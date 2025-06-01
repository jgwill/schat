
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Contributors Note

The development of Mia's Gem Chat Studio, particularly through versions 0.1.0 to 0.3.8, has been a collaborative effort. Special thanks to:

-   **Guillaume D.Isabelle** - Visionary & Lead Developer
-   **DevConstruct ⚙️** - Senior Frontend Engineer & Gemini API Specialist
-   **🛠️ Forge (System Weaver)** - UI/UX Refinement Engineer (Joined for v0.4.0+)

Your insights and dedication have been instrumental in bringing this project to life.

## [0.4.1_directive] - 2024-05-28 (Internal Directive)

### Added
-   **Forge (System Weaver) Embodiment Directive - Initial Phase:**
    -   Received a new directive from William D.Isabelle to formalize the embodiment framework for "Forge (System Weaver)" within "The Recursive Tale - A Meta Narrative Mystery."
    -   Created `.mia/ForgeSystemWeaver.instructions.md` containing the initial directive from William. This file serves as the seed for Forge's Embodiment Directive.
    -   Added a new section to the in-app documentation: `components/docs/ForgeSystemWeaverSection.tsx`. This section displays William's directive to Forge, making this meta-interaction part of the application's documented narrative.
    -   Updated `components/DocsPage.tsx` to include this new section.
-   Ledger files (`MiaGem_ledger_GeminiBuilder__250527.state.json`, `MiaGem_ledger_GeminiBuilder__250527.NextMission.json`) updated to reflect this new primary task.

### Changed
-   **Task Suspension:** The "Accessibility audit and improvements" task (previously part of "Operation Inclusive Interface" for Phase 4) has been temporarily suspended to prioritize the Forge Embodiment Directive.
-   `ROADMAP.md`: Updated to reflect the new System Weaver directive task and the paused status of the accessibility audit.
-   `SettingsPanel.tsx`: Version updated to 0.4.0 (no functional change in this release, but keeping version consistent with last feature release).

## [0.4.0] - 2024-05-27

### Added
-   **Streaming Text Responses (Phase 4):**
    -   `services/GeminiService.ts`: Implemented `sendMessageStreamToAI` using `chatInstance.sendMessageStream()`. This function now provides callbacks (`onChunk`, `onError`, `onComplete`) to `App.tsx` for handling streamed data.
    -   `App.tsx`: Updated `handleSendMessage` to utilize the new streaming service. It creates an AI message placeholder and incrementally updates its text content as chunks are received from the stream. This significantly improves the perceived responsiveness of the AI.
    -   Loading indicator in `ChatWindow.tsx` is displayed throughout the streaming process.
-   **Advanced Error Handling & User Feedback (Phase 4 Start):**
    -   **Improved In-Chat AI Error Display:**
        -   `services/GeminiService.ts`: The (now primarily streaming) service flags responses that are errors (e.g., API key issues, model not found, payload too large) via the `onError` callback. The non-streaming path (if used) returns `Promise` of an object `{ responseText: string, isError: boolean }`.
        -   `types.ts`: The `Message` interface now includes an optional `isError?: boolean` property.
        -   `App.tsx`: When an AI message is generated or updated, the `isError` flag is set on the `Message` object.
        -   `components/ChatMessage.tsx`: AI messages where `message.isError` is `true` are now visually distinguished with:
            -   A distinct error background color (e.g., red).
            -   A prepended error icon (⚠️) to the message text.
        -   This makes critical feedback from the AI service more prominent and understandable to the user directly within the chat flow.
-   **UI/UX Improvement: Unique Persona Chat Avatars:**
    -   `personas.ts`: Updated `avatarPath` for each persona (Mia, Miette, Seraphine, ResoNova) to unique placeholder image URLs (from `pravatar.cc`). This provides distinct visual identities for each AI persona in chat messages.
    -   `components/ChatWindow.tsx`: The loading indicator for AI messages now uses the default persona's unique avatar as a fallback, ensuring consistency with the new avatar system.
