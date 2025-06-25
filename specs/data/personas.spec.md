# personas.ts - Specification (SpecLang Aligned) - Revised

## Overall Goal/Intent

The `personas.ts` module serves as the **canonical source and definition hub for all AI personas** available within Mia's Gem Chat Studio. Its primary goal is to precisely define the unique characteristics, visual identities, and foundational behavioral guidelines for each AI persona (Mia, Miette, Seraphine, ResoNova). This module is critical for enabling persona-specific interactions, ensuring that each AI communicates and behaves according to its intended design, and providing a consistent source of core persona data for the entire application. The intent is to make persona definitions clear, easily maintainable, and directly translatable into distinct user experiences.

## Key Behaviors & Data Structures Defined

This module's "behavior" is to provide structured data that, in turn, defines the behavior and presentation of AI personas elsewhere in the system.

1.  **Individual Persona Definition (The "Prose Code" for AI Behavior):**
    *   **Intent:** To establish a distinct identity and behavioral blueprint for each AI persona, ensuring they are unique and recognizable to the user. The `systemInstruction` is the direct specification for the AI's interactive behavior, while visual attributes support the user's perception of these distinct identities.
    *   **Structure (`Persona` Interface):** Each persona (e.g., `MIA_PERSONA`) is defined as an object adhering to the `Persona` interface. This object encapsulates:
        *   `id: string`: A unique machine-readable identifier (e.g., "mia"), crucial for programmatic selection and state management.
        *   `name: string`: A human-readable display name, often incorporating a representative `glyph` (e.g., "🧠 Mia"), intended for UI presentation.
        *   `glyph: string`: An emoji or symbol visually representing the persona (e.g., "🧠"), designed for quick visual identification in compact UIs like the `PersonaSelectorBar`.
        *   `avatarPath: string`: A URL pointing to a unique image asset for the persona's avatar in chat messages.
            *   **UX Intent:** To provide immediate and distinct visual identification for each AI in the conversation flow, enhancing user engagement and clarity of who is speaking. This visual cue reinforces the selected persona's presence.
        *   `color: string`: A Tailwind CSS background color class (e.g., 'bg-blue-500').
            *   **UX Intent:** To visually associate UI elements (like dashboard representations, persona selector highlights, or default chat bubble styling) with a specific persona. This thematic coloring reinforces persona identity, aids in differentiating them across various application views, and contributes to a subtle form of branding for each persona.
        *   `description: string`: A concise textual summary of the persona's role, style, or conceptual underpinning, intended to inform the user about the persona's nature on selection UIs like the Dashboard.
        *   `systemInstruction: string`: **This is the core "prose code" specifying the persona's behavior.** It's a natural language prompt that directly instructs the Gemini API on how to respond when this persona is active. It shapes the AI's personality, tone, knowledge domain, conversational style, and any specific operational constraints (e.g., adherence to "modular memory principles"). The content of this string *is* the primary specification for the AI's interactive behavior and how it fulfills its defined role.
    *   **Note on Message Templates:** Persona-specific message templates, such as welcome messages or persona change announcements, are defined in `messageTemplates.ts` and are associated with personas by their `id`. This separation keeps the core `Persona` definition focused on identity and base system instructions.

2.  **Comprehensive Persona Collection:**
    *   **Behavior:** Exports an `ALL_PERSONAS: Persona[]` array.
    *   **Intent:** To provide a single, easily iterable collection of all defined persona objects, facilitating UI generation (e.g., for selection menus on the Dashboard or `PersonaSelectorBar`) and programmatic access to all available personas. This ensures all personas are discoverable by the application.

3.  **Default Persona Specification:**
    *   **Behavior:** Exports a `DEFAULT_PERSONA_ID: string` constant (e.g., `MIA_PERSONA.id`).
    *   **Intent:** To establish a fallback or initial active persona for the application. This ensures a defined AI personality is always available on startup or in ambiguous situations, providing a consistent initial user experience.

