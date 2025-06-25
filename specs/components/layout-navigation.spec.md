# Layout & Navigation Components - Specification (SpecLang Aligned) - Revised

This document specifies the behavior and intent of the core components responsible for application layout and primary user navigation: `Header.tsx` and `PersonaSelectorBar.tsx`. These components are designed to provide a consistent, intuitive, and accessible structure for users to interact with the application's main sections and features, contributing to a coherent and user-friendly overall experience, including responsiveness on mobile devices.

## Overall Goal/Intent

To establish a clear and persistent navigational framework that allows users to easily understand their current location within the application, switch between main views (Chat, Docs, Dashboard), access global settings, and (within the chat context) conveniently select different AI personas. The layout components are intended to be responsive, visually cohesive with the application's dark theme, and always readily accessible to enhance usability and user orientation. The user should feel confident and in control while navigating the application on any device.

---

## 1. `Header.tsx`

### Overall Goal/Intent
The `Header` component functions as the application's main masthead, consistently displaying branding, primary navigation pathways, and access to global settings. Its design prioritizes immediate recognition of the application and effortless movement between its core functional areas, adapting its presentation for optimal usability on both desktop and mobile screens. It remains persistently visible at the top of the screen to ensure constant access to these critical functions.

### Key Behaviors & Responsibilities

1.  **Application Branding & Identity:**
    *   **Behavior:** Prominently displays the application logo and the title (e.g., "Mia III Studio").
    *   **UX Intent:** To provide immediate brand recognition and a constant visual anchor for the user, reinforcing the application's identity. These elements are typically placed on the left for standard readability and quick identification, contributing to a professional and trustworthy presentation.

2.  **Primary View Navigation (Responsive):**
    *   **Desktop/Tablet Behavior (`md` breakpoint and up):**
        *   Renders clear, clickable navigation buttons ("Chat", "Docs", "Dashboard") inline within the header.
        *   The button corresponding to the `currentView` is visually differentiated (e.g., different background color, bolder text) to clearly indicate the user's active location.
        *   **UX Intent (Desktop/Tablet):** To offer unambiguous and direct pathways to all major sections of the application, allowing users to switch contexts efficiently. Active state highlighting provides crucial navigational feedback.
    *   **Mobile Behavior (screens smaller than `md` breakpoint):**
        *   The inline navigation links ("Chat", "Docs", "Dashboard") are hidden.
        *   A hamburger menu icon button is displayed (typically on the right side of the header).
        *   Tapping the hamburger icon toggles the visibility of a dropdown menu. This menu contains the navigation links ("Chat", "Docs", "Dashboard"), styled for easy tapping.
        *   The active link within the dropdown is highlighted.
        *   Clicking a link in the dropdown navigates to the view and closes the menu. Clicking outside the open menu also closes it.
        *   The hamburger button has appropriate ARIA attributes: `aria-label="Toggle navigation menu"`, `aria-expanded` (reflecting menu state).
        *   **UX Intent (Mobile):** To provide a discreet and space-saving navigation solution on smaller screens, preventing header clutter and prioritizing content visibility. The hamburger menu is a widely recognized pattern for mobile navigation, offering familiar interaction.
    *   **Common Navigation Behavior:** Clicking a navigation button (either inline or in the mobile dropdown) results in an immediate transition to the selected view via the `onSetView` callback. ARIA attributes (`aria-current`) enhance accessibility by programmatically conveying the active view.

3.  **Access to Global Settings:**
    *   **Behavior:** Features a distinct settings icon button (e.g., a gear) that, when clicked, triggers the `onToggleSettings` callback to show or hide the `SettingsPanel`. This button is always visible, regardless of screen size (placed alongside the hamburger menu on mobile).
    *   **UX Intent:** To provide a consistent and easily discoverable entry point for application-wide configurations and actions. An `aria-label` ensures the button's purpose is clear to assistive technologies.

4.  **Persistent and Consistent Layout:**
    *   **Behavior:** Maintains a fixed position at the top of the viewport (`sticky top-0`) with a designated `z-index` ensuring it remains visible above scrolling content. It adheres to the application's dark theme with consistent background color and typography. Its height is accounted for by other sticky elements (like `PersonaSelectorBar`).
    *   **UX Intent:** To guarantee that primary navigation (or access to it via hamburger menu) and settings access are always available to the user, regardless of their scroll position within a view. This predictability enhances usability and user control.

### Design Intent for Structure (Prose Code)

*   **Responsive Conditional Rendering for Navigation:** The structure includes logic to conditionally render either inline navigation links or a hamburger menu button based on screen size (media query breakpoints managed by Tailwind CSS classes). This is a fundamental design choice to achieve a responsive navigation system that adapts to different viewport constraints.
*   **State Management for Mobile Menu (`isMobileMenuOpen`):** Local component state (`isMobileMenuOpen`) is used to manage the visibility of the mobile navigation dropdown. This encapsulates the mobile menu's interactive state within the `Header` component itself, making it self-contained.
*   **Modular Navigation Elements for Consistency (`NavButton` Sub-Component):** The use of an internal `NavButton` sub-component is a design choice to encapsulate the logic and styling for individual navigation links (both inline and in the mobile dropdown). This structure promotes reusability and ensures consistent behavior (e.g., active state highlighting, hover effects, ARIA attributes) across all navigation items.
*   **Clear Visual Hierarchy for Scanability (Flexbox Layout):** The layout, typically achieved with flexbox, is designed to logically group branding elements, navigation links/hamburger menu, and the settings action. This organization provides a scannable and intuitive header structure, allowing users to quickly find what they need.
*   **Sticky Positioning for Persistent Accessibility:** The `sticky` positioning is a deliberate structural choice to fulfill the UX goal of persistent navigation access. This common pattern ensures essential controls are always within reach.
*   **Callback-Driven Interaction for Decoupling (Props for Actions):** The header's interactive elements communicate user intent to the parent (`App.tsx`) via callback props (`onSetView`, `onToggleSettings`). This decouples the header from direct state manipulation, making it a more reusable presentational component.

