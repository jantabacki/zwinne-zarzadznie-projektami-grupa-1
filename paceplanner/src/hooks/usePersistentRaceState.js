import { useState } from 'react';

export function usePersistentRaceState() {
  const [startClockText, setStartClockText] = useState('');
  const [spectatorReports, setSpectatorReports] = useState([]); // [{ km:Number, secs:Number }]

  function addOrReplaceReport(km, secsFromStart) {
    setSpectatorReports(prev => {
      const next = prev.slice();
      const i = next.findIndex(r => r.km === km);
      if (i >= 0) next[i] = { km, secs: secsFromStart };
      else next.push({ km, secs: secsFromStart });
      next.sort((a, b) => a.km - b.km);
      return next;
    });
  }

  return {
    startClockText,
    setStartClockText,
    spectatorReports,
    addOrReplaceReport,
  };
}