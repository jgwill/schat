# useSpeechRecognition.ts - Hook Specification (SpecLang Aligned) - Revised

## Overall Goal/Intent

The `useSpeechRecognition` custom React hook is designed to **simplify the integration of browser-based speech-to-text functionality** into React components. It aims to abstract the complexities of the Web Speech API's `SpeechRecognition` interface, providing a clean, stateful, and reusable hook that manages the speech recognition lifecycle, transcript updates, and error reporting. The primary goal is to offer developers an easy-to-use contract for enabling voice input, thereby enhancing user accessibility and input flexibility.

## Key Behaviors & Responsibilities (The Hook's Contract)

1.  **Browser Feature Detection:**
    *   **Behavior:** The hook ascertains if the user's browser possesses the necessary `SpeechRecognition` capabilities.
    *   **Output:** Exposes this status through the `browserSupportsSpeechRecognition: boolean` property. If not supported, an informative message is available via the `error` state.
    *   **Intent:** To allow consuming components to gracefully degrade or inform the user if voice input is unavailable, ensuring a better user experience on unsupported platforms and preventing attempts to use a non-existent API.

2.  **Speech Recognition Lifecycle Management:**
    *   **Behavior (`startListening()`):** When called, the hook initiates a new speech recognition session. The hook's internal `transcript` state (representing the text to be recognized *during this new session*) is cleared. Any prior `error` state within the hook is also reset. The `isListening` state becomes `true` upon successful initiation of listening by the browser's speech engine.
    *   **Behavior (`stopListening()`):** When called, the hook explicitly terminates the current speech recognition session. The `isListening` state becomes `false` once the browser's speech engine confirms it has stopped.
    *   **Intent:** To provide clear and explicit controls for starting and stopping voice input, giving the consuming component full command over the recognition window. Clearing the hook's internal transcript on `startListening` ensures that each activation provides a clean transcript for the *new* speech input session, unmingled with recognized speech from previous hook activations.

3.  **Real-time Transcription Output (Current Session):**
    *   **Behavior:** As the user speaks and the browser processes the audio during an active listening session (one initiated by `startListening()`), the hook continuously updates its `transcript: string` state with the recognized text from **this current, ongoing session**. This includes interim (non-final) results, providing a live feed of the transcription as it's recognized.
    *   **Intent:** To provide immediate textual feedback of the user's speech *during the active listening period*, allowing them to see the transcription as it forms. This enhances the interactivity and responsiveness of voice input. The hook itself does not manage how this session-specific transcript is combined with pre-existing text in a component; it solely provides the recognized audio from the point `startListening()` was called for the current session.

