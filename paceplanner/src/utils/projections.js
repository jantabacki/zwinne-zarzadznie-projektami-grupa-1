/**
 * Zwraca projekcje czasów (sekundy od startu) na kolejne oficjalne punkty.
 * - Jeśli istnieją >= 2 raporty → tempo z ostatniego odcinka (poprzedni→ostatni).
 * - Jeśli istnieje 1 raport → tempo średnie (secs / km).
 * - Jeśli brak raportów → pusta lista.
 *
 * @param {Array<{km:number, secs:number}>} reports posortowane lub nie (posortujemy lokalnie)
 * @param {Array<{km:number, cutoffSeconds:number}>} checkpoints oficjalne punkty
 * @returns {Array<{km:number, projectedSeconds:number, basis:'segment'|'avg'}>}
 */
export function computeCheckpointProjections(reports, checkpoints) {
  if (!Array.isArray(reports) || reports.length === 0) return [];
  const sortedReports = reports.slice().sort((a, b) => a.km - b.km);
  const last = sortedReports[sortedReports.length - 1];

  // Ustal tempo
  let pacePerKm = null;
  let basis = 'avg';
  if (sortedReports.length >= 2) {
    const prev = sortedReports[sortedReports.length - 2];
    const dKm = last.km - prev.km;
    const dSec = last.secs - prev.secs;
    pacePerKm = dSec / Math.max(dKm, 1e-9);
    basis = 'segment';
  } else {
    pacePerKm = last.secs / Math.max(last.km, 1e-9);
    basis = 'avg';
  }

  // Projekcja tylko dla checkpointów > ostatni raport
  const futureCps = checkpoints
    .filter(cp => cp.km > last.km)
    .sort((a, b) => a.km - b.km);

  return futureCps.map(cp => ({
    km: cp.km,
    projectedSeconds: last.secs + pacePerKm * (cp.km - last.km),
    basis,
  }));
}

/**
 * Projekcja czasu ukończenia biegu (np. 50 km).
 * - Jeśli są ≥2 raporty → tempo z ostatniego odcinka (poprzedni→ostatni).
 * - Jeśli jest 1 raport → tempo średnie od startu.
 * - Jeśli brak raportów → zwraca null.
 *
 * @param {Array<{km:number, secs:number}>} reports
 * @param {number} totalKm - dystans mety (np. 50)
 * @returns {{ projectedSeconds:number, basis:'segment'|'avg' } | null}
 */
export function computeFinishProjection(reports, totalKm) {
  if (!Array.isArray(reports) || reports.length === 0) return null;

  const sorted = reports.slice().sort((a, b) => a.km - b.km);
  const last = sorted[sorted.length - 1];

  // Jeśli mamy już raport na mecie lub dalej — to już "meta"
  if (last.km >= totalKm) {
    return { projectedSeconds: last.secs, basis: 'observed' };
  }

  let pacePerKm, basis;
  if (sorted.length >= 2) {
    const prev = sorted[sorted.length - 2];
    const dKm = last.km - prev.km;
    const dSec = last.secs - prev.secs;
    pacePerKm = dSec / Math.max(dKm, 1e-9);
    basis = 'segment';
  } else {
    pacePerKm = last.secs / Math.max(last.km, 1e-9);
    basis = 'avg';
  }

  const projectedSeconds = last.secs + pacePerKm * (totalKm - last.km);
  return { projectedSeconds, basis };
}