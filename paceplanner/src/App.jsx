import React from 'react';
import StartTimeControls from './components/StartTimeControls.jsx';
import CheckpointsPreview from './components/CheckpointsPreview.jsx';
import { usePersistentRaceState } from './hooks/usePersistentRaceState.js';

export default function App() {
  const { startClockText, setStartClockText } = usePersistentRaceState();

  return (
    <div className="wrap">
      <h1>PacePlanner — konfiguracja biegu</h1>

      <div className="grid">
        <StartTimeControls
          startClockText={startClockText}
          onChangeStart={setStartClockText}
        />
        {/* Po prawej (na desktop) zobaczysz listę punktów */}
        <CheckpointsPreview />
      </div>
    </div>
  );
}