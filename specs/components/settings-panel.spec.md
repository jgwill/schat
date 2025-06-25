# SettingsPanel.tsx - Specification (SpecLang Aligned) - Revised

## Overall Goal/Intent

The `SettingsPanel.tsx` component is designed to provide a **centralized, modal interface for users to access and manage global application settings and actions**. It aims to offer a clear, organized, and user-friendly way to customize their chat experience, manage session persistence, and control core application behaviors (including audio preferences) without navigating away from their current primary view (Chat, Docs, or Dashboard). The panel should be easily accessible, intuitive to use, responsive to different screen sizes, and dismissible.

## Key Behaviors & Responsibilities

1.  **Visibility Control & Modal Presentation:**
    *   **Behavior:** The panel's visibility is controlled by an `isOpen` prop. When `isOpen` is true, it renders as an overlay (modal dialog) on the right side of the screen, partially obscuring the background content to draw focus.
    *   **UX Intent:** To provide a non-disruptive way to access settings. The modal nature ensures users can focus on configurations and easily return to their previous context. Clicking outside the panel or a dedicated "Close" button dismisses it, offering a standard and intuitive closing mechanism.

2.  **Local Session Management Interface:**
    *   **Behavior:** Presents distinct buttons for "Save Locally" and "Load Locally." These buttons trigger corresponding callback functions (`onSaveLocalSession`, `onLoadLocalSession`) passed from `App.tsx`.
    *   **UX Intent:** To allow users to easily persist their current chat session in their browser's local storage and to retrieve a previously saved session, with clear, actionable buttons for each operation.

3.  **Simulated Cloud Session Management Interface (Responsive):**
    *   **Behavior:**
        *   Provides an input field for users to enter or select a "Cloud Session ID."
        *   Offers "Save to Cloud" and "Load from Cloud" buttons, which become active when a Session ID is present. These trigger `onSaveToCloud` and `onLoadFromCloud` callbacks.
        *   **Responsiveness:** On small (mobile) screens, the "Save to Cloud" and "Load from Cloud" buttons stack vertically (e.g., `grid-cols-1`). On small tablet screens (`sm` breakpoint) and larger, they are arranged side-by-side in a two-column layout (e.g., `sm:grid-cols-2`).
        *   Displays a list of `availableCloudSessions`. Clicking a session ID from this list populates the input field for convenience.
        *   Allows deletion of a cloud session (via `onDeleteFromCloud`), typically requiring user confirmation before proceeding to prevent accidental data loss.
    *   **UX Intent:** To offer a more robust (though simulated) session management experience, allowing users to work with named sessions. The responsive button layout ensures that on mobile devices, buttons are sufficiently large and easy to tap, preventing misclicks. On larger screens, the side-by-side layout makes efficient use of space. The UI aims to make these operations intuitive, with clear visual cues for available sessions and confirmation for destructive actions.

4.  **AI Model Configuration Interface:**
    *   **Behavior:**
        *   Displays the currently `selectedModel`.
        *   Provides a text input field (`modelInput`) allowing users to enter a custom Gemini model ID.
        *   A "Set Model" button triggers the `onModelChange` callback with the new model ID.
        *   Suggests available/known model IDs for user guidance.
    *   **UX Intent:** To empower users to switch between different Gemini models, including fine-tuned ones, with clear feedback on the current selection and easy input for changes. Suggested models help guide users who may not know specific model IDs.

5.  **Audio Preferences Configuration:**
    *   **Behavior:**
        *   Presents a dedicated "Audio Preferences" section.
        *   Within this section, a toggle switch labeled "Auto-play AI responses" is displayed.
        *   The state of this toggle (checked/unchecked) is directly controlled by the `autoPlayTTS` boolean prop received from `App.tsx`.
        *   When the user interacts with the toggle, the `onToggleAutoPlayTTS` callback is invoked with the new boolean value.
        *   An informative subtext explains that enabling this feature will cause AI messages to be read aloud automatically.
    *   **UX Intent:** To provide users with explicit, persistent control over whether AI messages are automatically spoken. The toggle offers a standard, easily understandable UI for this boolean setting.

