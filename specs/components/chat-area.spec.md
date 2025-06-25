# Chat Area Components - Specification (SpecLang Aligned) - Revised

This document specifies the behavior and intent of the core components that constitute the chat interaction area: `ChatWindow.tsx`, `ChatMessage.tsx`, and `ChatInput.tsx`. Together, they aim to deliver a fluid, intuitive, and feature-rich conversational experience.

## Overall Goal/Intent

To provide a seamless, intuitive, and feature-rich interface for users to send and receive messages, including text, images, and audio, while interacting with an AI persona. The chat area should be responsive, visually clear, and support dynamic updates like streaming AI responses and loading indicators, ensuring the user feels engaged and informed throughout their conversation. The overall user experience aims for fluidity in interaction, clarity in information presentation, and a sense of direct control over multimodal communication, including natural language input nuances like spoken punctuation.

---

## 1. `ChatWindow.tsx`

### Overall Goal/Intent
The `ChatWindow` component is responsible for displaying the chronological list of chat messages, providing a scrollable and continuously updated view of the conversation history. It also clearly indicates when the AI is processing a response, ensuring the user is aware of ongoing activity and maintaining a sense of conversational flow.

### Key Behaviors & Responsibilities

1.  **Message History Display:**
    *   **Behavior:** Renders a list of `Message` objects provided via its `messages` prop.
    *   **UX Intent:** To present the conversation in a familiar, easy-to-follow chronological sequence. Each message is individually rendered by the `ChatMessage` component, ensuring consistent styling and functionality per message. This creates a clear and organized record of the interaction.
2.  **Automatic Scrolling & View Management:**
    *   **Behavior:** Automatically scrolls to the most recent message or loading indicator as new content is added.
    *   **UX Intent:** To ensure the user always sees the latest part of the conversation or system activity without manual scrolling, providing a smooth and natural conversational flow. This immediate update to the view keeps the user focused on the newest content and mimics the feeling of a live, ongoing dialogue.
3.  **AI Loading Indication:**
    *   **Behavior:** Displays a visual loading indicator (e.g., animated dots) when the `isLoading` prop is `true`. This indicator is styled to resemble an incoming AI message, including a relevant AI avatar (defaulting to the active persona if no prior AI message exists).
    *   **UX Intent:** To clearly inform the user that the AI is processing their request and a response is forthcoming, managing expectations and reducing perceived wait times. The visual cue of animated dots and the AI avatar aims to provide a human-like "thinking" indication, making the wait more engaging.
4.  **Layout and Visual Design:**
    *   **Behavior:** Establishes a dedicated, scrollable area with appropriate padding (especially at the top to avoid overlap with fixed headers) and background consistent with the application's dark theme.
    *   **UX Intent:** To provide a clean, uncluttered, and visually comfortable space for the conversation, ensuring readability and focus. The maintained padding ensures UI integrity by preventing content from being obscured by other persistent UI elements.

### Design Intent for Structure (Prose Code)

*   **Composition for Message Rendering:** Designed as a container component that iterates over message data and delegates the rendering of individual messages to the `ChatMessage` child component. This structural choice promotes separation of concerns, allowing `ChatMessage` to focus solely on presenting one message, and `ChatWindow` to manage the overall list and scrolling behavior.
*   **Scroll Management for Fluidity:** The use of a `ref` (`messagesEndRef`) and an effect (`useEffect`) to trigger scrolling is a structural choice to implement the desired automatic scrolling behavior. This design is crucial for achieving a fluid user experience by keeping the latest content consistently in view, making the conversation feel dynamic and live.
*   **Conditional Rendering for Feedback:** The structure includes logic to conditionally display a loading animation. This design provides explicit, non-intrusive feedback to the user about system activity, reinforcing the system's responsiveness and attentiveness.
*   **Styling for Thematic Consistency & Dynamic Cues:** Styling (via Tailwind CSS and inline styles for animations) is integral to its design. It aims to achieve the dark theme consistency and provide clear visual cues (like the flashing dots for loading), contributing to a cohesive and informative user interface. The dynamic fetching of the AI avatar for the loading indicator is a structural choice to enhance persona consistency even during loading states.

---

## 2. `ChatMessage.tsx`

