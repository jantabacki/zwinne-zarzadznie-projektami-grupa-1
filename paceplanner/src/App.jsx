import React from 'react';
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

export default function App() {
  const {
    startClockText,
    setStartClockText,
    spectatorReports,
    addOrReplaceReport,
    deleteReport,
  } = usePersistentRaceState();

  const shareableState = { startClockText, spectatorReports };

  return (
    <div className="wrap">
      <h1>PacePlanner</h1>

      <div className="grid mt-16">
        <ThemeToggle />
        <StartTimeControls
          startClockText={startClockText}
          onChangeStart={setStartClockText}
        />
      </div>

      <div className="grid mt-16">
        <CheckpointsPreview />
        <ShareLinkPanel state={shareableState} />
      </div>

      <div className="grid mt-16">
        <ReportForm
          startClockText={startClockText}
          onAddOrReplaceReport={addOrReplaceReport}
        />
        <ReportsPreview
          reports={spectatorReports}
          onDeleteReport={deleteReport}
        />
      </div>

      <div className="grid mt-16">
        <CheckpointsTable
          startClockText={startClockText}
          reports={spectatorReports}
        />
      </div>

      <div className="grid mt-16">
        <Simulations
          startClockText={startClockText}
          reports={spectatorReports}
        />
      </div>

      <div className="grid mt-16">
        <FinishProjection
          startClockText={startClockText}
          reports={spectatorReports}
          totalKm={50}
        />
      </div>
    </div>
  );
}