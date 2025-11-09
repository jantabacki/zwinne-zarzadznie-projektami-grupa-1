import React, { useState } from 'react';
import { normalizeCheckpoints } from '../utils/checkpoints';

/**
 * Prosty edytor JSON do wczytania/zmiany trasy.
 * - Wklejasz JSON, klikasz "Zastosuj trasę"
 * - Walidujemy i zwracamy gotową tablicę [{km, cutoffSeconds}] do parenta
 */
export default function RouteConfig({ onApply, exampleJson }) {
  const [text, setText] = useState(exampleJson || '');
  const [error, setError] = useState('');

  function apply() {
    try {
      const normalized = normalizeCheckpoints(text);
      setError('');
      onApply(normalized);
    } catch (e) {
      setError(e.message || 'Błąd walidacji.');
    }
  }

  return (
    <section className="card">
      <h3 className="mt-0 mb-8">Konfiguracja trasy (JSON)</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='[ { "km": 18, "cutoff": "1:52:00" }, ... ]'
        style={{ width: '100%', minHeight: 180, padding: 10, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--soft)', color: 'var(--text)' }}
      />
      {error ? (
        <p className="hint" style={{ color: '#ef4444' }}>{error}</p>
      ) : (
        <p className="hint">Wspierane pola: <code>km</code> oraz <code>cutoffSeconds</code> albo <code>cutoff</code> (HH:MM:SS).</p>
      )}
      <div className="row" style={{ marginTop: 8 }}>
        <button className="btn" onClick={apply}>Zastosuj trasę</button>
      </div>
    </section>
  );
}