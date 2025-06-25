
import React from 'react';
import { Persona } from '../types';

interface PersonaSelectorBarProps {
  personas: Persona[];
  activePersonaId: string;
  onSelectPersona: (personaId: string) => void;
  isLoading: boolean;
}

const PersonaSelectorBar: React.FC<PersonaSelectorBarProps> = React.memo(({ personas, activePersonaId, onSelectPersona, isLoading }) => {
  return (
    <div 
      className="bg-gpt-light pt-1 pb-3 px-3 border-b border-gpt-gray sticky top-[52px] z-10 shadow-sm" // Changed from top-[56px] to top-[52px]
      role="radiogroup"
      aria-label="Choose your AI Friend"
    >
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center sm:justify-start gap-2 items-center">
        {/* <p className="text-sm text-gray-300 mr-3 hidden sm:block">AI Friend:</p> */}
        {personas.map((persona) => (
          <button
            key={persona.id}
            onClick={() => onSelectPersona(persona.id)}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out border-2 flex items-center space-x-1.5 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gpt-light
              ${activePersonaId === persona.id
                ? `${persona.color.replace('bg-', 'border-').replace('-500', '-400')} ${persona.color} text-white shadow-md ring-2 ${persona.color.replace('bg-','ring-')}`
                : `bg-gpt-gray border-transparent text-gray-300 hover:border-gray-500 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none`}
            `}
            role="radio"
            aria-checked={activePersonaId === persona.id}
            aria-label={`Select ${persona.name.substring(persona.glyph.length).trim()} persona`}
          >
            <span className="text-base sm:text-lg" aria-hidden="true">{persona.glyph}</span>
            <span className="hidden sm:inline">{persona.name.substring(persona.glyph.length).trim()}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

export default PersonaSelectorBar;