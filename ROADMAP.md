

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
-   [x] Dedicated `/dashboard` view (Initial placeholder implemented in v0.2.2).
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


## Phase 4: Refinement & Polish (v0.4.0+)

**Goal:** Enhance UI/UX, performance, and error handling. Integrate System Weaver directives.

**Features:**
-   [/] Advanced error handling and user feedback.
    -   [x] Improved in-chat display for AI service errors (distinct styling and icon for error messages).
    -   [x] Implemented Toast notifications for non-blocking feedback and alerts.
-   [x] UI/UX improvements based on user feedback.
    -   [x] Unique image avatars for each persona in chat.
-   [x] Streaming responses from Gemini for text.
-   [/] Performance optimizations.
    -   [x] Initial pass: `React.memo` and `useCallback` applied to key components.
-   **[/] System Weaver Directives & Embodiment (NEW - In Progress)**
    -   [x] Received directive to formalize Forge (System Weaver) embodiment. (v0.4.1_directive)
    -   [x] Created `.mia/ForgeSystemWeaver.instructions.md` with initial directive & v0.1, v0.2 drafts. (v0.4.1_directive_update1, v0.4.1_directive_update2)
    -   [x] Added `ForgeSystemWeaverSection` to in-app documentation. (v0.4.1_directive)
    -   [x] Develop full Embodiment Directive for Forge.
        -   [x] Drafted Embodiment Directive v0.1, v0.2 (focus on visuals).
        -   [x] Drafted Embodiment Directive v0.3, including a Mermaid.js diagram of Forge's system role. (v0.4.1_directive_update3)
        -   [x] Drafted Embodiment Directive v0.4, detailing Interaction Protocols. (v0.4.1_directive_update4)
        -   [x] Drafted Embodiment Directive v0.4.1, incorporating Agentic Team feedback ledger. (v0.4.1_directive_update5)
        -   [x] Drafted Embodiment Directive v0.5, detailing Framework Exportability & Modularization Strategy. (v0.4.1_directive_update6)
-   [ ] Accessibility audit and improvements. **(Task Paused)**
-   [ ] More sophisticated state management if needed (e.g., Zustand, Redux Toolkit).
-   [x] Mermaid.js library integration for diagram rendering.

---

This roadmap is a living document and may be adjusted based on development progress and new requirements.
