import React from 'react';
import StartTimeControls from './components/StartTimeControls.jsx';
import { usePersistentRaceState } from './hooks/usePersistentRaceState.js';

export default function App() {
  const { startClockText, setStartClockText } = usePersistentRaceState();

  return (
    <div className="wrap">
      <h1>PacePlanner — ustawienie godziny startu</h1>

      <div className="grid">
        <StartTimeControls
          startClockText={startClockText}
          onChangeStart={setStartClockText}
        />
      </div>

      {/* Podgląd (pomoc dla testów ręcznych) */}
      <p className="hint" style={{ marginTop: 12 }}>
        Aktualna godzina startu w stanie aplikacji: <strong>{startClockText || '—'}</strong>
      </p>
    </div>
  );
}