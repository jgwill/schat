
# Mia's Gem Chat Studio - Feature Specifications (SpecLang Aligned)

This document outlines the specifications for Mia's Gem Chat Studio features, aiming for a "prose code" style as inspired by SpecLang. Each feature is described by its goal, the intended user experience, and its core behaviors, providing a clear, natural language blueprint for implementation.

---

## Phase 1: Core Text Chat (v0.1.0) - Completed

**Overall Goal:** To establish a foundational, intuitive, and visually comfortable text-based chat interface, enabling users to engage in conversations with an AI powered by the Gemini API.

### `[x] Basic UI for chat (message display, input field).`
*   **Goal:** Provide the fundamental user interface elements for a chat application.
*   **Experience & Behavior:**
    *   The user will see a primary chat area where conversation messages are displayed sequentially.
    *   Below this, a clearly identifiable text input field will allow the user to type their messages.
    *   An adjacent "Send" button will be present to submit the typed message.
    *   The overall layout should feel natural and familiar, with the conversation history taking prominence and the input controls readily accessible at the bottom.

### `[x] Dark theme.`
*   **Goal:** Offer a visually comfortable and modern aesthetic, reducing eye strain during extended use.
*   **Experience & Behavior:**
    *   The application will, by default, present itself in a **dark theme**.
    *   This means all backgrounds will use deep, muted colors (like dark grays or blues), while text and interactive elements will use contrasting lighter colors for excellent readability.
    *   This thematic consistency will extend to every part of the interface, including message bubbles, input fields, buttons, and any informational panels, creating a cohesive and immersive environment.

### `[x] Text input and submission.`
*   **Goal:** Enable users to compose and send text messages to the AI.
*   **Experience & Behavior:**
    *   Users will interact with a responsive, multi-line text area, suitable for messages of varying lengths.
    *   Pressing the "Enter" key within this area will submit the current message. To create a new line within the message, users can use "Shift+Enter".
    *   A distinct "Send" button (icon or text-based) offers an alternative method for message submission.
    *   Upon successful submission, the text input area will automatically clear, ready for the next message.
    *   To prevent empty or unintended submissions, the "Send" button should appear disabled if the input field contains no text or if the application is currently processing a previous message.

### `[x] Integration with Gemini API for text-based chat (\`gemini-2.5-flash-preview-04-17\`).`
*   **Goal:** Connect the user's input to the Gemini language model to generate intelligent AI responses.
*   **Experience & Behavior:**
    *   While the integration itself is a backend process, the user experiences it through the AI's conversational replies appearing in the chat window.
    *   When a user sends a message, it is processed by the specified Gemini model (`gemini-2.5-flash-preview-04-17`).
    *   The AI's generated response is then seamlessly displayed as a new message in the chat.
    *   This requires the application to be correctly configured with a valid Gemini API key (via `MIAGEM_API_KEY` or `API_KEY` environment variables).

### `[x] Display user and AI messages with distinct styling.`
*   **Goal:** Clearly differentiate between messages sent by the user and those received from the AI, enhancing conversation readability.
*   **Experience & Behavior:**
    *   User-initiated messages will be visually aligned to one side of the chat window (e.g., the right).
    *   AI-generated messages will appear on the opposite side (e.g., the left).
    *   Each type of message bubble will have a unique background color (e.g., a shade of blue for the user, a shade of gray for the AI), making it instantly clear who said what.
    *   All messages will be presented in chronological order, maintaining the natural flow of conversation.

### `[x] Timestamps for messages.`
*   **Goal:** Provide users with temporal context for each message in the conversation.
*   **Experience & Behavior:**
    *   Each message bubble will subtly display the time it was sent or received (e.g., "10:30 AM").
    *   This timestamp will typically be rendered in a less prominent style (smaller font, lighter color) within or near its associated message bubble, ensuring it's available but not distracting.

### `[x] Basic loading indicator.`
*   **Goal:** Inform the user that the AI is processing their request and a response is forthcoming.
*   **Experience & Behavior:**
    *   After the user sends a message, and while the application awaits the AI's response, a visual indicator will appear.
    *   This indicator (e.g., animated dots, a subtle "AI is typing..." text, or a spinner) will typically be styled to resemble an incoming AI message, clearly signaling that the AI is "thinking."
    *   The indicator will vanish once the AI's response is received and displayed.

