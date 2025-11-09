import { useState } from 'react';

/**
 * Tymczasowy hook stanu aplikacji dla EPIC 1 / Story: Start time.
 * (Bez persystencji — zostanie dodana w innym story/epicu.)
 */
export function usePersistentRaceState() {
  const [startClockText, setStartClockText] = useState('');

  return {
    startClockText,
    setStartClockText,
  };
}