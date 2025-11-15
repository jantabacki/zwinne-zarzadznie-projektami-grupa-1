import { useState } from 'react';

export function usePersistentRaceState() {
  const [startClockText, setStartClockText] = useState('');
  const [spectatorReports, setSpectatorReports] = useState([]); // [{ km, secs }]

  /**
   * Dodaje nowy raport lub NADPISUJE istniejący dla tego samego km.
   * Zwraca string: 'added' | 'replaced'.
   */
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

  return {
    startClockText,
    setStartClockText,
    spectatorReports,
    addOrReplaceReport,
    deleteReport,
  };
}