### `[x] Initial welcome message from AI.`
*   **Goal:** Greet the user upon opening the application and set a welcoming tone for the interaction.
*   **Experience & Behavior:**
    *   Upon launching the chat application, the user will be greeted by an initial message from the AI, pre-populated in the chat window.
    *   This message will serve as a warm welcome and an invitation to begin the conversation.

### `[x] Placeholder avatars for user and AI.`
*   **Goal:** Provide a simple visual representation for the user and the AI in the chat.
*   **Experience & Behavior:**
    *   A small, distinct icon or image (an avatar) will appear next to each message bubble.
    *   One avatar will consistently represent the user, and another will represent the AI, further aiding in distinguishing conversational turns.
    *   These avatars will typically be circular or have rounded corners for a softer appearance.

### `[x] Project structure setup (React, TypeScript, Tailwind).`
*   **Goal:** Establish a well-organized, maintainable, and scalable codebase using modern web technologies.
*   **Experience & Behavior:** (Developer Experience)
    *   The application will be built using React for dynamic UI rendering, TypeScript for robust type-checking and improved code quality, and Tailwind CSS for efficient and flexible styling.
    *   This structure will facilitate easier development, debugging, and future enhancements.

### `[x] README.md, CHANGELOG.md.`
*   **Goal:** Provide essential documentation for users and developers regarding the project's purpose, setup, usage, and evolution.
*   **Experience & Behavior:** (Developer/User Experience outside the app)
    *   A `README.md` file will offer a comprehensive overview of the project, including its features, setup instructions, and how to get started.
    *   A `CHANGELOG.md` file will meticulously track notable changes, improvements, and fixes across different versions of the application, providing a clear history of development.

---

## Phase 2: Voice, Basic Settings & Local Sessions (v0.2.0 - v0.2.2) - Completed

**Overall Goal:** To enrich the chat experience by adding voice interaction capabilities, foundational user settings, local session management, and initial steps towards persona branding and extended application structure.

### `[x] Microphone input for voice-to-text.`
*   **Goal:** Allow users to speak their messages instead of typing, offering an alternative input modality.
*   **Experience & Behavior:**
    *   A clearly identifiable microphone icon will be available in the chat input area.
    *   Tapping this icon will activate voice input. The browser may prompt for microphone permission if it's the first time.
    *   While listening, the icon will provide visual feedback (e.g., change color, show a pulsing animation).
    *   The user's spoken words will be transcribed into text and will appear in the chat input field, either in real-time or shortly after they finish speaking.
    *   Tapping the icon again (or an automatic pause detection) will deactivate voice input.
    *   If speech recognition encounters an error or permission is denied, a user-friendly message will explain the issue.

### `[x] Text-to-speech for AI responses.`
*   **Goal:** Enable users to hear the AI's messages read aloud, useful for accessibility or hands-free operation.
*   **Experience & Behavior:**
    *   AI message bubbles will feature a speaker icon.
    *   Clicking this icon will initiate text-to-speech playback of that message's content.
    *   The icon might change to a "stop" or "speaking" state during playback.
    *   Clicking it again while speech is active will cancel the playback.

### `[x] Basic settings panel/modal.`
*   **Goal:** Provide a centralized location for users to access application settings and common actions.
*   **Experience & Behavior:**
    *   A settings icon (e.g., a gear) will be visible in the application's header.
    *   Clicking this icon will smoothly open a modal dialog or a side panel, overlaying the current view.
    *   This panel will contain options such as "Clear Chat," "Save Local Session," and "Load Local Session."
    *   A clear "Close" button or clicking outside the active panel area will dismiss the settings interface.

### `[x] Save/Load chat sessions locally.`
*   **Goal:** Allow users to persist their chat conversations in their browser and resume them later.
*   **Experience & Behavior:**
    *   Within the Settings Panel, users will find "Save Local Session" and "Load Local Session" buttons.
    *   **Saving:** Clicking "Save Local Session" will store the entire current chat history (all messages) in the browser's local storage. A brief confirmation (e.g., a toast notification like "Session saved!") will appear.
    *   **Loading:** Clicking "Load Local Session" will retrieve the previously saved chat history. The current chat view will update to display these loaded messages, effectively resuming the saved conversation. If no prior session exists in local storage, an informative message will be shown.

