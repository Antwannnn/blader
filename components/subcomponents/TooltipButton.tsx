import { getModifierKey } from '@utils/platformUtils';
import { useEffect, useState } from 'react';
import KeyIcon from './KeyIcon';

interface TooltipButtonProps {
  onClick: () => void;
  shortcut: {
    key: string;
    modifier?: string;
  };
  className?: string;
  children: React.ReactNode;
}

const TooltipButton = ({ onClick, shortcut, className, children }: TooltipButtonProps) => {
  const [modifierKey, setModifierKey] = useState('Alt');

  useEffect(() => {
    setModifierKey(getModifierKey());
  }, []);

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={className}
      >
        {children}
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 -top-16 opacity-0 invisible group-backdrop-blur-sm group-hover:visible group-hover:opacity-70 transition-all duration-200 ease-in-out transform group-hover:-translate-y-1 z-50">
        <div className="bg-background border border-text rounded-md p-2 shadow-lg whitespace-nowrap">
          <div className="flex items-center gap-2">
            <KeyIcon keyChar={modifierKey} size="sm" />
            <span className="text-text">+</span>
            <KeyIcon keyChar={shortcut.key} size="sm" />
          </div>
        </div>
        <div className="w-3 h-3 bg-background border-b border-r border-text rotate-45 absolute -bottom-[6px] left-1/2 -translate-x-1/2">
        </div>
      </div>
    </div>
  );
};

export default TooltipButton; 