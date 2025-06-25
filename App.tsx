


import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import SettingsPanel from './components/SettingsPanel';
import DocsPage from './components/DocsPage';
import DashboardPage from './components/DashboardPage';
import PersonaSelectorBar from './components/PersonaSelectorBar'; 
import ToastNotification from './components/ToastNotification'; // Import new ToastNotification component
import { Message, Sender, AppView, Persona, AppSettings, ApiActionType, ApiActionPayload, ApiSendMessagePayload, ApiChangePersonaPayload, ApiSetViewPayload, ToastType, ToastMessage } from './types';
import * as GeminiService from './services/GeminiService';
import * as UpstashRedisService from './services/UpstashRedisService'; 
import { saveChatSession, loadChatSession, clearChatSessionFromStorage, saveAppSettings, loadAppSettings } from './services/LocalStorageService';
import { USER_AVATAR_SVG, GEMINI_TEXT_MODEL } from './constants';
import { ALL_PERSONAS, getPersonaById, DEFAULT_PERSONA_ID, getEffectiveSystemInstruction } from './personas';
import { MIA_API_EVENT_NAME } from './services/ApiService';
import useToasts from './hooks/useToasts'; 
import { MESSAGE_TEMPLATES, DEFAULT_WELCOME_MESSAGE_TEMPLATE, DEFAULT_PERSONA_CHANGE_MESSAGE_TEMPLATE } from './messageTemplates'; 

// Helper function to sanitize text for speech, removing Markdown syntax
const sanitizeTextForSpeech = (markdown: string): string => {
  if (!markdown) return '';

  let text = markdown;

  // Remove images or replace with alt text. For speech, alt text is good.
  // ![Alt Text](image.url) -> Alt Text
  text = text.replace(/!\[(.*?)\]\(.*?\)/g, '$1');

  // Remove links but keep the link text.
  // [Link Text](link.url) -> Link Text
  text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1');

  // Remove bold, italics, strikethrough, keeping the text.
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2'); // Bold
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');    // Italics
  text = text.replace(/~~(.*?)~~/g, '$1');        // Strikethrough

  // Remove inline code backticks, keeping the text.
  text = text.replace(/`([^`]+)`/g, '$1');

  // Remove code blocks (fences only, basic attempt to keep content)
  text = text.replace(/```[\s\S]*?```/g, (match) => 
    match.replace(/```/g, '').replace(/^[\w-]+\n/, '').trim() // Remove language hint and fences
  );
  text = text.replace(/~~~[\s\S]*?~~~/g, (match) => 
    match.replace(/~~~/g, '').replace(/^[\w-]+\n/, '').trim() // Remove language hint and fences
  );
  
  // Remove headings (e.g., #, ##), keeping the text after hashes.
  text = text.replace(/^#{1,6}\s+/gm, '');

  // Remove horizontal rules.
  text = text.replace(/^(?:---|\*\*\*|___)\s*$/gm, '');

  // Remove blockquotes, keeping the text.
  text = text.replace(/^>\s+/gm, '');

  // Remove list item markers (unordered and ordered), keeping the text.
  text = text.replace(/^[-*+]\s+/gm, '');
  text = text.replace(/^\d+\.\s+/gm, '');
  
  // Replace multiple newlines with a single space to avoid long pauses
  text = text.replace(/\n+/g, ' ');

  // Trim and ensure single spaces
  return text.replace(/\s+/g, ' ').trim();
};