---

## 2. `PersonaSelectorBar.tsx`

### Overall Goal/Intent
The `PersonaSelectorBar` component is designed to offer users a highly visible and immediate way to switch the active AI persona while in the Chat view. It aims to make persona selection a quick, intuitive action, enhancing the user's ability to tailor their conversational experience dynamically. It remains persistently visible below the main `Header` (accounting for the Header's height), ensuring this control is readily available in the relevant context.

### Key Behaviors & Responsibilities

1.  **Dynamic Persona Selection Display:**
    *   **Behavior:** Renders a distinct button for each available AI `Persona`. Each button prominently displays the persona's `glyph` (icon/emoji) and, on sufficient screen space (e.g., `sm` breakpoint and up), its descriptive name.
    *   **UX Intent:** To allow users to quickly scan and identify available AI personalities. The visual glyphs provide immediate recognition, while names offer clarity, catering to different user preferences and screen sizes. This makes the selection process efficient and user-friendly.

2.  **Clear Indication of Active Persona:**
    *   **Behavior:** The button representing the currently `activePersonaId` is visually emphasized, typically using the persona's unique theme `color` for its border and background, and may include other visual cues like highlighting or shadows. Inactive persona buttons are more subdued.
    *   **UX Intent:** To provide unambiguous, at-a-glance feedback about which AI persona is currently engaged in the conversation. This active state indication is crucial for preventing user confusion and confirming their selection.

3.  **Responsive Interaction for Persona Switching:**
    *   **Behavior:** Clicking a persona button immediately invokes the `onSelectPersona` callback, signaling `App.tsx` to change the active AI. Buttons are disabled if the application is in a loading state (`isLoading` is true).
    *   **UX Intent:** To make persona switching feel instantaneous and responsive. Disabling buttons during loading states prevents conflicts and provides clear feedback about system readiness. ARIA attributes (`role="radio"`, `aria-checked`) improve accessibility by conveying the selection group semantics.

4.  **Persistent and Contextual Layout:**
    *   **Behavior:** The bar maintains a `sticky` position (e.g., `top-[52px]`) directly below the main `Header` within the Chat view, ensuring it's always accessible when relevant. Its styling aligns with the application's dark theme.
    *   **UX Intent:** To provide a dedicated and consistently available space for persona selection without interfering with the main chat flow. Its placement ensures it's a secondary navigation element, pertinent only to the chat context.

### Design Intent for Structure (Prose Code)

*   **Iterative Rendering for Dynamic Options (Mapping Persona Array):** The component is designed to map over the `personas` array to dynamically generate a button for each. This structural approach allows the list of personas to be easily updated or expanded by changing the source data (`personas.ts`) without altering the component's core logic.
*   **Conditional Styling for Clear State Indication (Active/Inactive Buttons):** The styling logic is intentionally designed to be conditional, changing a button's appearance based on whether its persona is active and whether the application is in a loading state. This direct visual mapping of state to appearance is key to its usability.
*   **Callback for Decoupled Action for Modularity (`onSelectPersona` Prop):** The use of the `onSelectPersona` callback allows the bar to signal selection intent without being responsible for the actual state change logic, which resides in `App.tsx`.
*   **Sticky Positioning for Contextual Accessibility (Visibility in Chat View):** The `sticky` positioning is a structural choice to meet the UX requirement of having persona selection readily available specifically when the user is interacting with the chat. The `top` offset is calculated based on the `Header`'s height.
*   **Responsive Design for Adaptability (Glyph vs. Full Name):** The design considers how persona information (glyph vs. full name) is displayed based on screen size (e.g., using Tailwind's `sm:` prefix for showing full names). This aims for optimal information density and usability across various devices.

---

## Relation to SpecLang Principles

*   **Prose Code Intent:** This specification uses natural language to clearly articulate the functional goals, intended user interactions, and visual design objectives for the `Header` and `PersonaSelectorBar`, including their responsive adaptations.
*   **Intent-Based Expression:** The descriptions prioritize *why* these components exist (e.g., "effortless movement between core functional areas," "discreet and space-saving navigation solution on smaller screens") and the *experience* they aim to provide (e.g., "unambiguous navigational feedback ensuring user orientation," "at-a-glance feedback about active persona promoting clarity").
*   **Iterative Refinement (Implied):** The evolution to include a hamburger menu for mobile navigation in the `Header` is a clear example of iterative refinement based on common usability patterns for different screen sizes.
*   **Accessibility as Intent:** The explicit mention of ARIA attributes for the hamburger menu and persona selectors reflects an intent to create navigable and understandable interfaces for all users.

This revised specification aims to provide a clear understanding of the design rationale and intended user experience for the primary layout and navigation components of Mia's Gem Chat Studio, with particular attention to their responsive behavior.