6.  **Chat Clearing Action:**
    *   **Behavior:** A "Clear Current Chat" button, when clicked, triggers the `onClearChat` callback. This action is typically placed in a "Danger Zone" section to visually indicate its potentially irreversible nature.
    *   **UX Intent:** To provide a straightforward way for users to reset their current conversation and start fresh, with a warning implied by its grouping.

7.  **Feedback During Operations:**
    *   **Behavior:** Buttons for actions that involve processing (e.g., cloud operations, model changes) display a `LoadingSpinner` and are disabled when the `isLoading` prop is true.
    *   **UX Intent:** To provide clear visual feedback that an operation is in progress and to prevent concurrent conflicting actions, improving the user's understanding of the system's state.

8.  **Error and Success Communication (Delegated):**
    *   **Behavior:** While the panel initiates actions, the communication of success or failure (e.g., "Session saved," "Invalid model ID") is primarily handled by the parent component (`App.tsx`) through toast notifications, triggered via the `addToast` prop.
    *   **UX Intent:** To provide consistent feedback to the user for various operations via a centralized notification system, keeping the settings panel itself clean and focused on configuration.

9.  **Layout and Styling:**
    *   **Behavior:** The panel is styled consistently with the application's dark theme. It uses clear headings to organize settings into logical sections. It is scrollable to accommodate all settings on smaller screens.
    *   **UX Intent:** To ensure a visually cohesive, accessible, and easy-to-navigate settings interface, where users can quickly find and modify desired settings.

## Design Intent for Structure (Prose Code)

*   **Modular Sections for Clarity:** The settings are organized into distinct, labeled sections. This structural choice enhances readability and makes it easier for users to locate and understand specific settings.
*   **Responsive Grid for Cloud Actions:** The use of a responsive grid layout (e.g., `grid-cols-1 sm:grid-cols-2`) for the cloud action buttons is a deliberate design choice. This structure ensures that on smaller screens where horizontal space is limited, the buttons stack for better tap targets and readability. On larger screens, the two-column layout utilizes space more efficiently. This adaptive structure directly supports the UX goal of optimal usability across different device sizes.
*   **State-Driven UI for Consistency:** The panel's content and button states are primarily driven by props passed from `App.tsx`. Local state is used judiciously for managing input field values. This design ensures that the settings panel accurately reflects the application's current state.
*   **Callback-Based Actions for Decoupling:** All primary actions are communicated to the parent component via callback props. This design decouples the `SettingsPanel` from the direct implementation of these actions and their persistence logic, making it a more reusable presentational component.
*   **Controlled Inputs for Predictable State:** Input fields and toggles are implemented as controlled components. This ensures that the application state (managed in `App.tsx`) is the single source of truth.

## Relation to SpecLang Principles

*   **Prose Code Intent:** This specification outlines the intended functionality and user experience of the settings panel in clear, natural language, focusing on *what the user can do* and *how the system supports these configurations*, including responsive adaptations for key controls.
*   **Intent-Based Expression:** Focuses on *what the user can configure* (e.g., "manage session persistence with responsive controls," "control audio preferences") rather than detailing specific HTML element hierarchies or CSS class names.
*   **Modularity:** The panel itself is a module, and it's internally structured into logical sub-sections. It relies on its parent (`App.tsx`) for managing the actual state and persistence of these settings, exemplifying a modular and decoupled design.
*   **User Control & Feedback:** A core design intent is to give users explicit control over various application aspects and to provide clear feedback about the system's response to their configurations and the usability of these controls on their specific device.

This specification details the `SettingsPanel`'s role as a comprehensive interface for user-driven application customization and management, emphasizing its interaction with `App.tsx` for managing persisted settings and its responsive design for key interactive elements.