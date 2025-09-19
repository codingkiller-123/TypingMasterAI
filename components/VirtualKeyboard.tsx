
import React from 'react';
import { KEYBOARD_LAYOUT } from '../constants';

interface VirtualKeyboardProps {
  nextChar: string;
}

const Key: React.FC<{ char: string; isHighlighted: boolean; flexGrow?: number }> = ({ char, isHighlighted, flexGrow = 1 }) => {
  const specialKeyClasses: { [key: string]: string } = {
    'Backspace': 'col-span-2 text-xs',
    'Tab': 'col-span-2 text-xs',
    'Caps Lock': 'col-span-2 text-xs',
    'Enter': 'col-span-2 text-xs',
    'Shift': 'col-span-3 text-xs',
    'Space': `col-span-8`,
  };

  const widthClass = specialKeyClasses[char] || `flex-grow`;

  return (
    <div
      style={{ flexGrow }}
      className={`h-12 sm:h-14 flex items-center justify-center m-1 p-2 rounded-md font-medium text-sm sm:text-base border-b-4 transition-all duration-100 ${
        isHighlighted
          ? 'bg-blue-500 text-white border-blue-700 transform -translate-y-1 shadow-lg'
          : 'bg-slate-200 text-slate-700 border-slate-400'
      } ${char === 'Space' ? 'max-w-xs' : 'min-w-[2.5rem]'}`}
    >
      {char === 'Space' ? '' : char}
    </div>
  );
};

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ nextChar }) => {
  return (
    <div className="mt-8 p-4 bg-slate-300 rounded-lg shadow-inner">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center">
          {row.map((char, charIndex) => {
            const isHighlighted = char.toLowerCase() === nextChar?.toLowerCase() || (nextChar === ' ' && char === 'Space');
            const flexMap: {[key:string]: number} = {
              'Backspace': 2,
              'Tab': 1.5,
              '\\': 1.5,
              'Caps Lock': 1.75,
              'Enter': 2.25,
              'Shift': 2.5,
              'Space': 8,
            }
            return (
              <Key
                key={`${rowIndex}-${charIndex}`}
                char={char}
                isHighlighted={isHighlighted}
                flexGrow={flexMap[char] || 1}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
