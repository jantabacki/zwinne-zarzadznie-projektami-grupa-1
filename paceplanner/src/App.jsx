import React from 'react';
import StartTimeControls from './components/StartTimeControls.jsx';
import CheckpointsPreview from './components/CheckpointsPreview.jsx';
import CheckpointsTable from './components/CheckpointsTable.jsx';
import ReportForm from './components/ReportForm.jsx';
import ReportsPreview from './components/ReportsPreview.jsx';
import Simulations from './components/Simulations.jsx';
import FinishProjection from './components/FinishProjection.jsx';
import { usePersistentRaceState } from './hooks/usePersistentRaceState.js';

export default function App() {
  const {
    startClockText,
    setStartClockText,
    spectatorReports,
    addOrReplaceReport,
    deleteReport,
  } = usePersistentRaceState();

  return (
    <div className="wrap">
      <h1>PacePlanner — projekcja mety</h1>

      <div className="grid">
        <StartTimeControls
          startClockText={startClockText}
          onChangeStart={setStartClockText}
        />
        <CheckpointsPreview />
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <ReportForm
          startClockText={startClockText}
          onAddOrReplaceReport={addOrReplaceReport}
        />
        <ReportsPreview
          reports={spectatorReports}
          onDeleteReport={deleteReport}
        />
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <CheckpointsTable
          startClockText={startClockText}
          reports={spectatorReports}
        />
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <Simulations
          startClockText={startClockText}
          reports={spectatorReports}
        />
      </div>

      {/* NOWOŚĆ: dedykowany panel projekcji mety */}
      <div className="grid" style={{ marginTop: 16 }}>
        <FinishProjection
          startClockText={startClockText}
          reports={spectatorReports}
          totalKm={50} // jeśli będziesz chciał wspierać inne dystanse, zrób to parametryzowalne
        />
      </div>
    </div>
  );
}