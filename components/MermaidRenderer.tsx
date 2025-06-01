
import React, { useEffect, useRef } from 'react';

interface MermaidRendererProps {
  chart: string;
  id: string; // Unique ID for the mermaid div
}

const MermaidRenderer: React.FC<MermaidRendererProps> = React.memo(({ chart, id }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = React.useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure mermaid is only initialized on client-side
  }, []);

  useEffect(() => {
    if (isClient && mermaidRef.current && (window as any).mermaid) {
      try {
        // Ensure the content is set before rendering
        mermaidRef.current.innerHTML = chart;
        (window as any).mermaid.run({ nodes: [mermaidRef.current] });
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (mermaidRef.current) {
            mermaidRef.current.innerHTML = `<pre class="text-red-400">Mermaid Error: ${error instanceof Error ? error.message : String(error)}\n\n${chart}</pre>`;
        }
      }
    } else if (isClient && !(window as any).mermaid) {
        if (mermaidRef.current) {
            mermaidRef.current.innerHTML = `<div class="text-yellow-400">Mermaid library not loaded. Diagram cannot be rendered.</div><pre class="bg-gpt-gray p-2 rounded mt-2">${chart}</pre>`;
        }
    }
  }, [chart, id, isClient]);

  return (
    <div className="mermaid-container my-4 p-4 border border-gpt-gray rounded bg-gpt-light overflow-auto">
      <div ref={mermaidRef} id={`mermaid-${id}`} className="mermaid text-gpt-text">
        {/* Initial content before mermaid processes it */}
        {isClient && (window as any).mermaid ? chart : <pre>{chart}</pre>}
      </div>
      {!isClient && <div className="text-sm text-gray-400">Loading diagram...</div>}
    </div>
  );
});

export default MermaidRenderer;