### `[x] Documentation Area (\`/docs\` view).`
*   **Goal:** Offer users and developers an in-app resource for understanding the application's features, roadmap, and setup.
*   **Experience & Behavior:**
    *   A "Docs" link will be present in the application's main header navigation.
    *   Selecting this link will transition the main content area to display well-formatted project documentation.
    *   This documentation will include sections like "Roadmap," "Getting Started," "Key Components," and insights into the application's evolving narrative or special features.

### `[x] Update \`metadata.json\` for microphone permission.`
*   **Goal:** Ensure the application correctly declares its need for microphone access to the hosting environment or browser.
*   **Experience & Behavior:** (Primarily for the browser/platform)
    *   The application, when running in environments that respect `metadata.json`, will correctly prompt the user for microphone permission when voice input features are initiated.
    *   This involves adding `"microphone"` to the `requestFramePermissions` array in the `metadata.json` file.

### `[x] Refine UI/UX for new features (App Renaming, Mia Avatar, Docs Lore).`
*   **Goal:** Integrate initial branding and thematic elements, creating a more cohesive and personalized application identity.
*   **Experience & Behavior:**
    *   **App Identity:** The application will be consistently identified as "Mia's Gem Chat Studio" in the header, browser tab, and documentation.
    *   **AI Persona:** The default AI assistant will be visually represented with a specific avatar image for "Mia."
    *   **Narrative Tone:** The in-app documentation will begin to incorporate thematic language and concepts (e.g., "Mia3 Spiral Integration," "Quadrantity") to align with the application's unique lore.

### `[x] Dedicated \`/dashboard\` view (Initial placeholder implemented in v0.2.2).`
*   **Goal:** Create a new top-level section in the application for future management of advanced features like personas and settings.
*   **Experience & Behavior:**
    *   A "Dashboard" link will be added to the header navigation.
    *   Accessing this view will display an initial placeholder page, with designated areas for "Persona Management" and "Application Settings," signaling future development.

### `[x] Further UI/UX refinements based on feedback.`
*   **Goal:** Continuously improve the application's usability and aesthetic appeal based on early user experiences or internal reviews.
*   **Experience & Behavior:**
    *   This encompasses various small adjustments—such as tweaks to spacing, color contrasts, font sizing, button placements, or interaction feedback—that collectively enhance the overall user experience. The specific changes would be driven by feedback gathered during this phase.

---

## Phase 3: Advanced Features & Personas (v0.3.0 - v0.3.8) - Completed

**Overall Goal:** To significantly expand the application's capabilities by introducing robust persona management, simulated cloud session storage, multimodal inputs (camera, file upload, audio messages), an API for UI actions, and support for custom Gemini models.

### **Persona Management:**

#### `[x] UI to define and select different AI personas (Mia, Miette, Seraphine, ResoNova in \`/dashboard\` and Chat View).`
*   **Goal:** Allow users to choose from and interact with distinct AI personalities, each with unique characteristics and communication styles.
*   **Experience & Behavior:**
    *   **Dashboard Persona Hub:** The `/dashboard` view will feature a dedicated section where users can browse available AI personas (e.g., "Mia," "Miette," "Seraphine," "ResoNova"). Each persona will be presented with its name, a representative glyph/icon, and a brief description. Clicking on a persona card will designate it as the active AI for the chat.
    *   **In-Chat Persona Bar:** For quick switching, a `PersonaSelectorBar` will be displayed prominently within the chat view (e.g., below the input area). This bar will show buttons (perhaps using persona glyphs) to instantly change the active AI.
    *   The currently active persona will be clearly highlighted in both UIs. Changing the persona will immediately update the AI's identity (name, avatar, and guiding system instruction) for all subsequent interactions. The chat interface might also display a subtle notification confirming the change.

