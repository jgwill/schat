
import React, { useState, useEffect, useCallback } from 'react';
import { Persona, DashboardPageProps, ToastType } from '../types'; // Updated import
import MarkdownRenderer from './MarkdownRenderer';
import { getEffectiveSystemInstruction } from '../personas'; 
import LoadingSpinner from './LoadingSpinner'; 

const PersonaEditor: React.FC<{
    persona: Persona;
    currentInstruction: string;
    onSave: (instruction: string) => void;
    onReset: () => void;
    onCancel: () => void;
}> = React.memo(({ persona, currentInstruction, onSave, onReset, onCancel }) => {
    const [editText, setEditText] = useState(currentInstruction);

    useEffect(() => {
        setEditText(currentInstruction);
    }, [currentInstruction]);

    return (
        <div className="mt-4 p-4 bg-gpt-dark rounded-md border border-gpt-gray">
            <h4 className="text-lg font-semibold text-gray-200 mb-2">Edit Instructions for {persona.name}</h4>
            <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={8}
                className="w-full p-2 bg-gray-700 text-gpt-text rounded-md border border-gray-600 focus:ring-brand-secondary focus:border-brand-secondary"
                aria-label={`System instructions for ${persona.name}`}
            />
            <div className="mt-3 flex flex-wrap gap-2 justify-end">
                <button
                    onClick={() => onSave(editText)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
                >
                    Save Instructions
                </button>
                <button
                    onClick={onReset}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm transition-colors"
                >
                    Reset to Default
                </button>
                 <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
});


const DashboardPage: React.FC<DashboardPageProps> = React.memo(({ 
    personas, 
    activePersonaId, 
    customPersonaInstructions,
    onSelectPersona, 
    onUpdateInstruction,
    onResetInstruction,
    // New props for Application Settings
    selectedModel,
    currentCloudSessionId,
    availableCloudSessions,
    isLoading,
    onSaveToCloud,
    onOpenSettings,
    addToast // Added prop
}) => {
  const [editingPersonaId, setEditingPersonaId] = useState<string | null>(null);

  const handleQuickSaveToCloud = useCallback(async () => {
    let sessionIdToUse = currentCloudSessionId;
    if (!sessionIdToUse) {
        const newId = window.prompt("Enter a Session ID for this Quick Cloud Save:", `session-${Date.now()}`);
        if (newId && newId.trim()) {
            sessionIdToUse = newId.trim();
        } else {
            addToast("Quick Save cancelled: No Session ID provided.", ToastType.Warning);
            return;
        }
    }
    if (sessionIdToUse) {
        await onSaveToCloud(sessionIdToUse); // App.tsx's onSaveToCloud will show success/error toast
    }
  }, [currentCloudSessionId, onSaveToCloud, addToast]);


  return (
    <div className="flex-grow p-6 overflow-y-auto bg-gpt-dark text-gpt-text">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Application Dashboard</h1>

        {/* Persona Management Section (existing) */}
        <section id="persona-management" className="mb-12 p-6 bg-gpt-light rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-6 text-white border-b border-gpt-gray pb-3">Persona Management</h2>
          <p className="text-gray-400 mb-6">Select an active persona or customize their system instructions. Changes to instructions for the active persona will reset the chat.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personas.map((persona) => {
              const effectiveInstruction = getEffectiveSystemInstruction(persona.id, customPersonaInstructions);
              const isCustom = effectiveInstruction !== persona.systemInstruction;

              return (
              <div
                key={persona.id}
                className={`p-6 rounded-lg shadow-md transition-all duration-200 ease-in-out border-2 
                            ${activePersonaId === persona.id 
                              ? 'bg-brand-primary border-brand-secondary ring-2 ring-brand-secondary' 
                              : 'bg-gpt-gray border-transparent hover:border-brand-secondary focus-within:border-brand-secondary'}`}
              >
                <div className="flex items-center mb-3">
                  <div 
                    className={`w-10 h-10 rounded-full mr-4 flex items-center justify-center text-xl font-bold text-white shadow-md ${persona.color}`}
                    aria-label={`${persona.name} glyph avatar`}
                  >
                    {persona.glyph}
                  </div>
                  <h3 
                    className={`text-2xl font-semibold cursor-pointer ${activePersonaId === persona.id ? 'text-white' : 'text-gray-100'}`}
                    onClick={() => onSelectPersona(persona.id)}
                    onKeyPress={(e) => e.key === 'Enter' && onSelectPersona(persona.id)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={activePersonaId === persona.id}
                    title={`Activate ${persona.name}`}
                  >
                    {persona.name}
                  </h3>
                </div>
                <p className={`text-sm mb-1 ${activePersonaId === persona.id ? 'text-gray-200' : 'text-gray-400'}`}>{persona.description}</p>
                {isCustom && <p className="text-xs text-yellow-400 mb-3">(Custom instructions active)</p>}
                {activePersonaId === persona.id && (
                  <p className="mb-3 text-xs font-semibold text-green-300">Currently Active</p>
                )}

                {editingPersonaId === persona.id ? (
                    <PersonaEditor
                        persona={persona}
                        currentInstruction={effectiveInstruction}
                        onSave={(newInstruction) => {
                            onUpdateInstruction(persona.id, newInstruction);
                            setEditingPersonaId(null);
                        }}
                        onReset={() => {
                            onResetInstruction(persona.id);
                        }}
                        onCancel={() => setEditingPersonaId(null)}
                    />
                ) : (
                    <button
                        onClick={() => setEditingPersonaId(persona.id)}
                        className="mt-3 w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-sm text-white rounded-md transition-colors"
                    >
                        Edit Instructions
                    </button>
                )}
              </div>
            )})}
          </div>
        </section>

        {/* Application Settings Section (New) */}
        <section id="application-settings" className="mb-12 p-6 bg-gpt-light rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-6 text-white border-b border-gpt-gray pb-3">Application Settings</h2>
          
          {/* AI Model Configuration */}
          <div className="mb-8">
            <h3 className="text-xl font-medium text-gray-200 mb-2">AI Model Configuration</h3>
            <p className="text-gray-400 mb-1">Current Active Model: <strong className="text-sky-400">{selectedModel}</strong></p>
            <button 
              onClick={onOpenSettings}
              disabled={isLoading}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors disabled:opacity-50"
            >
              Change Model in Settings
            </button>
          </div>

          {/* Cloud Storage (Simulated) */}
          <div className="mb-8">
            <h3 className="text-xl font-medium text-gray-200 mb-3">Cloud Session Storage (Simulated)</h3>
            <p className="text-gray-400 mb-1">
              Current Active Cloud Session ID: <strong className="text-sky-400">{currentCloudSessionId || 'None'}</strong>
            </p>
            <div className="my-3 space-x-2">
                <button
                    onClick={handleQuickSaveToCloud}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors disabled:opacity-50 flex items-center justify-center"
                    style={{ minWidth: '180px' }} 
                >
                    {isLoading ? <LoadingSpinner /> : "Quick Save Chat to Cloud"}
                </button>
                <button
                    onClick={onOpenSettings}
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm transition-colors disabled:opacity-50"
                >
                    Manage All Cloud Sessions
                </button>
            </div>
            {availableCloudSessions && availableCloudSessions.length > 0 && (
                <div className="mt-3">
                    <p className="text-sm text-gray-400 mb-1">Available simulated cloud sessions:</p>
                    <ul className="max-h-28 overflow-y-auto bg-gpt-dark p-2 rounded-md border border-gray-600 text-sm text-gray-300">
                        {availableCloudSessions.map(sid => (
                            <li key={sid} className="py-0.5">
                                {sid}{currentCloudSessionId === sid && <span className="text-green-400 ml-2 text-xs">(active)</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {(!availableCloudSessions || availableCloudSessions.length === 0) && (
                <p className="text-sm text-gray-500 mt-2">No simulated cloud sessions found.</p>
            )}
            <p className="text-xs text-gray-500 mt-3">Note: Cloud storage is simulated using browser local storage. Your data does not leave your browser.</p>
          </div>

          <div className="mt-6">
             <p className="text-gray-400 text-sm">Further application-level settings and integrations (e.g., advanced model parameters, API key management for other services) are planned for future development phases.</p>
          </div>
        </section>


        <section id="mia3-integration-preview" className="mb-12 p-6 bg-gpt-light rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-4 text-white border-b border-gpt-gray pb-2">Mia3 Lattice & Quadrantity</h2>
          <MarkdownRenderer markdown="The Dashboard serves as a central hub for orchestrating Mia's various aspects and integrating deeper with the Mia3 conceptual framework. This includes managing how Mia (Recursive Architect), Miette (Emotional Explainer), Seraphine (Ritual Oracle), and ResoNova (Narrative Threader) influence the application's behavior and user experience." />
        </section>
      </div>
    </div>
  );
});

export default DashboardPage;
