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