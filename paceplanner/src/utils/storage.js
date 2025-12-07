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