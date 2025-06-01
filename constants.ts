
export const USER_AVATAR_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
  <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
</svg>
`; // A generic user icon for User


export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';
export const AVAILABLE_MODELS = [
    { id: 'gemini-2.5-flash-preview-04-17', name: 'Gemini 2.5 Flash Preview' },
    // { id: 'gemini-native-audio-thinking-placeholder', name: 'Gemini Native Audio Thinking (Placeholder)' }, // Removed as it's not a valid/available model for generateContent
];

export const LOCAL_STORAGE_SESSION_KEY = 'geminiChatSession';
export const LOCAL_STORAGE_SETTINGS_KEY = 'geminiChatSettings';
export const LOCAL_STORAGE_PERSONA_INSTRUCTIONS_KEY = 'geminiChatPersonaInstructions'; // Currently part of settings key

// For Simulated Upstash Redis
export const LOCAL_STORAGE_CLOUD_SESSION_PREFIX = 'cloud_session_';
export const LOCAL_STORAGE_CLOUD_SESSIONS_LIST_KEY = 'cloud_sessions_list'; // Not strictly needed if we derive from prefixed keys

// Placeholder for actual Upstash Redis credentials - these would be set in the environment
// export const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
// export const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
// For simulation, we'll log when these would be used.