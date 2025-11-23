import React, { useMemo } from 'react';
import { OFFICIAL_CHECKPOINTS } from '../constants/checkpoints';
import { secondsToHms, parseStartClockToSeconds, wallClockFrom } from '../utils/time';

/**
 * Tabela łącząca oficjalne punkty z raportami:
 *  - kolumny: km, źródło, Limit/Czas (od startu), Godzina (zegar)
 *  - źródło: 'oficjalny' | 'raport' | 'oficjalny+raport'
 * Tu bez różnic i tempa — to kolejne story.
 */
export default function CheckpointsTable({ startClockText, reports = [], checkpoints = OFFICIAL_CHECKPOINTS }) {
  const startSeconds = useMemo(() => parseStartClockToSeconds(startClockText), [startClockText]);

  // Zbuduj mapę wg km: najpierw oficjalne, potem nadpisuj raportami (source = oficjalny+raport)
  const rows = useMemo(() => {
    const map = new Map();
    for (const cp of checkpoints) {
      map.set(cp.km, { km: cp.km, source: 'oficjalny', cutoffSeconds: cp.cutoffSeconds });
    }
    for (const r of reports) {
      const existing = map.get(r.km);
      if (existing) map.set(r.km, { ...existing, reportSeconds: r.secs, source: 'oficjalny+raport' });
      else map.set(r.km, { km: r.km, source: 'raport', reportSeconds: r.secs });
    }
    return Array.from(map.values()).sort((a, b) => a.km - b.km);
  }, [reports, checkpoints]);

  return (
    <section className="card">
      <h3 className="mt-0 mb-8">Punkty kontrolne — tabela</h3>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>km</th>
              <th>Źródło</th>
              <th>Limit / Czas (od startu)</th>
              <th>Godzina limitu / raportu</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const elapsed = row.reportSeconds ?? row.cutoffSeconds ?? null;
              const elapsedCell = row.reportSeconds != null
                ? (<em><strong>{secondsToHms(row.reportSeconds)}</strong></em>)
                : (row.cutoffSeconds != null ? secondsToHms(row.cutoffSeconds) : '-');

              const wallCell = (startSeconds != null && elapsed != null)
                ? wallClockFrom(startSeconds, elapsed)
                : '-';

              const sourceLabel = row.source === 'oficjalny'
                ? 'oficjalny'
                : (row.source === 'raport' ? 'raport' : 'oficjalny+raport');

              return (
                <tr key={row.km}>
                  <td>{row.km}</td>
                  <td><span className="tag">{sourceLabel}</span></td>
                  <td className="mono">{elapsedCell}</td>
                  <td className="mono">{wallCell}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="hint" style={{ marginTop: 8 }}>
        Ustaw godzinę startu, aby zobaczyć kolumnę „Godzina …”. Raport przy tym samym km nadpisuje punkt oficjalny.
      </p>
    </section>
  );
}