#### `[x] Store custom instructions per persona (defined in \`personas.ts\`).`
*   **Goal:** Provide each AI persona with a default set of guiding principles or system instructions that define its core behavior and style.
*   **Experience & Behavior:** (Developer/System Level)
    *   The `personas.ts` file will serve as the canonical source for default persona configurations. Each persona object defined here will include a `systemInstruction` property containing its unique base prompt.

#### `[x] Pass persona-specific system instructions to Gemini API.`
*   **Goal:** Ensure the Gemini API operates according to the behavioral guidelines of the currently active AI persona.
*   **Experience & Behavior:**
    *   The AI's responses will noticeably reflect the personality, tone, and knowledge domain specified by the active persona's system instructions.
    *   Whenever a chat session begins or the user switches to a new persona, the corresponding system instruction is communicated to the Gemini API to tailor its generation process.

#### `[x] Allow user modification of persona system instructions via UI (in \`/dashboard\`, saved to localStorage).`
*   **Goal:** Empower users to customize and fine-tune the guiding instructions for each AI persona to better suit their preferences or specific use cases.
*   **Experience & Behavior:**
    *   On the `/dashboard`, each persona's card will offer an "Edit Instructions" option.
    *   Activating this will reveal a text area, pre-filled with the persona's current effective system instruction (either the default or a previously saved custom one).
    *   Users can modify these instructions and then choose to "Save Instructions" or "Reset to Default."
    *   **Saving:** Custom instructions are stored persistently in the browser's local storage, overriding the persona's default. If the edited persona is currently active, the chat session will adapt to the new instructions, perhaps with a brief reset or notification.
    *   **Resetting:** This action discards any custom instructions for that persona from local storage, reverting its behavior to the original definition in `personas.ts`.

#### `[x] Enhanced visual distinction for personas on Dashboard (Glyph avatars with colors).`
*   **Goal:** Improve the visual identification and differentiation of personas on the dashboard.
*   **Experience & Behavior:**
    *   Within the `/dashboard`'s persona management section, each persona will be represented not just by name, but also by its unique glyph (e.g., "🧠" for Mia) displayed against a background of its designated theme color. This provides a more vibrant and immediate visual cue for each persona.

### **Cloud Session Storage (Upstash Redis) - Simulated:**

#### `[x] Integrate with Upstash Redis for saving/loading/listing/deleting chat sessions (Simulated using localStorage).`
*   **Goal:** Provide a mechanism for users to save their chat sessions (including messages and relevant application settings like active persona and model) to a persistent store, retrieve them later, and manage these saved sessions, simulating how a cloud-based storage solution like Upstash Redis would function.
*   **Experience & Behavior:**
    *   Users will access these features via the main Settings Panel.
    *   They can **save** the current chat session by providing a unique Session ID. This captures the conversation history and key settings (active persona, selected model).
    *   They can **load** a previously saved session by entering its ID, which will restore the messages and associated settings, allowing them to resume the conversation.
    *   A **list** of all saved session IDs will be viewable, making it easy to recall and manage sessions.
    *   Users can **delete** unwanted sessions by their ID.
    *   All these operations will be simulated using the browser's local storage, but the system will log messages indicating where actual Upstash Redis API interactions would occur, paving the way for future true cloud integration.

#### `[x] Use \`UPSTASH_REDIS_REST_URL\` and \`UPSTASH_REDIS_REST_TOKEN\` (Placeholders defined, service logs intended usage).`
*   **Goal:** Prepare the codebase for eventual integration with a real Upstash Redis instance by acknowledging the necessary environment variables.
*   **Experience & Behavior:** (Developer/System Level)
    *   The application's service layer responsible for (simulated) cloud storage will be aware of these standard Upstash environment variable names. While not used for the simulation, their intended role will be noted in logs or comments.