4.  **Listening State Indication:**
    *   **Behavior:** The `isListening: boolean` state accurately reflects whether the hook is actively attempting to capture and recognize speech. It transitions to `true` when `startListening` is successful (confirmed by the browser API's `onstart` event) and back to `false` when recognition ends (either via `stopListening`, naturally due to silence, or because of an error, confirmed by `onend` or `onerror` events).
    *   **Intent:** To enable consuming components to provide clear visual feedback to the user about the voice input status (e.g., changing a microphone icon's appearance, updating placeholder text), which is crucial for a good user experience with voice interactions.

5.  **Error Reporting:**
    *   **Behavior:** If any issues arise during initialization (e.g., browser incompatibility) or during a recognition session (e.g., microphone permission denied, no audible speech, network issues), the hook captures these and exposes a user-friendly message via the `error: string | null` state. When an error occurs, `isListening` typically becomes `false`.
    *   **Intent:** To ensure that problems with the speech recognition process are communicated clearly and actionably to the consuming component. This allows the component to inform the user or take appropriate fallback actions, rather than failing silently.

6.  **Transcript Manipulation (Current Session):**
    *   **Behavior (`resetTranscript()`):** Allows the consuming component to programmatically clear the hook's current `transcript` state (which reflects the ongoing session's recognized text) without stopping an active listening session.
    *   **Intent:** To provide flexibility for UIs where the transcript for the *current utterance* might need to be cleared independently of the listening state (e.g., if a user stumbles and wants to restart their current spoken phrase without stopping and restarting the mic).

7.  **Robust Interface Definition:**
    *   **Behavior:** The hook exposes a well-defined interface (`SpeechRecognitionHook`).
    *   **Intent:** This clear contract, with typed return values (`isListening: boolean`, `transcript: string`, etc.), ensures that consuming components can integrate with the hook reliably and with type safety. While the hook internally uses detailed TypeScript definitions for Web Speech API objects to ensure its own robustness, the external contract is what matters for consumers.

## Design Intent for Structure (Prose Code)

*   **Encapsulation of Browser API Complexity:** The hook is designed to completely encapsulate the direct use of the `window.SpeechRecognition` or `window.webkitSpeechRecognition` APIs. This abstraction shields consuming components from browser-specific prefixes and the intricate, event-driven nature of the native API, providing a simpler, React-centric interface. The primary intent is to reduce boilerplate and complexity for developers using voice input.
*   **Stateful Logic for Reactivity:** The hook's core design is to be a stateful piece of logic (managing `isListening`, `transcript` for the current session, `error`). This allows React components to reactively re-render and update their UI based on changes in the speech recognition process, such as new transcript data or error states, adhering to React's declarative programming model. The `transcript` provided is always relative to the current listening session.
*   **Observable Outcomes through State Changes (The Hook's Contract):** Instead of exposing raw event handlers from the Web Speech API, the hook translates internal API events into changes in its exposed state variables (`transcript`, `isListening`, `error`). For example, an `onresult` event from the API leads to an update in the `transcript` state, and an `onerror` event updates the `error` state and sets `isListening` to false. This transformation of events into state is the primary mechanism by which consumers observe the hook's behavior and the progress of speech recognition for the current input.
*   **Memoized Control Functions for Stability:** The `startListening`, `stopListening`, and `resetTranscript` functions are designed to be stable references (achieved via `useCallback`). This is important for performance if they are used as dependencies in `useEffect` hooks or passed to memoized child components by the consuming component, preventing unnecessary re-renders.
*   **Clear and Focused API Contract:** The object returned by the hook (`{ isListening, transcript, ... }`) is its public API. This interface is intentionally kept minimal and focused on the essential needs of a component implementing voice input, promoting ease of use and reducing the learning curve.
*   **Internal Instance Management for Resource Safety:** The use of `useRef` to hold the `SpeechRecognition` instance is a deliberate structural choice to manage a mutable, non-rendering object across the hook's lifecycle. This ensures proper setup and, crucially, cleanup of event listeners and resources (via `useEffect`'s cleanup function) to prevent memory leaks or unexpected behavior.

## Relation to SpecLang Principles

*   **Prose Code Intent:** This specification describes the hook's purpose (to simplify voice input integration) and its behavioral contract (what it provides to consumers and how it behaves) in natural language.
*   **Intent-Based Expression:** The hook offers a high-level, intent-driven API (e.g., `startListening` to achieve voice input, providing `transcript` to get recognized text *for that specific listening session*) rather than exposing the raw complexities of the Web Speech API. The focus is on *what the consumer wants to achieve for a given speech input attempt*.
*   **Modularity and Reusability:** As a custom hook, it packages complex speech recognition logic into a reusable, self-contained module, promoting DRY (Don't Repeat Yourself) principles across different components that might need voice input.
*   **State Encapsulation & Clear Contract:** The hook manages its internal complexity and state, exposing a clear and predictable set of outputs and controls. The defined return type `SpeechRecognitionHook` acts as this explicit contract, making its usage predictable and type-safe for consumers.

This revised specification for `useSpeechRecognition` focuses on its external contract and observable behaviors, providing a clear guide for its usage and understanding its role in simplifying voice input integration for React components, particularly clarifying that its `transcript` pertains to the current active listening session. Integration with pre-existing text is the responsibility of the consuming component.