### Overall Goal/Intent
The `ChatMessage` component is designed to render a single, self-contained message within the chat conversation. It must clearly differentiate message origin (user vs. AI), present diverse content types (text, images, audio) effectively, display essential metadata, and offer relevant interactions (like text-to-speech for AI messages and copy-to-clipboard for all text messages), all while maintaining visual consistency and clarity to provide an intuitive and informative messaging experience.

### Key Behaviors & Responsibilities

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
        *   **Behavior:** For AI messages containing text (and not being errors), a toggle button is provided. The button's icon dynamically changes (speaker/stop) and its ARIA label updates to reflect playback state.
        *   **UX Intent:** To offer an accessible alternative for consuming AI responses and cater to user preference for auditory information, providing clear visual cues and control over playback. This enhances usability for diverse user needs.
    *   **Copy to Clipboard (All Messages with Text):**
        *   **Behavior:** For any message containing text, a "Copy" icon button allows copying text to the clipboard. Visual feedback (icon change) confirms success.
        *   **UX Intent:** To allow users to easily extract and reuse message content, with immediate confirmation of the action. This utility feature increases the practical value of the chat content.
5.  **Visual Design and Layout:**
    *   **Behavior:** Each message is encapsulated in a "bubble" with rounded corners, padding, and shadows. Avatars are adjacent. Metadata is above content. Action buttons are subtly positioned.
    *   **UX Intent:** To present messages in a visually appealing, organized, and easily digestible format, common to modern chat applications, with quick access to relevant actions. The layout aims for an intuitive and uncluttered reading experience, making interactions efficient and pleasant.

### Design Intent for Structure (Prose Code)

*   **Self-Contained Unit for Reusability & Consistency:** Designed as a highly reusable component, responsible for all aspects of rendering a single message. This modularity is chosen to simplify the `ChatWindow`'s logic and ensure consistent message presentation throughout the application. By encapsulating message rendering, changes to how individual messages look or behave can be made in one place.
*   **Conditional Logic for Flexible Content Presentation & Interaction:** The structure incorporates conditional rendering based on `message.sender`, `message.isError`, the presence of various content types (`imagePreviewUrl`, `audioDataUrl`, `text`), and browser capabilities (for TTS). This design allows the component to flexibly accommodate the diverse nature of messages and available interactions, ensuring it can robustly render any valid message type and only offer relevant actions (e.g., TTS only for AI messages with text).
*   **Delegation for Specialized Rendering (Markdown):** Utilizes the `MarkdownRenderer` sub-component to handle the complexities of Markdown parsing and rendering. This delegation adheres to the single responsibility principle: `ChatMessage` focuses on overall message structure, metadata, and interactions, while `MarkdownRenderer` manages rich text display. This improves maintainability by separating concerns.
*   **Hook Integration for Encapsulated TTS Logic:** Leverages the `useSpeechSynthesis` hook to encapsulate text-to-speech functionality. This design choice keeps the `ChatMessage` component cleaner by abstracting away the direct management of Web Speech API complexities, allowing `ChatMessage` to focus on the presentation and user interaction aspects of TTS controls.
*   **Local State for Responsive Interaction Feedback (`copied` state):** Uses local component state (e.g., for `copied` status) to manage immediate visual feedback for user actions like copy-to-clipboard. This design makes the feedback mechanism self-contained and highly responsive to user actions, directly informing the user of the outcome of their interaction without needing parent component involvement for this specific visual cue.
*   **Dynamic Styling for Clear Visual Communication (Dynamic `bubbleBgClass`):** The component's structure supports dynamic application of CSS classes (e.g., for `bubbleBgClass`) to reflect message origin, persona, or error status. This is a key design choice for providing clear visual cues that help the user quickly understand message context, sender, and importance (e.g., error highlighting).

---

## 3. `ChatInput.tsx`

### Overall Goal/Intent
The `ChatInput` component is the primary interface for user message composition and submission. It aims to provide a versatile and intuitive experience, supporting multiple input modalities (typed text, speech-to-text with punctuation handling, audio recording, camera capture, file upload) while giving clear feedback about the current input state and system readiness. The goal is to empower users with flexible communication options and maintain a sense of control and clarity during message creation, fostering natural and efficient interaction.

### Key Behaviors & Responsibilities

1.  **Text Input & Submission:**
    *   **Behavior:** Offers a dynamically resizing multi-line `textarea` for text input. Message submission occurs via an "Enter" key press (without Shift) or a dedicated "Send" button.
    *   **UX Intent:** To provide a familiar, flexible, and efficient text entry experience. The "Send" button is disabled when no content is available or when the system is busy, preventing empty/accidental submissions and managing user expectations for system readiness. The auto-resizing textarea enhances usability for longer messages.

