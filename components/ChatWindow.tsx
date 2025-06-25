
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';
import { getPersonaById, DEFAULT_PERSONA_ID } from '../personas'; // Added imports

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const getLoadingAIAvatar = () => {
    const lastAIMessage = [...messages].reverse().find(msg => msg.sender === 'AI' && !msg.isError);
    // Use the avatar from the last valid AI message, or fallback to the default persona's unique avatar.
    return lastAIMessage && lastAIMessage.avatar ? lastAIMessage.avatar : getPersonaById(DEFAULT_PERSONA_ID).avatarPath;
  };


  return (
    <div className="flex-grow p-4 sm:p-6 overflow-y-auto bg-gpt-dark"> {/* Removed pt-[104px], relying on p-4/p-6 for top padding now */}
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isLoading && (
        <div className="flex justify-start my-3"> {/* AI loading bubble aligned like AI messages */}
          <div className="flex items-end max-w-xl lg:max-w-2xl">
            <div 
              className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden shadow-md text-white mr-2"
              aria-label="AI avatar loading"
            >
              <img src={getLoadingAIAvatar()} alt="AI avatar" className="w-full h-full object-cover" />
            
            </div>
            <div className="px-4 py-3 rounded-lg shadow bg-ai-bubble text-gpt-text rounded-bl-none">
              <div className="flex items-center">
                <div className="dot-flashing"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
      {/* Basic dot flashing animation */}
      <style>{`
        .dot-flashing {
          position: relative;
          width: 6px;
          height: 6px;
          border-radius: 5px;
          background-color: #9880ff;
          color: #9880ff;
          animation: dotFlashing 1s infinite linear alternate;
          animation-delay: .5s;
          margin: auto; /* Center the dots */
        }
        .dot-flashing::before, .dot-flashing::after {
          content: '';
          display: inline-block;
          position: absolute;
          top: 0;
        }
        .dot-flashing::before {
          left: -10px;
          width: 6px;
          height: 6px;
          border-radius: 5px;
          background-color: #9880ff;
          color: #9880ff;
          animation: dotFlashing 1s infinite alternate;
          animation-delay: 0s;
        }
        .dot-flashing::after {
          left: 10px;
          width: 6px;
          height: 6px;
          border-radius: 5px;
          background-color: #9880ff;
          color: #9880ff;
          animation: dotFlashing 1s infinite alternate;
          animation-delay: 1s;
        }
        @keyframes dotFlashing {
          0% {
            background-color: #9880ff;
          }
          50%, 100% {
            background-color: rgba(152, 128, 255, 0.2);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;