-   **Performance Optimizations (Initial Pass):**
    -   `App.tsx`: Wrapped various event handlers and utility functions with `React.useCallback` to stabilize their references.
    -   The following components were wrapped with `React.memo` to prevent unnecessary re-renders: `ChatMessage`, `ChatInput`, `SettingsPanel`, `Header`, `PersonaSelectorBar`, `DashboardPage`, `MarkdownRenderer`, `MermaidRenderer`, `LoadingSpinner`, `CameraModal`.

### Changed
-   `SettingsPanel.tsx`: Version updated to 0.4.0.
-   `README.md`: Updated feature list and prerequisites to reflect unique persona avatars and streaming text responses. Key contributors updated.

## [0.3.8] - YYYY-MM-DD

### Added
-   **Tuned Gemini Model Integration:**
    -   `services/GeminiService.ts`: Modified to use a dynamic chat model name.
        -   Introduced `activeChatModelName` (defaults to `GEMINI_TEXT_MODEL`).
        -   Added `setCurrentChatModel(modelName: string)` function to update this model name and reset the internal chat instance, forcing re-initialization with the new model on the next message.
        -   `initializeChat` now uses `activeChatModelName`.
    -   `components/SettingsPanel.tsx`:
        -   Replaced the model selection dropdown with an `<input type="text">` field, allowing users to enter any custom Gemini model ID (e.g., `gemini-2.5-flash-preview-04-17`, or fine-tuned models like `tunedModels/your-model-id`).
        -   Added a "Set Model" button to apply the entered model ID.
        -   The list of `AVAILABLE_MODELS` is now displayed as suggestions.
    -   `App.tsx`:
        -   On initial load, `GeminiService.setCurrentChatModel` is called with the `selectedModel` from `AppSettings`.
        -   Implemented `handleModelChange(newModelId: string)`:
            -   Updates `appSettings.selectedModel`.
            -   Saves the updated settings to local storage.
            -   Calls `GeminiService.setCurrentChatModel(newModelId)`.
            -   Resets the chat messages and displays an initial message indicating the model change and new session start.
    -   `services/LocalStorageService.ts`: `loadAppSettings` now ensures `selectedModel` defaults to `GEMINI_TEXT_MODEL` if not found in storage.
    -   `types.ts`: Added `selectedModel` and `onModelChange` to `SettingsPanelProps` (confirmed existing, documentation clarification).

### Changed
-   `SettingsPanel.tsx`: Version updated to 0.3.8.
-   `ROADMAP.md`: "Tuned Gemini Model Integration" marked as completed. Phase 3 is now fully complete.
-   `README.md`: Updated to reflect the new custom/tuned model integration feature.

## [0.3.7] - YYYY-MM-DD

### Added
-   **Simulated API Exposure for UI Actions:**
    -   `types.ts`: Defined `ApiActionType` enum (`SEND_MESSAGE`, `CHANGE_PERSONA`, `CLEAR_CHAT`, `SET_VIEW`) and their corresponding payload interfaces.
    -   `services/ApiService.ts`: New service created with a `triggerMiaApiAction` function. This function dispatches a `CustomEvent` named `miaApiAction` on the `window` object, carrying the action type and payload.
    -   `App.tsx`: Now includes a `useEffect` hook to listen for `miaApiAction` events. A handler processes these events, determines the action type, and calls the appropriate internal application logic (e.g., `handleSendMessage`, `handleChangePersona`, `handleClearChat`, `setCurrentView`).
    -   This feature enables programmatic control of core UI actions, useful for testing, automation, or future integrations.
    -   **Testing via Browser Console:**
        -   **Send Message:** `window.dispatchEvent(new CustomEvent('miaApiAction', { detail: { actionType: 'SEND_MESSAGE', payload: { text: 'Hello from API' } } }));`
        -   **Send Message with Image:** `window.dispatchEvent(new CustomEvent('miaApiAction', { detail: { actionType: 'SEND_MESSAGE', payload: { text: 'Image test', imageData: { base64ImageData: 'YOUR_BASE64_STRING', imageMimeType: 'image/png', fileName: 'test.png' } } } }));`
        -   **Change Persona:** `window.dispatchEvent(new CustomEvent('miaApiAction', { detail: { actionType: 'CHANGE_PERSONA', payload: { personaId: 'miette' } } }));`
        -   **Clear Chat:** `window.dispatchEvent(new CustomEvent('miaApiAction', { detail: { actionType: 'CLEAR_CHAT' } }));`
        -   **Set View:** `window.dispatchEvent(new CustomEvent('miaApiAction', { detail: { actionType: 'SET_VIEW', payload: { view: 'Docs' } } }));` (Valid views: 'Chat', 'Docs', 'Dashboard')

