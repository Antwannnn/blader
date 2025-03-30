import { themes } from '@app/constants/themes';
import { useState } from 'react';

interface ThemeModalProps {
  onClose: () => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}



const ThemeModal = ({ onClose, currentTheme, onThemeChange }: ThemeModalProps) => {
  const [originalTheme] = useState(currentTheme);

  const handleMouseEnter = (theme: string) => {
    if (theme !== document.documentElement.getAttribute('data-theme')) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  };

  const handleClose = () => {
    document.documentElement.setAttribute('data-theme', originalTheme);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-secondary rounded-xl p-6 w-full max-h-[70vh] max-w-md overflow-y-scroll scroll-background">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text">Select Theme</h2>
          <button 
            onClick={handleClose}
            className="text-text hover:text-text/80"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                onThemeChange(t.value);
                onClose();
              }}
              onMouseEnter={() => handleMouseEnter(t.value)}
              className={`
                px-4 py-2 rounded-lg text-left flex items-center justify-between transition-colors duration-200
                ${currentTheme === t.value 
                  ? 'bg-text text-background border-2 border-text' 
                  : 'bg-tertiary text-text hover:bg-text hover:text-background'}
                flex items-center justify-between
              `}
            >
              <span>{t.name}</span>

            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeModal; 