'use client';

import { useSettings } from '@/contexts/SettingsContext';
import { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

const SettingsModal = () => {
  const { 
    isOpen, 
    closeSettings,
    parameters,
    updateParameter
  } = useSettings();

  // Empêcher le scroll quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop avec animation */}
      <div 
        className="absolute inset-0 bg-black/25 backdrop-blur-sm animate-fadeIn"
        onClick={closeSettings}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className="w-full max-w-md bg-background rounded-2xl p-6 shadow-xl animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-text">
              Settings
            </h3>
            <button
              onClick={closeSettings}
              className="rounded-lg p-2 hover:bg-text/10 transition-colors"
            >
              <IoClose className="w-5 h-5 text-text" />
            </button>
          </div>

          {/* Content */}
          <div className="mt-4 space-y-4">
            {/* Keyboard Layout Setting */}
            <div className="space-y-2">
              <label className="text-sm text-text/80">Keyboard Layout</label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateParameter('keyboard', 'layout', 'qwerty')}
                  className={`px-4 py-2 rounded-lg ${
                    parameters.keyboard.layout === 'qwerty'
                      ? 'bg-text text-background'
                      : 'bg-secondary text-text hover:bg-text/10'
                  }`}
                >
                  qwerty
                </button>
                <button
                  onClick={() => updateParameter('keyboard', 'layout', 'azerty')}
                  className={`px-4 py-2 rounded-lg ${
                    parameters.keyboard.layout === 'azerty'
                      ? 'bg-text text-background'
                      : 'bg-secondary text-text hover:bg-text/10'
                  }`}
                >
                  azerty
                </button>
              </div>
            </div>

            {/* Show Keyboard Setting */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-text/80">Show Keyboard</span>
              <button
                onClick={() => updateParameter('keyboard', 'show', !parameters.keyboard.show)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  parameters.keyboard.show ? 'bg-text text-background' : 'bg-secondary text-text'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                    parameters.keyboard.show ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 