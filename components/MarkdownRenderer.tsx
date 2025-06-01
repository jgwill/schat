
import React from 'react';

interface MarkdownRendererProps {
  markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = React.memo(({ markdown }) => {
  const renderMarkdown = (md: string): string => {
    let html = md;

    // Encode HTML entities to prevent XSS from accidental HTML in markdown
    html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Bold: **text** or __text__
    html = html.replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>');
    // Italics: *text* or _text_
    html = html.replace(/\*(.*?)\*|_(.*?)_/g, '<em>$1$2</em>');
    // Strikethrough: ~~text~~
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // Code blocks: ```lang\ncode\n``` or ```code```
    html = html.replace(/```(\w*)\n([\s\S]*?)\n```|```([\s\S]*?)```/g, (match, lang, codeWithLang, codeWithoutLang) => {
        const code = codeWithLang || codeWithoutLang;
        const langClass = lang ? `language-${lang}` : '';
        return `<pre class="bg-gpt-gray p-2 rounded my-2 overflow-x-auto"><code class="${langClass}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    });
    // Inline code: `code`
    html = html.replace(/`(.*?)`/g, '<code class="bg-gpt-gray px-1 rounded text-sm">$1</code>');

    // Links: [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand-secondary hover:underline">$1</a>');
    
    // Unordered lists: - item or * item or + item
    html = html.replace(/^(\s*)[-*+]\s+(.*)/gm, (match, indent, item) => {
        return `${indent}<li>${item}</li>`;
    });
    html = html.replace(/^(<li>.*<\/li>\s*)+/gm, (match) => {
        return `<ul class="list-disc list-inside my-1">${match.replace(/^\s*<li>/gm, '<li>')}</ul>`;
    });
     // Ordered lists: 1. item
    html = html.replace(/^(\s*)\d+\.\s+(.*)/gm, (match, indent, item) => {
        return `${indent}<li>${item}</li>`;
    });
    html = html.replace(/^(<li>.*<\/li>\s*)+/gm, (match) => {
        // Check if the previous line was an <ul> to avoid nesting ol in ul
        if (!match.startsWith('<ul')) {
             return `<ol class="list-decimal list-inside my-1">${match.replace(/^\s*<li>/gm, '<li>')}</ol>`;
        }
        return match; // Return as is if it's already wrapped or part of a UL
    });


    // Paragraphs (treat consecutive newlines as paragraph breaks)
    // And preserve single newlines within paragraphs as <br>
    html = html.split(/\n\s*\n/).map(paragraph => {
      if (paragraph.trim() === '') return '';
      // Avoid wrapping list and preformatted elements in <p>
      if (/^<(ul|ol|pre|h[1-6])/i.test(paragraph.trim())) {
        return paragraph;
      }
      return `<p class="my-1">${paragraph.replace(/\n/g, '<br />')}</p>`;
    }).join('');
    
    // Remove <br /> inside <pre> tags as they handle newlines naturally
    html = html.replace(/<pre(.*?)>([\s\S]*?)<\/pre>/g, (match, preAttributes, preContent) => {
        return `<pre${preAttributes}>${preContent.replace(/<br \/>/g, '\n')}</pre>`;
    });


    return html;
  };

  return (
    <div 
      className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-gpt-text"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
    />
  );
});

export default MarkdownRenderer;
