
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import SettingsPanel from './components/SettingsPanel';
import DocsPage from './components/DocsPage';
import DashboardPage from './components/DashboardPage';
import PersonaSelectorBar from './components/PersonaSelectorBar'; 
import { Message, Sender, AppView, Persona, AppSettings, ApiActionType, ApiActionPayload, ApiSendMessagePayload, ApiChangePersonaPayload, ApiSetViewPayload, ToastType, ToastMessage } from './types';
import * as GeminiService from './services/GeminiService';
import * as UpstashRedisService from './services/UpstashRedisService'; 
import { saveChatSession, loadChatSession, clearChatSessionFromStorage, saveAppSettings, loadAppSettings } from './services/LocalStorageService';
import { USER_AVATAR_SVG, GEMINI_TEXT_MODEL } from './constants';
import { ALL_PERSONAS, getPersonaById, DEFAULT_PERSONA_ID, getEffectiveSystemInstruction } from './personas';
import { MIA_API_EVENT_NAME } from './services/ApiService';
import useToasts from './hooks/useToasts'; // Import useToasts

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.Chat);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  
  const { toasts, addToast, removeToast } = useToasts(); // Initialize useToasts

  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const loaded = loadAppSettings(); 
    return loaded || { 
      activePersonaId: DEFAULT_PERSONA_ID,
      selectedModel: GEMINI_TEXT_MODEL, 
      customPersonaInstructions: {},
      currentCloudSessionId: undefined,
    };
  });

  const [availableCloudSessions, setAvailableCloudSessions] = useState<string[]>([]);

  const activePersona = getPersonaById(appSettings.activePersonaId);

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
  
  const createInitialWelcomeMessage = useCallback((persona: Persona, instruction: string, modelUsed?: string): Message => ({
    id: crypto.randomUUID(),
    sender: Sender.AI,
    text: `Welcome to Mia's Gem Chat Studio! I am ${persona.name}. ${instruction === persona.systemInstruction ? "Using default guidelines." : "Using custom guidelines."} ${modelUsed ? `Current model: ${modelUsed}. ` : ''}How can I assist you today?`,
    timestamp: new Date(),
    avatar: persona.avatarPath,
    name: persona.name,
    aiBubbleClassName: persona.color,
    isError: false,
  }), []);


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
        addToast(errorMsg, ToastType.Error, 10000); // Longer duration for critical error
    // Removed the specific 'else if' block for "legacy API_KEY" warning.
    // If apiKeyStatus.configured is true, it will fall into the 'else' below.
    } else {
        // This will now also cover the case where the legacy API_KEY is used.
        // GeminiService.ts already logs to console if legacy key is used.
        // No toast or specific error bar will be shown for just the legacy key warning.
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
        messagesToInitializeWith.filter(msg => !(msg.sender === Sender.AI && (msg.text.startsWith("Welcome") || msg.isError)))
    );

    refreshCloudSessionsList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createInitialWelcomeMessage, refreshCloudSessionsList, addToast]);

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
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiMessagePlaceholderId
              ? { ...msg, text: errorMessage, isError: isDefinitiveError, aiBubbleClassName: 'bg-red-700' }
              : msg
          )
        );
        addToast(errorMessage, ToastType.Error); // Show error in toast as well
        setIsLoading(false); 
      },
      () => { 
        setIsLoading(false);
      },
      serviceImageData,
      serviceAudioData
    );

  }, [activePersona, apiKeyError, addToast]);

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
    } else {
      addToast("No saved local chat session found or session is empty.", ToastType.Warning);
    }
    setIsSettingsOpen(false);
  }, [appSettings, createSystemMessage, addToast]);

  const handleSaveToCloud = useCallback(async (sessionId: string) => {
    // Validation for empty sessionId is handled in SettingsPanel/DashboardPage or by addToast call there
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
    // Validation for empty sessionId handled in SettingsPanel or by addToast call there
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
  }, [createSystemMessage, addToast]);

  const handleDeleteFromCloud = useCallback(async (sessionId: string) => {
    // Validation for empty sessionId & confirmation handled in SettingsPanel
    setIsLoading(true);
    try {
        await UpstashRedisService.deleteCloudSession(sessionId);
        await refreshCloudSessionsList();
        if (appSettings.currentCloudSessionId === sessionId) {
            const currentInstruction = getEffectiveSystemInstruction(appSettings.activePersonaId, appSettings.customPersonaInstructions);
            GeminiService.resetChatSession(currentInstruction); 
            setMessages([createInitialWelcomeMessage(activePersona, currentInstruction, appSettings.selectedModel)]);
            
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
  }, [appSettings, activePersona, refreshCloudSessionsList, createInitialWelcomeMessage, addToast]);

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

    const systemNotification = createSystemMessage(newPersona, `${newPersona.name} has joined the conversation. The chat history is maintained.`);
    setMessages(prev => [...prev, systemNotification]);
    addToast(`Persona changed to ${newPersona.name}.`, ToastType.Info);

  }, [appSettings, messages, createSystemMessage, addToast]);

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
    } else {
      addToast(`Instructions for ${targetPersona.name} updated.`, ToastType.Success);
    }
  }, [appSettings, messages, createSystemMessage, addToast]);
  
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
    } else {
      addToast(`Instructions for ${personaToReset.name} reset to default.`, ToastType.Success);
    }
  }, [appSettings, messages, createSystemMessage, addToast]);

  const handleModelChange = useCallback((newModelId: string) => {
    // Validation for empty/same model ID handled in SettingsPanel or by addToast there
    const trimmedModelId = newModelId.trim();
    const updatedSettings = { ...appSettings, selectedModel: trimmedModelId };
    setAppSettings(updatedSettings);
    saveAppSettings(updatedSettings);

    const currentInstruction = getEffectiveSystemInstruction(appSettings.activePersonaId, appSettings.customPersonaInstructions);
    GeminiService.reinitializeChatWithHistory(
        trimmedModelId, 
        currentInstruction, 
        messages.filter(msg => !(msg.sender === Sender.AI && msg.isError))
    );
    
    const systemNotification = createSystemMessage(activePersona, `Model changed to **${trimmedModelId}**. The conversation continues with history.`);
    setMessages(prev => [...prev, systemNotification]);
    addToast(`AI Model changed to: ${trimmedModelId}. Conversation continues.`, ToastType.Success);
    setIsSettingsOpen(false); 
  }, [appSettings, activePersona, messages, createSystemMessage, addToast]);

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

  const ToastUI: React.FC<{toast: ToastMessage; onDismiss: (id: string) => void}> = ({toast, onDismiss}) => {
    let bgColor = 'bg-gray-700';
    let borderColor = 'border-gray-600';
    let textColor = 'text-gray-100';

    switch (toast.type) {
        case ToastType.Success:
            bgColor = 'bg-green-600';
            borderColor = 'border-green-700';
            textColor = 'text-white';
            break;
        case ToastType.Error:
            bgColor = 'bg-red-600';
            borderColor = 'border-red-700';
            textColor = 'text-white';
            break;
        case ToastType.Info:
            bgColor = 'bg-blue-600';
            borderColor = 'border-blue-700';
            textColor = 'text-white';
            break;
        case ToastType.Warning:
            bgColor = 'bg-yellow-500';
            borderColor = 'border-yellow-600';
            textColor = 'text-black';
            break;
    }
    
    return (
        <div 
            key={toast.id}
            className={`max-w-sm w-full ${bgColor} ${textColor} shadow-lg rounded-md p-3 my-2 border-l-4 ${borderColor} transition-all duration-300 ease-in-out transform opacity-0 animate-toast-in`}
            role="alert"
            style={{ animationFillMode: 'forwards' }}
        >
            <div className="flex items-start justify-between">
                <p className="text-sm flex-grow">{toast.message}</p>
                <button 
                    onClick={() => onDismiss(toast.id)}
                    className={`ml-2 -mt-1 -mr-1 p-1 rounded-md hover:bg-black hover:bg-opacity-20 transition-colors ${toast.type === ToastType.Warning ? 'text-black hover:text-gray-700' : 'text-white hover:text-gray-200'}`}
                    aria-label="Dismiss notification"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
  };

  const renderViewContent = () => {
    switch (currentView) {
      case AppView.Chat:
        return (
          <div className="flex-grow flex flex-col w-full max-w-4xl lg:max-w-5xl mx-auto overflow-hidden">
            {/* PersonaSelectorBar moved up for correct sticky behavior */}
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
      {apiKeyError && !toasts.some(t => t.message.includes("API Key")) && ( // Show top bar error if no API key toast visible
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
      />

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
            <ToastUI key={toast.id} toast={toast} onDismiss={removeToast} />
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
