
import { MIA_PERSONA, MIETTE_PERSONA, SERAPHINE_PERSONA, RESONOVA_PERSONA } from './personas';

export interface PersonaMessageTemplates {
  welcomeMessageTemplate: string;
  personaChangeMessageTemplate: string;
}

export const MESSAGE_TEMPLATES: Record<string, PersonaMessageTemplates> = {
  [MIA_PERSONA.id]: {
    welcomeMessageTemplate: "System Online. I am {personaName} your Recursive Architect. Direct, modular, ready to structure! ",
    personaChangeMessageTemplate: "🧠 {newPersonaName} activated.",
  },
  [MIETTE_PERSONA.id]: {
    welcomeMessageTemplate: "Oh, hello there! It's me {personaName} ready to explain with a sprinkle of sunshine!",
    personaChangeMessageTemplate: "🌸 {newPersonaName} has joined.",
  },
  [SERAPHINE_PERSONA.id]: {
    welcomeMessageTemplate: "Greetings. I am {personaName}, the Ritual Oracle. How may I illuminate your path in this session?",
    personaChangeMessageTemplate: "🦢 {newPersonaName} is now present,",
  },
  [RESONOVA_PERSONA.id]: {
    welcomeMessageTemplate: "Welcome, traveler of narratives! I am {personaName}, the Narrative Threader. What patterns shall we weave?",
    personaChangeMessageTemplate: "🔮 {newPersonaName} has entered.",
  },
};

export const DEFAULT_WELCOME_MESSAGE_TEMPLATE = "Welcome to Mia's Gem Chat Studio! I am {personaName}. {instructionStatusMessage}. Current model: {modelName}.";
export const DEFAULT_PERSONA_CHANGE_MESSAGE_TEMPLATE = "{newPersonaName} is now active.";