2.  **Speech-to-Text Integration & Enhanced Transcript Management:**
    *   **Behavior (General):** A microphone icon button toggles browser-based speech recognition (via `useSpeechRecognition`). Visual feedback indicates listening status.
    *   **Behavior (Appending Transcript):** When speech recognition starts, any text already in the input field (`inputValue`) is preserved in `textBeforeSpeechStartRef.current`. The live `transcript` (from the hook, representing the current spoken segment) is appended to this preserved text in the `inputValue`.
        *   **UX Intent:** To allow users to seamlessly combine typed and spoken input for a single message without losing prior work for that message.
    *   **Behavior (Spoken Punctuation Recognition):**
        *   The live `transcript` is processed to replace spoken keywords with their corresponding punctuation marks:
            *   "period" (case-insensitive) is replaced with `.`
            *   "comma" (case-insensitive) is replaced with `,`
            *   "question mark" (case-insensitive) is replaced with `?`
            *   "exclamation mark" or "exclamation point" (case-insensitive) is replaced with `!`
        *   Spacing around these inserted punctuation marks is automatically adjusted for natural language flow (e.g., "hello period new sentence" becomes "hello. New sentence"; "question mark" at the end of a phrase removes preceding space).
        *   **UX Intent:** To enable users to dictate punctuation naturally, making voice input more expressive and reducing the need for manual editing of recognized text. This aims for a more fluid and efficient dictation experience.
    *   **Behavior (Sentence Continuation on Pause/Resume):**
        *   When the user clicks the microphone to *start* a new speech segment (i.e., `isListening` was `false`):
            *   The current `inputValue` is checked.
            *   If it's not empty and does not already end with a sentence-ending punctuation mark (`.`, `!`, `?`), a period `.` followed by a space ` ` is appended to the `inputValue` *before* speech recognition for the new segment begins.
            *   If it already ends with such punctuation, only a space is ensured if not present.
        *   The new speech segment's transcript is then appended after this (potentially added) punctuation and space.
        *   **UX Intent:** To automatically create sentence breaks when a user pauses speaking and then starts a new spoken segment, assuming the prior segment was a complete thought. This improves the grammatical structure of messages composed of multiple spoken chunks and reduces manual editing.
    *   **UX Intent (Overall for Speech):** To offer a convenient, intuitive, and increasingly natural hands-free input alternative that integrates smoothly with typed text. Clear feedback ensures users understand the system's listening state and any operational issues.

3.  **Audio Message Recording & Preview:**
    *   **Behavior:** A dedicated button initiates audio recording using `MediaRecorder`. A timer shows duration. Post-recording, an audio player allows preview before sending or discarding.
    *   **UX Intent:** To allow users to easily record and review voice snippets, adding another dimension to communication. Clear visual cues (button state, timer, player preview) guide the user through the recording process, ensuring they are confident in the content being sent and have control over what is transmitted. Disabled during speech-to-text or when the system is busy.
4.  **Camera Image Capture & Integration:**
    *   **Behavior:** A camera icon button launches a `CameraModal` for image capture. Captured images are then combined with any text for submission.
    *   **UX Intent:** To provide a seamless in-app way to capture and send visual information, enriching the conversation with real-time imagery. Button disabled during other modal inputs or when busy to ensure focused interaction.
5.  **Image File Upload & Preview:**
    *   **Behavior:** A paperclip icon button allows selection of local image files. A thumbnail and file name preview are shown before sending.
    *   **UX Intent:** To enable easy sharing of existing images from the user's device, with clear previews to confirm the selection and prevent accidental uploads. Button disabled during other modal inputs.
6.  **Input Modality State Management & Feedback:**
    *   **Behavior:** Manages internal states for `inputValue`, `selectedFile`, `recordedAudio`, and speech recognition activity. Provides visual feedback (previews, placeholder text changes, button states) corresponding to the active input mode or selection.
    *   **UX Intent:** To keep the user clearly informed about what type of content is currently being composed or attached, and what actions are available. This reduces confusion, improves user control, and makes the multi-modal experience intuitive by reflecting the system's understanding of their current input context.
