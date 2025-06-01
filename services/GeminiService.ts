
import { GoogleGenAI, Chat, GenerateContentResponse, Part, Content } from "@google/genai";
import { GEMINI_TEXT_MODEL } from '../constants';
import { getPersonaById, DEFAULT_PERSONA_ID, getEffectiveSystemInstruction } from "../personas";
import { Message, Sender } from "../types"; // Added Message, Sender for formatting

// Interface for the non-streaming response structure (kept for reference if non-streaming path is revived)
interface GeminiStandardResponse {
    responseText: string;
    isError: boolean;
}

let chat: Chat | null = null;

let apiKeyToUse = process.env.MIAGEM_API_KEY;
let usingLegacyKeyWarning = "";

if (!apiKeyToUse) {
    console.warn("MIAGEM_API_KEY not set. Checking for legacy API_KEY...");
    apiKeyToUse = process.env.API_KEY;
    if (apiKeyToUse) {
        usingLegacyKeyWarning = "Using legacy API_KEY. Please update your environment to use MIAGEM_API_KEY for future compatibility.";
        console.warn(usingLegacyKeyWarning);
    }
}

const EFFECTIVE_API_KEY = apiKeyToUse;

let currentSystemInstruction: string = getEffectiveSystemInstruction(DEFAULT_PERSONA_ID, {});
let activeChatModelName: string = GEMINI_TEXT_MODEL;

export const getApiKeyStatus = (): { configured: boolean; message: string } => {
    if (EFFECTIVE_API_KEY) {
        return { configured: true, message: usingLegacyKeyWarning || "API Key configured." };
    }
    return { 
        configured: false, 
        message: "Gemini API Key not configured. Please set MIAGEM_API_KEY (recommended) or API_KEY (legacy) environment variable." 
    };
};

export const setSystemInstructionForSession = (instruction: string): void => {
    if (currentSystemInstruction !== instruction) {
        currentSystemInstruction = instruction;
        console.log("System instruction updated. Chat session will be re-initialized with history if applicable.");
    }
};

export const setCurrentChatModel = (modelName: string): void => {
    if (activeChatModelName !== modelName) {
        activeChatModelName = modelName.trim() || GEMINI_TEXT_MODEL;
        console.log(`Chat model updated to: ${activeChatModelName}. Chat session will be re-initialized with history if applicable.`);
    }
};

const formatAppMessagesToGeminiHistory = (messages: Message[]): Content[] => {
    const history: Content[] = [];
    for (const msg of messages) {
        const parts: Part[] = [];
        if (msg.text) {
            parts.push({ text: msg.text });
        }
        if (msg.base64ImageData && msg.imageMimeType) {
            parts.push({
                inlineData: { mimeType: msg.imageMimeType, data: msg.base64ImageData },
            });
        }
        if (msg.audioDataUrl && msg.audioMimeType) {
            const base64AudioData = msg.audioDataUrl.split(',')[1];
            if (base64AudioData) {
                parts.push({
                    inlineData: { mimeType: msg.audioMimeType, data: base64AudioData },
                });
            }
        }

        if (parts.length > 0) {
            history.push({
                role: msg.sender === Sender.User ? "user" : "model",
                parts: parts,
            });
        }
    }
    return history;
};

