# ChatMessage.tsx - Specification (SpecLang Aligned) - Revised

## Overall Goal/Intent
The `ChatMessage` component is designed to render a single, self-contained message within the chat conversation. It must clearly differentiate message origin (user vs. AI), present diverse content types (text, images, audio) effectively, display essential metadata, and offer relevant interactions (like text-to-speech for AI messages and copy-to-clipboard for all text messages), all while maintaining visual consistency and clarity to provide an intuitive and informative messaging experience. The overall aim is for each message to be an easily understandable and interactive unit of the conversation.

## Key Behaviors & Responsibilities

1.  **Message Origin Differentiation:**
    *   **Behavior:** Visually distinguishes between messages from the `User` and the `AI` using alignment (e.g., user right, AI left) and distinct background colors for message bubbles. AI message bubbles can further adopt persona-specific colors or error-specific styling.
    *   **UX Intent:** To allow users to instantly and effortlessly identify the sender of each message, which is fundamental for following conversational flow. This clear visual distinction enhances readability and reduces cognitive load, making the chat easier to parse.
2.  **Multimodal Content Display:**
    *   **Text:** Renders textual content using a `MarkdownRenderer` to support rich formatting (bold, italics, lists, code blocks). For AI error messages, a "⚠️" icon precedes the text.
        *   **UX Intent:** To present text clearly and engagingly, allowing for emphasis and structure within messages. Error icons provide immediate visual alerting, guiding the user's attention to important system feedback efficiently.
    *   **Images (User):** Displays a thumbnail preview for images sent by the user, along with the optional file name.
        *   **UX Intent:** To provide immediate visual confirmation of image transmission and context within the chat, making the conversation richer, more verifiable, and visually engaging.
    *   **Audio (User/AI):** Renders an HTML5 `<audio controls>` element for playback of recorded audio messages.
        *   **UX Intent:** To allow seamless in-chat playback of audio content without needing external players, integrating audio naturally into the conversational flow and making audio messages as accessible as text.
3.  **Metadata Presentation:**
    *   **Behavior:** Displays the sender's avatar (user SVG, AI image), sender's display name, and a formatted timestamp for each message.
    *   **UX Intent:** To provide clear attribution and temporal context for every message, enhancing the sense of a structured and traceable conversation. Avatars add a personal touch and aid in quick sender identification, making the interface feel more interactive.
4.  **Message Interactivity:**
    *   **Text-to-Speech (AI Messages):**
        *   **Behavior:** For AI messages containing text (and not being errors), a toggle button is provided.
            *   When speech is not active, the button displays a "speaker" icon. Clicking it initiates text-to-speech playback of the message content.
            *   When speech is active, the button displays a "stop" (square) icon. Clicking it cancels the ongoing playback.
            *   This functionality relies on browser support for `SpeechSynthesis`. The button's ARIA label dynamically updates to reflect the current action (play or stop).
        *   **UX Intent:** To offer an accessible alternative for consuming AI responses and cater to user preference for auditory information, with clear visual cues for the TTS state and control. This enhances usability for diverse user needs by providing explicit control over audio playback.
    *   **Copy to Clipboard (All Messages with Text):**
        *   **Behavior:** For any message containing text, a "Copy" icon button is provided. Clicking this button copies the message's raw text content to the user's clipboard using `navigator.clipboard.writeText()`. Brief visual feedback (e.g., the icon changing to a "check" mark for a short period) confirms the successful copy action. Errors during copying are logged, and a basic alert is shown as a fallback.
        *   **UX Intent:** To allow users to easily extract and reuse message content from the conversation for other purposes. The immediate feedback mechanism ensures the user is aware of the action's outcome, improving confidence in the interaction.
5.  **Visual Design and Layout:**
    *   **Behavior:** Each message is encapsulated in a "bubble" with rounded corners, appropriate padding, and shadows. Avatars are positioned adjacent to their bubbles. Metadata is typically placed above the main content. Action buttons (TTS, Copy) are positioned subtly near the message bubble, often appearing at the bottom-right for easy access without cluttering the message content.
    *   **UX Intent:** To present messages in a visually appealing, organized, and easily digestible format, common to modern chat applications. The layout and styling aim for an intuitive reading experience with quick access to relevant actions, minimizing clutter and maximizing clarity.

## Design Intent for Structure (Prose Code)

*   **Self-Contained Unit for Reusability & Consistency:** Designed as a highly reusable component, responsible for all aspects of rendering a single message. This modularity is chosen to simplify the `ChatWindow`'s logic and ensure consistent message presentation throughout the application. By encapsulating message rendering, changes to how individual messages look or behave can be made in one place.
*   **Conditional Logic for Flexible Content Presentation & Interaction:** The structure incorporates conditional rendering based on `message.sender`, `message.isError`, the presence of various content types (`imagePreviewUrl`, `audioDataUrl`, `text`), and browser capabilities (for TTS). This design allows the component to flexibly accommodate the diverse nature of messages and available interactions, ensuring it can robustly render any valid message type and only offer relevant actions (e.g., TTS only for AI messages with text).
*   **Delegation for Specialized Rendering (Markdown):** Utilizes the `MarkdownRenderer` sub-component to handle the complexities of Markdown parsing and rendering. This delegation adheres to the single responsibility principle: `ChatMessage` focuses on overall message structure, metadata, and interactions, while `MarkdownRenderer` manages rich text display. This improves maintainability by separating concerns.
*   **Hook Integration for Encapsulated TTS Logic:** Leverages the `useSpeechSynthesis` hook to encapsulate text-to-speech functionality. This design choice keeps the `ChatMessage` component cleaner by abstracting away the direct management of Web Speech API complexities, allowing `ChatMessage` to focus on the presentation and user interaction aspects of TTS controls.
*   **Local State for Responsive Interaction Feedback (`copied` state):** Uses local component state (e.g., for `copied` status) to manage immediate visual feedback for user actions like copy-to-clipboard. This design makes the feedback mechanism self-contained and highly responsive to user actions, directly informing the user of the outcome of their interaction without needing parent component involvement for this specific visual cue.
*   **Dynamic Styling for Clear Visual Communication (Dynamic `bubbleBgClass`):** The component's structure supports dynamic application of CSS classes (e.g., for `bubbleBgClass`) to reflect message origin, persona, or error status. This is a key design choice for providing clear visual cues that help the user quickly understand message context, sender, and importance (e.g., error highlighting).

## Relation to SpecLang Principles

*   **Prose Code Intent:** This specification describes the functional goals and intended user experiences of the component in natural language, emphasizing clarity, interactivity, and user-centric design in message presentation.
*   **Intent-Based Expression:** The component's features are described in terms of *what the user can achieve* (e.g., "play back AI messages with clear play/stop cues," "copy text easily with confirmation") and *how the interface should respond* (e.g., "icon changes to a stop (square) icon when speaking," "visual feedback confirms copy"), focusing on the user-facing contract and desired interactive experience.
*   **Modularity:** `ChatMessage` is a prime example of a modular UI component, designed to be self-sufficient in rendering a complex piece of data (a message) with its associated interactions, making it highly reusable within the `ChatWindow`.
*   **Bi-Directional Ideation & Feedback:** The component provides rich feedback (visual styling, dynamic icons like the speaker/stop for TTS, copy confirmation) in response to user interactions, creating a clear interactive loop and affirming user actions. This immediate feedback helps users understand the system's state and the results of their interactions.

This revised specification for `ChatMessage.tsx` details its role in rendering individual messages with enhanced interactivity and clear visual cues for features like text-to-speech, aiming for a high-quality user experience where each message is an informative and interactive element.