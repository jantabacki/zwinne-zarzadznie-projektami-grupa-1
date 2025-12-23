<<<<<<< HEAD
import React from 'react';
=======
import React, { useEffect, useMemo, useState } from 'react';
>>>>>>> epic-7
import StartTimeControls from './components/StartTimeControls.jsx';
import CheckpointsPreview from './components/CheckpointsPreview.jsx';
import CheckpointsTable from './components/CheckpointsTable.jsx';
import ReportForm from './components/ReportForm.jsx';
import ReportsPreview from './components/ReportsPreview.jsx';
import Simulations from './components/Simulations.jsx';
import FinishProjection from './components/FinishProjection.jsx';
import ShareLinkPanel from './components/ShareLinkPanel.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
<<<<<<< HEAD
import { usePersistentRaceState } from './hooks/usePersistentRaceState.js';
=======

import { usePersistentRaceState } from './hooks/usePersistentRaceState.js';
import { OFFICIAL_CHECKPOINTS } from './constants/checkpoints';
import RouteFileLoader from './components/RouteFileLoader.jsx';
import { loadRouteCheckpoints, saveRouteCheckpoints } from './utils/storage';
>>>>>>> epic-7

export default function App() {
  const {
    startClockText,
    setStartClockText,
    spectatorReports,
    addOrReplaceReport,
    deleteReport,
  } = usePersistentRaceState();

<<<<<<< HEAD
=======
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

>>>>>>> epic-7
  const shareableState = { startClockText, spectatorReports };

  return (
    <div className="wrap">
<<<<<<< HEAD
      <h1>PacePlanner</h1>
=======
      <h1>{title}</h1>
>>>>>>> epic-7

      <div className="grid mt-16">
        <ThemeToggle />
        <StartTimeControls
          startClockText={startClockText}
          onChangeStart={setStartClockText}
        />
      </div>

<<<<<<< HEAD
      <div className="grid mt-16">
        <CheckpointsPreview />
        <ShareLinkPanel state={shareableState} />
      </div>

      <div className="grid mt-16">
=======
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
>>>>>>> epic-7
        <ReportForm
          startClockText={startClockText}
          onAddOrReplaceReport={addOrReplaceReport}
        />
<<<<<<< HEAD
=======
      </div>

      <div className="grid mt-16">
>>>>>>> epic-7
        <ReportsPreview
          reports={spectatorReports}
          onDeleteReport={deleteReport}
        />
<<<<<<< HEAD
      </div>

      <div className="grid mt-16">
        <CheckpointsTable
          startClockText={startClockText}
          reports={spectatorReports}
=======
        <CheckpointsTable
          startClockText={startClockText}
          reports={spectatorReports}
          checkpoints={routeCheckpoints}
>>>>>>> epic-7
        />
      </div>

      <div className="grid mt-16">
        <Simulations
          startClockText={startClockText}
          reports={spectatorReports}
<<<<<<< HEAD
        />
      </div>

      <div className="grid mt-16">
=======
          checkpoints={routeCheckpoints}
        />
>>>>>>> epic-7
        <FinishProjection
          startClockText={startClockText}
          reports={spectatorReports}
          totalKm={50}
        />
      </div>
    </div>
  );
}