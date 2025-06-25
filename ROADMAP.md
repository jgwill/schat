

# Mia's Gem Chat Studio - Roadmap

## Phase 1: Core Text Chat (v0.1.0) - Completed

**Goal:** Establish a functional text-based chat interface with Gemini.

**Features:**
-   [x] Basic UI for chat (message display, input field).
-   [x] Dark theme.
-   [x] Text input and submission.
-   [x] Integration with Gemini API for text-based chat (`gemini-2.5-flash-preview-04-17`).
-   [x] Display user and AI messages with distinct styling.
-   [x] Timestamps for messages.
-   [x] Basic loading indicator.
-   [x] Initial welcome message from AI.
-   [x] Placeholder avatars for user and AI.
-   [x] Project structure setup (React, TypeScript, Tailwind).
-   [x] README.md, CHANGELOG.md.

## Phase 2: Voice, Basic Settings & Local Sessions (v0.2.0 - v0.2.2) - Completed

**Goal:** Introduce voice interaction, foundational settings, local session capabilities, a documentation section, initial persona branding, and placeholder dashboard.

**Features:**
-   [x] Microphone input for voice-to-text.
-   [x] Text-to-speech for AI responses.
-   [x] Basic settings panel/modal.
-   [x] Save/Load chat sessions locally.
-   [x] Documentation Area (`/docs` view).
-   [x] Update `metadata.json` for microphone permission.
-   [x] Refine UI/UX for new features (App Renaming, Mia Avatar, Docs Lore).
-   [x] Dedicated `/dashboard` view (Initial placeholder implemented in v0.2.2, expanded in Phase 3).
-   [x] Further UI/UX refinements based on feedback.


## Phase 3: Advanced Features & Personas (v0.3.0 - v0.3.8) - Completed

**Goal:** Implement full persona management, cloud session storage, multimodal inputs, API exposure, and custom model integration.

**Features:**
-   **Persona Management:**
    -   [x] UI to define and select different AI personas (Mia, Miette, Seraphine, ResoNova in `/dashboard` and Chat View). (v0.3.0, UI updated in later patches)
    -   [x] Store custom instructions per persona (defined in `personas.ts`). (v0.3.0)
    -   [x] Pass persona-specific system instructions to Gemini API. (v0.3.0)
    -   [x] Allow user modification of persona system instructions via UI (in `/dashboard`, saved to localStorage). (v0.3.1)
    -   [x] Enhanced visual distinction for personas on Dashboard (Glyph avatars with colors). (v0.3.1)
