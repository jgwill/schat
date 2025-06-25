# ToastNotification.tsx - Specification (SpecLang Aligned)

## Overall Goal/Intent

The `ToastNotification.tsx` component is designed to **render individual, non-blocking notification messages (toasts)** to the user. Its primary goal is to provide timely and visually distinct feedback for various application events (e.g., success, error, information, warning) in a way that does not interrupt the user's current workflow. It aims to be a self-contained, reusable UI element for presenting these brief messages, enhancing user awareness of application status changes.

## Key Behaviors & Responsibilities

1.  **Display Individual Toast Message:**
    *   **Behavior:** Accepts a `toast` object (of type `ToastMessage`) as a prop, which contains the `id`, `message` text, `type`, and optional `duration`. It renders this information within a styled container.
    *   **UX Intent:** To clearly present a short, informative message to the user, providing immediate feedback relevant to their actions or system events.

2.  **Type-Specific Styling for Clarity:**
    *   **Behavior:** Dynamically applies different background colors, border colors, and text colors to the toast container based on the `toast.type` (Success, Error, Info, Warning).
    *   **UX Intent:** To allow users to quickly and visually distinguish the nature of the notification (e.g., green for success, red for error). This color-coding enhances comprehension and allows for immediate understanding of the feedback's importance or outcome.

3.  **Manual Dismissal for User Control:**
    *   **Behavior:** Includes a "Dismiss" button (typically an 'X' icon) within the toast. Clicking this button invokes the `onDismiss` callback prop, passing the `toast.id`.
    *   **UX Intent:** To give users control to remove the notification from view before it auto-dismisses (if applicable), or if they have acknowledged its content. This ensures toasts do not linger unnecessarily.

4.  **Animated Appearance for Noticeability:**
    *   **Behavior:** The toast notification animates into view (e.g., sliding in from the side with a fade-in effect) when it is first rendered.
    *   **UX Intent:** To make the appearance of new notifications noticeable yet unobtrusive, drawing the user's attention smoothly without being jarring.

5.  **Accessibility Considerations for Inclusivity:**
    *   **Behavior:** Sets the `role="alert"` attribute on the toast container to ensure assistive technologies announce it appropriately. Uses `aria-live="assertive"` for error and warning types, and `aria-live="polite"` for success and info types, to control the urgency of screen reader announcements.
    *   **UX Intent:** To ensure that users relying on assistive technologies are made aware of important application feedback in a timely and appropriate manner.

## Design Intent for Structure (Prose Code)

*   **Presentational Component for Focused Responsibility:** Designed primarily as a presentational component. Its appearance and content are determined by the `toast` prop it receives. This design choice allows it to focus solely on rendering a single toast effectively. It manages no internal state related to the toast's content or lifecycle (auto-dismissal is intended to be handled by the parent hook/manager, `useToasts`).
*   **Self-Contained Styling Logic for Encapsulation:** Encapsulates the logic for determining the appropriate CSS classes based on the `toast.type`. This keeps styling decisions related to toast presentation localized within this component, making it easy to modify toast appearance without affecting other parts of the system.
*   **Callback for Dismissal to Enable Decoupling:** Relies on an `onDismiss` callback prop to signal its parent (typically `App.tsx` via `useToasts`) that it should be removed from the list of active toasts. This design decouples the visual representation of the toast from the state management of the toast queue, promoting a cleaner separation of concerns.
*   **Memoization for Performance:** Wrapped with `React.memo` because its rendering is solely dependent on its props (`toast` and `onDismiss`). This design choice prevents unnecessary re-renders if other parts of the application update but this specific toast's data or its dismiss handler haven't changed, which is beneficial when multiple toasts might be displayed or updated.

## Relation to SpecLang Principles

*   **Prose Code Intent:** This specification describes the component's purpose (to display individual toast notifications clearly and effectively) and its key presentational and interactive behaviors in natural language.
*   **Intent-Based Expression:** The behaviors focus on *what the user sees and experiences* (e.g., "visually distinct feedback," "control to remove the notification," "animated into view") and how it achieves its communicative goal of providing timely, non-disruptive feedback.
*   **Modularity and Reusability:** The component is a self-contained module for rendering a single toast, designed to be reused for any notification message generated by the application, promoting a consistent feedback mechanism.
*   **Clear Visual Contract for Communication:** The type-specific styling is a core part of its contract, ensuring that the visual language of notifications is consistent and meaningful, allowing users to quickly discern the nature of the feedback.

This specification outlines the `ToastNotification` component's role in providing clear, styled, and interactive feedback elements within the application, contributing to a more informed user experience.