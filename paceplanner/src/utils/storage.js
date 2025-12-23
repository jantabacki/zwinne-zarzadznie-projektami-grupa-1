import { PERSISTENCE_STORAGE_KEY } from '../constants/config';

function safeParse(json) {
  try { return JSON.parse(json); } catch { return null; }
}

/** ➜ TERAZ eksportujemy (użyje go też URL loader) */
export function normalizeState(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const startClockText = typeof raw.startClockText === 'string' ? raw.startClockText : '';
  const reports = Array.isArray(raw.spectatorReports) ? raw.spectatorReports : [];

  const spectatorReports = reports
    .map(r => ({ km: Number(r.km), secs: Number(r.secs) }))
    .filter(r => Number.isFinite(r.km) && r.km > 0 && Number.isFinite(r.secs) && r.secs >= 0)
    .sort((a, b) => a.km - b.km);

  return { startClockText, spectatorReports };
}

export function loadPersistedState() {
  try {
    const raw = localStorage.getItem(PERSISTENCE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = safeParse(raw);
    return normalizeState(parsed);
  } catch {
    return null;
  }
}

export function savePersistedState(state) {
  try {
    const payload = {
      version: 3,
      startClockText: state.startClockText || '',
      spectatorReports: Array.isArray(state.spectatorReports) ? state.spectatorReports : [],
    };
    localStorage.setItem(PERSISTENCE_STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

import { ROUTE_STORAGE_KEY } from '../constants/config';

/** Zapis/odczyt trasy (checkpointów) — niezależnie od stanu raportów. */
export function saveRouteCheckpoints(checkpoints) {
  try {
    if (!Array.isArray(checkpoints)) return;
    const payload = checkpoints.map(cp => ({ km: Number(cp.km), cutoffSeconds: Number(cp.cutoffSeconds) }))
      .filter(cp => Number.isFinite(cp.km) && cp.km > 0 && Number.isFinite(cp.cutoffSeconds) && cp.cutoffSeconds >= 0);
    localStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

export function loadRouteCheckpoints() {
  try {
    const raw = localStorage.getItem(ROUTE_STORAGE_KEY);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return null;
    const normalized = arr.map(cp => ({ km: Number(cp.km), cutoffSeconds: Number(cp.cutoffSeconds) }))
      .filter(cp => Number.isFinite(cp.km) && cp.km > 0 && Number.isFinite(cp.cutoffSeconds) && cp.cutoffSeconds >= 0)
      .sort((a, b) => a.km - b.km);
    return normalized.length ? normalized : null;
  } catch { return null; }
}

export function clearRouteCheckpoints() {
  try { localStorage.removeItem(ROUTE_STORAGE_KEY); } catch {}
}