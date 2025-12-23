import React, { useEffect, useMemo, useState } from 'react';
import StartTimeControls from './components/StartTimeControls.jsx';
import CheckpointsPreview from './components/CheckpointsPreview.jsx';
import CheckpointsTable from './components/CheckpointsTable.jsx';
import ReportForm from './components/ReportForm.jsx';
import ReportsPreview from './components/ReportsPreview.jsx';
import Simulations from './components/Simulations.jsx';
import FinishProjection from './components/FinishProjection.jsx';
import ShareLinkPanel from './components/ShareLinkPanel.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';

import { usePersistentRaceState } from './hooks/usePersistentRaceState.js';
import { OFFICIAL_CHECKPOINTS } from './constants/checkpoints';
import RouteFileLoader from './components/RouteFileLoader.jsx';
import { loadRouteCheckpoints, saveRouteCheckpoints } from './utils/storage';

export default function App() {
  const {
    startClockText,
    setStartClockText,
    spectatorReports,
    addOrReplaceReport,
    deleteReport,
  } = usePersistentRaceState();

  // === TRASA (checkpointy) — z pliku lub domyślna ===
  const [routeName, setRouteName] = useState('');
  const [routeCheckpoints, setRouteCheckpoints] = useState(() => loadRouteCheckpoints() || OFFICIAL_CHECKPOINTS);

  function applyRoute(checkpoints, name) {
    setRouteCheckpoints(checkpoints);
    if (name) setRouteName(name);
    saveRouteCheckpoints(checkpoints);
  }

  function resetRoute() {
    setRouteCheckpoints(OFFICIAL_CHECKPOINTS);
    setRouteName('');
  }

  // (opcjonalnie) pokaż nazwę w tytule
  const title = useMemo(
    () => routeName ? `PacePlanner — ${routeName}` : 'PacePlanner',
    [routeName]
  );

  useEffect(() => { document.title = title; }, [title]);

  const shareableState = { startClockText, spectatorReports };

  return (
    <div className="wrap">
      <h1>{title}</h1>

      <div className="grid mt-16">
        <ThemeToggle />
        <StartTimeControls
          startClockText={startClockText}
          onChangeStart={setStartClockText}
        />
      </div>

      {/* Panel wczytywania trasy z pliku + podgląd trasy */}
      <div className="grid mt-16">
        <RouteFileLoader
          onApply={applyRoute}
          onReset={resetRoute}
          currentRouteName={routeName}
        />
        <CheckpointsPreview checkpoints={routeCheckpoints} />
      </div>

      <div className="grid mt-16">
        <ShareLinkPanel state={shareableState} />
        <ReportForm
          startClockText={startClockText}
          onAddOrReplaceReport={addOrReplaceReport}
        />
      </div>

      <div className="grid mt-16">
        <ReportsPreview
          reports={spectatorReports}
          onDeleteReport={deleteReport}
        />
        <CheckpointsTable
          startClockText={startClockText}
          reports={spectatorReports}
          checkpoints={routeCheckpoints}
        />
      </div>

      <div className="grid mt-16">
        <Simulations
          startClockText={startClockText}
          reports={spectatorReports}
          checkpoints={routeCheckpoints}
        />
        <FinishProjection
          startClockText={startClockText}
          reports={spectatorReports}
          totalKm={50}
        />
      </div>
    </div>
  );
}