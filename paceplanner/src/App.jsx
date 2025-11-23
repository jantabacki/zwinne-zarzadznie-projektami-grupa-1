import React from 'react';
import StartTimeControls from './components/StartTimeControls.jsx';
import CheckpointsPreview from './components/CheckpointsPreview.jsx';
import CheckpointsTable from './components/CheckpointsTable.jsx';
import ReportForm from './components/ReportForm.jsx';
import ReportsPreview from './components/ReportsPreview.jsx';
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
      <h1>PacePlanner — tabela punktów</h1>

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

      {/* Nowa tabela (łącząca oficjalne + raporty) */}
      <div className="grid" style={{ marginTop: 16 }}>
        <CheckpointsTable
          startClockText={startClockText}
          reports={spectatorReports}
        />
      </div>
    </div>
  );
}