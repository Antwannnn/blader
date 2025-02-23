'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Type pour tous les paramètres possibles
interface Parameters {
  keyboard: {
    layout: 'qwerty' | 'azerty';
    show: boolean;
  };
}

// Valeurs par défaut des paramètres
const DEFAULT_PARAMETERS: Parameters = {
  keyboard: {
    layout: 'qwerty',
    show: true,
  },
};

// Type pour le contexte
interface SettingsContextType {
  isOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  parameters: Parameters;
  updateParameter: <K extends keyof Parameters, SK extends keyof Parameters[K]>(
    category: K,
    key: SK,
    value: Parameters[K][SK]
  ) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Helper pour gérer le localStorage
const storage = {
  get: function<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    try {
      return JSON.parse(stored) as T;
    } catch {
      return defaultValue;
    }
  },
  set: function<T>(key: string, value: T): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
};

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialiser les paramètres depuis le localStorage
  const [parameters, setParameters] = useState<Parameters>(() => {
    return storage.get('settings', DEFAULT_PARAMETERS);
  });

  // Sauvegarder les changements dans le localStorage
  useEffect(() => {
    storage.set('settings', parameters);
  }, [parameters]);

  const updateParameter = useCallback(<K extends keyof Parameters, SK extends keyof Parameters[K]>(
    category: K,
    key: SK,
    value: Parameters[K][SK]
  ) => {
    setParameters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  }, []);

  const openSettings = useCallback(() => setIsOpen(true), []);
  const closeSettings = useCallback(() => setIsOpen(false), []);

  return (
    <SettingsContext.Provider
      value={{
        isOpen,
        openSettings,
        closeSettings,
        parameters,
        updateParameter,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 