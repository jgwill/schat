# DashboardPage.tsx - Specification (SpecLang Aligned)

## Overall Goal/Intent

The `DashboardPage.tsx` component serves as a **centralized hub for high-level application overview and management**, with a primary focus on **AI Persona Customization** and providing quick access or summaries of key **Application Settings**. It aims to offer users an intuitive and informative space to personalize their AI interactions and understand the current configuration of the chat studio without diving into the more granular `SettingsPanel` for every detail. The dashboard should be visually engaging and responsive to different screen sizes.

## Key Behaviors & Responsibilities

1.  **Persona Management Interface:**
    *   **Display Personas:**
        *   **Behavior:** Renders a distinct card or section for each available AI `Persona` (Mia, Miette, Seraphine, ResoNova), sourced from the `personas` prop. Each persona display includes its name, glyph, theme color, and description.
        *   **UX Intent:** To provide users with a clear, visually appealing overview of all available AI personalities, allowing them to easily identify and understand the characteristics of each.
    *   **Active Persona Indication:**
        *   **Behavior:** The card or section for the `activePersonaId` is visually highlighted (e.g., with a border, shadow, or background color change consistent with the persona's theme color) to clearly distinguish it from inactive personas.
        *   **UX Intent:** To provide unambiguous, at-a-glance feedback about which AI persona is currently engaged in the conversation, reinforcing the active selection.
    *   **Persona Selection:**
        *   **Behavior:** Clicking on a persona's name or a dedicated selection area within its card triggers the `onSelectPersona` callback with the chosen persona's ID.
        *   **UX Intent:** To allow users to easily switch the active AI persona directly from the dashboard, making persona changes quick and accessible.
    *   **System Instruction Customization:**
        *   **Behavior:** Each persona card provides an "Edit Instructions" button. Clicking this reveals a `PersonaEditor` sub-component (or an inline textarea) pre-filled with the persona's current effective system instruction (custom or default). Users can modify these instructions.
        *   "Save Instructions" button: Triggers the `onUpdateInstruction` callback with the persona's ID and the new instruction text.
        *   "Reset to Default" button: Triggers the `onResetInstruction` callback for that persona.
        *   "Cancel" button: Hides the editor without saving changes.
        *   A visual cue (e.g., "(Custom instructions active)") indicates if a persona is using modified instructions.
        *   **UX Intent:** To empower users to tailor the guiding principles of each AI persona. The in-place editing provides immediate context, and clear save/reset/cancel actions offer control over customization.

2.  **Application Settings Overview & Quick Actions (Responsive):**
    *   **AI Model Configuration Display:**
        *   **Behavior:** Displays the `selectedModel` (current active Gemini model ID). Provides a button "Change Model in Settings" that triggers the `onOpenSettings` callback, directing the user to the `SettingsPanel` for actual modification.
        *   **UX Intent:** To inform the user of the current AI model being used and provide a quick pathway to change it if necessary, without cluttering the dashboard with the full model input UI.
    *   **Cloud Session Storage Summary & Actions (Responsive):**
        *   **Behavior:**
            *   Displays the `currentCloudSessionId` if one is active, otherwise indicates "None".
            *   Lists `availableCloudSessions` in a scrollable, compact view.
            *   Provides two primary action buttons:
                1.  "Quick Save Chat to Cloud": Triggers `handleQuickSaveToCloud`. If no `currentCloudSessionId` exists, it prompts the user for a new session ID before calling the `onSaveToCloud` prop.
                2.  "Manage All Cloud Sessions": Triggers `onOpenSettings`, directing the user to the `SettingsPanel` for detailed cloud session loading/deletion.
            *   **Responsiveness:** The "Quick Save Chat to Cloud" and "Manage All Cloud Sessions" buttons are arranged in a container that uses `flex-wrap` and `gap`. On smaller screens, if horizontal space is insufficient, the buttons will naturally wrap onto a new line, ensuring they remain fully visible and tappable.
        *   **UX Intent:** To offer a quick overview of cloud session status and provide an immediate action for saving the current chat. For more complex cloud operations, users are guided to the comprehensive `SettingsPanel`. The responsive button layout ensures accessibility and good usability on mobile devices by preventing button cropping or excessive shrinking.
    *   **Loading State Indication:**
        *   **Behavior:** Disables interactive elements (like "Quick Save" or "Open Settings" buttons) when the `isLoading` prop is true, potentially showing a spinner near relevant actions.
        *   **UX Intent:** To provide clear feedback that a background operation is in progress and prevent conflicting actions.

3.  **Feedback & Notifications (Delegated):**
    *   **Behavior:** Relies on the `addToast` prop (passed from `App.tsx`) to display toast notifications for actions initiated from the dashboard (e.g., success/failure of a "Quick Save").
    *   **UX Intent:** To maintain a consistent feedback mechanism across the application, using non-blocking toasts for dashboard-initiated operations.

4.  **Visual Design and Layout:**
    *   **Behavior:** The dashboard presents information in clearly delineated sections (e.g., "Persona Management," "Application Settings") with appropriate headings. It adheres to the application's dark theme and aims for a clean, organized layout.
    *   **UX Intent:** To create an informative and aesthetically pleasing overview page that is easy to navigate and understand, where users can quickly find key management functions.

## Design Intent for Structure (Prose Code)

*   **Section-Based Organization for Clarity:** The dashboard is structured into logical sections using HTML semantic elements and styled containers. This design choice is intended to group related functionalities (persona management vs. application settings), making the page easy to scan and navigate.
*   **Component Composition for Persona Editing (`PersonaEditor`):** The `PersonaEditor` sub-component (or similar inline editing UI) is used to encapsulate the system instruction editing functionality. This modular approach keeps the main `DashboardPage` component cleaner and allows the editing UI to be managed independently.
*   **Props-Driven Data Display for Accuracy:** Most information displayed (active persona, custom instructions, selected model, session IDs) is received via props. This ensures the dashboard accurately reflects the current global application state managed by `App.tsx`.
*   **Callback-Driven Actions for Decoupling:** Actions like selecting a persona, updating instructions, or opening the settings panel are handled by invoking callback props. This decouples the dashboard from the actual implementation of these actions, adhering to a good separation of concerns where `App.tsx` remains the orchestrator.
*   **Responsive Flex Layout for Action Buttons:** The use of `flex flex-wrap gap-2` for the cloud management action buttons is a specific structural choice to achieve responsive behavior. This ensures that on smaller screens, buttons stack vertically if needed, maintaining their full size and tap-ability, which is crucial for mobile usability. On larger screens, they align horizontally, making efficient use of space.
*   **Conditional Rendering for Dynamic UI:** The UI for editing persona instructions or showing "custom instructions active" indicators is conditionally rendered based on state (e.g., `editingPersonaId`, `isCustom`). This allows the UI to adapt dynamically to user interactions and data.

## Relation to SpecLang Principles

*   **Prose Code Intent:** This specification defines the dashboard's purpose (centralized management and overview) and its behaviors (persona customization, settings summary, quick actions) in natural language, focusing on the intended user journey and experience.
*   **Intent-Based Expression:** Describes features based on *what the user can achieve* (e.g., "personalize their AI interactions," "quickly understand the current configuration," "save their chat with a responsive button") and *how the interface supports these goals*.
*   **Modularity:** The dashboard itself is a distinct module within the application. Its reliance on props and callbacks for data and actions promotes loose coupling with other parts of the system.
*   **User Control & Feedback:** A core intent is to provide users with direct control over persona behavior and easy access to settings, accompanied by clear visual feedback (active states, loading indicators, responsive button layouts) and notifications for actions.

This specification details the `DashboardPage` component's role as a user-friendly interface for managing AI personas and accessing key application settings, with specific attention to its responsive design for quick action buttons.