const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.Chat);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  
  const { toasts, addToast, removeToast } = useToasts(); 

  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const loaded = loadAppSettings(); 
    return loaded; 
  });

  const [availableCloudSessions, setAvailableCloudSessions] = useState<string[]>([]);

  const activePersona = getPersonaById(appSettings.activePersonaId);

  const speakText = useCallback((
    textToSpeakOriginal: string, 
    contextMessage: string = "Auto-play",
    isInitialAutoplay: boolean = false // Flag for initial, non-interactive autoplay
  ) => {
    if (!textToSpeakOriginal || textToSpeakOriginal.trim() === '') {
        console.log(`${contextMessage} TTS: Original text is empty, nothing to speak.`);
        return;
    }
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Ensure any previous speech is stopped
        const textToSpeakSanitized = sanitizeTextForSpeech(textToSpeakOriginal);

        if (textToSpeakSanitized.trim() === '') {
            if (textToSpeakOriginal.trim() !== '') {
                console.warn(`${contextMessage} TTS: Sanitized text is empty, though original was not. Nothing to speak.`);
                addToast(`${contextMessage}: Content was empty after Markdown removal.`, ToastType.Info, 2500);
            } else {
                console.log(`${contextMessage} TTS: Original and sanitized text is empty, nothing to speak.`);
            }
        } else {
            const utterance = new SpeechSynthesisUtterance(textToSpeakSanitized);
            utterance.lang = 'en-US'; // Or make this configurable
            
            utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
                // Always log the error for debugging
                console.error(`${contextMessage} TTS speech error: ${event.error}`, event);
                
                // List of errors considered critical enough to show a toast
                const criticalToastErrors = [
                    'service-not-allowed',
                    'language-unavailable', // More specific than synthesis-unavailable
                    'voice-unavailable',
                    'synthesis-unavailable', // General synthesis engine issue
                    'synthesis-failed',      // If synthesis fails outright
                    'network',               // If a network voice fails
                    'audio-hardware'         // If there's a hardware problem
                ];

                if (event.error === 'not-allowed') {
                    if (isInitialAutoplay) {
                        // Suppress toast for "not-allowed" on initial, non-interactive autoplay
                        console.warn(`${contextMessage} TTS: Initial auto-play was blocked by browser policy (error: ${event.error}). No toast shown.`);
                    } else {
                        // For subsequent 'not-allowed' errors, it's critical as it implies a change in permissions
                        addToast(`${contextMessage} TTS Error: Speech synthesis not allowed. Please check browser/OS permissions.`, ToastType.Error);
                    }
                } else if (criticalToastErrors.includes(event.error)) {
                    // For other defined critical errors, show a toast
                    addToast(`${contextMessage} TTS Error: ${event.error}. Speech may not be available.`, ToastType.Error);
                } else {
                    // For all other errors (e.g., 'interrupted', 'audio-busy', 'canceled', 'text-too-long', 'invalid-argument', or unknown ones),
                    // only log to console and do not show a user-facing toast.
                    console.warn(`${contextMessage} TTS: Non-critical error '${event.error}' occurred. Playback might be affected. No toast shown.`);
                }
            };
            window.speechSynthesis.speak(utterance);
        }
    } else {
        addToast(`${contextMessage} TTS: Speech synthesis not supported by this browser.`, ToastType.Warning);
    }
  }, [addToast]);


  const createSystemMessage = useCallback((persona: Persona, text: string, isError: boolean = false): Message => ({
    id: crypto.randomUUID(),
    sender: Sender.AI,
    text: text,
    timestamp: new Date(),
    avatar: persona.avatarPath, 
    name: persona.name, 
    aiBubbleClassName: isError ? 'bg-red-700' : persona.color, 
    isError: isError,
  }), []);
  
  const createInitialWelcomeMessage = useCallback((persona: Persona, effectiveInstruction: string, modelUsed?: string): Message => {
    const instructionStatusMessage = effectiveInstruction === persona.systemInstruction ? "" : "";
    
    const personaSpecificTemplates = MESSAGE_TEMPLATES[persona.id];
    const welcomeTemplate = personaSpecificTemplates?.welcomeMessageTemplate || DEFAULT_WELCOME_MESSAGE_TEMPLATE;

    let welcomeText = welcomeTemplate
      .replace('{personaName}', persona.name)
      .replace('{instructionStatusMessage}', instructionStatusMessage)
      .replace('{modelName}', modelUsed || 'default');
    
    return {
        id: crypto.randomUUID(),
        sender: Sender.AI,
        text: welcomeText,
        timestamp: new Date(),
        avatar: persona.avatarPath,
        name: persona.name,
        aiBubbleClassName: persona.color,
        isError: false,
    };
  }, []);


  const refreshCloudSessionsList = useCallback(async () => {
    try {
      const sessions = await UpstashRedisService.listCloudSessions();
      setAvailableCloudSessions(sessions);
    } catch (error) {
      console.error("Failed to list cloud sessions:", error);
      addToast("Failed to refresh cloud session list.", ToastType.Error);
    }
  }, [addToast]);


  useEffect(() => {
    const apiKeyStatus = GeminiService.getApiKeyStatus();
    if (!apiKeyStatus.configured) {
        const errorMsg = apiKeyStatus.message + " Please check the Docs for setup instructions.";
        setApiKeyError(errorMsg);
        addToast(errorMsg, ToastType.Error, 10000); 
    } else {
        setApiKeyError(null); 
    }

    const loadedSettings = loadAppSettings(); 
    setAppSettings(loadedSettings); 
    
    const initialPersona = getPersonaById(loadedSettings.activePersonaId);
    const initialEffectiveInstruction = getEffectiveSystemInstruction(loadedSettings.activePersonaId, loadedSettings.customPersonaInstructions);
      
    const loadedMessages = loadChatSession(); 
    let messagesToInitializeWith: Message[] = [];

    if (loadedMessages && loadedMessages.length > 0) {
      messagesToInitializeWith = loadedMessages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp), 
        avatar: msg.sender === Sender.AI ? initialPersona.avatarPath : msg.avatar,
        name: msg.sender === Sender.AI ? initialPersona.name : msg.name,
        aiBubbleClassName: msg.sender === Sender.AI ? (msg.isError ? 'bg-red-700' : initialPersona.color) : undefined,
        isError: msg.sender === Sender.AI ? msg.isError || false : false,
      }));
      setMessages(messagesToInitializeWith);
    } else {
      const welcomeMsg = createInitialWelcomeMessage(initialPersona, initialEffectiveInstruction, loadedSettings.selectedModel);
      messagesToInitializeWith = [welcomeMsg];
      setMessages(messagesToInitializeWith);
    }
    
    GeminiService.reinitializeChatWithHistory(
        loadedSettings.selectedModel,
        initialEffectiveInstruction,
        messagesToInitializeWith.filter(msg => !(msg.sender === Sender.AI && (msg.isError || msg.id === messagesToInitializeWith.find(wm => wm.text.includes("Welcome") || wm.text.includes("System Online") || wm.text.includes("Oh, hello there") || wm.text.includes("Greetings") )?.id ))) 
    );

    refreshCloudSessionsList();

    if (loadedSettings.autoPlayTTS) {
        const lastAiMessage = [...messagesToInitializeWith].reverse().find(
            (msg) => msg.sender === Sender.AI && !msg.isError && msg.text && msg.text.trim() !== ''
        );
        if (lastAiMessage && lastAiMessage.text) {
            speakText(lastAiMessage.text, "Initial message auto-play", true); // Pass true for isInitialAutoplay
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleSendMessage = useCallback(async (
    text: string, 
    imageData?: { base64ImageData: string, imageMimeType: string, fileName?: string },
    audioData?: { audioDataUrl: string, audioMimeType: string }
  ) => {
    if (apiKeyError) { 
        addToast("API Key is not configured. Cannot send message. " + apiKeyError, ToastType.Error);
        return;
    }
    const trimmedText = text.trim();
    if (!trimmedText && !imageData && !audioData) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: Sender.User,
      text: trimmedText,
      timestamp: new Date(),
      avatar: USER_AVATAR_SVG,
      name: 'You',
      ...(imageData && { 
        imagePreviewUrl: `data:${imageData.imageMimeType};base64,${imageData.base64ImageData}`,
        base64ImageData: imageData.base64ImageData,
        imageMimeType: imageData.imageMimeType,
        fileName: imageData.fileName,
      }),
      ...(audioData && {
        audioDataUrl: audioData.audioDataUrl,
        audioMimeType: audioData.audioMimeType,
      })
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    const aiMessagePlaceholderId = crypto.randomUUID();
    const placeholderAiMessage: Message = {
      id: aiMessagePlaceholderId,
      sender: Sender.AI,
      text: "", 
      timestamp: new Date(),
      avatar: activePersona.avatarPath,
      name: activePersona.name,
      aiBubbleClassName: activePersona.color,
      isError: false,
    };
    setMessages((prevMessages) => [...prevMessages, placeholderAiMessage]);

    const serviceImageData = imageData ? { base64ImageData: imageData.base64ImageData, imageMimeType: imageData.imageMimeType } : undefined;
    let serviceAudioData;
    if (audioData && audioData.audioDataUrl && audioData.audioMimeType) {
      const base64AudioData = audioData.audioDataUrl.split(',')[1];
      if (base64AudioData) {
          serviceAudioData = { base64AudioData, audioMimeType: audioData.audioMimeType };
      }
    }

    let streamErrorOccurred = false;

    await GeminiService.sendMessageStreamToAI(
      trimmedText,
      (chunkText) => { 
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiMessagePlaceholderId
              ? { ...msg, text: msg.text + chunkText }
              : msg
          )
        );
      },
      (errorMessage, isDefinitiveError) => { 
        streamErrorOccurred = true;
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiMessagePlaceholderId
              ? { ...msg, text: errorMessage, isError: isDefinitiveError, aiBubbleClassName: 'bg-red-700' }
              : msg
          )
        );
        addToast(errorMessage, ToastType.Error); 
        setIsLoading(false); 
      },
      () => { 
        setIsLoading(false);
        setMessages(prevMessages => {
            const completedMessage = prevMessages.find(msg => msg.id === aiMessagePlaceholderId);
            if (appSettings.autoPlayTTS && !streamErrorOccurred && completedMessage && completedMessage.text && !completedMessage.isError) {
                speakText(completedMessage.text, "AI response auto-play"); // isInitialAutoplay defaults to false
            }
            return prevMessages;
        });
      },
      serviceImageData,
      serviceAudioData
    );

  }, [activePersona, apiKeyError, addToast, appSettings.autoPlayTTS, speakText]);

  const handleClearChat = useCallback(() => {
    const currentInstruction = getEffectiveSystemInstruction(appSettings.activePersonaId, appSettings.customPersonaInstructions);
    GeminiService.resetChatSession(currentInstruction); 
    
    setMessages([createInitialWelcomeMessage(activePersona, currentInstruction, appSettings.selectedModel)]);
    clearChatSessionFromStorage(); 
    
    const updatedSettings = { ...appSettings, currentCloudSessionId: undefined };
    setAppSettings(updatedSettings);
    saveAppSettings(updatedSettings);

    setIsSettingsOpen(false);
    addToast("Local chat session cleared!", ToastType.Info);
  }, [activePersona, appSettings, createInitialWelcomeMessage, addToast]);

  const handleSaveLocalSession = useCallback(() => {
    saveChatSession(messages); 
    addToast("Chat session saved locally!", ToastType.Success);
  }, [messages, addToast]);

  const handleLoadLocalSession = useCallback(() => {
    const loadedMessagesFromStorage = loadChatSession();
    const personaForLoadedSession = getPersonaById(appSettings.activePersonaId);
    const modelForLoadedSession = appSettings.selectedModel;
    const instructionForLoadedSession = getEffectiveSystemInstruction(appSettings.activePersonaId, appSettings.customPersonaInstructions);

    if (loadedMessagesFromStorage && loadedMessagesFromStorage.length > 0) {
       const newMessages = loadedMessagesFromStorage.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        avatar: msg.sender === Sender.AI ? personaForLoadedSession.avatarPath : msg.avatar,
        name: msg.sender === Sender.AI ? personaForLoadedSession.name : msg.name,
        aiBubbleClassName: msg.sender === Sender.AI ? (msg.isError ? 'bg-red-700' : personaForLoadedSession.color) : undefined,
        isError: msg.sender === Sender.AI ? msg.isError || false : false,
      }));
      setMessages(newMessages);
      
      GeminiService.reinitializeChatWithHistory(
          modelForLoadedSession, 
          instructionForLoadedSession, 
          newMessages.filter(msg => !(msg.sender === Sender.AI && msg.isError))
        );
      
      const systemNotification = createSystemMessage(personaForLoadedSession, `Local session loaded. ${personaForLoadedSession.name} is continuing the conversation with history.`);
      setMessages(prev => [...prev, systemNotification]);
      
      const updatedSettings = { ...appSettings, currentCloudSessionId: undefined }; 
      setAppSettings(updatedSettings);
      saveAppSettings(updatedSettings);

      addToast("Local chat session loaded!", ToastType.Success);

       if (appSettings.autoPlayTTS) {
          const lastAiMessageFromLoaded = [...newMessages, systemNotification].reverse().find(
              (msg) => msg.sender === Sender.AI && !msg.isError && msg.text && msg.text.trim() !== ''
          );
          if (lastAiMessageFromLoaded && lastAiMessageFromLoaded.text) {
             speakText(lastAiMessageFromLoaded.text, "Loaded local session auto-play", true); // Pass true for isInitialAutoplay
          }
      }
    } else {
      addToast("No saved local chat session found or session is empty.", ToastType.Warning);
    }
    setIsSettingsOpen(false);
  }, [appSettings, createSystemMessage, addToast, speakText]); 

  const handleSaveToCloud = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    try {
      await UpstashRedisService.saveSessionToCloud(sessionId, messages, appSettings);
      const updatedSettings = { ...appSettings, currentCloudSessionId: sessionId };
      setAppSettings(updatedSettings);
      saveAppSettings(updatedSettings);
      await refreshCloudSessionsList();
      addToast(`Session "${sessionId}" saved to cloud (simulated).`, ToastType.Success);
    } catch (error) {
      console.error("Failed to save to cloud:", error);
      addToast(`Error saving session to cloud: ${error instanceof Error ? error.message : "Unknown error"}`, ToastType.Error);
    } finally {
      setIsLoading(false);
    }
  }, [messages, appSettings, refreshCloudSessionsList, addToast]);

  const handleLoadFromCloud = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    try {
      const loadedData = await UpstashRedisService.loadSessionFromCloud(sessionId);
      
      if (loadedData && loadedData.messages && loadedData.messages.length > 0) {
        const { messages: cloudMessages, settings: cloudSettings } = loadedData;
        
        const personaForLoadedSession = getPersonaById(cloudSettings.activePersonaId);
        const modelForLoadedSession = cloudSettings.selectedModel;
        const instructionForLoadedSession = getEffectiveSystemInstruction(cloudSettings.activePersonaId, cloudSettings.customPersonaInstructions);

        setAppSettings(cloudSettings); 
        saveAppSettings(cloudSettings); 

        const newMessages = cloudMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          avatar: msg.sender === Sender.AI ? personaForLoadedSession.avatarPath : msg.avatar,
          name: msg.sender === Sender.AI ? personaForLoadedSession.name : msg.name,
          aiBubbleClassName: msg.sender === Sender.AI ? (msg.isError ? 'bg-red-700' : personaForLoadedSession.color) : undefined,
          isError: msg.sender === Sender.AI ? msg.isError || false : false,
        }));
        setMessages(newMessages);
        
        GeminiService.reinitializeChatWithHistory(
            modelForLoadedSession, 
            instructionForLoadedSession, 
            newMessages.filter(msg => !(msg.sender === Sender.AI && msg.isError))
        );
        const systemNotification = createSystemMessage(personaForLoadedSession, `Cloud session "${sessionId}" loaded. ${personaForLoadedSession.name} is continuing with history.`);
        setMessages(prev => [...prev, systemNotification]);

        clearChatSessionFromStorage(); 
        addToast(`Session "${sessionId}" loaded from cloud (simulated).`, ToastType.Success);

        if (cloudSettings.autoPlayTTS) {
            const lastAiMessageFromCloud = [...newMessages, systemNotification].reverse().find(
                (msg) => msg.sender === Sender.AI && !msg.isError && msg.text && msg.text.trim() !== ''
            );
            if (lastAiMessageFromCloud && lastAiMessageFromCloud.text) {
                speakText(lastAiMessageFromCloud.text, "Loaded cloud session auto-play", true); // Pass true for isInitialAutoplay
            }
        }

      } else {
        addToast(`Cloud session "${sessionId}" not found or is empty.`, ToastType.Warning);
      }
    } catch (error) {
      console.error("Failed to load from cloud:", error);
      addToast(`Error loading session from cloud: ${error instanceof Error ? error.message : "Unknown error"}`, ToastType.Error);
    } finally {
      setIsLoading(false);
      setIsSettingsOpen(false);
    }
  }, [createSystemMessage, addToast, speakText]);

  const handleDeleteFromCloud = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    try {
        await UpstashRedisService.deleteCloudSession(sessionId);
        await refreshCloudSessionsList();
        if (appSettings.currentCloudSessionId === sessionId) {
            const currentInstruction = getEffectiveSystemInstruction(appSettings.activePersonaId, appSettings.customPersonaInstructions);
            const personaForWelcome = getPersonaById(appSettings.activePersonaId);
            GeminiService.resetChatSession(currentInstruction); 
            
            const welcomeMsg = createInitialWelcomeMessage(personaForWelcome, currentInstruction, appSettings.selectedModel);
            setMessages([welcomeMsg]);

            if (appSettings.autoPlayTTS && welcomeMsg.text && !welcomeMsg.isError) {
                 speakText(welcomeMsg.text, "Post-cloud delete welcome auto-play", true); // Pass true for isInitialAutoplay
            }
            
            const updatedSettings = { ...appSettings, currentCloudSessionId: undefined };
            setAppSettings(updatedSettings);
            saveAppSettings(updatedSettings);
        }
        addToast(`Cloud session "${sessionId}" deleted (simulated).`, ToastType.Success);
    } catch (error) {
        console.error("Failed to delete from cloud:", error);
        addToast(`Error deleting session from cloud: ${error instanceof Error ? error.message : "Unknown error"}`, ToastType.Error);
    } finally {
        setIsLoading(false);
    }
  }, [appSettings, createInitialWelcomeMessage, refreshCloudSessionsList, addToast, speakText]);


  const handleChangePersona = useCallback((newPersonaId: string) => {
    const newPersona = getPersonaById(newPersonaId);
    if (!newPersona || newPersona.id === appSettings.activePersonaId) {
        if (newPersona && newPersona.id === appSettings.activePersonaId) {
          addToast("Persona already active.", ToastType.Info);
        } else {
          addToast(`Attempted to change to unknown persona ID: ${newPersonaId}`, ToastType.Warning);
        }
        return;
    }

    const newEffectiveInstruction = getEffectiveSystemInstruction(newPersonaId, appSettings.customPersonaInstructions || {});
    const updatedSettings = { ...appSettings, activePersonaId: newPersona.id };
    
    setAppSettings(updatedSettings);
    saveAppSettings(updatedSettings);
    
    GeminiService.reinitializeChatWithHistory(
        appSettings.selectedModel, 
        newEffectiveInstruction, 
        messages.filter(msg => !(msg.sender === Sender.AI && msg.isError)) 
    );
    
    const personaSpecificTemplates = MESSAGE_TEMPLATES[newPersona.id];
    const changeTemplate = personaSpecificTemplates?.personaChangeMessageTemplate || DEFAULT_PERSONA_CHANGE_MESSAGE_TEMPLATE;
    const personaChangeText = changeTemplate.replace('{newPersonaName}', newPersona.name);

    const systemNotification = createSystemMessage(newPersona, personaChangeText);
    setMessages(prev => [...prev, systemNotification]);
    addToast(`Persona changed to ${newPersona.name}.`, ToastType.Info);
    
    if (appSettings.autoPlayTTS && systemNotification.text && !systemNotification.isError) {
        speakText(systemNotification.text, "Persona change auto-play"); // isInitialAutoplay defaults to false
    }

  }, [appSettings, messages, createSystemMessage, addToast, speakText]);

  const handleUpdatePersonaInstruction = useCallback((personaId: string, newInstruction: string) => {
    const newCustomInstructions = {
      ...(appSettings.customPersonaInstructions || {}),
      [personaId]: newInstruction,
    };
    const updatedSettings = { ...appSettings, customPersonaInstructions: newCustomInstructions };
    setAppSettings(updatedSettings);
    saveAppSettings(updatedSettings);
    
    const targetPersona = getPersonaById(personaId); 

    if (personaId === appSettings.activePersonaId) {
      GeminiService.reinitializeChatWithHistory(
          appSettings.selectedModel, 
          newInstruction, 
          messages.filter(msg => !(msg.sender === Sender.AI && msg.isError))
      );
      const systemNotification = createSystemMessage(targetPersona, `Instructions for ${targetPersona.name} updated. The conversation continues with history.`);
      setMessages(prev => [...prev, systemNotification]);
      addToast(`Instructions for ${targetPersona.name} updated. Conversation continues.`, ToastType.Success);

        if (appSettings.autoPlayTTS && systemNotification.text && !systemNotification.isError) {
            speakText(systemNotification.text, "Instruction update auto-play"); // isInitialAutoplay defaults to false
        }
    } else {
      addToast(`Instructions for ${targetPersona.name} updated.`, ToastType.Success);
    }
  }, [appSettings, messages, createSystemMessage, addToast, speakText]);
  
  const handleResetPersonaInstruction = useCallback((personaId: string) => {
    const personaToReset = getPersonaById(personaId);
    const defaultInstruction = personaToReset.systemInstruction;
    
    const newCustomInstructions = { ...(appSettings.customPersonaInstructions || {}) };
    delete newCustomInstructions[personaId]; 

    const updatedSettings = { ...appSettings, customPersonaInstructions: newCustomInstructions };
    setAppSettings(updatedSettings);
    saveAppSettings(updatedSettings);

    if (personaId === appSettings.activePersonaId) {
      GeminiService.reinitializeChatWithHistory(
          appSettings.selectedModel, 
          defaultInstruction, 
          messages.filter(msg => !(msg.sender === Sender.AI && msg.isError))
        );
      const systemNotification = createSystemMessage(personaToReset, `Instructions for ${personaToReset.name} reset to default. The conversation continues with history.`);
      setMessages(prev => [...prev, systemNotification]);
      addToast(`Instructions for ${personaToReset.name} reset to default. Conversation continues.`, ToastType.Success);

        if (appSettings.autoPlayTTS && systemNotification.text && !systemNotification.isError) {
            speakText(systemNotification.text, "Instruction reset auto-play"); // isInitialAutoplay defaults to false
        }
    } else {
      addToast(`Instructions for ${personaToReset.name} reset to default.`, ToastType.Success);
    }
  }, [appSettings, messages, createSystemMessage, addToast, speakText]);

  const handleModelChange = useCallback((newModelId: string) => {
    const trimmedModelId = newModelId.trim();
    const updatedSettings = { ...appSettings, selectedModel: trimmedModelId };
    setAppSettings(updatedSettings);
    saveAppSettings(updatedSettings);

    const currentInstruction = getEffectiveSystemInstruction(appSettings.activePersonaId, appSettings.customPersonaInstructions);
    const personaForMessage = getPersonaById(appSettings.activePersonaId);

    GeminiService.reinitializeChatWithHistory(
        trimmedModelId, 
        currentInstruction, 
        messages.filter(msg => !(msg.sender === Sender.AI && msg.isError))
    );
    
    const systemNotification = createSystemMessage(personaForMessage, `Model changed to **${trimmedModelId}**. The conversation continues with history.`);
    setMessages(prev => [...prev, systemNotification]);
    addToast(`AI Model changed to: ${trimmedModelId}. Conversation continues.`, ToastType.Success);

    if (appSettings.autoPlayTTS && systemNotification.text && !systemNotification.isError) {
        speakText(systemNotification.text, "Model change auto-play"); // isInitialAutoplay defaults to false
    }
    setIsSettingsOpen(false); 
  }, [appSettings, messages, createSystemMessage, addToast, speakText]);

  const handleToggleAutoPlayTTS = useCallback((newValue: boolean) => {
    setAppSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, autoPlayTTS: newValue };
      saveAppSettings(updatedSettings);
      addToast(`Auto-play AI responses ${newValue ? 'enabled' : 'disabled'}.`, ToastType.Info);
      return updatedSettings;
    });
  }, [addToast]);

  const onToggleSettings = useCallback(() => {
      refreshCloudSessionsList(); 
      setIsSettingsOpen(prev => !prev);
  }, [refreshCloudSessionsList]);


  useEffect(() => {
    const handleApiAction = (event: Event) => {
      const customEvent = event as CustomEvent<ApiActionPayload>;
      const { actionType, payload } = customEvent.detail;
      console.log(`App: Received API action '${actionType}' with payload:`, payload);

      switch (actionType) {
        case ApiActionType.SEND_MESSAGE:
          if (payload && typeof (payload as ApiSendMessagePayload).text === 'string') {
            const { text, imageData, audioData } = payload as ApiSendMessagePayload;
            handleSendMessage(text, imageData, audioData);
          } else {
            console.warn("ApiService: SEND_MESSAGE payload malformed or missing text.");
            addToast("API: SEND_MESSAGE payload error.", ToastType.Warning);
          }
          break;
        case ApiActionType.CHANGE_PERSONA:
          if (payload && typeof (payload as ApiChangePersonaPayload).personaId === 'string') {
            handleChangePersona((payload as ApiChangePersonaPayload).personaId);
          } else {
            console.warn("ApiService: CHANGE_PERSONA payload malformed or missing personaId.");
            addToast("API: CHANGE_PERSONA payload error.", ToastType.Warning);
          }
          break;
        case ApiActionType.CLEAR_CHAT:
          handleClearChat();
          break;
        case ApiActionType.SET_VIEW:
          if (payload && Object.values(AppView).includes((payload as ApiSetViewPayload).view)) {
            setCurrentView((payload as ApiSetViewPayload).view);
            addToast(`View changed to ${(payload as ApiSetViewPayload).view} via API.`, ToastType.Info);
          } else {
            console.warn("ApiService: SET_VIEW payload malformed or invalid view.");
            addToast("API: SET_VIEW payload error.", ToastType.Warning);
          }
          break;
        default:
          console.warn(`ApiService: Unknown actionType received: ${actionType}`);
          addToast(`API: Unknown actionType '${actionType}'.`, ToastType.Warning);
      }
    };

    window.addEventListener(MIA_API_EVENT_NAME, handleApiAction);
    return () => {
      window.removeEventListener(MIA_API_EVENT_NAME, handleApiAction);
    };
  }, [handleSendMessage, handleChangePersona, handleClearChat, setCurrentView, addToast]);


  const renderViewContent = () => {
    switch (currentView) {
      case AppView.Chat:
        return (
          <div className="flex-grow flex flex-col w-full md:max-w-4xl lg:max-w-5xl mx-auto overflow-hidden">
            <ChatWindow messages={messages} isLoading={isLoading} />
            <div className="border-t border-gpt-gray">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
          </div>
        );
      case AppView.Docs:
        return <DocsPage />;
      case AppView.Dashboard:
        return <DashboardPage 
                  personas={ALL_PERSONAS} 
                  activePersonaId={appSettings.activePersonaId} 
                  customPersonaInstructions={appSettings.customPersonaInstructions || {}}
                  onSelectPersona={handleChangePersona} 
                  onUpdateInstruction={handleUpdatePersonaInstruction}
                  onResetInstruction={handleResetPersonaInstruction}
                  selectedModel={appSettings.selectedModel}
                  currentCloudSessionId={appSettings.currentCloudSessionId}
                  availableCloudSessions={availableCloudSessions}
                  isLoading={isLoading}
                  onSaveToCloud={handleSaveToCloud}
                  onOpenSettings={onToggleSettings}
                  addToast={addToast} 
                />;
      default: 
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gpt-dark">
      {apiKeyError && !toasts.some(t => t.message.includes("API Key")) && ( 
        <div className="bg-red-600 text-white p-3 text-center text-sm shadow-md">
          <p><strong>Configuration Error:</strong> {apiKeyError}</p>
        </div>
      )}
      <Header 
        currentView={currentView}
        onSetView={setCurrentView}
        onToggleSettings={onToggleSettings}
      />
      
      {currentView === AppView.Chat && (
        <PersonaSelectorBar
          personas={ALL_PERSONAS}
          activePersonaId={appSettings.activePersonaId}
          onSelectPersona={handleChangePersona}
          isLoading={isLoading}
        />
      )}
      
      <main className={`flex-grow flex flex-col overflow-y-auto w-full ${apiKeyError ? 'pt-0' : ''}`}>
        {renderViewContent()}
      </main>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onClearChat={handleClearChat}
        onSaveLocalSession={handleSaveLocalSession}
        onLoadLocalSession={handleLoadLocalSession}
        onSaveToCloud={handleSaveToCloud}
        onLoadFromCloud={handleLoadFromCloud}
        onDeleteFromCloud={handleDeleteFromCloud}
        availableCloudSessions={availableCloudSessions}
        currentCloudSessionId={appSettings.currentCloudSessionId}
        isLoading={isLoading}
        selectedModel={appSettings.selectedModel}
        onModelChange={handleModelChange}
        addToast={addToast} 
        autoPlayTTS={appSettings.autoPlayTTS || false}
        onToggleAutoPlayTTS={handleToggleAutoPlayTTS}
      />

      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
            <ToastNotification key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
      <style>{`
        @keyframes toast-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-toast-in {
          animation: toast-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;