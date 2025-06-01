import { useState, useEffect, useCallback } from 'react';

// Function to clean markdown syntax from text before speech synthesis
const cleanTextForSpeech = (text: string): string => {
  return text
    // Remove markdown headers (# ## ###)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markers (* ** _)
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    // Remove code blocks (``` and `)
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`(.+?)`/g, '$1')
    // Remove links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove horizontal rules (---)
    .replace(/^---+$/gm, '')
    // Remove blockquotes (>)
    .replace(/^>\s+/gm, '')
    // Remove list markers (- * +)
    .replace(/^[\s]*[-\*\+]\s+/gm, '')
    // Remove numbered lists (1. 2.)
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove extra whitespace and newlines
    .replace(/\n\s*\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();
};

interface SpeechSynthesisHook {
  speak: (text: string) => void;
  cancel: () => void;
  isSpeaking: boolean;
  browserSupportsSpeechSynthesis: boolean;
  error: string | null;
}

const useSpeechSynthesis = (): SpeechSynthesisHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const browserSupportsSpeechSynthesis = 'speechSynthesis' in window;

  useEffect(() => {
    if (!browserSupportsSpeechSynthesis) {
      setError('Speech synthesis is not supported by this browser.');
      return;
    }
    
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance();
    
    u.lang = 'en-US';
    u.pitch = 1;
    u.rate = 1;
    u.volume = 1;

    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = (event) => {
      setError(`Speech synthesis error: ${event.error}`);
      setIsSpeaking(false);
    };
    
    setUtterance(u);

    return () => {
      synth.cancel(); // Cancel any ongoing speech when component unmounts or hook re-runs
    };
  }, [browserSupportsSpeechSynthesis]);

  const speak = useCallback((text: string) => {
    if (!browserSupportsSpeechSynthesis || !utterance) {
      setError('Speech synthesis not available or utterance not initialized.');
      return;
    }
    
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel(); // Cancel current speech before starting new one
    }
    
    // Clean the text from markdown syntax before passing to the utterance
    const cleanText = cleanTextForSpeech(text);
    utterance.text = cleanText;
    synth.speak(utterance);
  }, [utterance, browserSupportsSpeechSynthesis]);

  const cancel = useCallback(() => {
    if (!browserSupportsSpeechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [browserSupportsSpeechSynthesis]);

  return {
    speak,
    cancel,
    isSpeaking,
    browserSupportsSpeechSynthesis,
    error,
  };
};

export default useSpeechSynthesis;