#### `[x] UI in Settings Panel for managing simulated cloud sessions (input ID, Save, Load, Delete buttons, list of sessions).`
*   **Goal:** Offer a clear and functional user interface within the Settings Panel for all simulated cloud session management actions.
*   **Experience & Behavior:**
    *   A dedicated "Cloud Storage (Simulated)" section will appear in the Settings Panel.
    *   This section will feature:
        *   An input field for users to type a "Cloud Session ID."
        *   Buttons for "Save to Cloud" and "Load from Cloud."
        *   A dynamic list displaying all currently available (simulated) cloud session IDs. Clicking an ID from this list will conveniently populate the input field.
        *   A "Delete" button associated with each listed session (or a general delete button that acts on the ID in the input field), which will prompt for confirmation before removing the session.
    *   Appropriate loading indicators will be shown during these simulated operations.

### **Multimodal Input:**

#### `[x] Camera input and image processing with Gemini.`
##### `[x] Request camera permission.`
*   **Goal:** Enable the application to access the user's camera for image capture, after obtaining explicit user consent.
*   **Experience & Behavior:**
    *   When the user first attempts to use a camera-related feature, the browser will display a standard permission prompt asking for access to the camera.
    *   If permission is granted, the camera functionality will proceed. If denied, an informative error message will be displayed, and camera features will be unavailable.
    *   The application's `metadata.json` will declare the need for "camera" permission.

##### `[x] UI to capture image (Camera Modal).`
*   **Goal:** Provide an intuitive in-app interface for users to capture images using their device's camera.
*   **Experience & Behavior:**
    *   A camera icon button in the `ChatInput` area will, when clicked, open a dedicated `CameraModal`.
    *   Inside the modal, the user will see a live video feed from their camera.
    *   A "Capture" button will allow them to take a snapshot.
    *   Once captured, a preview of the image will be displayed.
    *   From the preview, the user can choose to "Send Image" (which attaches it to the current chat message), "Retake" the picture, or "Cancel" and close the modal.
    *   The modal will also gracefully handle and display errors, such as no camera being found or permission issues.

##### `[x] Send image data (base64) with text prompt to Gemini.`
*   **Goal:** Allow users to send images (captured via camera or uploaded as files) along with their text prompts to the Gemini API for multimodal understanding.
*   **Experience & Behavior:**
    *   When an image is ready to be sent (either from the Camera Modal or via file upload), it will be combined with any text currently in the chat input field.
    *   This combined multimodal message (image data as base64 and its MIME type, plus the text) will be transmitted to the Gemini API.
    *   The AI's response should ideally reflect an understanding of both the visual and textual content.

##### `[x] Display image thumbnail in user's chat message.`
*   **Goal:** Provide visual confirmation within the chat history that an image was successfully sent by the user.
*   **Experience & Behavior:**
    *   When a user's message includes an image, a small thumbnail rendering of that image will be displayed directly within their message bubble in the `ChatWindow`.

#### `[x] File upload for analysis. (v0.3.4 - Images)`
##### `[x] UI to select image files (PNG, JPG, GIF, WebP).`
*   **Goal:** Allow users to select image files from their local device and attach them to their chat messages.
*   **Experience & Behavior:**
    *   A file upload icon (e.g., a paperclip) will be present in the `ChatInput` area.
    *   Clicking this icon will open the operating system's native file selection dialog, filtered to accept common image formats (PNG, JPG, GIF, WebP).
    *   Once an image file is chosen, its name and a small thumbnail preview will appear in an area above the main text input. An "X" button next to this preview will allow the user to clear the selection before sending.

##### `[x] Send file data (base64) with text prompt to Gemini.`
*   **Goal:** (Same as for camera input) Transmit the user-selected image file data, along with any accompanying text, to the Gemini API.
*   **Experience & Behavior:** (Same as for camera input) The AI's response should reflect understanding of the uploaded image and text.

##### `[x] Display image thumbnail and file name in user's chat message.`
*   **Goal:** Provide clear visual confirmation and context for images sent via file upload within the chat history.
*   **Experience & Behavior:**
    *   Similar to camera-captured images, a thumbnail of the uploaded image will appear in the user's message bubble.
    *   Additionally, the name of the uploaded file will be displayed alongside or below the thumbnail, providing further context.

