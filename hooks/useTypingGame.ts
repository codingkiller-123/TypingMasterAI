import { useState, useEffect, useCallback } from 'react';
import { GameStatus } from '../types';
import { KEY_TO_FINGER_MAP } from '../constants';

// Helper for voice synthesis
const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel(); // Clear queue
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  }
};


export const useTypingGame = (lessonText: string, voiceFeedbackEnabled: boolean) => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.Waiting);
  const [typedText, setTypedText] = useState('');
  // Changed errors to a Map to store incorrect characters
  const [errors, setErrors] = useState<Map<number, string>>(new Map());
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const currentIndex = typedText.length;
  const nextChar = lessonText[currentIndex];

  const resetGame = useCallback(() => {
    setStatus(GameStatus.Waiting);
    setTypedText('');
    setErrors(new Map());
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel(); // Stop any ongoing speech
    }
  }, []);

  useEffect(() => {
    if (status === GameStatus.Typing && startTime) {
      const interval = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000 / 60; // in minutes
        if (elapsedTime > 0) {
          const correctChars = typedText.split('').filter((char, index) => lessonText[index] === char).length;
          const wordsTyped = correctChars / 5;
          const calculatedWpm = Math.round(wordsTyped / elapsedTime);
          setWpm(calculatedWpm < 0 ? 0 : calculatedWpm);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, startTime, typedText, lessonText]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (status === GameStatus.Finished) return;

    const { key } = e;

    if (key === 'Shift' || key === 'Control' || key === 'Alt' || key === 'Meta' || key === 'CapsLock' || key === 'Tab' || key.startsWith('Arrow')) {
        return;
    }

    if (status === GameStatus.Waiting && key.length === 1 && key !== ' ') {
      setStatus(GameStatus.Typing);
      setStartTime(Date.now());
    }
    
    e.preventDefault();

    if (key === 'Backspace') {
      if (currentIndex > 0) {
        const newErrors = new Map(errors);
        newErrors.delete(currentIndex - 1);
        setErrors(newErrors);
        setTypedText(typedText.slice(0, -1));
      }
    } else if (key.length === 1) { // Only process single character keys
      if (currentIndex < lessonText.length) {
        const expectedChar = lessonText[currentIndex];
        
        if (key !== expectedChar) {
          const newErrors = new Map(errors);
          if (!newErrors.has(currentIndex)) {
            newErrors.set(currentIndex, key); // Store the incorrect key
            setErrors(newErrors);
          
            if(voiceFeedbackEnabled) {
              const finger = KEY_TO_FINGER_MAP[expectedChar.toLowerCase()];
              if(finger) {
                  speak(`For ${expectedChar}, use your ${finger}.`);
              }
            }
          }
        }
        const newTypedText = typedText + key;
        setTypedText(newTypedText);

        const totalTyped = newTypedText.length;
        if (totalTyped > 0) {
            const currentErrors = new Map(errors);
            if (key !== expectedChar && !currentErrors.has(currentIndex)) {
              currentErrors.set(currentIndex, key);
            }
            const correctChars = totalTyped - currentErrors.size;
            const newAccuracy = (correctChars / totalTyped) * 100;
            setAccuracy(parseFloat(newAccuracy.toFixed(2)));
        }

        if (newTypedText.length === lessonText.length) {
          setStatus(GameStatus.Finished);
          if ('speechSynthesis' in window) {
            speechSynthesis.cancel(); // Stop any pending speech
          }
        }
      }
    }
  }, [status, currentIndex, lessonText, typedText, errors, voiceFeedbackEnabled]);


  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return { status, typedText, errors, wpm, accuracy, nextChar, resetGame };
};