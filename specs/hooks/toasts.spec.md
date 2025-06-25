# useToasts.ts - Hook Specification (SpecLang Aligned)

## Overall Goal/Intent

The `useToasts.ts` custom React hook is designed to **provide a centralized mechanism for managing and displaying toast notifications** throughout the Mia's Gem Chat Studio application. Its primary goal is to offer a simple and reusable interface for any component to trigger the display of brief, non-blocking feedback messages (toasts) to the user, while also handling their automatic dismissal after a configurable duration. The intent is to create a consistent and developer-friendly way to implement user notifications for various application events.

## Key Behaviors & Responsibilities (The Hook's Contract)

1.  **Toast Message Queue Management:**
    *   **Behavior:** Internally manages an array of `ToastMessage` objects, representing the queue of currently active toast notifications.
    *   **Output:** Exposes this array as the `toasts: ToastMessage[]` state variable. Toasts are typically added to the beginning of the array so new toasts appear at the top of a displayed list.
    *   **Intent:** To maintain an ordered list of notifications that can be rendered by a consuming component (like `App.tsx` in conjunction with `ToastNotification.tsx`).

2.  **Adding New Toast Notifications:**
    *   **Behavior (`addToast(message: string, type: ToastType, duration?: number): void`):**
        *   When called, this function creates a new `ToastMessage` object with a unique ID, the provided `message` text, `type` (Success, Error, Info, Warning), and an optional `duration`. If no duration is provided, a default duration (e.g., 3000ms) is used.
        *   The new toast is added to the internal `toasts` array, triggering an update to the exposed `toasts` state.
        *   If a `duration` is specified (and is not zero or negative), a `setTimeout` is initiated. When this timer expires, the `removeToast` function is automatically called for that toast's ID.
    *   **Intent:** To provide a simple, programmatic way for any part of the application to request the display of a new toast notification with specific content, type, and lifecycle. The auto-dismissal feature ensures toasts are transient and do not clutter the UI indefinitely.

3.  **Removing Toast Notifications:**
    *   **Behavior (`removeToast(id: string): void`):**
        *   When called with a toast ID, this function filters the internal `toasts` array to remove the toast message matching that ID.
        *   This updates the exposed `toasts` state, causing the corresponding visual toast to be removed from the display (when rendered by a consuming component).
    *   **Intent:** To allow for both programmatic removal of toasts (e.g., by the auto-dismissal timer) and potentially manual removal if a UI were to offer explicit dismiss actions that call this function.

4.  **Stable Callback Functions:**
    *   **Behavior:** The `addToast` and `removeToast` functions are memoized (e.g., using `useCallback`).
    *   **Intent:** To provide stable references for these functions. This is important for performance if they are used as dependencies in `useEffect` hooks or passed to memoized child components by the consuming component, preventing unnecessary re-renders or effect re-executions.

## Design Intent for Structure (Prose Code)

*   **Encapsulation of Toast State Logic:** The hook is designed to entirely encapsulate the state management logic for the toast notification queue (the `toasts` array) and the timers for auto-dismissal. This abstraction allows consuming components to simply request the addition of toasts without needing to manage their lifecycle or storage.
*   **Stateful Hook for Reactivity:** As a custom React hook, it leverages `useState` to manage the `toasts` array. Changes to this state (adding or removing toasts) will cause components consuming the hook (or its `toasts` output) to re-render, enabling a reactive UI that updates as notifications come and go.
*   **Centralized Control for Consistency:** By providing a single hook to manage all toasts, the application can achieve a consistent notification behavior and appearance system-wide, assuming a single instance of this hook is used at a high level (e.g., in `App.tsx`).
*   **Clear and Focused API Contract:** The object returned by the hook (`{ toasts, addToast, removeToast }`) defines its public API. This interface is intentionally kept simple and focused on the essential operations for managing toast notifications, promoting ease of integration.

## Relation to SpecLang Principles

*   **Prose Code Intent:** This specification describes the hook's purpose (centralized toast management) and its behavioral contract (how to add/remove toasts, what state it exposes) in natural language.
*   **Intent-Based Expression:** The hook's API (`addToast`, `removeToast`, `toasts` array) clearly expresses the intent of interacting with a notification system. For example, calling `addToast("Success!", ToastType.Success)` directly conveys the desired outcome.
*   **Modularity and Reusability:** `useToasts` is a highly reusable piece of logic that can be integrated into any React application or component tree that needs a toast notification system, promoting DRY principles.
*   **State Encapsulation:** The hook effectively hides the internal implementation details of how toasts are stored and timed, exposing only the necessary state and control functions. This aligns with good encapsulation practices, making the hook easier to use and maintain.

This specification outlines the `useToasts.ts` hook's role in providing a robust and easy-to-use system for managing toast notifications within Mia's Gem Chat Studio, enhancing user feedback capabilities.