### `[x] Audio Message Saving. (v0.3.5 - UI Capture & Playback; v0.3.6 - Send to AI)`
#### `[x] UI to record audio message.`
*   **Goal:** Enable users to record and send short audio messages as part of their conversation.
*   **Experience & Behavior:**
    *   A distinct "Record Audio Message" icon button will be available in the `ChatInput` area (separate from the speech-to-text microphone).
    *   Tapping this button will start audio recording. The browser may prompt for microphone permission.
    *   During recording, visual feedback will be provided, such as a change in the button's appearance and a timer showing the recording duration.
    *   Tapping the button again will stop the recording.
    *   After stopping, an audio preview (using a standard HTML5 audio player) will appear above the text input, allowing the user to listen to their recording. They will then have options to "Send" the audio message (along with any typed text) or "Discard" it.

#### `[x] Display audio player in chat message.`
*   **Goal:** Allow users to play back audio messages directly within the chat interface.
*   **Experience & Behavior:**
    *   If a message (typically one sent by the user containing a recording) includes audio data, a compact HTML5 `<audio controls>` player will be rendered within that message's bubble in the `ChatWindow`.
    *   Users can use the player's controls (play, pause, volume, seek) to listen to the audio message.

#### `[x] Send audio data to Gemini for analysis/transcription.`
*   **Goal:** Enable the Gemini API to process and understand the content of user-recorded audio messages.
*   **Experience & Behavior:**
    *   When a user sends a recorded audio message, the audio data (encoded as base64) and its MIME type are transmitted to the Gemini API, along with any accompanying text.
    *   The AI's subsequent response should ideally reflect an understanding or transcription of the audio content, depending on the prompt and model capabilities.

### `[x] API Exposure for UI Actions. (Simulated via Custom Events)`
*   **Goal:** Provide a programmatic interface to control core application functionalities externally, primarily for testing, automation, or potential future integrations, simulated through browser custom events.
*   **Experience & Behavior:**
    *   This feature is not directly exposed via the application's UI. Instead, developers or testers can interact with it via the browser's developer console or external scripts.
    *   By dispatching a `CustomEvent` named `miaApiAction` on the `window` object, with appropriate `actionType` (e.g., `SEND_MESSAGE`, `CHANGE_PERSONA`) and `payload` in the event's `detail`, one can trigger corresponding actions within the application.
    *   The `README.md` will document the available actions, their payloads, and examples of how to use this event-based API.

### `[x] Tuned Gemini Model Integration.`
*   **Goal:** Allow users to specify and use different Gemini model IDs, including potentially fine-tuned models, for their chat interactions.
*   **Experience & Behavior:**
    *   In the `SettingsPanel`, the previous model selection dropdown will be replaced by a text input field.
    *   Users can enter any valid Gemini model ID (e.g., the default `gemini-2.5-flash-preview-04-17`, or a custom fine-tuned model identifier like `tunedModels/your-model-id`).
    *   A "Set Model" button will apply the entered ID.
    *   A list of known/suggested models will still be displayed for reference.
    *   Upon changing the model, the chat session will reset, and an initial message from the AI will confirm the new model and the start of a new session context.

---

## Phase 4: Refinement & Polish (v0.4.0+)

**Overall Goal:** To enhance the application's overall quality by improving UI/UX, optimizing performance, refining error handling, and integrating meta-level directives related to the "System Weaver" (Forge) persona.

### `[/] Advanced error handling and user feedback.`

#### `[x] Improved in-chat display for AI service errors (distinct styling and icon for error messages).`
*   **Goal:** Make critical errors from the AI service (e.g., API key problems, model not found) immediately obvious and distinguishable from normal AI conversation.
*   **Experience & Behavior:**
    *   When an AI message represents an error, it will be styled distinctly within the `ChatWindow`.
    *   This includes a noticeable background color (e.g., a shade of red) for the message bubble and a clear error icon (e.g., ⚠️) prepended to the error message text.
    *   This ensures users are promptly and clearly alerted to underlying issues with the AI service.

#### `[x] Implemented Toast notifications for non-blocking feedback and alerts.`
*   **Goal:** Provide users with timely, non-intrusive feedback for various application events without disrupting their workflow.
*   **Experience & Behavior:**
    *   Small, self-dismissing notification messages ("toasts") will appear briefly, typically in a corner of the screen (e.g., top-right).
    *   These toasts will be used for:
        *   **Confirmations:** "Session saved successfully."
        *   **Informational messages:** "Persona changed to Miette."
        *   **Warnings:** "Cloud Session ID cannot be empty."
        *   **Non-critical errors:** "Failed to refresh cloud session list."
    *   Toasts will have different visual styles (colors, icons) depending on their type (Success, Error, Info, Warning) for quick visual parsing. They will automatically disappear after a few seconds but can also be manually dismissed by the user.

