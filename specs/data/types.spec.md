# types.ts - Specification (SpecLang Aligned) - Revised

## Overall Goal/Intent

The `types.ts` file serves as the **authoritative schema and central contract for all custom data structures** used within Mia's Gem Chat Studio. Its primary purpose is to establish unambiguous, consistent, and statically verifiable definitions for the shapes of data objects (like messages, personas, application settings) and to enumerate constrained value sets (like sender types or view states). By doing so, it enhances code clarity, facilitates maintainability, and significantly contributes to preventing runtime data-related errors through TypeScript's static type-checking. The intent is to create a robust data foundation for the application.

## Key Data Structures Defined (Behaviors of Data)

This file defines the "behavior" of data by rigorously specifying its expected structure, properties, and allowed values.

1.  **`Sender` Enum:**
    *   **Intent:** To provide a constrained set of identifiers for the originator of a chat message, ensuring clarity and type safety when determining message source.
    *   **Structure:** An enumeration strictly allowing `User` or `AI`.

2.  **`Message` Interface:**
    *   **Intent:** To define the comprehensive structure for a single chat message object, accommodating text, metadata, multimodal content (images, audio), and state indicators (like errors). This ensures all parts of the system agree on what constitutes a message.
    *   **Key Properties:** `id`, `sender`, `text`, `timestamp`, `avatar`, `name`, `aiBubbleClassName?`, `imagePreviewUrl?`, `base64ImageData?`, `imageMimeType?`, `fileName?`, `audioDataUrl?`, `audioMimeType?`, `isError?`.

3.  **`AppView` Enum:**
    *   **Intent:** To define a fixed set of identifiers for the main navigable sections of the application, enabling type-safe view management.
    *   **Structure:** Enumerates `Chat`, `Docs`, `Dashboard`.

4.  **`Persona` Interface:**
    *   **Intent:** To structure the data representing an AI persona, encapsulating its identity, visuals, and core behavioral guidelines (`systemInstruction`). This provides a consistent blueprint for persona objects.
    *   **Key Properties:** `id`, `name`, `glyph`, `avatarPath`, `color`, `description`, `systemInstruction`.

5.  **`AppSettings` Interface:**
    *   **Intent:** To define the shape of the object for storing and managing global user-configurable application settings, ensuring all settings are consistently structured and accessed.
    *   **Key Properties and Their Intent:**
        *   `selectedModel`, `activePersonaId`: Track the user's primary AI configuration choices.
        *   `customPersonaInstructions?`: Allows for persistent user overrides of default persona behaviors.
        *   `currentCloudSessionId?`: Maintains context for (simulated) cloud-saved sessions.
        *   `autoPlayTTS?: boolean`: An optional property to determine if AI responses should be automatically spoken aloud. Its intent is to give users control over auditory feedback from the AI.

6.  **Simulated API Action Types (e.g., `ApiActionType`, `ApiSendMessagePayload`):**
    *   **Intent:** To provide type safety for data structures used in the application's simulated external API, facilitating reliable programmatic interaction.

7.  **Toast Notification Types (e.g., `ToastType`, `ToastMessage`):**
    *   **Intent:** To define the structure and categories for UI toast notifications, ensuring consistent and type-safe feedback messages.

8.  **Component Prop Interfaces (e.g., `SettingsPanelProps`, `DashboardPageProps`):**
    *   **Intent:** To explicitly define the contract (expected props) for React components, improving reusability, preventing integration errors, and clarifying data flow.
    *   **`SettingsPanelProps` Update:**
        *   `autoPlayTTS: boolean`: A prop to pass the current state of the auto-play TTS setting to the panel.
        *   `onToggleAutoPlayTTS: (newValue: boolean) => void`: A callback prop for the panel to inform the application when the user changes the auto-play TTS setting.

## Role and Importance in Application Development

*   **Single Source of Truth for Data Shapes:** Acts as the definitive reference for how data should be structured throughout the application.
*   **Enhanced Code Quality & Reduced Bugs:** Leverages TypeScript's static type checking to catch data-related errors at compile time, rather than runtime.
*   **Improved Readability & Maintainability:** Makes the expected shape of data explicit, facilitating easier understanding and safer modification of code that uses these types.
*   **Facilitates Collaboration:** Provides clear, shared data contracts for developers working on different parts of the application.

## Relation to SpecLang Principles

*   **"Prose Code" for Data Structure:** TypeScript interfaces and enums serve as a precise, human-readable specification for data blueprints. They clearly define the "what" of data, acting as a form of structured prose.
*   **Intent-Based Expression:** Type definitions clearly express the intended structure and purpose of data elements (e.g., `AppSettings` is intended to hold all user-configurable global settings, including `autoPlayTTS`. `SettingsPanelProps` now explicitly contracts for `autoPlayTTS` state and control).
*   **Precision and Control:** Offers high precision regarding data fields, their optionality, and allowed types, leaving no ambiguity in data structure.
*   **Foundation for Behavior:** While not defining dynamic behavior itself, these types are fundamental to the correct implementation of application logic that manipulates or relies on this data. They are the nouns upon which the verbs (behaviors) of the application act.

In summary, `types.ts` is a foundational specification file that dictates the "anatomy" of data within Mia's Gem Chat Studio. It ensures consistent and understood data structures, crucial for a robust system, and has been updated to include new settings like `autoPlayTTS` and corresponding component prop types.