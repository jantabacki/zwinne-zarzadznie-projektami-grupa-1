import { useEffect, useMemo, useRef, useState } from 'react';
import { loadPersistedState, savePersistedState } from '../utils/storage';
import { loadStateFromUrl, stripShareParamFromUrl } from '../utils/urlState';

export function usePersistentRaceState() {
  // 1) Inicjalizacja: najpierw URL (?s=), potem localStorage, na końcu pusty stan
  const initial = useMemo(() => {
    const fromUrl = loadStateFromUrl();
    if (fromUrl) return fromUrl;
    return loadPersistedState() || { startClockText: '', spectatorReports: [] };
  }, []);

  const [startClockText, setStartClockText] = useState(initial.startClockText);
  const [spectatorReports, setSpectatorReports] = useState(initial.spectatorReports);

  // 2) API modyfikacji (bez zmian)
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

  // 3) Autosave (debounce) — zapisujemy zawsze, także gdy start był z URL
  const saveTimer = useRef(null);
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      savePersistedState({ startClockText, spectatorReports });
    }, 200);
    return () => clearTimeout(saveTimer.current);
  }, [startClockText, spectatorReports]);

  // 4) Jeżeli start był z URL (mieścił ?s=), „czyścimy” parametr po pierwszym renderze
  useEffect(() => {
    stripShareParamFromUrl();
  }, []);

  return {
    startClockText,
    setStartClockText,
    spectatorReports,
    addOrReplaceReport,
    deleteReport,
  };
}