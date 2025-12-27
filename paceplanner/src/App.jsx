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
import RouteManager from './components/RouteManager.jsx';

import { usePersistentRaceState } from './hooks/usePersistentRaceState.js';
import { OFFICIAL_CHECKPOINTS } from './constants/checkpoints';
import { loadRoutes, saveRoutes, loadActiveRouteId, saveActiveRouteId } from './utils/storage';

export default function App() {
  const {
    startClockText, setStartClockText,
    spectatorReports, addOrReplaceReport, deleteReport,
  } = usePersistentRaceState();

  // ===== Kolekcja tras =====
  const [routes, setRoutes] = useState(() => loadRoutes());
  const [activeRouteId, setActiveRouteId] = useState(() => loadActiveRouteId());

  // Jeśli brak tras — dołóż domyślną (OFFICIAL_CHECKPOINTS)
  useEffect(() => {
    if (routes.length === 0) {
      const defaultRoute = { id: 'default', name: 'Domyślna trasa', checkpoints: OFFICIAL_CHECKPOINTS };
      setRoutes([defaultRoute]);
      saveRoutes([defaultRoute]);
      setActiveRouteId('default');
      saveActiveRouteId('default');
    } else if (!activeRouteId) {
      setActiveRouteId(routes[0].id);
      saveActiveRouteId(routes[0].id);
    }
  }, []); // init once

  // refresh (po akcjach w RouteManager – wczytujemy ponownie z localStorage)
  function refreshRoutes() {
    const rs = loadRoutes();
    setRoutes(rs);
    if (!rs.find(r => r.id === activeRouteId)) {
      const first = rs[0]?.id || 'default';
      setActiveRouteId(first);
      saveActiveRouteId(first);
    }
  }

  const activeRoute = useMemo(
    () => routes.find(r => r.id === activeRouteId) || routes[0] || { checkpoints: OFFICIAL_CHECKPOINTS, name: 'Domyślna trasa' },
    [routes, activeRouteId]
  );

  const title = useMemo(
    () => activeRoute?.name ? `PacePlanner — ${activeRoute.name}` : 'PacePlanner',
    [activeRoute?.name]
  );
  useEffect(() => { document.title = title; }, [title]);

  const shareableState = { startClockText, spectatorReports };

  return (
    <div className="wrap">
      <h1>{title}</h1>

      <div className="grid mt-16">
        <ThemeToggle />
        <StartTimeControls startClockText={startClockText} onChangeStart={setStartClockText} />
      </div>

      {/* Menedżer tras po lewej, podgląd aktywnej po prawej */}
      <div className="grid mt-16">
        <RouteManager
          routes={routes}
          activeId={activeRouteId}
          onChangeActive={setActiveRouteId}
          onRefresh={refreshRoutes}
        />
        <CheckpointsPreview checkpoints={activeRoute.checkpoints} />
      </div>

      <div className="grid mt-16">
        <ShareLinkPanel state={shareableState} />
        <ReportForm startClockText={startClockText} onAddOrReplaceReport={addOrReplaceReport} />
      </div>

      <div className="grid mt-16">
        <ReportsPreview reports={spectatorReports} onDeleteReport={deleteReport} />
        <CheckpointsTable startClockText={startClockText} reports={spectatorReports} checkpoints={activeRoute.checkpoints} />
      </div>

      <div className="grid mt-16">
        <Simulations startClockText={startClockText} reports={spectatorReports} checkpoints={activeRoute.checkpoints} />
        <FinishProjection startClockText={startClockText} reports={spectatorReports} totalKm={50} />
      </div>
    </div>
  );
}