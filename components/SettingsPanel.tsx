
import React, { useState, useEffect } from 'react';
import { AVAILABLE_MODELS, GEMINI_TEXT_MODEL } from '../constants';
import LoadingSpinner from './LoadingSpinner';
import { SettingsPanelProps, ToastType } from '../types'; // Ensure this is imported if not already

const SettingsPanel: React.FC<SettingsPanelProps> = React.memo(({
  isOpen,
  onClose,
  onClearChat,
  onSaveLocalSession,
  onLoadLocalSession,
  onSaveToCloud,
  onLoadFromCloud,
  onDeleteFromCloud,
  availableCloudSessions,
  currentCloudSessionId,
  isLoading,
  selectedModel,
  onModelChange,
  addToast, // Added prop
}) => {
  const [cloudSessionIdInput, setCloudSessionIdInput] = useState<string>(currentCloudSessionId || '');
  const [modelInput, setModelInput] = useState<string>(selectedModel);

  useEffect(() => {
    setCloudSessionIdInput(currentCloudSessionId || '');
    setModelInput(selectedModel);
  }, [isOpen, currentCloudSessionId, selectedModel]);


  const handleSaveModel = () => {
    const trimmedModelInput = modelInput.trim();
    if (!trimmedModelInput) {
        addToast("Model ID cannot be empty. Reverting to current model.", ToastType.Warning);
        setModelInput(selectedModel || GEMINI_TEXT_MODEL); 
        return;
    }
    if (trimmedModelInput !== selectedModel) {
        onModelChange(trimmedModelInput); // App.tsx will show success toast
    } else {
        addToast("Model ID hasn't changed from the current active model.", ToastType.Info);
    }
  };
  
  const handleCloudSessionAction = async (action: 'save' | 'load' | 'delete') => {
    if (!cloudSessionIdInput.trim()) { 
        addToast("Please enter or select a Cloud Session ID.", ToastType.Warning);
        return;
    }
    const idToUse = cloudSessionIdInput.trim();

    // Confirmation for delete action
    if (action === 'delete') {
        if (!confirm(`Are you sure you want to delete cloud session "${idToUse}"? This cannot be undone.`)) {
            return;
        }
    }


    switch(action) {
        case 'save':
            await onSaveToCloud(idToUse); // App.tsx will show toast
            break;
        case 'load':
            await onLoadFromCloud(idToUse); // App.tsx will show toast
            break;
        case 'delete':
            await onDeleteFromCloud(idToUse); // App.tsx will show toast
            if(cloudSessionIdInput === idToUse) setCloudSessionIdInput(''); // Clear input if deleted session was active in input
            break;
    }
  };


  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-40 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-md bg-gpt-light shadow-xl p-6 z-50 transform transition-transform duration-300 ease-in-out translate-x-0 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {/* Local Session Management */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">Local Session</h3>
            <div className="space-y-3">
              <button onClick={onSaveLocalSession} disabled={isLoading} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50">Save Locally</button>
              <button onClick={onLoadLocalSession} disabled={isLoading} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50">Load Locally</button>
            </div>
          </div>

          {/* Cloud Session Management (Simulated) */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">Cloud Storage (Simulated)</h3>
            <div className="space-y-3">
              <input 
                type="text"
                placeholder="Enter Cloud Session ID"
                value={cloudSessionIdInput}
                onChange={(e) => setCloudSessionIdInput(e.target.value)}
                className="w-full p-2.5 bg-gpt-gray text-gpt-text rounded-md border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary"
                disabled={isLoading}
              />
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleCloudSessionAction('save')} disabled={isLoading || !cloudSessionIdInput.trim()} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50">
                  {isLoading ? <LoadingSpinner/> : "Save to Cloud"}
                </button>
                <button onClick={() => handleCloudSessionAction('load')} disabled={isLoading || !cloudSessionIdInput.trim()} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50">
                  {isLoading ? <LoadingSpinner/> : "Load from Cloud"}
                </button>
              </div>
               {availableCloudSessions.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-400 mb-1">Available cloud sessions:</p>
                  <ul className="max-h-32 overflow-y-auto bg-gpt-gray p-2 rounded-md border border-gray-600 space-y-1">
                    {availableCloudSessions.map(sid => (
                      <li key={sid} className="flex justify-between items-center">
                        <button 
                            onClick={() => setCloudSessionIdInput(sid)}
                            className="text-sm text-sky-400 hover:text-sky-300 flex-grow text-left"
                            disabled={isLoading}
                            title={`Use session ID: ${sid}`}
                        >
                            {sid}{currentCloudSessionId === sid && <span className="text-green-400 ml-2">(active)</span>}
                        </button>
                        <button 
                            onClick={() => {
                                // Set input first to ensure the correct ID is used by handleCloudSessionAction
                                setCloudSessionIdInput(sid); 
                                // Action now relies on the state of cloudSessionIdInput, which might not update immediately.
                                // So, pass sid directly to action handler if it's specific to this button click.
                                // However, to keep handleCloudSessionAction generic:
                                // 1. Set state
                                // 2. Call action (it will use the state)
                                // For delete, we need to ensure the correct ID is acted upon, so a temporary direct pass might be better
                                // but for consistency, we rely on state, so user sees what is being acted on.
                                // The current structure of handleCloudSessionAction uses cloudSessionIdInput.
                                handleCloudSessionAction('delete');
                            }}
                            className="text-xs text-red-500 hover:text-red-400 p-1"
                            disabled={isLoading || !sid} // disable if sid somehow empty
                            title={`Delete cloud session: ${sid}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.71l.5 6.5a.75.75 0 1 1-1.498.116l-.5-6.5A.75.75 0 0 1 6.05 6Zm3.902 0a.75.75 0 0 1 .712.787l-.5 6.5a.75.75 0 1 1-1.498-.116l.5-6.5A.75.75 0 0 1 9.95 6Z" clipRule="evenodd" /></svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* AI Model Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">AI Model (Gemini)</h3>
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={modelInput}
                    onChange={(e) => setModelInput(e.target.value)}
                    placeholder="e.g., gemini-2.5-flash-preview-04-17 or tunedModels/your-model"
                    className="flex-grow p-2.5 bg-gpt-gray text-gpt-text rounded-md border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary"
                    aria-label="Enter Gemini Model ID"
                    disabled={isLoading}
                />
                <button 
                    onClick={handleSaveModel}
                    disabled={isLoading || modelInput.trim() === selectedModel || modelInput.trim() === ''}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
                >
                    {isLoading ? <LoadingSpinner /> : "Set"}
                </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Enter the full model ID. Currently: <strong>{selectedModel}</strong>.
              <br />Suggestions:
            </p>
            <ul className="text-xs text-gray-500 list-disc list-inside mt-1">
                {AVAILABLE_MODELS.map(m => <li key={m.id}>{m.name} ({m.id})</li>)}
                <li>tunedModels/your-tuned-model-id</li>
            </ul>
          </div>
           {/* Clear Chat */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">Danger Zone</h3>
             <button onClick={onClearChat} disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50">Clear Current Chat</button>
          </div>

        </div>
        
        <div className="mt-auto pt-6 border-t border-gpt-gray">
            <p className="text-xs text-gray-500 text-center">Mia's Gem Chat Studio v0.4.0</p>
        </div>
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #202123; // gpt-dark
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #444654; // gpt-gray
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555869;
          }
        `}</style>
      </div>
    </div>
  );
});

export default SettingsPanel;