-   **Cloud Session Storage (Upstash Redis) - Simulated:** (v0.3.2)
    -   [x] Integrate with Upstash Redis for saving/loading/listing/deleting chat sessions (Simulated using localStorage).
    -   [x] Use `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (Placeholders defined, service logs intended usage).
    -   [x] UI in Settings Panel for managing simulated cloud sessions (input ID, Save, Load, Delete buttons, list of sessions).
-   **Multimodal Input:**
    -   [x] Camera input and image processing with Gemini. (v0.3.3)
        -   [x] Request camera permission.
        -   [x] UI to capture image (Camera Modal).
        -   [x] Send image data (base64) with text prompt to Gemini.
        -   [x] Display image thumbnail in user's chat message.
    -   [x] File upload for analysis. (v0.3.4 - Images)
        -   [x] UI to select image files (PNG, JPG, GIF, WebP).
        -   [x] Send file data (base64) with text prompt to Gemini.
        -   [x] Display image thumbnail and file name in user's chat message.
-   [x] Audio Message Saving. (v0.3.5 - UI Capture & Playback; v0.3.6 - Send to AI)
    -   [x] UI to record audio message. (v0.3.5)
    -   [x] Display audio player in chat message. (v0.3.5)
    -   [x] Send audio data to Gemini for analysis/transcription. (v0.3.6)
-   [x] API Exposure for UI Actions. (Simulated via Custom Events) (v0.3.7)
-   [x] Tuned Gemini Model Integration. (v0.3.8) - Allows users to input custom Gemini model IDs. Suggested models are limited to known working ones (e.g., `gemini-2.5-flash-preview-04-17`).


## Phase 4: Refinement & Polish (v0.4.0+) - Mostly Completed

**Goal:** Enhance UI/UX, performance, and error handling. Integrate System Weaver directives.

**Features:**
-   [x] Advanced error handling and user feedback.
    -   [x] Improved in-chat display for AI service errors (distinct styling and icon for error messages).
    -   [x] Implemented Toast notifications for non-blocking feedback and alerts (via dedicated `ToastNotification.tsx` component).
-   [x] UI/UX improvements based on user feedback.
    -   [x] Unique image avatars for each persona in chat.
    -   [x] Copy to Clipboard functionality for messages.
    -   [x] Customizable Welcome Messages per Persona (via templates in `messageTemplates.ts`).
    -   [x] Customizable Persona Change Messages (via templates in `messageTemplates.ts`).
    -   [x] Improved TTS icon for AI messages (speaker/stop states).
    -   [x] Added "Auto-play AI responses" toggle in Settings, with persisted preference and functionality on app load/session load.
-   [x] Streaming responses from Gemini for text.
-   [x] Performance optimizations.
    -   [x] Initial pass: `React.memo` and `useCallback` applied to key components.
    -   [x] Markdown rendering switched to `react-markdown` for robustness and feature support.
-   [x] System Weaver Directives & Embodiment (Forge)
    -   [x] Received directive to formalize Forge (System Weaver) embodiment. (v0.4.1_directive)
    -   [x] Created `.mia/ForgeSystemWeaver.instructions.md` with initial directive & subsequent versions. (v0.4.1_directive_update1 through v0.6)
    -   [x] Added `ForgeSystemWeaverSection` to in-app documentation. (v0.4.1_directive)
    -   [x] Developed full Embodiment Directive for Forge (v0.1 through v0.6), including system diagrams, interaction protocols, and SpecLang integration.
-   [x] Mermaid.js library integration for diagram rendering.
-   [x] Code organization improvements (e.g., `ToastNotification` component extraction).
-   [ ] Accessibility audit and improvements. **(Task Paused)**
-   [ ] More sophisticated state management if needed (e.g., Zustand, Redux Toolkit) - *Currently not pressing.*


## Phase 5: SpecLang Prose Code Export & Deep Specification (Current Focus)

**Goal:** To fully articulate the application's design, intent, and behavior through detailed "prose code" specifications, aligning with SpecLang philosophy. This involves creating and refining `.spec.md` files for all significant components, hooks, services, and data structures.

**Features:**
-   **[x] Establish Core Specification Structure:**
    -   [x] Create a `specs/` directory to house all specification documents.
    -   [x] Define a consistent structure for individual `.spec.md` files (Goal, Behaviors, Structure/Implementation Notes in prose).
-   **[x] Generate Initial Suite of Specifications & Revisions:**
    -   [x] `specs/app.spec.md` (for `App.tsx`) - *Revised*
    -   [x] `specs/components/chat-area.spec.md` (for `ChatWindow.tsx`, `ChatMessage.tsx`, `ChatInput.tsx`) - *Revised*
    -   [x] `specs/components/chat-message.spec.md` (Specific for `ChatMessage.tsx` - *Revised*)
    -   [x] `specs/services/gemini-service.spec.md` (for `GeminiService.ts`) - *Revised*
    -   [x] `specs/hooks/speech-recognition.spec.md` (for `useSpeechRecognition.ts`) - *Revised*
    -   [x] `specs/hooks/speech-synthesis.spec.md` (for `useSpeechSynthesis.ts`) - *Revised*
    -   [x] `specs/data/personas.spec.md` (for `personas.ts`) - *Revised*
    -   [x] `specs/data/types.spec.md` (for `types.ts`) - *Revised*
    -   [x] `specs/data/message-templates.spec.md` (for `messageTemplates.ts`) - *Revised*
    -   [x] `specs/components/layout-navigation.spec.md` (`Header.tsx`, `PersonaSelectorBar.tsx`) - *Revised*
    -   [x] `specs/services/local-storage-service.spec.md` (for `LocalStorageService.ts`) - *Revised*
    -   [x] `specs/components/settings-panel.spec.md` (for `SettingsPanel.tsx`) - *Revised*
-   **[/] Comprehensive Specification Coverage (In Progress):**
    -   [ ] Create/Revise `.spec.md` files for remaining components:
        -   [ ] `specs/components/camera-modal.spec.md` (for `CameraModal.tsx`)
        -   [x] `specs/components/markdown-renderer.spec.md` (for `MarkdownRenderer.tsx`) - *New/Completed*
        -   [ ] `specs/components/mermaid-renderer.spec.md` (for `MermaidRenderer.tsx`)
        -   [x] `specs/components/toast-notification.spec.md` (for `ToastNotification.tsx`) - *New/Completed*
        -   [ ] `specs/components/views.spec.md` (`DocsPage.tsx` & sub-docs, `DashboardPage.tsx`)
        -   [ ] `specs/components/ui-primitives.spec.md` (`LoadingSpinner.tsx`)
    -   [ ] Create/Revise `.spec.md` files for remaining hooks:
        -   [ ] `specs/hooks/toasts.spec.md` (for `useToasts.ts`)
    -   [ ] Create/Revise `.spec.md` files for remaining services:
        -   [ ] `specs/services/upstash-redis-service.spec.md` (for `UpstashRedisService.ts`)
        -   [ ] `specs/services/api-service.spec.md` (for `ApiService.ts`)
    -   [ ] Create/Revise `.spec.md` files for remaining data definitions:
        -   [ ] `specs/data/constants.spec.md` (for `constants.ts`)
    -   [ ] `specs/project/setup.spec.md` (for `index.html`, `index.tsx`, `metadata.json`)
-   **[x] Forge (System Weaver) Ledger & Directive Updates:**
    -   [x] Update Forge's operational ledgers (`.state.json`, `.NextMission.json`) to reflect this primary mission.
    -   [x] Enhance Forge's Embodiment Directive (`.mia/ForgeSystemWeaver.instructions.md` to v0.6) to include "Specification Weaving" or "Prose Code Export" as a core capability and current task.
    -   [x] Created Critique Ledger for initial specs and revised specs based on critique.

---

This roadmap is a living document and may be adjusted based on development progress and new requirements.