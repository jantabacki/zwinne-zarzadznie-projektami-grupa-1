import React, { useState } from 'react';
import { parseReportTextToElapsedSeconds } from '../utils/reports';
import { parseStartClockToSeconds } from '../utils/time';

/**
 * Formularz dodawania raportu kibica:
 *  - km: liczba (np. 21 lub 21.5)
 *  - czas: "MM:SS", "HH:MM:SS" (elapsed) lub "HH:MM[:SS]" (zegar – wymaga ustawionego startu)
 *  Wywołuje onAddOrReplaceReport(km, secsFromStart) przy poprawnych danych.
 */
export default function ReportForm({ startClockText, onAddOrReplaceReport }) {
  const [kmText, setKmText] = useState('');
  const [timeText, setTimeText] = useState('');
  const [error, setError] = useState('');

  function handleAdd() {
    const km = Number(kmText);
    if (!Number.isFinite(km) || km <= 0) {
      setError('Podaj dodatnią wartość kilometrów (np. 21 lub 21.5).');
      return;
    }

    const startSeconds = parseStartClockToSeconds(startClockText);
    const elapsedSeconds = parseReportTextToElapsedSeconds(timeText, startSeconds);

    if (elapsedSeconds == null) {
      setError('Nieprawidłowy czas. Użyj MM:SS, HH:MM:SS lub godziny HH:MM[:SS] (dla zegara ustaw godzinę startu).');
      return;
    }

    setError('');
    onAddOrReplaceReport(km, elapsedSeconds);
    setKmText('');
    setTimeText('');
  }

  return (
    <section className="card">
      <h3 className="mt-0 mb-10">Raport kibica → dodaj punkt</h3>
      <div className="row">
        <input
          type="number"
          step="0.1"
          min="0"
          placeholder="km (np. 21)"
          value={kmText}
          onChange={(e) => setKmText(e.target.value)}
        />
        <input
          type="text"
          placeholder='czas (np. "09:30" lub "1:12:40")'
          value={timeText}
          onChange={(e) => setTimeText(e.target.value)}
        />
        <button className="btn" onClick={handleAdd}>Dodaj</button>
      </div>
      <p className="hint" style={{ marginTop: 8 }}>
        Format czasu: <code>MM:SS</code>, <code>HH:MM:SS</code> lub godzina <code>HH:MM[:SS]</code>.
      </p>
      {error && <p className="hint" style={{ color: '#ef4444' }}>{error}</p>}
    </section>
  );
}