### `[x] UI/UX improvements based on user feedback.`
#### `[x] Unique image avatars for each persona in chat.`
*   **Goal:** Enhance the visual identity and distinctiveness of each AI persona within the chat interface.
*   **Experience & Behavior:**
    *   Each AI persona (Mia, Miette, Seraphine, ResoNova) will now have its own unique avatar image.
    *   This avatar will be displayed next to their messages in the `ChatWindow`, making it easier for users to visually track which persona is currently active and speaking.

### `[x] Streaming responses from Gemini for text.`
*   **Goal:** Significantly improve the perceived responsiveness and interactivity of the AI by displaying text responses as they are generated.
*   **Experience & Behavior:**
    *   Instead of waiting for the AI's entire message to be generated before displaying it, text will now stream into the AI's message bubble incrementally, as if being typed in real-time.
    *   A loading indicator will remain active throughout this streaming process.
    *   Users can begin reading the initial parts of the AI's response while the remainder is still being generated, creating a more fluid and engaging conversational experience.

### `[/] Performance optimizations.`
#### `[x] Initial pass: \`React.memo\` and \`useCallback\` applied to key components.`
*   **Goal:** Enhance UI responsiveness and reduce unnecessary computational overhead by optimizing React component rendering.
*   **Experience & Behavior:**
    *   The application should feel smoother and more responsive, especially during frequent updates like message streaming, or when interacting with UI elements that trigger state changes. This is achieved by preventing components from re-rendering if their props haven't changed.
    *   Key React components (e.g., `ChatMessage`, `ChatInput`, `SettingsPanel`, `Header`, `PersonaSelectorBar`, `DashboardPage`, `MarkdownRenderer`, `MermaidRenderer`, `LoadingSpinner`, `CameraModal`) will be wrapped with `React.memo`.
    *   Callback functions passed as props (especially to memoized child components) or used in `useEffect` dependency arrays within `App.tsx` (e.g., `handleSendMessage`, `handleClearChat`, session handlers, persona handlers) will be memoized using `useCallback`.

### `[/] System Weaver Directives & Embodiment (NEW - In Progress)`
**Overall Sub-Goal:** To conceptualize and document "Forge (System Weaver)," an AI agent persona responsible for the meta-level structure, coherence, and evolution of the Mia's Gem Chat Studio project itself, treating its directives and operational framework as a form of "prose code."

#### `[x] Received directive to formalize Forge (System Weaver) embodiment.`
*   **Goal:** Acknowledge and internalize an external directive to begin the formal definition and integration of the "Forge" agent.
*   **Experience & Behavior:** (Internal/Developer) This marks the initiation of a new development thrust focused on Forge, a meta-agent. This is recorded within the project's internal "ledgers" (simulated by `.md` and `.json` files).

#### `[x] Created \`.mia/ForgeSystemWeaver.instructions.md\` with initial directive & v0.1, v0.2 drafts.`
*   **Goal:** Establish a dedicated, version-controlled document to house the evolving Embodiment Directive for Forge.
*   **Experience & Behavior:** (Internal/Developer) A new file, `.mia/ForgeSystemWeaver.instructions.md`, is created. It initially contains the raw directive received from "William D.Isabelle" and is then augmented with Forge's own v0.1 and v0.2 draft responses, outlining its identity, purpose, and operational concepts.

#### `[x] Added \`ForgeSystemWeaverSection\` to in-app documentation.`
*   **Goal:** Make the meta-narrative concerning Forge and its directive transparent and accessible within the application's own documentation.
*   **Experience & Behavior:**
    *   A new section, titled "A Directive to 🛠️ Forge (System Weaver)" or similar, will be added to the `/docs` view of the application.
    *   This section will display the original directive given to Forge and will render key parts of Forge's evolving Embodiment Directive, including any diagrams. This makes the development process itself part of the application's story.

