import React from 'react';
import MarkdownRenderer from '../MarkdownRenderer';

const API_REFERENCE_CONTENT = `
This section will detail the \`NGAPP_TOKEN\` secured API endpoints for controlling UI actions programmatically. This is planned for **Phase 3** of the roadmap and will allow for external integrations or more complex automation scenarios.
`;

const DASHBOARD_CONTENT = `
A dedicated \`/dashboard\` view has been initiated (currently a placeholder) and is planned for full implementation in **Phase 3**. This section will provide a centralized interface for:
*   **Persona Management:** Defining, customizing, and switching between different AI personas (e.g., Mia, Miette).
*   **Advanced Model Configuration:** More granular control over Gemini model parameters.
*   **Application Settings:** Broader customization options for the chat studio.
*   **Usage Analytics (Conceptual):** Potentially displaying statistics or logs related to chat sessions.

Click the "Dashboard" link in the header to see the current progress.
`;

const FutureFeaturesSection: React.FC = () => {
  return (
    <>
      <section id="api-reference" className="mb-12 p-6 bg-gpt-light rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-4 text-white border-b border-gpt-gray pb-2">API Reference (Future)</h2>
        <MarkdownRenderer markdown={API_REFERENCE_CONTENT} />
      </section>

      <section id="dashboard" className="mb-12 p-6 bg-gpt-light rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-4 text-white border-b border-gpt-gray pb-2">Dashboard (In Progress)</h2>
        <MarkdownRenderer markdown={DASHBOARD_CONTENT} />
      </section>
    </>
  );
};

export default FutureFeaturesSection;