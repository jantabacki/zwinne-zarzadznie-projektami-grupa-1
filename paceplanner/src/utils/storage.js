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

import { ROUTES_STORAGE_KEY, ACTIVE_ROUTE_ID_KEY, ROUTE_STORAGE_KEY } from '../constants/config'; // ROUTE_STORAGE_KEY było dodane wcześniej (pojedyncza trasa)

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

/** Prosty generator ID (bez kolizji w praktyce) */
function genId() {
  return 'r_' + Math.random().toString(36).slice(2, 10);
}

/** Walidacja/normalizacja checkpointów (km>0, cutoffSeconds>=0) */
function normalizeCheckpointsArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map(cp => ({ km: Number(cp.km), cutoffSeconds: Number(cp.cutoffSeconds) }))
    .filter(cp => Number.isFinite(cp.km) && cp.km > 0 && Number.isFinite(cp.cutoffSeconds) && cp.cutoffSeconds >= 0)
    .sort((a, b) => a.km - b.km);
}

/** ====== MIGRACJA ze starego klucza pojedynczej trasy ====== */
function migrateLegacySingleRouteIfAny() {
  try {
    const raw = localStorage.getItem(ROUTE_STORAGE_KEY);
    if (!raw) return null;
    const cp = JSON.parse(raw);
    const checkpoints = normalizeCheckpointsArray(cp);
    localStorage.removeItem(ROUTE_STORAGE_KEY); // czyścimy stary format
    if (!checkpoints.length) return null;
    const id = genId();
    const route = { id, name: 'Zaimportowana trasa', checkpoints };
    const routes = [route];
    localStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(routes));
    localStorage.setItem(ACTIVE_ROUTE_ID_KEY, id);
    return route;
  } catch {
    return null;
  }
}

/** ====== Kolekcja tras (CRUD) ====== */
export function loadRoutes() {
  try {
    const raw = localStorage.getItem(ROUTES_STORAGE_KEY);
    if (!raw) return migrateLegacySingleRouteIfAny() ? JSON.parse(localStorage.getItem(ROUTES_STORAGE_KEY)) : [];
    const routes = JSON.parse(raw);
    if (!Array.isArray(routes)) return [];
    return routes
      .map(r => ({ id: String(r.id || genId()), name: String(r.name || 'Trasa'), checkpoints: normalizeCheckpointsArray(r.checkpoints) }))
      .filter(r => r.checkpoints.length > 0);
  } catch {
    return [];
  }
}

export function saveRoutes(routes) {
  try {
    localStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(routes));
  } catch {}
}

export function loadActiveRouteId() {
  try {
    return localStorage.getItem(ACTIVE_ROUTE_ID_KEY) || null;
  } catch { return null; }
}

export function saveActiveRouteId(id) {
  try {
    if (id) localStorage.setItem(ACTIVE_ROUTE_ID_KEY, id);
  } catch {}
}

/** Dodaj nową trasę (z nadanym ID). Zwraca {id} */
export function addRoute({ name, checkpoints }) {
  const routes = loadRoutes();
  const id = genId();
  const norm = normalizeCheckpointsArray(checkpoints);
  if (!norm.length) return null;
  routes.push({ id, name: name || 'Nowa trasa', checkpoints: norm });
  saveRoutes(routes);
  return { id };
}

/** Nadpisz trasę po ID */
export function updateRoute({ id, name, checkpoints }) {
  const routes = loadRoutes();
  const i = routes.findIndex(r => r.id === id);
  if (i < 0) return false;
  const next = { ...routes[i] };
  if (name != null) next.name = String(name);
  if (checkpoints != null) next.checkpoints = normalizeCheckpointsArray(checkpoints);
  routes[i] = next;
  saveRoutes(routes);
  return true;
}

/** Usuń trasę po ID */
export function deleteRoute(id) {
  const routes = loadRoutes().filter(r => r.id !== id);
  saveRoutes(routes);
  // jeśli usunięto aktywną, wyczyść aktywne ID
  const active = loadActiveRouteId();
  if (active === id) saveActiveRouteId(routes[0]?.id || '');
  return true;
}