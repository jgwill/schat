
export enum Sender {
  User = 'User',
  AI = 'AI',
}

export interface Message {
  id: string;
  sender: Sender;
  text: string; // Can contain Markdown
  timestamp: Date;
  avatar: string; // Path to image for AI (e.g., /assets/mia_avatar.png) or SVG string for User.
  name: string; // Display name (e.g., "You" or Persona Name)
  aiBubbleClassName?: string; // Optional: Tailwind CSS class for AI message bubble background
  imagePreviewUrl?: string; // Base64 Data URL for displaying captured image/file in UI
  base64ImageData?: string; // Base64 string of the image data for sending to AI
  imageMimeType?: string;   // Mime type of the image (e.g., 'image/jpeg')
  fileName?: string;        // Optional: name of the uploaded file
  audioDataUrl?: string;    // Base64 Data URL for playing recorded audio
  audioMimeType?: string;   // Mime type of the recorded audio (e.g., 'audio/webm')
  isError?: boolean; // Optional: true if this AI message is an error message
}

export enum AppView {
  Chat = 'Chat',
  Docs = 'Docs',
  Dashboard = 'Dashboard',
}

export interface Persona {
  id: string;
  name: string; // Includes glyph, e.g., "🧠 Mia"
  glyph: string; // e.g., "🧠"
  avatarPath: string; // Path to image asset for chat messages
  color: string; // Tailwind CSS class for styling (e.g., 'bg-blue-500'), used for dashboard glyphs and AI chat bubble background.
  description: string;
  systemInstruction: string; // Default system instruction
}

export interface AppSettings {
  selectedModel: string; // ID of the currently selected Gemini model
  activePersonaId: string; // Store the ID of the active persona
  customPersonaInstructions?: { [personaId: string]: string }; // User-defined instructions
  currentCloudSessionId?: string; // ID of the last active/loaded cloud session
}

// For Simulated API Exposure
export enum ApiActionType {
  SEND_MESSAGE = 'SEND_MESSAGE',
  CHANGE_PERSONA = 'CHANGE_PERSONA',
  CLEAR_CHAT = 'CLEAR_CHAT',
  SET_VIEW = 'SET_VIEW',
}

export interface ApiSendMessagePayload {
  text: string;
  imageData?: { base64ImageData: string; imageMimeType: string; fileName?: string };
  audioData?: { audioDataUrl: string; audioMimeType: string }; // Changed from base64 to dataUrl for consistency
}

export interface ApiChangePersonaPayload {
  personaId: string;
}

export interface ApiSetViewPayload {
  view: AppView; // Use AppView enum
}

// Generic payload type for the event detail
export interface ApiActionPayload {
  actionType: ApiActionType;
  payload?: any; // Specific payload type will be asserted based on actionType
}

// Toast Notifications
export enum ToastType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
}

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}


// Props for components
export interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onClearChat: () => void;
    onSaveLocalSession: () => void;
    onLoadLocalSession: () => void;
    onSaveToCloud: (sessionId: string) => Promise<void>;
    onLoadFromCloud: (sessionId: string) => Promise<void>;
    onDeleteFromCloud: (sessionId: string) => Promise<void>;
    availableCloudSessions: string[];
    currentCloudSessionId?: string;
    isLoading: boolean;
    selectedModel: string; 
    onModelChange: (newModelId: string) => void; 
    addToast: (message: string, type: ToastType, duration?: number) => void; // Added
}

export interface DashboardPageProps {
  personas: Persona[];
  activePersonaId: string;
  customPersonaInstructions: { [personaId: string]: string };
  onSelectPersona: (personaId: string) => void;
  onUpdateInstruction: (personaId: string, instruction: string) => void;
  onResetInstruction: (personaId: string) => void;
  // New props for Application Settings section
  selectedModel: string;
  currentCloudSessionId?: string;
  availableCloudSessions: string[];
  isLoading: boolean;
  onSaveToCloud: (sessionId: string) => Promise<void>;
  onOpenSettings: () => void; // To open the main SettingsPanel
  addToast: (message: string, type: ToastType, duration?: number) => void; // Added
}
