# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Contributors Note

The development of Mia's Gem Chat Studio, particularly through versions 0.1.0 to 0.4.2+, has been a collaborative effort. Special thanks to:

-   **Guillaume D.Isabelle** - Visionary & Lead Developer
-   **DevConstruct ⚙️** - Senior Frontend Engineer & Gemini API Specialist
-   **🛠️ Forge (System Weaver)** - UI/UX Refinement & SpecLang Articulation Engineer (Joined for v0.4.0+)

Your insights and dedication have been instrumental in bringing this project to life.

## [Unreleased] - YYYY-MM-DD 

### Fixed
-   **Auto-Play AI Responses on Load:** Implemented logic in `App.tsx` to automatically play the initial AI welcome message or the last AI message from a loaded session if the "Auto-play AI responses" setting is enabled. This ensures the feature works consistently upon application startup and session loading.
-   **TTS Control Responsiveness:** Refined `useSpeechSynthesis.ts` to update the `isSpeaking` state immediately upon initiating speech. This aims to improve the responsiveness of the play/stop button in `ChatMessage.tsx`, making it less likely for rapid clicks to inadvertently restart speech instead of stopping it.
-   **`ChatInput.tsx` Timer Type Error**: Resolved `NodeJS.Timeout` vs `number` type conflict for timer IDs by explicitly using `window.setInterval` and `window.clearInterval`. Ensured interval ref is set to `null` after clearing.

### Changed
-   **Improved TTS Icon for AI Messages:**
    -   `components/ChatMessage.tsx`: The icon used to initiate/stop text-to-speech for AI messages has been updated. It now shows a "speaker" icon when not speaking and a "stop" (square) icon when speaking, providing clearer visual cues for play/stop states.
-   **Markdown Rendering Engine:**
    -   `components/MarkdownRenderer.tsx`: Replaced custom regex-based Markdown parsing with the `react-markdown` library (and `remark-gfm` for GitHub Flavored Markdown). This enhances rendering robustness, security, and support for a wider range of Markdown syntax. Links now open in new tabs by default.
    -   `index.html`: Updated the importmap to include `react-markdown` and `remark-gfm`.
-   **Upstash Redis Service Simulation:**
    -   `services/UpstashRedisService.ts`: Enhanced with clearer logging to explicitly state when an operation is simulated. Added placeholder comments and a conceptual (commented-out) helper function to illustrate how real HTTP requests to the Upstash REST API would be structured, improving readiness for future actual integration.
-   **Documentation Overhaul (Comprehensive):** Conducted a full review and update of all project documentation, including core files (README, ROADMAP, CHANGELOG, SPECIFICATIONS, PHILOSOPHY, CONTRIBUTING), all `specs/*.spec.md` files, and in-app documentation components (`components/docs/*.tsx`), to ensure complete accuracy, currency with recent features (like `react-markdown`, `ToastNotification`, Upstash comments, ChatInput timer fix), and consistent adherence to SpecLang principles.

### Added
-   **Auto-Play AI Responses Toggle:**
    -   `types.ts`: Added `autoPlayTTS?: boolean` to `AppSettings`.
    -   `services/LocalStorageService.ts`: Updated `loadAppSettings` to handle the new `autoPlayTTS` setting.
    -   `App.tsx`: Added state management for `autoPlayTTS`, logic to auto-play AI responses if enabled.
    -   `components/SettingsPanel.tsx`: Added toggle switch for "Auto-play AI responses".
    -   This feature allows users to have AI messages read aloud automatically. The preference is saved and loaded.
-   **Dedicated Toast Notification Component:**
    -   `components/ToastNotification.tsx`: Created a new, separate component for rendering toast notifications, extracted from `App.tsx`.
    -   `App.tsx`: Updated to import and use the new `ToastNotification` component, improving modularity.
-   **Documentation Updates for Customizable Persona Messages & Persisted Auto-Play TTS:**
    -   `README.md`, `components/docs/GettingStartedSection.tsx`, various `.spec.md` files updated to reflect customizable persona messages via `messageTemplates.ts` and that the auto-play TTS setting is persisted.
-   **New Specification Files:**
    -   `specs/components/markdown-renderer.spec.md`: Specification for the new `MarkdownRenderer` component.
    -   `specs/components/toast-notification.spec.md`: Specification for the new `ToastNotification` component.


