# CameraModal.tsx - Specification (SpecLang Aligned)

## Overall Goal/Intent

The `CameraModal.tsx` component is designed to provide a **dedicated, modal interface for users to capture images using their device's camera** and send them as part of a chat message. Its primary goal is to offer an intuitive, self-contained workflow for camera-based image input, from initiating the camera feed to capturing, previewing, and confirming the image for submission. The intent is to seamlessly integrate live image capture into the chat experience, enriching communication with visual content.

## Key Behaviors & Responsibilities

1.  **Modal Presentation and Lifecycle Management:**
    *   **Behavior:** The modal's visibility is controlled by an `isOpen` prop. When `true`, it overlays the current application view, focusing user interaction on camera operations. It handles the lifecycle of the camera stream, starting it when the modal opens and stopping it when the modal closes or the component unmounts.
    *   **UX Intent:** To provide a focused environment for camera interaction without navigating away from the main application. Automatic stream management ensures resources are used efficiently and permissions are handled contextually.

2.  **Camera Access and Video Feed Display:**
    *   **Behavior:**
        *   On opening, attempts to access the user's camera via `navigator.mediaDevices.getUserMedia({ video: true })`.
        *   If successful, it displays the live video feed from the camera within the modal.
        *   If camera access fails (e.g., permission denied, no camera found), it displays a clear, user-friendly error message.
    *   **UX Intent:** To provide users with a live preview from their camera, enabling them to frame their shot. Graceful error handling informs users of issues and potential remediation steps (e.g., checking browser permissions).

3.  **Image Capture:**
    *   **Behavior:** A "Capture" button is provided. When clicked, it takes the current frame from the live video feed and renders it onto an internal (hidden or visible) `<canvas>` element. The image data is then obtained from the canvas as a data URL (typically JPEG format).
    *   **UX Intent:** To allow users to easily take a snapshot from the live camera feed with a single action.

4.  **Image Preview and Confirmation:**
    *   **Behavior:** After an image is captured, the live video feed is typically replaced or augmented by a static preview of the captured image.
    *   The user is then presented with options:
        *   "Send Image": Triggers the `onSendImage` callback with the base64 encoded image data and its MIME type.
        *   "Retake": Discards the current captured image and reactivates the live camera feed (if it was stopped) or simply allows the user to capture again from the live feed.
        *   "Cancel" (or a general close button): Closes the modal, discarding any captured image.
    *   **UX Intent:** To give users a clear view of the image they've taken and explicit control over whether to use it, retake it, or abandon the capture process. This confirmation step prevents accidental sending of unwanted images.

5.  **Error Handling and Feedback:**
    *   **Behavior:** Displays informative error messages if camera access fails, if the video stream cannot be played, or if other unexpected issues occur during the process. A loading indicator may be shown briefly while the camera is initializing.
    *   **UX Intent:** To keep the user informed about the status of camera operations and any problems encountered, guiding them through troubleshooting if necessary.

6.  **Responsive Design:**
    *   **Behavior:** The modal content (video feed, buttons) is designed to be responsive and usable on various screen sizes, ensuring that controls are accessible and the preview is adequately visible.
    *   **UX Intent:** To provide a consistent and effective camera capture experience across different devices, including mobile phones where camera usage is common.

## Design Intent for Structure (Prose Code)

*   **Encapsulation of Camera Logic:** The component is designed to encapsulate all logic related to camera access (`getUserMedia`), video display (`<video>` element), image capture (`<canvas>`), and stream management. This abstraction shields the rest ofthe application from the complexities of the MediaDevices API.
*   **State Management for Workflow Control:** Uses internal React state (e.g., for `stream`, `capturedImage`, `error`, `isLoading`) to manage the different stages of the camera interaction workflow (initializing, streaming, captured, error). This state-driven approach allows the UI to reactively update based on the current phase of operation.
*   **Refs for DOM Element Interaction:** Utilizes `useRef` for direct interaction with the `<video>` and `<canvas>` DOM elements, which is necessary for operations like setting the video source, playing the video, and drawing the captured image onto the canvas.
*   **Callback for Image Submission (`onSendImage`):** Communicates the successfully captured image data (base64 string and MIME type) back to the parent component (`ChatInput`) via the `onSendImage` callback. This decouples the modal from the specifics of how the image is processed or sent by the parent.
*   **Effect Hooks for Lifecycle Management (`useEffect`):** Employs `useEffect` to manage the camera stream lifecycle (starting when `isOpen` becomes true, stopping when `isOpen` becomes false or on unmount). This ensures that camera resources are acquired and released appropriately, preventing unnecessary resource usage or privacy concerns.

## Relation to SpecLang Principles

*   **Prose Code Intent:** This specification describes the modal's purpose (to enable in-app image capture) and its interactive workflow (start camera, capture, preview, send/retake) in natural language.
*   **Intent-Based Expression:** Focuses on *what the user can achieve* (e.g., "capture images using their device's camera," "preview and confirm the image") and the *user experience* during this process (e.g., "live preview," "clear error messages," "explicit control over submission").
*   **Modularity:** The `CameraModal` is a self-contained module for a specific task (camera input), designed to be invoked by other components (`ChatInput`) when this functionality is needed.
*   **User Control and Feedback:** The design emphasizes providing users with clear feedback at each step (loading, error, preview) and explicit controls (Capture, Retake, Send, Cancel) to manage the image capture process.

This specification outlines the `CameraModal.tsx` component's role in providing a user-friendly and integrated solution for capturing and sending images via the device camera within Mia's Gem Chat Studio.