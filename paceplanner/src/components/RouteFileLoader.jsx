import React, { useRef, useState } from 'react';
import { normalizeCheckpointsFile } from '../utils/checkpoints';
import { saveRouteCheckpoints, clearRouteCheckpoints } from '../utils/storage';

export default function RouteFileLoader({ onApply, onReset, currentRouteName }) {
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [routeName, setRouteName] = useState(currentRouteName || '');
  const [error, setError] = useState('');

  async function handlePickFile(e) {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    try {
      const text = await file.text();
      const { checkpoints, name } = normalizeCheckpointsFile(text);
      setRouteName(name || '');
      onApply(checkpoints, name);
      saveRouteCheckpoints(checkpoints);
    } catch (err) {
      setError(err?.message || 'Nie udało się wczytać pliku.');
    } finally {
      // pozwól wybrać ten sam plik ponownie
      e.target.value = '';
    }
  }

  function handleReset() {
    setError('');
    setFileName('');
    setRouteName('');
    clearRouteCheckpoints();
    onReset?.(); // wróć do domyślnej trasy
  }

  return (
    <section className="card">
      <h3 className="mt-0 mb-8">Konfiguracja z pliku (JSON)</h3>

      <div className="row">
        <input
          type="file"
          ref={fileRef}
          accept=".json,application/json"
          onChange={handlePickFile}
          aria-label="Wybierz plik JSON z trasą"
        />
        <button className="btn" onClick={() => fileRef.current?.click()}>
          Wybierz plik…
        </button>
        <button className="btn" onClick={handleReset}>
          Użyj domyślnej trasy
        </button>
      </div>

      <p className="hint" style={{ marginTop: 8 }}>
        {fileName ? <>Wczytano: <strong>{fileName}</strong></> : 'Obsługiwany format: tablica checkpointów lub obiekt { name, checkpoints }.'}
      </p>
      {routeName && <p className="hint">Nazwa trasy: <strong>{routeName}</strong></p>}
      {error && <p className="hint" style={{ color: '#ef4444' }}>{error}</p>}

      <details style={{ marginTop: 8 }}>
        <summary className="hint">Przykład formatu</summary>
        <pre className="mono" style={{ whiteSpace: 'pre-wrap' }}>
{`[
  { "km": 18, "cutoff": "1:52:00" },
  { "km": 28, "cutoff": "3:13:00" },
  { "km": 38, "cutoff": "4:35:00" },
  { "km": 43, "cutoff": "5:17:00" },
  { "km": 50, "cutoff": "6:15:00" }
]`}
        </pre>
        <pre className="mono" style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>
{`{
  "name": "PacePlanner — Trasa A",
  "checkpoints": [
    { "km": 18, "cutoffSeconds": 6720 },
    { "km": 28, "cutoffSeconds": 11580 },
    { "km": 38, "cutoffSeconds": 16500 },
    { "km": 43, "cutoffSeconds": 19020 },
    { "km": 50, "cutoffSeconds": 22500 }
  ]
}`}
        </pre>
      </details>
    </section>
  );
}