4.  **Persona Data Access and Interpretation Utilities:**
    *   **`getPersonaById(id: string | null | undefined): Persona`:**
        *   **Behavior:** Retrieves a specific `Persona` object from the `ALL_PERSONAS` collection based on its `id`. If the ID is invalid or not provided, it returns the default persona (Mia).
        *   **Intent:** To provide a safe and reliable way for other modules to fetch complete persona data using only an ID, abstracting the direct access to the `ALL_PERSONAS` array and handling potential lookup failures gracefully. This promotes robust data retrieval.
    *   **`getEffectiveSystemInstruction(personaId: string, customInstructions?: { [id: string]: string }): string`:**
        *   **Behavior:** Determines the actual system instruction to be used for a given persona. It prioritizes a user-defined custom instruction (if available for that `personaId` in the `customInstructions` map) over the persona's default `systemInstruction`.
        *   **Intent:** To enable user customization of AI behavior while maintaining a fallback to the persona's inherent definition. This function is key to dynamic persona adaptation and allows users to tailor AI responses to their specific needs, enhancing user control.

5.  **Type Re-export:**
    *   **Behavior:** Re-exports the `Persona` type from `types.ts`.
    *   **Intent:** For developer convenience, allowing modules that import persona data to also easily access the `Persona` type definition from the same import statement, improving code readability and maintainability.

## Design Intent for Structure (Prose Code)

*   **Centralized Definitions for Consistency & Maintainability:** The module is designed as the single source of truth for all default persona attributes, including their core behavioral prompts (`systemInstruction`) and visual identifiers (`avatarPath`, `color`). This centralization ensures consistency across the application and simplifies updates or additions to persona characteristics, as changes only need to be made in one place.
*   **Read-Only Defaults for Stability & Baseline Behavior:** Persona objects are defined as constants, signifying that these are the baseline, immutable definitions provided by the application. User-specific modifications to behaviors (via custom system instructions) are managed externally (e.g., in `AppSettings`) and applied via `getEffectiveSystemInstruction`. This preserves the integrity of the default persona definitions while allowing for user customization.
*   **Behavioral Prompts as Core Data & Direct Specification:** The `systemInstruction` strings are treated as critical data elements that directly "program" the AI's interactive behavior. Their prose nature makes them understandable and modifiable by developers responsible for shaping AI personalities, acting as the primary specification for how each persona should act.
*   **Decoupling Data from Usage for Modularity:** The module defines persona data but does not dictate how it's used in the UI or by the AI service. Utility functions provide controlled access and interpretation, promoting loose coupling and allowing different parts of the application to consume persona data as needed. This enhances modularity, as UI components or services can evolve independently of the core persona definitions.
*   **Visual Attributes for Enhanced User Experience:** The inclusion of `avatarPath` and `color` is a deliberate design choice to support a richer and more distinguishable user experience. These attributes enable the UI to visually reinforce the active persona's identity, making the interaction feel more engaging and personalized.

## Relation to SpecLang Principles

*   **Prose Code for AI Behavior:** The `systemInstruction` property within each `Persona` object is a direct embodiment of "prose code." It is a natural language specification that is interpreted by the Gemini LLM to produce specific conversational behaviors, making the persona's intended interaction style explicit and configurable. This is the primary mechanism for specifying *how the AI behaves*.
*   **Intent-Based Expression:** The persona definitions focus on the *intended identity, role, and communicative style* of each AI. Visual attributes like `avatarPath` and `color` support the intent of making these distinctions clear and engaging for the user, contributing to a richer interactive experience and fulfilling the UX goal of clear persona differentiation.
*   **Iterative Refinement (of System Instructions):** The detailed and nuanced content of the `systemInstruction` fields suggests an iterative process of prompt engineering to achieve the desired AI personalities. This aligns with SpecLang's "create by reacting" principle applied to AI behavior definition.
*   **Modularity:** Each persona is defined as a self-contained unit, allowing for easy addition or modification of personas without impacting others, as long as the `Persona` interface contract is maintained. The separation of message templates into `messageTemplates.ts` further enhances this modularity.

This revised specification for `personas.ts` underscores its crucial role in defining the "who" and "how" of AI interaction in Mia's Gem Chat Studio, with `systemInstruction` serving as a direct behavioral program for the AI. Visual attributes are specified to enhance persona differentiation and user experience.