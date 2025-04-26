
import { useEffect, useCallback } from 'react';

interface Hotkey {
  keys: string;
  callback: () => void;
  preventDefault?: boolean;
}

export function useHotkeys(hotkeys: Hotkey[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check for modifier keys
      const ctrlKey = event.ctrlKey || event.metaKey;
      const shiftKey = event.shiftKey;
      const altKey = event.altKey;
      
      for (const hotkey of hotkeys) {
        const keys = hotkey.keys.toLowerCase().split('+');
        const keyMatch = event.key.toLowerCase() === keys[keys.length - 1];
        
        // Check if modifier keys match
        const ctrlRequired = keys.includes('ctrl') || keys.includes('cmd');
        const shiftRequired = keys.includes('shift');
        const altRequired = keys.includes('alt');
        
        const modifiersMatch = 
          ctrlKey === ctrlRequired && 
          shiftKey === shiftRequired && 
          altKey === altRequired;
        
        if (keyMatch && modifiersMatch) {
          if (hotkey.preventDefault !== false) {
            event.preventDefault();
          }
          hotkey.callback();
          break;
        }
      }
    },
    [hotkeys]
  );
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
