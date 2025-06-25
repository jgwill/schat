# useSpeechSynthesis.ts - Hook Specification (SpecLang Aligned) - Revised

## Overall Goal/Intent

The `useSpeechSynthesis` custom React hook is designed to **simplify the integration of browser-based text-to-speech (TTS) functionality** into React components. It aims to abstract the complexities of the Web Speech API's `SpeechSynthesis` and `SpeechSynthesisUtterance` interfaces. The hook provides a clean, stateful, and reusable solution for managing speech playback, utterance configuration, and status reporting, primarily enabling components to easily voice textual content and provide auditory feedback to users.

## Key Behaviors & Responsibilities (The Hook's Contract)

1.  **Browser Feature Detection:**
    *   **Behavior:** The hook verifies if the user's browser supports the `speechSynthesis` feature of the Web Speech API.
    *   **Output:** This status is exposed through the `browserSupportsSpeechSynthesis: boolean` property. If TTS is not supported, an informative message is available via the `error` state.
    *   **Intent:** To allow consuming components to conditionally offer TTS functionality or inform the user if it's unavailable, ensuring a graceful degradation of features and preventing errors on unsupported platforms.

2.  **Speech Playback Control:**
    *   **Behavior (`speak(text: string)`):** When invoked with a string of text, the hook initiates speech synthesis for that text. If speech is already in progress from a previous call to `speak` within the same hook instance, the ongoing speech is first cancelled by the browser's speech synthesis engine. The `isSpeaking` state is set to `true` immediately to reflect the intent to speak, before the actual browser API call to `synth.speak()` is made.
    *   **Intent:** To provide a straightforward method for components to request audio playback of textual content. The cancellation of prior speech ensures that user actions result in the most recent request being prioritized. Setting `isSpeaking` immediately aims to make the UI more responsive to the playback state, reflecting the user's action instantly.
    *   **Behavior (`cancel()`):** When called, the hook immediately instructs the browser's speech synthesis engine to stop any ongoing speech synthesis. The `isSpeaking` state becomes `false`.
    *   **Intent:** To offer an explicit way for components or users to halt audio playback, providing immediate control and responsiveness.

3.  **Speaking Status Indication:**
    *   **Behavior:** The `isSpeaking: boolean` state accurately reflects whether the speech synthesis engine is intended to be or is currently producing audio output. It becomes `true` immediately when `speak()` is called. The browser's `SpeechSynthesisUtterance` events (`onstart`, `onend`, `onerror`) further refine this state: `onstart` confirms actual speaking has begun (though `isSpeaking` is already true), and `onend` or `onerror` will set `isSpeaking` to `false`.
    *   **Intent:** To enable consuming components to provide clear visual feedback to the user about the TTS status (e.g., changing a speaker icon's appearance from play to stop, disabling a "speak" button while active). The immediate update of `isSpeaking` on the `speak` call enhances the perceived responsiveness of the UI.

4.  **Error Reporting:**
    *   **Behavior:** If issues arise, such as browser incompatibility or errors during the speech synthesis process itself (caught by `utterance.onerror`), the hook captures these and makes a user-friendly message available via the `error: string | null` state. When an error occurs, `isSpeaking` becomes `false`.
    *   **Intent:** To ensure that problems with TTS are clearly communicated to the consuming component, allowing it to inform the user or take appropriate fallback measures, rather than failing silently.

5.  **Utterance Configuration (Internal Default):**
    *   **Behavior (Internal):** The hook internally creates and configures a `SpeechSynthesisUtterance` object with default settings (e.g., language 'en-US', standard pitch, rate, and volume).
    *   **Intent:** To provide a ready-to-use TTS capability with sensible defaults without requiring the consuming component to manage utterance properties unless future enhancements allow customization. This simplifies initial integration for common use cases.

6.  **Resource Management (Internal):**
    *   **Behavior (Internal):** The hook manages the lifecycle of the `SpeechSynthesisUtterance` instance and ensures that any active speech is cancelled if the consuming component unmounts (via the `useEffect` cleanup function).
    *   **Intent:** To prevent audio from continuing to play after the associated UI element is no longer visible and to ensure clean resource handling, avoiding potential side effects and memory leaks.

## Design Intent for Structure (Prose Code)

*   **Encapsulation of Browser API Complexity:** The hook is designed to fully abstract the direct usage of `window.speechSynthesis` and `SpeechSynthesisUtterance`. This simplification is a core design goal, allowing developers to use TTS features without needing deep knowledge of the underlying Web Speech API's event model and object management.
*   **Stateful Logic for Reactive UI:** The hook's primary design involves managing state (`isSpeaking`, `error`) that reflects the current status of the TTS operation. This enables consuming React components to reactively update their UI based on changes in TTS state (e.g., displaying a "stop" button when `isSpeaking` is true). The proactive setting of `isSpeaking` on `speak()` call is intended to enhance this perceived UI responsiveness.
*   **Observable Outcomes via State Changes (The Hook's Contract):** Internal browser events related to speech synthesis (like `utterance.onstart`, `utterance.onend`, `utterance.onerror`) are translated into changes in the hook's exposed state variables (`isSpeaking`, `error`). This event-to-state transformation is the primary mechanism by which consuming components observe the hook's behavior and the TTS lifecycle, rather than interacting with raw browser events.
*   **Memoized Control Functions for Stability:** The `speak` and `cancel` functions are designed to be stable references (using `useCallback`). This is crucial for performance optimizations in consuming components, especially if these functions are passed as props to memoized children or used in `useEffect` dependency arrays, preventing unnecessary re-renders.
*   **Clear and Focused API Contract:** The object returned by the hook (`{ speak, cancel, isSpeaking, ... }`) defines its public API. This interface is intentionally kept minimal and focused on providing essential controls and status information for TTS operations, promoting ease of use.
*   **Reusable Utterance Instance for Efficiency:** The hook maintains and reuses a single `SpeechSynthesisUtterance` object internally. This design choice avoids the overhead of creating new utterance objects for each speech request and allows for persistent configuration (like language, rate) if those were to be exposed for customization in future extensions.

## Relation to SpecLang Principles

*   **Prose Code Intent:** This specification articulates the hook's primary purpose (to simplify TTS integration and provide auditory feedback) and its behavioral contract (what it enables for consumers and how its state reflects TTS operations) using natural language.
*   **Intent-Based Expression:** The hook provides a high-level, intent-driven API (e.g., `speak("text")` to achieve audio playback). The refined behavior of `isSpeaking` (updating immediately on `speak()` call) further aligns the hook's observable state with the user's direct intent and the component's need to reflect that intent quickly.
*   **Modularity and Reusability:** As a custom React hook, it encapsulates TTS logic into a self-contained, reusable module, promoting clean code architecture in applications requiring TTS features in multiple places.
*   **State Encapsulation & Clear Contract:** The hook manages its internal complexity and state, exposing a clear and predictable set of outputs and controls. The explicit return type `SpeechSynthesisHook` serves as this defined contract, ensuring predictable and type-safe usage for consumers.

This revised specification for `useSpeechSynthesis` highlights the intended behavior and contract of the hook, emphasizing the improved UI feedback timing for `isSpeaking` state and its role in abstracting TTS complexities for easier integration into React components.