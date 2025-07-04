
import React from 'react';
import MarkdownRenderer from '../MarkdownRenderer';
import MermaidRenderer from '../MermaidRenderer';

const KEY_COMPONENTS_CONTENT_INTRO = `
This section highlights some of the key React components used in Mia's Gem Chat Studio.
`;

const MARKDOWN_RENDERER_EXAMPLE = `
**Example using react-markdown:**
*   Item 1 _italic_
*   Item 2 \`inline code\`
[A Link to Google](https://google.com) that opens in a new tab.

\`\`\`javascript
function greet() {
  console.log("Hello, from react-markdown!");
}
\`\`\`

| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

`;

const MERMAID_EXAMPLE_CHART = `
graph TD
    A[User Input] -->|Text or Speech| B(ChatInput Component)
    B --> C{App.tsx State}
    C -->|Sends to Gemini| D(GeminiService)
    D -->|Receives Response| C
    C -->|Updates Messages| E(ChatWindow Component)
    E --> F[ChatMessage Component]
    F --> G[MarkdownRenderer]
    F --> H[TTS Output]
`;

const KeyComponentsSection: React.FC = () => {
  return (
    <section id="components" className="mb-12 p-6 bg-gpt-light rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-4 text-white border-b border-gpt-gray pb-2">Key Components</h2>
      <MarkdownRenderer markdown={KEY_COMPONENTS_CONTENT_INTRO} />

      <h3 className="text-xl font-medium mt-4 mb-2 text-gray-300">MarkdownRenderer</h3>
      <p className="mb-2 text-gray-400">This component renders Markdown text into HTML using the <code className="text-sm bg-gpt-gray p-1 rounded">react-markdown</code> library with <code className="text-sm bg-gpt-gray p-1 rounded">remark-gfm</code> for GitHub Flavored Markdown support (e.g., tables, strikethrough). It's styled using Tailwind Typography for a consistent look and feel. Links automatically open in new tabs.</p>
      <div className="p-4 border border-gpt-gray rounded bg-gpt-dark">
        <MarkdownRenderer markdown={MARKDOWN_RENDERER_EXAMPLE} />
      </div>

      <h3 className="text-xl font-medium mt-6 mb-2 text-gray-300">MermaidRenderer (Diagrams)</h3>
      <p className="mb-2 text-gray-400">This component utilizes the Mermaid.js library, which is loaded and initialized globally via <code>index.html</code> (using the CDN and a <code>mermaid.initialize</code> call), to render diagrams from text definitions.
      </p>
      <MermaidRenderer chart={MERMAID_EXAMPLE_CHART} id="example-keycomponents-chart" />
      <p className="text-xs text-gray-500 mt-1">Note: If you see code instead of a diagram, ensure your browser can access the Mermaid CDN (<code>https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js</code>) and that no console errors indicate issues with its initialization in <code>index.html</code>.</p>
    </section>
  );
};

export default KeyComponentsSection;