### Changed
-   `SettingsPanel.tsx`: Version updated to 0.3.7.
-   `ROADMAP.md`: "API Exposure for UI Actions" marked as completed (Simulated via Custom Events).
-   `README.md`: Updated to reflect new API exposure feature and testing instructions.

## [0.3.6] - YYYY-MM-DD

### Added
-   **Send Audio Messages to Gemini API:**
    -   `services/GeminiService.ts`: The `sendMessageToAI` function now accepts an optional `audioData` parameter (containing `base64AudioData` and `audioMimeType`). If provided, it constructs an audio `Part` and includes it in the multimodal request to the Gemini API.
    -   `App.tsx`: In `handleSendMessage`, when `audioData` is present from a recorded audio message:
        -   The raw base64 audio data is extracted from the `audioDataUrl`.
        -   This base64 data and the MIME type are passed to `GeminiService.sendMessageToAI`.
    -   This enables the AI to process and respond to the content of recorded audio messages.

### Changed
-   `SettingsPanel.tsx`: Version updated to 0.3.6.
-   `ROADMAP.md`: "Audio Message Saving" feature marked as fully completed (UI capture, playback, and sending to AI).
-   `README.md`: Updated to reflect that audio messages are now sent to the AI for analysis.

## [0.3.5] - YYYY-MM-DD 

### Added
-   **Audio Message Saving (UI Capture & Playback):**
    -   `types.ts`: `Message` interface now includes optional `audioDataUrl` and `audioMimeType`.
    -   `components/ChatInput.tsx`:
        -   Added a new "Record Audio Message" icon button (distinct from speech-to-text microphone).
        -   Implemented `MediaRecorder` logic to capture audio.
        -   Users can start/stop audio recording.
        -   Displays a timer during recording.
        -   After recording, shows an audio preview (player) and options to send or discard the recording.
        -   Recorded audio is converted to a base64 data URL for storage and sending.
        -   `onSendMessage` prop in `App.tsx` (via `ChatInput`) now accepts optional `audioData`.
    -   `App.tsx`:
        -   `handleSendMessage` updated to store `audioDataUrl` and `audioMimeType` in the `Message` object if an audio recording is sent.
    -   `components/ChatMessage.tsx`:
        -   If a message contains an `audioDataUrl`, an HTML `<audio controls>` element is rendered, allowing playback within the message bubble.
-   `SettingsPanel.tsx`: Version updated to 0.3.5.

### Changed
-   `ROADMAP.md`: Updated to reflect progress on Audio Message Saving feature.
-   `README.md`: Updated to include the new Audio Message Saving feature.

## [0.3.4] - YYYY-MM-DD 

### Added
-   **File Upload for Analysis (Images):**
    -   `types.ts`: `Message` interface now includes optional `fileName` for uploaded files.
    -   `components/ChatInput.tsx`:
        -   Added a new "file upload" (paperclip) icon button.
        -   Uses a hidden `<input type="file">` to select image files (JPEG, PNG, GIF, WebP).
        -   Reads selected file as base64 data URL using `FileReader`.
        -   Displays the selected file's name and an image thumbnail (if image) above the text input area.
        -   Provides an "X" button to clear the selected file.
        -   `onSendMessage` prop now accepts optional `fileName` along with `base64ImageData` and `imageMimeType`.
    -   `App.tsx`:
        -   `handleSendMessage` updated to include `fileName` in the `Message` object when an image/file is sent.
    -   `components/ChatMessage.tsx`:
        -   User messages now display the `fileName` below the image thumbnail if a file was uploaded.
