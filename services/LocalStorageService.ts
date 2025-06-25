
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
    autoPlayTTS: false, // Default value for autoPlayTTS
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
        // Allow any string for model ID, as it could be a fine-tuned model.
        // Basic validation for known good models is suggestive, not restrictive.
        const modelIsKnownSuggestable = AVAILABLE_MODELS.some(model => model.id === finalSelectedModel);
        if (!modelIsKnownSuggestable && !finalSelectedModel.startsWith('tunedModels/') && finalSelectedModel !== GEMINI_TEXT_MODEL) {
          // If it's not a known suggestable, not a tuned model path, and not the default, log a gentle note but allow it.
          console.log(`Using custom model ID: ${finalSelectedModel}. Ensure this is a valid Gemini model ID.`);
        }
    } else { 
        finalSelectedModel = GEMINI_TEXT_MODEL;
    }
    
    return {
        ...defaults, 
        ...parsed, 
        activePersonaId: parsed.activePersonaId || defaults.activePersonaId,
        selectedModel: finalSelectedModel, 
        customPersonaInstructions: parsed.customPersonaInstructions || defaults.customPersonaInstructions,
        autoPlayTTS: typeof parsed.autoPlayTTS === 'boolean' ? parsed.autoPlayTTS : defaults.autoPlayTTS,
    };
  } catch (error) {
    console.error("Error loading app settings from local storage:", error);
    return defaults;
  }
};