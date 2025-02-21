import { useEffect, useState } from 'react';
import { BsShift } from "react-icons/bs";
import { IoBackspaceOutline } from "react-icons/io5";
import { TbArrowBigLeft } from "react-icons/tb";
import KeyIcon from './subcomponents/KeyIcon';

interface KeyboardLayoutProps {
  className?: string;
}

const KeyboardLayout = ({ className }: KeyboardLayoutProps) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  // Définition des rangées du clavier avec les touches utilitaires
  const qwertyKeyboardRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0','(', 'Backspace'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{', '}', ')'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", '+', 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift']
  ];

  const azertyKeyboardRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0','(', 'Backspace'],
    ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{', '}', ')'],
    ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", '+', 'Enter'],
    ['Shift', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift']
  ];

  const specialKeyIcons = {
    'Backspace': <IoBackspaceOutline className="w-5 h-5" />,
    'Shift': <BsShift className="w-5 h-5" />,
    'Enter': <TbArrowBigLeft className="w-6 h-6" />
  };

  const specialKeyWidths = {
    'Shift': 'w-14',
    'Enter': 'w-14',
    'Backspace': 'w-14'
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        if (e.key === 'Shift') newSet.add('Shift');
        else if (e.key === 'Enter') newSet.add('Enter');
        else if (e.key === 'Backspace') newSet.add('Backspace');
        else newSet.add(e.key.toLowerCase());
        return newSet;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        if (e.key === 'Shift') newSet.delete('Shift');
        else if (e.key === 'Enter') newSet.delete('Enter');
        else if (e.key === 'Backspace') newSet.delete('Backspace');
        else newSet.delete(e.key.toLowerCase());
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className={`sm:flex hidden flex-col opacity-50 items-center justify-center select-none gap-1 ${className}`}>
      {qwertyKeyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex items-center justify-center gap-1">
          {/* Ajout d'un padding à gauche pour décaler les rangées (sauf la première) */}
          {rowIndex > 0 && <div style={{ width: `${rowIndex * 20}px` }} />}
          {row.map((key) => (
            <KeyIcon
              key={key}
              keyChar={key === 'Shift' || key === 'Enter' || key === 'Backspace' ? '' : key.toUpperCase()}
              icon={specialKeyIcons[key as keyof typeof specialKeyIcons]}
              className={`
                transition-all duration-75 h-10
                ${specialKeyWidths[key as keyof typeof specialKeyWidths] || 'w-[40px]'}
                ${pressedKeys.has(key) 
                  ? 'bg-text !text-background !translate-y-[5px] shadow-inner' 
                  : 'bg-background !text-text hover:bg-text/10'
                }
              `}
            />
          ))}
        </div>
      ))}
      {/* Barre d'espace */}
      <div className="flex gap-1 mt-1">
        <KeyIcon
          keyChar="Space"
          className={`
            w-[300px] h-10 transition-all duration-75
            ${pressedKeys.has(' ') 
              ? 'bg-text text-background translate-y-[1px] shadow-inner' 
              : 'bg-background text-text hover:bg-text/10'
            }
          `}
        />
      </div>
    </div>
  );
};

export default KeyboardLayout;