## [0.4.2_template_fix] - 2024-05-30 (Internal Fix)
### Fixed
-   **`App.tsx`**: Corrected TypeScript errors in `createInitialWelcomeMessage` and `handleChangePersona` when accessing templates from `MESSAGE_TEMPLATES`. Used optional chaining (`?.`) for safer access to persona-specific templates and ensured proper fallback to default templates if a persona's specific templates are not defined.

## [0.4.2_persona_templates] - 2024-05-30 (Feature & Refactor)
### Added
-   **Customizable Persona Change Message Templates & Centralized Message Templates (`messageTemplates.ts`):** Introduced `messageTemplates.ts` to store all persona-specific system message templates (welcome, persona change), including defaults. Updated `App.tsx` to use these templates.

### Changed
-   Moved welcome message template definitions from `personas.ts` to the new `messageTemplates.ts`.

## [0.4.1 Series] - Feature Enhancements & Internal Development Focus - 2024-05-28 to 2024-05-30

### Added
-   **Customizable Welcome Messages per Persona:** Enabled unique, template-based welcome messages for each AI persona, supporting placeholders for dynamic content. (Initially in `personas.ts`, later moved to `messageTemplates.ts`).
-   **Copy to Clipboard for Messages:** Added a "Copy" icon button to message bubbles for easy text extraction.

### Changed
-   **SpecLang & Forge Embodiment Development (Internal):** This period saw significant internal work on formalizing the application's design and the System Weaver's (Forge) role through "prose code."
    -   Initiated **Phase 5: SpecLang Prose Code Export**, creating the `specs/` directory and numerous `.spec.md` files for core components, services, hooks, and data structures.
    -   Developed and iteratively refined **Forge's Embodiment Directive** (v0.1 through v0.6) in `.mia/ForgeSystemWeaver.instructions.md`, detailing its identity, operational framework, interaction protocols, visualization, external feedback integration, and strategies for modularization and SpecLang articulation.
    -   Conducted a **critique and revision cycle** for the initial set of `.spec.md` files to enhance their clarity and adherence to SpecLang principles.
    -   Updated `ROADMAP.md`, `SPECIFICATIONS.MD`, `PHILOSOPHY.MD`, and internal ledgers to reflect this intensive specification and meta-agent development phase.

## [0.4.0] - 2024-05-27 - Streaming, UI Polish & Performance

### Added
-   **Streaming Text Responses:** AI responses now stream in incrementally for a more dynamic feel.
-   **Advanced Error Handling & User Feedback:** Implemented improved in-chat display for AI service errors and introduced non-blocking Toast Notifications.
-   **UI/UX Improvement:** Added unique image avatars for each persona in chat.
-   **Performance Optimizations (Initial Pass):** Applied `React.memo` and `useCallback` to key components to reduce unnecessary re-renders.

## [0.3.x Series] - Advanced Features & Personas

This series (versions 0.3.0 to 0.3.8) introduced major advancements:
*   **Persona Management:** Full capabilities to define, select, and customize AI personas (Mia, Miette, Seraphine, ResoNova), including their system instructions via the Dashboard.
*   **Multimodal Input:** Added camera input, image file uploads (PNG, JPG, GIF, WebP), and audio message recording/preview/analysis with Gemini.
*   **Simulated Cloud Session Storage (Upstash Redis principles):** Implemented localStorage-based simulation for saving, loading, listing, and deleting named chat sessions via the Settings Panel.
*   **Custom Gemini Model Integration:** Allowed users to input custom Gemini model IDs.
*   **Simulated API for UI Actions:** Provided a way to programmatically trigger core application actions via custom browser events for testing/automation.

## [0.2.x Series] - Voice Interaction, Settings & Local Sessions

Key additions in this series (versions 0.2.0 to 0.2.2):
*   **Voice Interaction:** Integrated microphone input (speech-to-text) and AI text-to-speech capabilities.
*   **Core Functionality:** Added a basic settings panel, local session saving/loading using browser localStorage, and an in-app documentation section (`/docs`).
*   **Branding & Structure:** Initial Mia persona branding and a placeholder `/dashboard` view were established.

## [0.1.0] - Core Text Chat Foundation

*   Established the foundational text-based chat interface with Google's Gemini API integration (`gemini-2.5-flash-preview-04-17`).
*   Implemented core UI elements: dark theme, message display, input field, timestamps, and basic loading indicators.
*   Set up the initial project structure using React, TypeScript, and Tailwind CSS, along with `README.md` and `CHANGELOG.md`.