const _initializeChatInternal = (history?: Content[]): Chat => {
  if (!EFFECTIVE_API_KEY) {
    const errorMsg = "Gemini API Key not configured. Please set MIAGEM_API_KEY (recommended) or API_KEY (legacy) environment variable.";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  const ai = new GoogleGenAI({ apiKey: EFFECTIVE_API_KEY });
  
  console.log(`Initializing chat with model: ${activeChatModelName}, instruction: ${currentSystemInstruction.substring(0,50)}..., and ${history ? history.length : 0} history items.`);
  return ai.chats.create({
    model: activeChatModelName,
    config: {
        systemInstruction: currentSystemInstruction,
    },
    history: history || [],
  });
};

export const reinitializeChatWithHistory = (
    newModel: string, 
    newInstruction: string, 
    messagesToBuildHistoryFrom: Message[]
): void => {
    activeChatModelName = newModel.trim() || GEMINI_TEXT_MODEL;
    currentSystemInstruction = newInstruction;
    const geminiHistory = formatAppMessagesToGeminiHistory(messagesToBuildHistoryFrom);
    chat = _initializeChatInternal(geminiHistory);
    console.log(`Chat re-initialized with new settings and ${geminiHistory.length} history entries.`);
};

export const getChatInstance = (): Chat => {
    if (!chat) {
        console.log("Chat instance is null, creating a new fresh instance.");
        chat = _initializeChatInternal(); 
    }
    return chat;
};

// New streaming function
export const sendMessageStreamToAI = async (
    messageText: string,
    onChunk: (chunkText: string) => void,
    onError: (errorMessage: string, isDefinitiveError: boolean) => void,
    onComplete: () => void,
    imageData?: { base64ImageData: string, imageMimeType: string },
    audioData?: { base64AudioData: string, audioMimeType: string }
): Promise<void> => {
    const apiKeyStatus = getApiKeyStatus();
    if (!apiKeyStatus.configured) {
        onError(apiKeyStatus.message, true);
        onComplete(); // Ensure loading state is cleared
        return;
    }

    try {
        const chatInstance = getChatInstance();
        const parts: Part[] = [];

        if (messageText) {
            parts.push({ text: messageText });
        }
        if (imageData && imageData.base64ImageData && imageData.imageMimeType) {
            parts.push({
                inlineData: { mimeType: imageData.imageMimeType, data: imageData.base64ImageData },
            });
        }
        if (audioData && audioData.base64AudioData && audioData.audioMimeType) {
            parts.push({
                inlineData: { mimeType: audioData.audioMimeType, data: audioData.base64AudioData },
            });
        }

        if (parts.length === 0) {
            onError("Cannot send an empty message.", true);
            onComplete();
            return;
        }

        const stream = await chatInstance.sendMessageStream({ message: parts });

        for await (const chunk of stream) {
            if (chunk.text) { // Check if text exists, Gemini sometimes sends empty chunks.
                onChunk(chunk.text);
            }
        }
        onComplete();

    } catch (error) {
        console.error("Error during streaming message to AI:", error);
        let errorMessage = "Sorry, I encountered an error during streaming. Please check the console or try again later.";
        let isDefinitiveError = true;

        if (error instanceof Error) {
            const keyNameInError = usingLegacyKeyWarning ? "API_KEY" : "MIAGEM_API_KEY";
            if (error.message.includes("API_KEY_INVALID") || error.message.includes("PERMISSION_DENIED") || error.message.toLowerCase().includes("api key not valid")) {
                errorMessage = `There's an issue with the API Key (${keyNameInError}). Please check if it's valid and has the correct permissions.`;
            } else if (error.message.includes("model not found")) {
                errorMessage = `The AI model ('${activeChatModelName}') could not be found. Please check the model name.`;
            } else if (error.message.toLowerCase().includes("request payload size exceeds the limit")) {
                errorMessage = "The image or audio file you sent might be too large. Please try a smaller file.";
            } else if (error.message.toLowerCase().includes("instruction") || error.message.toLowerCase().includes("system")) {
                errorMessage = `There was an issue with the AI's current persona instructions. The chat may need to be reset or persona reselected. Details: ${error.message}`;
            } else {
                isDefinitiveError = false; 
                errorMessage = `Sorry, an unexpected error occurred: ${error.message}. Please try again.`;
            }
        }
        onError(errorMessage, isDefinitiveError);
        onComplete(); // Ensure loading state is cleared
    }
};


/* // Kept for reference - Original non-streaming sendMessageToAI
export const sendMessageToAI = async (
    messageText: string, 
    imageData?: { base64ImageData: string, imageMimeType: string },
    audioData?: { base64AudioData: string, audioMimeType: string }
): Promise<GeminiStandardResponse> => {
  const apiKeyStatus = getApiKeyStatus();
  if (!apiKeyStatus.configured) {
    return { responseText: apiKeyStatus.message, isError: true };
  }

  try {
    const chatInstance = getChatInstance(); 
    const parts: Part[] = [];

    if (messageText) {
        parts.push({ text: messageText });
    }
    if (imageData && imageData.base64ImageData && imageData.imageMimeType) {
        parts.push({
            inlineData: { mimeType: imageData.imageMimeType, data: imageData.base64ImageData },
        });
    }
    if (audioData && audioData.base64AudioData && audioData.audioMimeType) {
        parts.push({
            inlineData: { mimeType: audioData.audioMimeType, data: audioData.base64AudioData },
        });
    }
    
    if (parts.length === 0) {
        return { responseText: "Cannot send an empty message.", isError: true };
    }

    const response: GenerateContentResponse = await chatInstance.sendMessage({ message: parts });
    return { responseText: response.text, isError: false };
  } catch (error) {
    console.error("Error sending message to AI:", error);
    let errorMessage = "Sorry, I encountered an error. Please check the console or try again later.";
    let isDefinitiveError = true; 

    if (error instanceof Error) {
        const keyNameInError = usingLegacyKeyWarning ? "API_KEY" : "MIAGEM_API_KEY";
        if (error.message.includes("API_KEY_INVALID") || error.message.includes("PERMISSION_DENIED") || error.message.toLowerCase().includes("api key not valid")) {
             errorMessage = `There's an issue with the API Key (${keyNameInError}). Please check if it's valid and has the correct permissions.`;
        } else if (error.message.includes("model not found")) {
            errorMessage = `The AI model ('${activeChatModelName}') could not be found. Please check the model name.`;
        } else if (error.message.toLowerCase().includes("request payload size exceeds the limit")) {
            errorMessage = "The image or audio file you sent might be too large. Please try a smaller file.";
        } else if (error.message.toLowerCase().includes("instruction") || error.message.toLowerCase().includes("system")) {
            errorMessage = `There was an issue with the AI's current persona instructions. The chat may need to be reset or persona reselected. Details: ${error.message}`;
        } else {
            isDefinitiveError = false; 
            errorMessage = `Sorry, an unexpected error occurred: ${error.message}. Please try again.`;
        }
    }
    return { responseText: errorMessage, isError: isDefinitiveError };
  }
};
*/

export const resetChatSession = (newInstruction?: string, messagesForHistory?: Message[]): void => {
    const instructionToUse = newInstruction || currentSystemInstruction;
    const modelToUse = activeChatModelName;

    if (messagesForHistory && messagesForHistory.length > 0) {
        console.log("Resetting chat session and re-initializing with provided history.");
        reinitializeChatWithHistory(modelToUse, instructionToUse, messagesForHistory);
    } else {
        console.log("Resetting chat session for a fresh start (no history provided).");
        currentSystemInstruction = instructionToUse; 
        chat = null; 
    }
    console.log("Chat session state has been reset in GeminiService.");
};
