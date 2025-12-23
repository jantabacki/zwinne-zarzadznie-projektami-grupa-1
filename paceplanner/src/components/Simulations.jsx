import React, { useMemo } from 'react';
import { computeCheckpointProjections } from '../utils/projections';
import { secondsToHms, wallClockFrom, parseStartClockToSeconds } from '../utils/time';
import { OFFICIAL_CHECKPOINTS } from '../constants/checkpoints';

/**
 * Wyświetla projekcje czasów na KOLEJNE oficjalne checkpointy
 * po ostatnim raporcie, wraz z godziną na zegarze i zapasem do limitu.
 */
export default function Simulations({ startClockText, reports = [], checkpoints = OFFICIAL_CHECKPOINTS }) {
  const startSeconds = useMemo(() => parseStartClockToSeconds(startClockText), [startClockText]);
  const rows = useMemo(() => computeCheckpointProjections(reports, checkpoints), [reports, checkpoints]);

  function classifySpare(spareSeconds) {
    if (spareSeconds == null || !isFinite(spareSeconds)) return 'neutral';
    if (spareSeconds < 0) return 'bad';
    if (spareSeconds <= 120) return 'warn';
    return 'ok';
  }
  function formatSpare(spareSeconds) {
    if (spareSeconds == null || !isFinite(spareSeconds)) return '—';
    const sign = spareSeconds >= 0 ? '+' : '−';
    const abs = Math.abs(spareSeconds);
    const mm = Math.floor(abs / 60);
    const ss = Math.round(abs % 60);
    return `${sign}${mm}m ${ss}s`;
  }
  function findCutoffForKm(km) {
    const cp = checkpoints.find(c => c.km === km);
    return cp?.cutoffSeconds ?? null;
    }

  return (
    <section className="card">
      <h3 className="mt-0 mb-8">Projekcja punktów kontrolnych</h3>

      {(!rows || rows.length === 0) ? (
        <p className="hint">Dodaj przynajmniej jeden raport, aby wyświetlić projekcje.</p>
      ) : (
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>km</th>
                <th>Proj. czas (od startu)</th>
                <th>Godzina (zegar)</th>
                <th>Zapas vs limit (±)</th>
                <th>Metoda</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const cutoff = findCutoffForKm(r.km);
                const spare = cutoff != null ? (cutoff - r.projectedSeconds) : null;
                const spareClass = classifySpare(spare);
                const wall = (startSeconds != null) ? wallClockFrom(startSeconds, r.projectedSeconds) : '—';
                return (
                  <tr key={r.km}>
                    <td>{r.km}</td>
                    <td className="mono"><strong>{secondsToHms(r.projectedSeconds)}</strong></td>
                    <td className="mono">{wall}</td>
                    <td className={`mono delta ${spareClass}`}>{formatSpare(spare)}</td>
                    <td><span className="tag">{r.basis === 'segment' ? 'tempo odcinka' : 'tempo średnie'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="hint" style={{ marginTop: 8 }}>
        Projekcja używa tempa z ostatniego odcinka (jeśli są ≥2 raporty) lub średniego tempa, gdy jest tylko jeden raport.
      </p>
    </section>
  );
}