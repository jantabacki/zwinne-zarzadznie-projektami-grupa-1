import React, { useState } from 'react';
import StartTimeControls from './components/StartTimeControls.jsx';
import CheckpointsPreview from './components/CheckpointsPreview.jsx';
import RouteConfig from './components/RouteConfig.jsx';
import { usePersistentRaceState } from './hooks/usePersistentRaceState.js';
import { OFFICIAL_CHECKPOINTS } from './constants/checkpoints';

const EXAMPLE_JSON = `[
  { "km": 18, "cutoff": "1:52:00" },
  { "km": 28, "cutoff": "3:13:00" },
  { "km": 38, "cutoff": "4:35:00" },
  { "km": 43, "cutoff": "5:17:00" },
  { "km": 50, "cutoff": "6:15:00" }
]`;

export default function App() {
  const { startClockText, setStartClockText } = usePersistentRaceState();
  const [routeCheckpoints, setRouteCheckpoints] = useState(null);

  function handleApplyRoute(normalized) {
    setRouteCheckpoints(normalized);
  }
  function resetToDefault() {
    setRouteCheckpoints(OFFICIAL_CHECKPOINTS);
  }

  return (
    <div className="wrap">
      <h1>PacePlanner — konfiguracja biegu</h1>

      <div className="grid">
        <StartTimeControls
          startClockText={startClockText}
          onChangeStart={setStartClockText}
        />
        <CheckpointsPreview checkpoints={routeCheckpoints || OFFICIAL_CHECKPOINTS} />
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <RouteConfig onApply={handleApplyRoute} exampleJson={EXAMPLE_JSON} />
        <section className="card">
          <h3 className="mt-0 mb-8">Akcje</h3>
          <div className="row">
            <button className="btn" onClick={resetToDefault}>Użyj domyślnej trasy</button>
          </div>
          <p className="hint" style={{ marginTop: 8 }}>
            Po zastosowaniu JSON, podgląd po prawej zaktualizuje się do nowej trasy.
          </p>
        </section>
      </div>
    </div>
  );
}