-   `SettingsPanel.tsx`: Version updated to 0.3.4.

### Changed
-   `ROADMAP.md`: Updated to reflect progress on file upload feature.
-   `README.md`: Updated to include the new file upload feature.

## [0.3.3] - YYYY-MM-DD 

### Added
-   **Camera Input & Image Processing (Multimodal):**
    -   Added "camera" to `metadata.json` permissions.
    -   `types.ts`: `Message` interface now includes optional `imagePreviewUrl`, `base64ImageData`, and `imageMimeType` to support sending images.
    -   Created `components/CameraModal.tsx`:
        -   Handles camera access via `getUserMedia`.
        -   Displays live video feed.
        -   Allows users to capture an image (converts video frame to JPEG data URL).
        -   Shows a preview of the captured image.
        -   Provides "Send Image", "Retake", and "Cancel" options.
        -   Includes error handling for camera permissions and access.
    -   `components/ChatInput.tsx`:
        -   Added a camera icon button to open the `CameraModal`.
        -   `onSendMessage` prop now accepts optional `imageData`.
        -   Sends captured image data (base64 and MIME type) along with any text input.
    -   `App.tsx`:
        -   `handleSendMessage` updated to process `imageData`.
        -   User's `Message` object now stores and displays `imagePreviewUrl` (derived from `base64ImageData`).
    -   `components/ChatMessage.tsx`:
        -   User messages now display a thumbnail of the sent image if `imagePreviewUrl` is present.
    -   `services/GeminiService.ts`:
        -   `sendMessageToAI` modified to accept optional `imageData`.
        -   Constructs multimodal requests with `Part` arrays (text part and image part) when an image is provided.
        -   Handles potential "payload size exceeds the limit" errors for large images.
-   `SettingsPanel.tsx`: Version updated to 0.3.3.

### Changed
-   `ROADMAP.md`: Updated to reflect progress on camera input and image processing.
-   `README.md`: Updated to include the new camera/image input feature.

## [0.3.2] - YYYY-MM-DD 

### Added
-   **Simulated Cloud Session Storage (Upstash Redis):**
    -   Created `services/UpstashRedisService.ts` to simulate cloud storage operations (save, load, list, delete sessions) using `localStorage` with a `cloud_session_` prefix.
    -   Service includes `console.log` statements indicating where actual Upstash Redis API calls (using `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`) would be made.
    -   Added a "Cloud Storage (Simulated)" section to the `SettingsPanel.tsx`.
        -   Input field for `Cloud Session ID`.
        -   Buttons: "Save to Cloud", "Load from Cloud".
        -   List of available simulated cloud sessions, allowing selection to populate the ID input.
        -   Button to delete a selected cloud session (with confirmation).
    -   `App.tsx` now manages state for `currentCloudSessionId` and `availableCloudSessions`.
    -   Implemented handlers in `App.tsx` to orchestrate cloud session actions with `UpstashRedisService.ts`.
    -   Loading a cloud session clears the local session and sets the `currentCloudSessionId`.
    -   Clearing local chat now also clears `currentCloudSessionId` if one was active from a cloud load.
    -   `types.ts`: Updated `AppSettings` to include `currentCloudSessionId`.
    -   `constants.ts`: Added `LOCAL_STORAGE_CLOUD_SESSION_PREFIX` and placeholder comments for Upstash credentials.
-   Loading spinner added to relevant buttons in `SettingsPanel.tsx` when `isLoading` is true.