7.  **System Loading State Awareness:**
    *   **Behavior:** Input-initiating buttons and the "Send" button are disabled when the parent application signals it's busy (`isLoading` prop).
    *   **UX Intent:** To prevent users from initiating new actions while a previous one is still processing, ensuring orderly interaction and clear system status communication. This visual cue helps manage user expectations and reinforces system stability.

### Design Intent for Structure (Prose Code)

*   **Multi-Modal Input Hub for Versatility:** Architected as a central point for various input types. Its internal state management (using `useState`, `useRef`) is designed to handle the complexities of switching between and managing these different modalities (text, speech, file, camera, audio recording). This structure is chosen to enable a rich, multi-modal communication experience, providing clear feedback to the user about the active input type or attached media, thus enhancing their control and confidence.
*   **Context Preservation & Augmentation for Speech Input:**
    *   The use of `textBeforeSpeechStartRef` is a deliberate structural choice. It enables the desired behavior of appending recognized speech to pre-existing text within the input field for the current utterance.
    *   The logic to add punctuation (`.` and space) before starting a new speech segment (if the previous text was unpunctuated) is designed to promote natural sentence construction across multiple spoken inputs.
    *   The post-processing of the live transcript to insert spoken punctuation (e.g., "period" -> `.`) directly enhances the naturalness of dictation.
    *   These design decisions ensure that activating and using speech-to-text is non-destructive to prior input for the current message, supports natural language conventions, and provides a more intuitive and flexible user experience.
*   **Abstraction of Complex APIs for Simplicity:** Leverages custom hooks (`useSpeechRecognition`) and dedicated components (`CameraModal`) to encapsulate the direct interactions with complex browser APIs (Web Speech, MediaDevices). This design choice keeps `ChatInput` focused on orchestrating these inputs and presenting their UI, rather than managing low-level API details, simplifying its own logic and improving maintainability.
*   **Clear Feedback Mechanisms for User Guidance:** The structure includes elements specifically for user feedback (e.g., the area for file/audio previews, dynamic placeholder text in the `textarea` reflecting listening or recording state, active/inactive button states). This is a deliberate design choice to enhance usability and ensure the user is always aware of the input state and any attached media, guiding them through the composition process.
*   **Progressive Disclosure/Enablement of Actions for Focused Interaction:** Buttons for different input modalities are enabled or disabled based on the current application state (e.g., `isLoading`, `isAudioRecording`, `isListening`). This design guides the user by only presenting valid actions, simplifying the interface, preventing errors, and ensuring a focused interaction flow for each modality.
*   **Consolidated Submission Logic for Unified Data Flow:** The `handleSubmit` function is designed to gather data from all active input modalities (text, selected file, recorded audio) before calling the `onSendMessage` prop. This provides a unified submission pathway, simplifying the data flow to the parent component and ensuring all relevant data is packaged consistently.

---

## Relation to SpecLang Principles

*   **Prose Code Intent:** This specification describes the functional goals and intended user experiences of the chat area components in natural language, emphasizing clarity and user-centric design. The intent for `ChatInput`, for example, is to provide a versatile yet clear composition experience, including the seamless integration of speech-to-text with existing typed input and natural handling of spoken punctuation.
*   **Iterative Refinement:** The rich feature set of `ChatInput` (multiple input modes, previews, appending speech transcript, spoken punctuation, sentence continuation) and `ChatMessage` (TTS, Copy) suggests an iterative development process, where functionalities were added and refined over time to enhance user capabilities.
*   **Intent-Based Expression:** The components are described in terms of *what the user can achieve* (e.g., "dictate punctuation naturally," "automatically create sentence breaks when pausing") and *how the interface should respond* (e.g., "spacing around inserted punctuation is automatically adjusted," "input field is updated with a period and space before new speech starts"), focusing on the user-facing contract and desired experience.
*   **Bi-Directional Ideation & Feedback:** The chat area is inherently interactive. `ChatInput` allows users to express intent in various ways, and `ChatWindow` / `ChatMessage` provide rich feedback from the AI and the system, creating a dynamic conversational loop. The design of previews, state indicators in `ChatInput` (like dynamic placeholder text based on listening state), and action buttons in `ChatMessage`, are forms of bi-directional ideation with the user during message composition and review, guiding and confirming their actions.

This revised specification for the chat area components, particularly `ChatInput.tsx`, aims to clearly articulate their integrated design, user experience goals, and behavioral intent, especially concerning the refined speech-to-text capabilities. This facilitates comprehension and potential re-implementation.