
import { Message, AppSettings } from '../types';
import { LOCAL_STORAGE_SESSION_KEY, LOCAL_STORAGE_SETTINGS_KEY, GEMINI_TEXT_MODEL, AVAILABLE_MODELS } from '../constants'; 
import { DEFAULT_PERSONA_ID } from '../personas';

export const saveChatSession = (messages: Message[]): void => {
  try {
    const serializedMessages = JSON.stringify(messages.map(msg => ({...msg, timestamp: msg.timestamp.toISOString() })));
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, serializedMessages);
  } catch (error) {
    console.error("Error saving chat session to local storage:", error);
  }
};

export const loadChatSession = (): Message[] | null => {
  try {
    const serializedMessages = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    if (serializedMessages === null) {
      return null;
    }
    const parsedMessages = JSON.parse(serializedMessages);
    return parsedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
    }));
  } catch (error) {
    console.error("Error loading chat session from local storage:", error);
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    return null;
  }
};

export const clearChatSessionFromStorage = (): void => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
  } catch (error) { 
    console.error("Error clearing chat session from local storage:", error);
  }
};

export const saveAppSettings = (settings: AppSettings): void => { 
  try {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving app settings to local storage:", error);
  }
};

export const loadAppSettings = (): AppSettings => { 
  const defaults: AppSettings = { 
    activePersonaId: DEFAULT_PERSONA_ID, 
    selectedModel: GEMINI_TEXT_MODEL, 
    customPersonaInstructions: {},
    currentCloudSessionId: undefined,
  };

  try {
    const serializedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    
    if (serializedSettings === null) {
      return defaults;
    }
    
    const parsed = JSON.parse(serializedSettings) as Partial<AppSettings>; 

    // Validate selectedModel
    let finalSelectedModel = parsed.selectedModel || defaults.selectedModel;
    if (finalSelectedModel) {
        const modelExists = AVAILABLE_MODELS.some(model => model.id === finalSelectedModel);
        if (!modelExists) {
            console.warn(`Loaded model "${finalSelectedModel}" is not in AVAILABLE_MODELS. Falling back to default: ${GEMINI_TEXT_MODEL}`);
            finalSelectedModel = GEMINI_TEXT_MODEL;
        }
    } else { // If parsed.selectedModel is undefined or empty string
        finalSelectedModel = GEMINI_TEXT_MODEL;
    }
    
    return {
        ...defaults, // Start with defaults
        ...parsed, // Override with parsed values if they exist
        activePersonaId: parsed.activePersonaId || defaults.activePersonaId,
        selectedModel: finalSelectedModel, // Use validated or default model
        customPersonaInstructions: parsed.customPersonaInstructions || defaults.customPersonaInstructions,
    };
  } catch (error) {
    console.error("Error loading app settings from local storage:", error);
    // Fallback to defaults on error
    return defaults;
  }
};