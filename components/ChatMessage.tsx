
import React, { useState } from 'react';
import { Message, Sender } from '../types';
import { USER_AVATAR_SVG } from '../constants';
import MarkdownRenderer from './MarkdownRenderer';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';

interface ChatMessageProps {
  message: Message;
}

// Helper function to sanitize text for speech, removing Markdown syntax
const sanitizeTextForSpeech = (markdown: string): string => {
  if (!markdown) return '';

  let text = markdown;

  // Remove images or replace with alt text. For speech, alt text is good.
  // ![Alt Text](image.url) -> Alt Text
  text = text.replace(/!\[(.*?)\]\(.*?\)/g, '$1');

  // Remove links but keep the link text.
  // [Link Text](link.url) -> Link Text
  text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1');

  // Remove bold, italics, strikethrough, keeping the text.
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2'); // Bold
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');    // Italics
  text = text.replace(/~~(.*?)~~/g, '$1');        // Strikethrough

  // Remove inline code backticks, keeping the text.
  text = text.replace(/`([^`]+)`/g, '$1');
  
  // Remove code blocks (fences only, basic attempt to keep content)
  text = text.replace(/```[\s\S]*?```/g, (match) => 
    match.replace(/```/g, '').replace(/^[\w-]+\n/, '').trim() // Remove language hint and fences
  );
  text = text.replace(/~~~[\s\S]*?~~~/g, (match) => 
    match.replace(/~~~/g, '').replace(/^[\w-]+\n/, '').trim() // Remove language hint and fences
  );

  // Remove headings (e.g., #, ##), keeping the text after hashes.
  text = text.replace(/^#{1,6}\s+/gm, '');

  // Remove horizontal rules.
  text = text.replace(/^(?:---|\*\*\*|___)\s*$/gm, '');

  // Remove blockquotes, keeping the text.
  text = text.replace(/^>\s+/gm, '');

  // Remove list item markers (unordered and ordered), keeping the text.
  text = text.replace(/^[-*+]\s+/gm, '');
  text = text.replace(/^\d+\.\s+/gm, '');
  
  // Replace multiple newlines with a single space to avoid long pauses
  text = text.replace(/\n+/g, ' ');

  // Trim and ensure single spaces
  return text.replace(/\s+/g, ' ').trim();
};


const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message }) => {
  const isUser = message.sender === Sender.User;
  const { speak, cancel, isSpeaking, browserSupportsSpeechSynthesis } = useSpeechSynthesis();
  const [copied, setCopied] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const Avatar: React.FC<{ avatarSrc: string, alt: string, isSvg: boolean }> = ({ avatarSrc, alt, isSvg }) => (
    <div
      className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden shadow-md text-white"
      aria-label={alt}
    >
      {isSvg ? (
        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: avatarSrc }} />
      ) : (
        <img src={avatarSrc} alt={alt} className="w-full h-full object-cover" />
      )}
    </div>
  );

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      cancel();
    } else {
      const textToSpeak = sanitizeTextForSpeech(message.text);
      speak(textToSpeak);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!message.text) return;
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Reset after 1.5 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text.'); // Basic error feedback
    }
  };

  const bubbleBgClass = isUser
    ? 'bg-sky-700'
    : message.isError
      ? 'bg-red-700' // Error message background
      : (message.aiBubbleClassName || 'bg-ai-bubble');

  return (
    <div className={`flex my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 mt-1 ${isUser ? 'ml-2' : 'mr-2'}`}>
          <Avatar
            avatarSrc={isUser ? USER_AVATAR_SVG : message.avatar}
            alt={`${message.name} avatar`}
            isSvg={isUser}
          />
        </div>

        <div
          className={`px-4 py-3 rounded-lg shadow-md relative text-white break-words ${bubbleBgClass}`}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold mr-3">{message.name}</p>
            <p className="text-xs text-gray-200">{formatTime(message.timestamp)}</p>
          </div>

          {message.imagePreviewUrl && isUser && (
            <div className="my-2 bg-black bg-opacity-20 p-1.5 rounded-md inline-block">
              <img
                src={message.imagePreviewUrl}
                alt={message.fileName || "User upload preview"}
                className="max-w-xs max-h-48 rounded object-contain"
              />
              {message.fileName && (
                <p className="text-xs text-gray-300 mt-1 truncate" title={message.fileName}>
                  {message.fileName}
                </p>
              )}
            </div>
          )}

          {message.audioDataUrl && (
            <div className="my-2">
              <audio
                controls
                src={message.audioDataUrl}
                className="w-full h-10 max-w-xs"
                aria-label={`Audio message from ${message.name}`}
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {message.text && !isUser && message.isError && (
            <span role="img" aria-label="Error icon" className="mr-1.5">⚠️</span>
          )}
          {message.text && <MarkdownRenderer markdown={message.text} />}

          {/* Action Buttons Area */}
          <div className="absolute -bottom-2 -right-2 flex space-x-1">
            {message.text && (
              <button
                onClick={handleCopyToClipboard}
                className={`p-1 rounded-full transition-all duration-200
                  ${copied ? 'bg-green-500 hover:bg-green-600 scale-110' : 'bg-gray-500 hover:bg-gray-400'}
                   text-white shadow-md`}
                aria-label={copied ? "Copied to clipboard" : "Copy message to clipboard"}
              >
                {copied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.121A1.5 1.5 0 0117 6.621V16.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 017 16.5v-13z" />
                    <path d="M5 6.5A1.5 1.5 0 016.5 5h3.879a1.5 1.5 0 011.06.44l3.122 3.121A1.5 1.5 0 0115 9.621V16.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 015 16.5v-10zM5.5 7.5A.5.5 0 005 8v8.5a.5.5 0 00.5.5h7a.5.5 0 00.5-.5V9.621a.5.5 0 00-.146-.353l-3.121-3.122A.5.5 0 009.379 6H6.5a.5.5 0 00-.5.5v1z" />
                  </svg>
                )}
              </button>
            )}

            {!isUser && !message.isError && browserSupportsSpeechSynthesis && message.text && (
              <button
                onClick={handleToggleSpeech}
                className={`p-1 rounded-full transition-colors duration-200
                  ${isSpeaking ? 'bg-red-600 hover:bg-red-700' : 'bg-sky-600 hover:bg-sky-500'}
                   text-white shadow-md`}
                aria-label={isSpeaking ? `Stop speaking ${message.name}'s message` : `Speak ${message.name}'s message`}
              >
                {isSpeaking ? ( 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5z" />
                  </svg>
                ) : ( 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"> 
                    <path d="M9.492 3.162A2.5 2.5 0 006.3 4.75L4.75 6.3H2.5A.75.75 0 001.75 7.5v5a.75.75 0 00.75.75H4.75l1.55 1.55a2.5 2.5 0 003.192 1.588A8.023 8.023 0 0012.75 10a8.023 8.023 0 00-3.258-6.838z" />
                    <path d="M14.121 6.379a.75.75 0 10-1.06 1.06L13.5 8.879a3.001 3.001 0 010 2.242l-.439.439a.75.75 0 001.06 1.061l.44-.44a4.501 4.501 0 000-3.364l-.44-.439zM15.51 4.22a.75.75 0 00-1.06 1.061l.438.439a6.001 6.001 0 010 8.56l-.439.44a.75.75 0 101.06 1.06l.439-.439a7.501 7.501 0 000-10.721l-.438-.44z" />
                  </svg>
                )}
              </button>
            )}
          </div> {/* End Action Buttons Area */}
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;
