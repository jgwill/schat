
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = React.memo(({ markdown }) => {
  return (
    <div 
      className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-gpt-text"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Ensure links open in a new tab and have security attributes
          a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />,
          // You can customize other elements here if needed, e.g., for syntax highlighting in code blocks
          // code({node, inline, className, children, ...props}) {
          //   const match = /language-(\w+)/.exec(className || '')
          //   return !inline && match ? (
          //     <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...props}>
          //       {String(children).replace(/\n$/, '')}
          //     </SyntaxHighlighter>
          //   ) : (
          //     <code className={className} {...props}>
          //       {children}
          //     </code>
          //   )
          // }
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
});

export default MarkdownRenderer;