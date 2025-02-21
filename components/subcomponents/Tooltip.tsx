import { getModifierKey } from '@utils/platformUtils';
import { useEffect, useState } from 'react';
import KeyIcon from './KeyIcon';

interface TooltipProps {
  children: React.ReactNode;
  shortcut: {
    key: string;
    modifier?: string;
  };
}

const Tooltip = ({ children, shortcut }: TooltipProps) => {
  const [modifierKey, setModifierKey] = useState('Alt');

  useEffect(() => {
    setModifierKey(getModifierKey());
  }, []);

  return (
    <div className="group relative inline-block">
      {children}
      <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute -top-14 left-1/2 -translate-x-1/2 z-50 px-3 py-2 bg-background border border-text rounded-md shadow-lg whitespace-nowrap">
        <div className="flex items-center gap-2">
          <KeyIcon keyChar={modifierKey} size="sm" />
          <span className="text-text">+</span>
          <KeyIcon keyChar={shortcut.key} size="sm" />
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background border-b border-r border-text rotate-45"></div>
      </div>
    </div>
  );
};

export default Tooltip; 