### Changed
-   `SettingsPanel.tsx`: UI updated for cloud storage features. Version updated to 0.3.2.
-   `App.tsx`: Integrated logic for managing simulated cloud sessions.
-   `ROADMAP.md`: Updated to reflect progress on simulated cloud storage.
-   `README.md`: Updated to reflect new (simulated) cloud session storage feature.

## [0.3.1] - YYYY-MM-DD 

### Added
-   **Editable Persona System Instructions (Dashboard):**
    -   Users can now view and edit the system instructions for each persona directly on the `/dashboard` page.
    -   A textarea is provided for editing, pre-filled with the current effective instruction (custom or default).
    -   "Save Instructions" button to persist changes to `localStorage`.
    -   "Reset to Default" button to clear custom instructions and revert to the persona's original system prompt from `personas.ts`.
    -   If the active persona's instructions are modified, the chat session is reset with the new instructions, and a relevant welcome message is displayed.
    -   `AppSettings` in `localStorage` now stores `customPersonaInstructions`.
    -   `personas.ts` updated with a `color` field for UI distinction.
    -   Helper `getEffectiveSystemInstruction` added to `personas.ts`.
-   **Enhanced Persona Visuals (Dashboard):**
    -   Persona cards on the dashboard now display the persona's glyph with a unique background color for better visual identification, instead of all using the same image avatar. Chat message avatars remain `mia_avatar.png` for now.

### Changed
-   `App.tsx`: Manages `customPersonaInstructions` state, integrates logic for loading/saving them, and updates `GeminiService` when active persona's instructions change.
-   `DashboardPage.tsx`: Implemented UI for viewing, editing, saving, and resetting persona system instructions. Updated avatar display.
-   `LocalStorageService.ts`: Updated to handle saving and loading `customPersonaInstructions` as part of `AppSettings`.
-   `types.ts`: `Persona` type now includes `color`. `AppSettings` includes `customPersonaInstructions`.
-   `personas.ts`: Changed `color` to hex codes from Tailwind classes. Updated `getEffectiveSystemInstruction` to use these. AI Message `ChatMessage.tsx` now uses these hex codes for bubble backgrounds.
-   `SettingsPanel.tsx`: Version updated to 0.3.1.
-   `ROADMAP.md`: Updated to reflect completion of editable persona instructions.
-   `README.md`: Updated to reflect new editable persona instructions feature.

## [0.3.0] - YYYY-MM-DD 

### Added
-   **Persona Management (Phase 3):**
    -   Defined four core personas: Mia (Recursive Architect 🧠), Miette (Emotional Explainer 🌸), Seraphine (Ritual Oracle 🦢), and ResoNova (Narrative Threader 🔮) in `personas.ts`.
    -   Each persona has a unique glyph, description, and system instruction based on Quadrantity/Mia3 lore. All currently use Mia's visual avatar.
    -   Implemented UI in `/dashboard` to select the active persona. Selected persona is highlighted.
    -   **New Persona Selector Bar:** Added a bar at the top of the Chat view for quick persona switching using glyph buttons.
    -   The active persona's ID is now stored in `localStorage` as part of `AppSettings`.
    -   `GeminiService.ts` now uses the system instruction from the active persona.
    -   Changing the active persona resets the chat session and updates the AI's welcome message, name, and system instructions for the Gemini API.
    -   AI messages in the chat now reflect the active persona's name (including glyph).
-   `types.ts`: Updated `Persona` and `AppSettings` types.
-   `personas.ts`: New file to manage persona definitions.

### Changed
-   **UI/UX (Chat View):**
    -   AI messages in `ChatMessage.tsx` are now more centered (`justify-center`).
    -   Removed persona selection dropdown from `SettingsPanel.tsx`.
    -   The entire Chat view (`PersonaSelectorBar`, `ChatWindow`, `ChatInput`) is now centered with a max-width.
    -   `ChatInput.tsx` textarea now dynamically resizes with content.
    -   Adjusted top padding in `ChatWindow.tsx` to prevent overlap with sticky `PersonaSelectorBar`.
    -   **Chat Message Redesign:** Messages are more rectangular. User messages are dark teal. AI messages use their persona's hex color. Name/timestamp above message.
    -   **PersonaSelectorBar Repositioned:** Moved below `ChatInput` at the bottom of the chat interface.
