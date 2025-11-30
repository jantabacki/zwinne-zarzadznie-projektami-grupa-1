import React, { useMemo } from 'react';
import { computeFinishProjection } from '../utils/projections';
import { secondsToHms, wallClockFrom, parseStartClockToSeconds } from '../utils/time';
import { TOTAL_RACE_LIMIT_SECONDS } from '../constants/config';

/**
 * Panel pokazujący przewidywany czas na mecie (np. 50 km).
 * Pokazuje też zapas względem całkowitego limitu.
 */
export default function FinishProjection({ startClockText, reports, totalKm = 50 }) {
  const startSeconds = useMemo(() => parseStartClockToSeconds(startClockText), [startClockText]);
  const proj = useMemo(() => computeFinishProjection(reports, totalKm), [reports, totalKm]);

  if (!proj) {
    return (
      <section className="card">
        <h3 className="mt-0 mb-8">Projekcja mety</h3>
        <p className="hint">Dodaj przynajmniej jeden raport, aby wyświetlić projekcję mety.</p>
      </section>
    );
  }

  const spare = TOTAL_RACE_LIMIT_SECONDS - proj.projectedSeconds;
  const spareClass = spare < 0 ? 'bad' : (spare <= 120 ? 'warn' : 'ok');

  const wall = startSeconds != null
    ? wallClockFrom(startSeconds, proj.projectedSeconds)
    : '—';

  function formatSpare(s) {
    const sign = s >= 0 ? '+' : '−';
    const abs = Math.abs(s);
    const mm = Math.floor(abs / 60);
    const ss = Math.round(abs % 60);
    return `${sign}${mm}m ${ss}s`;
  }

  const basisLabel =
    proj.basis === 'segment' ? 'tempo ostatniego odcinka' :
    proj.basis === 'avg'     ? 'tempo średnie' :
    'obserwacja';

  return (
    <section className="card">
      <h3 className="mt-0 mb-8">Projekcja mety — {totalKm} km</h3>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Proj. czas (od startu)</th>
              <th>Godzina (zegar)</th>
              <th>Zapas vs limit (±)</th>
              <th>Metoda</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="mono"><strong>{secondsToHms(proj.projectedSeconds)}</strong></td>
              <td className="mono">{wall}</td>
              <td className={`mono delta ${spareClass}`}>{formatSpare(spare)}</td>
              <td><span className="tag">{basisLabel}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="hint" style={{ marginTop: 8 }}>
        Limit całego biegu: <code>{secondsToHms(TOTAL_RACE_LIMIT_SECONDS)}</code>.
      </p>
    </section>
  );
}