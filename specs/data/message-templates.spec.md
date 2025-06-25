# messageTemplates.ts - Specification (SpecLang Aligned)

## Overall Goal/Intent

The `messageTemplates.ts` module is designed to be the **centralized repository for all persona-specific, system-generated message templates** used within Mia's Gem Chat Studio. Its primary purpose is to provide a clear, configurable, and maintainable way to define the text used for announcements like initial welcome messages and notifications when the active AI persona changes. By externalizing these templates, the module allows for easier customization of the application's "voice" for different personas without altering core application logic, thereby enhancing the thematic consistency and immersive quality of persona interactions.

## Key Behaviors & Data Structures Defined

This module's "behavior" is to export structured template data that other parts of the application (primarily `App.tsx`) will use to construct dynamic, persona-aware messages.

1.  **Persona-Specific Message Template Definitions:**
    *   **Intent:** To provide unique and character-consistent templates for various system messages, keyed by persona ID. This is the primary point for users or developers to customize how personas announce themselves and greet the user, ensuring each persona maintains its distinct voice even in system-generated communications.
    *   **Structure (`MESSAGE_TEMPLATES` object):**
        *   This is the core export, a `Record<string, PersonaMessageTemplates>`.
        *   Each key in this record is a persona ID (e.g., "mia", "miette"), imported from `personas.ts` to ensure consistency and linkage with persona definitions.
        *   The value for each persona ID is an object of type `PersonaMessageTemplates`, which contains:
            *   `welcomeMessageTemplate: string`: This template is used to generate the initial greeting message when a persona becomes active or the application starts. It supports placeholders to inject dynamic context.
                *   `{personaName}`: Will be replaced with the persona's full display name (e.g., "🧠 Mia").
                *   `{instructionStatusMessage}`: Will be replaced with a phrase indicating if default or custom system instructions are active (e.g., "Using default guidelines").
                *   `{modelName}`: Will be replaced with the name of the currently active Gemini model.
            *   `personaChangeMessageTemplate: string`: This template is used to generate a system message in the chat when the user switches to this persona. It supports placeholders:
                *   `{newPersonaName}`: Will be replaced with the full display name of the persona that has just become active.
    *   **Customization:** To change how a persona greets the user or announces its activation, modify the corresponding string template for that persona's ID within the `MESSAGE_TEMPLATES` object in this file. This allows for fine-tuning the narrative and tone.
    *   **UX Intent:** To ensure that even system-generated messages align with the active persona's established voice and character, enhancing the immersive experience. Customization allows for creative and engaging announcements that reinforce persona identity.

2.  **Default Fallback Templates:**
    *   **Intent:** To provide generic, sensible message templates that can be used if a specific template for a given persona ID is not found in `MESSAGE_TEMPLATES`. This ensures application robustness and prevents errors due to missing persona-specific template definitions, especially if new personas are added without immediately updating their templates. This guarantees the system can always generate a necessary system message.
    *   **Structure:**
        *   `DEFAULT_WELCOME_MESSAGE_TEMPLATE: string`: A generic welcome message template using the same placeholders as the persona-specific welcome templates.
        *   `DEFAULT_PERSONA_CHANGE_MESSAGE_TEMPLATE: string`: A generic persona change notification template using the `{newPersonaName}` placeholder.
    *   **Customization Note:** While these can be edited, the primary customization focus for persona-specific messages should be within the `MESSAGE_TEMPLATES` object to maintain persona distinctiveness.

3.  **Interface for Template Structure (`PersonaMessageTemplates`):**
    *   **Intent:** To provide a clear TypeScript interface defining the expected shape of the template object associated with each persona ID, ensuring consistency and type safety when defining or consuming these templates.
    *   **Structure:** An interface specifying that each persona template set must contain `welcomeMessageTemplate` and `personaChangeMessageTemplate` string properties.

## Design Intent for Structure (Prose Code)

*   **Centralization for Maintainability and Customization:** All persona-related system message templates are consolidated into this single file. This design makes it easy to review, update, or add new templates without searching through application logic files. It directly supports the goal of allowing users/developers to easily customize the "voice" of the application for each persona.
*   **Configuration over Code for Flexibility:** The templates are treated as configurable data rather than hardcoded strings within components. This aligns with the principle of separating content/configuration from presentation/logic, making the application more flexible and easier to adapt for different narrative styles or branding.
*   **Placeholder Mechanism for Dynamic Content Injection:** The use of simple string replacement for placeholders (`{placeholderName}`) is a straightforward and effective way to inject dynamic, context-relevant content (like the current persona's name or model) into static templates. This allows messages to be informative and personalized.
*   **Explicit Fallbacks for Robust Operation:** The inclusion of `DEFAULT_WELCOME_MESSAGE_TEMPLATE` and `DEFAULT_PERSONA_CHANGE_MESSAGE_TEMPLATE` is a deliberate design choice to ensure the application can always generate necessary system messages, even if new personas are added without corresponding entries in `MESSAGE_TEMPLATES`. This contributes to the application's overall robustness.
*   **Association via Persona ID for Clear Linkage:** Using persona IDs (imported from `personas.ts`) as keys in the `MESSAGE_TEMPLATES` object provides a clear and reliable link between a persona's core definition (in `personas.ts`) and its specific system message phrasing defined here.

## Relation to SpecLang Principles

*   **"Prose Code" for System Communication:** The template strings themselves are "prose code." They are natural language specifications that directly define the text the application will use to communicate with the user during specific system events (welcome, persona change). The clarity and intent of these messages are defined directly in this human-readable format.
*   **Intent-Based Expression:** The templates are designed to fulfill specific communicative intents: welcoming the user in a persona-consistent manner, or clearly announcing a change in the active AI. The placeholders are designed to inject information relevant to that intent, making the messages more meaningful.
*   **Modularity and Decoupling:** This module decouples the *content* of system messages from the *logic* that triggers and displays them (which resides in `App.tsx`). This separation allows for easier changes to message wording without touching application flow, promoting better software design.
*   **Iterative Refinement of Narrative Voice:** The wording of these templates can be easily iterated upon and refined by editing this single file, allowing for quick adjustments to the application's communicative style or the specific nuances of each persona's voice.

In summary, `messageTemplates.ts` serves as a configuration-driven specification for how the application communicates key system events related to AI personas, promoting consistency, customizability, and maintainability of these user-facing messages. Users wishing to customize these messages should directly edit the template strings associated with each persona ID within this file.