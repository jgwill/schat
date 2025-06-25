
import React, { useState, useCallback, useEffect, useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import CameraModal from './CameraModal'; 

interface ChatInputProps {
  onSendMessage: (
    message: string, 
    imageData?: { base64ImageData: string, imageMimeType: string, fileName?: string },
    audioData?: { audioDataUrl: string, audioMimeType: string }
  ) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = React.memo(({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; dataUrl: string; base64Data: string } | null>(null);
  
  // Audio Recording State
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [audioRecordingStartTime, setAudioRecordingStartTime] = useState<number | null>(null);
  const [audioRecordingDuration, setAudioRecordingDuration] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<{ dataUrl: string; mimeType: string; blob: Blob } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  // Fix: Changed NodeJS.Timeout to number for browser compatibility
  const audioTimerIntervalRef = useRef<number | null>(null);


  const fileInputRef = useRef<HTMLInputElement>(null);
  const textBeforeSpeechStartRef = useRef<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null); 

  const {
    isListening,
    transcript, 
    startListening, 
    stopListening, 
    error: speechError, 
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    if (isListening) {
        const base = textBeforeSpeechStartRef.current;
        let combinedText = base;
        if (transcript && transcript.length > 0) {
            combinedText = base ? base + ' ' + transcript : transcript;
        }
        setInputValue(combinedText);
    }
  }, [transcript, isListening]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [inputValue]);


  const handleSubmit = useCallback((e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const textToSend = inputValue.trim();
    
    let fileDataToSend;
    if (selectedFile) {
        fileDataToSend = {
            base64ImageData: selectedFile.base64Data,
            imageMimeType: selectedFile.type,
            fileName: selectedFile.name,
        };
    }

    let audioDataToSend;
    if (recordedAudio) {
        audioDataToSend = {
            audioDataUrl: recordedAudio.dataUrl,
            audioMimeType: recordedAudio.mimeType,
        };
    }

    if ((textToSend || fileDataToSend || audioDataToSend) && !isLoading) {
      onSendMessage(textToSend, fileDataToSend, audioDataToSend);
      setInputValue('');
      setSelectedFile(null);
      setRecordedAudio(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      resetTranscript(); 
      textBeforeSpeechStartRef.current = ''; 
      if(isListening) stopListening();
      if (textareaRef.current) { 
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [inputValue, isLoading, onSendMessage, resetTranscript, selectedFile, recordedAudio, isListening, stopListening]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSpeechToTextMicClick = () => {
    if (isAudioRecording) return; // Prevent if audio message recording is active
    if (isListening) {
      stopListening();
    } else {
      textBeforeSpeechStartRef.current = inputValue; 
      startListening(); 
    }
  };

  const handleSendImageFromModal = (base64ImageData: string, imageMimeType: string) => {
    const cameraFileName = `capture_${new Date().toISOString()}.jpg`;
    onSendMessage(inputValue.trim(), { base64ImageData, imageMimeType, fileName: cameraFileName });
    setInputValue(''); 
    setSelectedFile(null); 
    setRecordedAudio(null);
    textBeforeSpeechStartRef.current = '';
    resetTranscript();
    setIsCameraModalOpen(false);
     if (textareaRef.current) { 
        textareaRef.current.style.height = 'auto';
      }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, GIF, WebP).');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setSelectedFile({
          name: file.name,
          type: file.type,
          dataUrl: dataUrl,
          base64Data: dataUrl.split(',')[1], 
        });
        setRecordedAudio(null); // Clear any recorded audio if a file is selected
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
  };

  const startAudioRecording = async () => {
    if (isListening) stopListening(); // Stop speech-to-text if active
    setSelectedFile(null); // Clear any selected file

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Convert Blob to base64 Data URL for persistent storage in Message
            const reader = new FileReader();
            reader.onloadend = () => {
                setRecordedAudio({
                    dataUrl: reader.result as string,
                    mimeType: audioBlob.type,
                    blob: audioBlob // Keep blob for local preview if needed, URL.createObjectURL is temporary
                });
            };
            reader.readAsDataURL(audioBlob);

            stream.getTracks().forEach(track => track.stop()); // Stop microphone tracks
            if (audioTimerIntervalRef.current) clearInterval(audioTimerIntervalRef.current);
        };

        mediaRecorderRef.current.start();
        setIsAudioRecording(true);
        setAudioRecordingStartTime(Date.now());
        setAudioRecordingDuration(0);
        audioTimerIntervalRef.current = window.setInterval(() => {
            setAudioRecordingDuration(prev => prev + 1);
        }, 1000);

    } catch (err) {
        console.error("Error starting audio recording:", err);
        alert("Could not start audio recording. Please ensure microphone access is allowed.");
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isAudioRecording) {
        mediaRecorderRef.current.stop();
        setIsAudioRecording(false);
        if (audioTimerIntervalRef.current) clearInterval(audioTimerIntervalRef.current);
    }
  };

  const handleAudioRecordButtonClick = () => {
    if (isAudioRecording) {
        stopAudioRecording();
    } else {
        startAudioRecording();
    }
  };
  
  const discardRecordedAudio = () => {
    setRecordedAudio(null);
    setAudioRecordingDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
  return (
    <>
      <form onSubmit={handleSubmit} className="bg-gpt-light p-3 sm:p-4 border-t border-gpt-gray sticky bottom-0 w-full">
        {(selectedFile || recordedAudio) && (
          <div className="mb-2 p-2 bg-gpt-gray rounded-md flex items-center justify-between text-sm text-gpt-text">
            <div className="flex items-center overflow-hidden">
              {selectedFile && selectedFile.type.startsWith('image/') && (
                  <img src={selectedFile.dataUrl} alt="Preview" className="w-10 h-10 mr-2 rounded object-cover"/>
              )}
              {recordedAudio && (
                <div className="mr-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-sky-400 mr-1">
                        <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" />
                        <path d="M5.5 8.5A.5.5 0 016 8h1.146a.5.5 0 000-1H6a.5.5 0 01-.5-.5V4.653a2.502 2.502 0 00-1.5-.486V4a3 3 0 013-3h2a3 3 0 013 3v.167a2.502 2.502 0 00-1.5.486V7.5a.5.5 0 01-.5.5H14a.5.5 0 000 1h.146A3.502 3.502 0 0117.5 12v.097a3.5 3.5 0 01-3.422 3.473l-.05.002-.032.001h-.032A3.5 3.5 0 0110.5 19h-.47A3.5 3.5 0 016.5 16v-.5a.5.5 0 01.5-.5h1.53a.5.5 0 000-1H6.5a1.5 1.5 0 01-1.5-1.5V12A3.5 3.5 0 015.5 8.5zM16 12a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0z" />
                    </svg>
                    <audio src={recordedAudio.dataUrl} controls className="h-8 max-w-[150px] sm:max-w-xs"></audio>
                    <span className="ml-2 text-gray-400 text-xs">({formatDuration(audioRecordingDuration)})</span>
                </div>
              )}
              {selectedFile && (
                <>
                  <span className="truncate" title={selectedFile.name}>{selectedFile.name}</span>
                  <span className="ml-2 text-gray-400 text-xs">({selectedFile.type})</span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={selectedFile ? clearSelectedFile : discardRecordedAudio}
              className="p-1 text-gray-400 hover:text-white rounded-full"
              aria-label={selectedFile ? "Clear selected file" : "Discard recorded audio"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex items-end bg-gpt-gray rounded-lg p-1.5 sm:p-2 shadow-sm">
          {browserSupportsSpeechRecognition && (
            <button
              type="button"
              onClick={handleSpeechToTextMicClick}
              disabled={isLoading || isAudioRecording} 
              className={`p-2 rounded-md text-white transition-colors duration-200 ease-in-out mr-1 sm:mr-1 self-center
                ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                              : (isAudioRecording ? 'bg-gray-500 opacity-50 cursor-not-allowed' : 'bg-brand-secondary hover:bg-brand-primary')}`}
              aria-label={isListening ? "Stop speech-to-text" : "Start speech-to-text"}
            >
              {isListening ? ( /* Stop Icon */
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M5 3.75a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V4.5a.75.75 0 01.75-.75zM14.25 3.75a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V4.5a.75.75 0 01.75-.75z" /></svg>
              ) : ( /* Speech-to-text Mic Icon */
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" /><path d="M5.5 8.5A.5.5 0 016 8h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" /><path d="M9 12.5a.5.5 0 001 0V11a.5.5 0 00-1 0v1.5z" /><path d="M3 8a1 1 0 000 2h1v2a1 1 0 102 0V9.5A.5.5 0 018.5 9H10a.5.5 0 000-1H8.5A1.5 1.5 0 007 6.5V6a.5.5 0 00-1 0v.5A.5.5 0 015.5 7H5a.5.5 0 00-.5.5V8zm12-1a.5.5 0 00-.5.5V8h-.5a.5.5 0 000 1H12a.5.5 0 00.5-.5V7A1.5 1.5 0 0011 5.5V5a.5.5 0 00-1 0v.5A.5.5 0 019.5 6H9a.5.5 0 000 1h.5A.5.5 0 0110.5 7.5v3a1 1 0 102 0V10h1a1 1 0 000-2z" /></svg>
              )}
            </button>
          )}
           {/* Audio Record Button */}
          <button
            type="button"
            onClick={handleAudioRecordButtonClick}
            disabled={isLoading || isListening}
            className={`p-2 rounded-md text-white transition-colors duration-200 ease-in-out mr-1 sm:mr-1 self-center
              ${isAudioRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                                 : (isListening ? 'bg-gray-500 opacity-50 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600')}`}
            aria-label={isAudioRecording ? "Stop audio message recording" : "Record audio message"}
          >
            {isAudioRecording ? ( /* Stop Icon */
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5z" /></svg>
            ) : ( /* Audio Record Mic Icon (different from STT mic) */
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M3 4a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H3zm12.5 6.25a.75.75 0 01-.75.75H5.25a.75.75 0 010-1.5h9.5a.75.75 0 01.75.75z" />
              </svg>
            )}
          </button>
          {isAudioRecording && (
            <span className="text-xs text-red-400 self-center ml-1 mr-1">{formatDuration(audioRecordingDuration)}</span>
          )}

          <button
            type="button"
            onClick={() => setIsCameraModalOpen(true)}
            disabled={isLoading || isAudioRecording || isListening}
            className={`p-2 rounded-md text-white transition-colors duration-200 ease-in-out mr-1 sm:mr-1 self-center
              ${isLoading || isAudioRecording || isListening ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-teal-500 hover:bg-teal-600'}`}
            aria-label="Open camera to capture image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M1.5 6A2.5 2.5 0 014 3.5h12A2.5 2.5 0 0118.5 6v8a2.5 2.5 0 01-2.5 2.5H4A2.5 2.5 0 011.5 14V6zm14.5-1a1 1 0 00-1-1H4a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V6zM5 9.25a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
              <path d="M9.75 3.5a.75.75 0 00-1.5 0V5h1.5V3.5zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif"
            aria-label="Upload file"
            disabled={isAudioRecording || isListening}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isAudioRecording || isListening}
            className={`p-2 rounded-md text-white transition-colors duration-200 ease-in-out mr-1 sm:mr-1 self-center
              ${isLoading || isAudioRecording || isListening ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-indigo-500 hover:bg-indigo-600'}`}
            aria-label="Attach file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 117.44 12.56l3.45-3.554a.75.75 0 011.06 1.06l-3.45 3.554a1.125 1.125 0 001.591 1.591l3.455-3.553a3 3 0 000-4.242z" clipRule="evenodd" />
            </svg>
          </button>
          <textarea
            ref={textareaRef} 
            value={inputValue}
            onChange={(e) => {
                if(!isListening && !isAudioRecording) { 
                    setInputValue(e.target.value);
                }
            }}
            onKeyDown={handleKeyDown}
            placeholder={
                isListening ? "Listening for speech-to-text..." 
                : isAudioRecording ? "Recording audio message..." 
                : "Type, speak, or attach file..."
            }
            className="flex-grow p-2 bg-transparent text-gpt-text focus:outline-none resize-none min-h-[2.5rem] sm:min-h-[2.8rem] max-h-48 overflow-y-auto" 
            rows={1}
            readOnly={isListening || isAudioRecording} 
            aria-label="Chat message input"
            style={{ lineHeight: '1.5rem' }} 
          />
          <button
            type="submit"
            disabled={isLoading || (!inputValue.trim() && !selectedFile && !recordedAudio) || isAudioRecording }
            className={`ml-1 sm:ml-2 p-2 rounded-md text-white transition-colors duration-200 ease-in-out self-center
              ${isLoading || (!inputValue.trim() && !selectedFile && !recordedAudio) || isAudioRecording ? 'bg-gray-600 cursor-not-allowed' : 'bg-brand-secondary hover:bg-brand-primary focus:ring-2 focus:ring-blue-400'}`}
            aria-label="Send message"
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M3.105 3.105a.5.5 0 01.707 0L19.5 18.293V13.5a.5.5 0 011 0v6a.5.5 0 01-.5.5h-6a.5.5 0 010-1h4.793L3.105 3.812a.5.5 0 010-.707z" />
              </svg>
            )}
          </button>
        </div>
        {speechError && <p className="text-xs text-red-400 mt-1 text-center">{speechError}</p>}
        {!browserSupportsSpeechRecognition && !speechError && ( 
          <p className="text-xs text-yellow-400 mt-1 text-center">
            Voice input is not supported by your browser. Try Chrome or Edge.
          </p>
        )}
      </form>
      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onSendImage={handleSendImageFromModal}
      />
    </>
  );
});

export default ChatInput;
