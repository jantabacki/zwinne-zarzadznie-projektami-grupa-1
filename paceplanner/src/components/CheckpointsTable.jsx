import React, { useMemo } from 'react';
import { OFFICIAL_CHECKPOINTS } from '../constants/checkpoints';
import { secondsToHms, parseStartClockToSeconds, wallClockFrom } from '../utils/time';
import { findPreviousReport } from '../utils/reports';

export default function CheckpointsTable({ startClockText, reports = [], checkpoints = OFFICIAL_CHECKPOINTS }) {
  const startSeconds = useMemo(() => parseStartClockToSeconds(startClockText), [startClockText]);

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

  function nearestOfficialAround(index) {
    let prev = null, next = null;
    for (let j = index - 1; j >= 0; j--) {
      if (rows[j].cutoffSeconds != null) { prev = rows[j]; break; }
    }
    for (let j = index + 1; j < rows.length; j++) {
      if (rows[j].cutoffSeconds != null) { next = rows[j]; break; }
    }
    return { prev, next };
  }

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
    return `${sign}${mm}m ${String(ss)}s`;
  }

  function renderRow(row, index) {
    const elapsed = row.reportSeconds ?? row.cutoffSeconds ?? null;
    const elapsedCell = row.reportSeconds != null
      ? (<em><strong>{secondsToHms(row.reportSeconds)}</strong></em>)
      : (row.cutoffSeconds != null ? secondsToHms(row.cutoffSeconds) : '-');

    const wallCell = (startSeconds != null && elapsed != null)
      ? wallClockFrom(startSeconds, elapsed)
      : '-';

    // Oblicz spareSeconds (tylko jako liczba), potem formatuj i nadaj klasę
    let spareSeconds = null;
    const { prev: prevOff, next: nextOff } = nearestOfficialAround(index);

    if (row.reportSeconds != null && row.cutoffSeconds != null) {
      // raport + oficjalny limit
      spareSeconds = row.cutoffSeconds - row.reportSeconds;
    } else if (row.reportSeconds != null && row.cutoffSeconds == null && prevOff && nextOff) {
      // tylko raport → interpolacja limitu
      const segKm = nextOff.km - prevOff.km;
      const segTime = nextOff.cutoffSeconds - prevOff.cutoffSeconds;
      const expected = prevOff.cutoffSeconds + ((row.km - prevOff.km) / segKm) * segTime;
      spareSeconds = expected - row.reportSeconds;
    } else if (row.reportSeconds == null && row.cutoffSeconds != null) {
      // oficjalny punkt po ostatnim raporcie → projekcja
      const sortedReports = reports.slice().sort((a, b) => a.km - b.km);
      const lastReport = sortedReports[sortedReports.length - 1];
      if (lastReport && row.km > lastReport.km) {
        const prevRep = findPreviousReport(sortedReports, lastReport.km);
        const pace = prevRep
          ? (lastReport.secs - prevRep.secs) / (lastReport.km - prevRep.km)
          : (lastReport.secs / Math.max(1e-9, lastReport.km));
        const projection = lastReport.secs + pace * (row.km - lastReport.km);
        spareSeconds = row.cutoffSeconds - projection;
      }
    }

    const spareClass = classifySpare(spareSeconds);
    const diffCell = <span className={`delta ${spareClass}`}>{formatSpare(spareSeconds)}</span>;

    const sourceClass = row.source === 'raport' ? 'tag is-report' : (row.source === 'oficjalny+raport' ? 'tag is-mix' : 'tag');

    return (
      <tr key={row.km}>
        <td>{row.km}</td>
        <td><span className={sourceClass}>{row.source}</span></td>
        <td className="mono">{elapsedCell}</td>
        <td className="mono">{wallCell}</td>
        <td className="mono">{diffCell}</td>
      </tr>
    );
  }

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
              <th>Różnica do limitu (±)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => renderRow(row, i))}
          </tbody>
        </table>
      </div>
      <p className="hint" style={{ marginTop: 8 }}>
        Kolory: <span className="delta ok">duży zapas</span>, <span className="delta warn">mały zapas</span>, <span className="delta bad">poza limitem</span>.
      </p>
    </section>
  );
}