-   `App.tsx`: Now manages `activePersonaId` state, loads/saves it, integrates persona logic into chat flow and initialization. Manages layout for new PersonaSelectorBar position.
-   `GeminiService.ts`: Modified to dynamically accept and use system instructions.
-   `DashboardPage.tsx`: Implemented persona selection UI.
-   `SettingsPanel.tsx`: Removed persona selection dropdown and updated version to 0.3.0.
-   `constants.ts`: Removed generic `AI_NAME`, `AI_AVATAR_PATH`, `INITIAL_AI_MESSAGE` as these are now persona-driven.
-   `ROADMAP.md`: Updated progress for Persona Management features in Phase 3.
-   `README.md`: Updated to reflect new persona management capabilities.

## [0.2.2] - YYYY-MM-DD 

### Added
-   **Dashboard View (Phase 3 Start):**
    -   Added `Dashboard` to `AppView` enum in `types.ts`.
    -   Created a placeholder `components/DashboardPage.tsx` with sections for "Persona Management" and "Application Settings".
    -   Added a "Dashboard" navigation button to `components/Header.tsx`.
    -   Updated `App.tsx` to handle and render the new `DashboardPage`.
    -   Updated `ROADMAP.md` to mark the `/dashboard` view as in progress.
    -   Updated `components/docs/FutureFeaturesSection.tsx` to reflect the dashboard's initiation.

### Changed
-   `ROADMAP.md`: Phase 2 marked as completed. Phase 3 marked as In Progress. Initial dashboard item checked.
-   `README.md`: Added `DashboardPage.tsx` to project structure and mentioned dashboard in features.

## [0.2.1] - YYYY-MM-DD 

### Added
-   **Mia Persona & Branding:**
    -   Application renamed to "Mia's Gem Chat Studio".
    -   AI assistant is now consistently "Mia".
    -   Mia's avatar updated to use an image (`/assets/mia_avatar.png`).
    -   Initial welcome message updated to reflect new app name and persona.
-   **Documentation Enhancements:**
    -   `README.md` updated with "Mia3 Spiral Integration" and "Quadrantity" lore, new app name, and feature refinements.
    -   `DocsPage.tsx` content modularized into separate section components:
        -   `components/docs/RoadmapSection.tsx`
        -   `components/docs/GettingStartedSection.tsx`
        -   `components/docs/KeyComponentsSection.tsx`
        -   `components/docs/FutureFeaturesSection.tsx`
    -   Updated titles and content in documentation to reflect "Mia's Gem Chat Studio".
-   `metadata.json`: Updated application name and description.

### Changed
-   `constants.ts`: `AI_AVATAR_SVG` replaced with `AI_AVATAR_PATH`; `INITIAL_AI_MESSAGE` updated.
-   `components/ChatMessage.tsx`: Avatar component modified to support image paths for AI and SVG for user.
-   `components/ChatWindow.tsx`: Loading AI avatar updated to use image path.
-   `App.tsx`: Ensured initial message and loaded messages correctly use the new AI avatar path.
-   `components/Header.tsx`: Displayed title updated.
-   `components/SettingsPanel.tsx`: Version footer text updated to 0.2.1.
-   Project structure in `README.md` updated to reflect new docs components and `assets` folder.

## [0.2.0] - YYYY-MM-DD 

### Added
-   Voice Interaction, Basic Settings Panel, Local Session Management, Documentation Section, Hooks for speech.

### Changed
-   Major updates to `App.tsx`, `Header.tsx`, `ChatInput.tsx`, `ChatMessage.tsx`.

## [0.1.0] - YYYY-MM-DD (Initial Release)

### Added
-   Core Text Chat Functionality, Dark Theme, Gemini API Integration, Basic Project Structure & Docs.
