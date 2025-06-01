
import React from 'react';
import { Message, Sender } from '../types';
import { USER_AVATAR_SVG } from '../constants'; 
import MarkdownRenderer from './MarkdownRenderer';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';

interface ChatMessageProps {
  message: Message;
  // isFirstMessage?: boolean; // Optional prop - REMOVED as it's not used
}

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message }) => {
  const isUser = message.sender === Sender.User;
  const { speak, cancel, isSpeaking, browserSupportsSpeechSynthesis } = useSpeechSynthesis();

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
      speak(message.text);
    }
  };
  
  const bubbleBgClass = isUser 
    ? 'bg-sky-700' 
    : message.isError 
      ? 'bg-red-700' // Error message background
      : (message.aiBubbleClassName || 'bg-ai-bubble');

  return (
    <div className={`flex my-2 ${isUser ? 'justify-end' : 'justify-start'}`}> {/* Removed style={{ paddingTop: '24px' }} */}
      <div className={`flex items-start max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 mt-1 ${isUser ? 'ml-2' : 'mr-2'}`}>
          <Avatar 
            avatarSrc={isUser ? USER_AVATAR_SVG : message.avatar} // message.avatar for AI is now persona.avatarPath
            alt={`${message.name} avatar`} 
            isSvg={isUser} 
          />
        </div>
        
        <div
          className={`px-4 py-3 rounded-lg shadow-md relative text-white break-words ${bubbleBgClass}`}
        >
          {/* Removed conditional line rendering based on isFirstMessage as it was not used */}

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

          {!isUser && !message.isError && browserSupportsSpeechSynthesis && message.text && (
            <button
              onClick={handleToggleSpeech}
              className={`absolute -bottom-2 -right-2 p-1 rounded-full transition-colors duration-200
                ${isSpeaking ? 'bg-red-600 hover:bg-red-700' : 'bg-sky-600 hover:bg-sky-500'}
                 text-white shadow-md`}
              aria-label={isSpeaking ? `Stop speaking ${message.name}'s message` : `Speak ${message.name}'s message`}
            >
              {isSpeaking ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M5 3.75a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V4.5a.75.75 0 01.75-.75zM14.25 3.75a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V4.5a.75.75 0 01.75-.75z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M6.75 8.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" />
                  <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6.5a.75.75 0 01.75.75v11.5a.75.75 0 01-1.5 0V4.25a.75.75 0 01.75-.75z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;