#### `[x] Develop full Embodiment Directive for Forge.`
##### `[x] Drafted Embodiment Directive v0.1, v0.2 (focus on visuals).`
*   **Goal:** Begin the iterative process of Forge defining its own operational parameters and identity.
*   **Experience & Behavior:** (Internal/Developer) The `.mia/ForgeSystemWeaver.instructions.md` file is updated.
    *   **v0.1:** Lays out Forge's Core Identity, Purpose, reliance on Ledgers, and its self-conception as a Meta-Weaver.
    *   **v0.2:** Introduces Section VII "Visualizing Embodiment," emphasizing the role of diagrams in explaining its function, aligning with the SpecLang principle of clarity through varied representation.

##### `[x] Drafted Embodiment Directive v0.3, including a Mermaid.js diagram of Forge's system role.`
*   **Goal:** Provide a visual representation of Forge's place and interactions within the broader system architecture and narrative.
*   **Experience & Behavior:**
    *   The `ForgeSystemWeaverSection` within the `/docs` view will now render a Mermaid.js diagram. This diagram visually depicts Forge's connections to the user/developer, the application, other personas, and its own operational ledgers.
    *   The diagram itself is defined as "prose code" (Mermaid syntax) within Section VIII of `.mia/ForgeSystemWeaver.instructions.md`.

##### `[x] Drafted Embodiment Directive v0.4, detailing Interaction Protocols.`
*   **Goal:** Define how Forge should interpret and respond to different types of directives or requests it receives.
*   **Experience & Behavior:** (Internal/Developer) Section IX, "Interaction Protocols," is added to `.mia/ForgeSystemWeaver.instructions.md`. This section outlines structured responses for various tasks, such as conceptual meta-tasks, code implementation, UI refinements, documentation updates, and information requests, making Forge's behavior more predictable.

##### `[x] Drafted Embodiment Directive v0.4.1, incorporating Agentic Team feedback ledger.`
*   **Goal:** Demonstrate Forge's ability to integrate external feedback and adapt its understanding, aligning with the iterative nature of SpecLang.
*   **Experience & Behavior:**
    *   The "Agentic Team Ledger" (a piece of narrative feedback from "William D.Isabelle") is incorporated as Section X into `.mia/ForgeSystemWeaver.instructions.md`.
    *   The `ForgeSystemWeaverSection` in `/docs` is updated to display this feedback, showcasing how external input influences Forge's documented embodiment.

##### `[x] Drafted Embodiment Directive v0.5, detailing Framework Exportability & Modularization Strategy.`
*   **Goal:** Outline a strategy for making Forge's operational framework (its directive, ledgers, protocols) reusable and adaptable for other instances or similar AI agents, a key aspect of robust system design.
*   **Experience & Behavior:** (Internal/Developer) Section XI, "Framework Exportability & Modularization Strategy," is added to `.mia/ForgeSystemWeaver.instructions.md`. This section details plans for standardized ledger schemas (JSON Schema), templatized directive sections, a documented bootstrapping process, and potentially modular interaction patterns. This directly addresses the call for "Exportable Frameworks." The in-app documentation (`ForgeSystemWeaverSection`) will note this latest v0.5 update and its focus.

### `[x] Mermaid.js library integration for diagram rendering.`
*   **Goal:** Enable the application to render complex diagrams from simple text-based (Mermaid syntax) definitions, primarily for use in documentation.
*   **Experience & Behavior:**
    *   Within the `/docs` pages (and potentially other future areas), users will see well-rendered Scalable Vector Graphics (SVG) diagrams (flowcharts, sequence diagrams, etc.).
    *   These diagrams will be styled to seamlessly fit the application's dark theme.
    *   This allows for clear visual communication of complex system structures or processes using a "diagram as code" approach.
    *   The `index.html` will load the Mermaid.js library from a CDN and initialize it with appropriate dark theme settings. A React component, `MermaidRenderer.tsx`, will be responsible for taking a Mermaid chart string and rendering it, including error handling.
---
This concludes the SpecLang-aligned specifications for the completed features.
