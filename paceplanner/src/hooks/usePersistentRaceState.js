import { useEffect, useMemo, useRef, useState } from 'react';
import { loadPersistedState, savePersistedState } from '../utils/storage';

export function usePersistentRaceState() {
  // 1) Inicjalizacja ze storage (raz)
  const initial = useMemo(() => loadPersistedState() || { startClockText: '', spectatorReports: [] }, []);
  const [startClockText, setStartClockText] = useState(initial.startClockText);
  const [spectatorReports, setSpectatorReports] = useState(initial.spectatorReports);

  // 2) API do modyfikacji raportów
  function addOrReplaceReport(km, secsFromStart) {
    let action = 'added';
    setSpectatorReports(prev => {
      const next = prev.slice();
      const i = next.findIndex(r => r.km === km);
      if (i >= 0) {
        next[i] = { km, secs: secsFromStart };
        action = 'replaced';
      } else {
        next.push({ km, secs: secsFromStart });
      }
      next.sort((a, b) => a.km - b.km);
      return next;
    });
    return action;
  }

  function deleteReport(km) {
    setSpectatorReports(prev => prev.filter(r => r.km !== km));
  }

  // 3) Autosave (z lekkim debounce, by nie pisać przy każdym keystroke)
  const saveTimer = useRef(null);
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      savePersistedState({ startClockText, spectatorReports });
    }, 200);
    return () => clearTimeout(saveTimer.current);
  }, [startClockText, spectatorReports]);

  return {
    startClockText,
    setStartClockText,
    spectatorReports,
    addOrReplaceReport,
    deleteReport,
  };
}