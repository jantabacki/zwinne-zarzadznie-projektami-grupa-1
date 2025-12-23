import { secondsToHms } from './time';

/**
 * Wejście może być:
 *  A) tablicą obiektów: [ { km, cutoffSeconds } | { km, cutoff: "HH:MM:SS" }, ... ]
 *  B) obiektem: { name?: string, checkpoints: [ ...jak wyżej... ] }
 * Zwraca: { checkpoints: Array<{km:number, cutoffSeconds:number}>, name?: string }
 */
export function normalizeCheckpointsFile(jsonInput) {
  let data = jsonInput;
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch { throw new Error('Niepoprawny JSON.'); }
  }

  let name;
  let items;
  if (Array.isArray(data)) {
    items = data;
  } else if (data && typeof data === 'object' && Array.isArray(data.checkpoints)) {
    name = typeof data.name === 'string' && data.name.trim() ? data.name.trim() : undefined;
    items = data.checkpoints;
  } else {
    throw new Error('Spodziewano tablicy lub obiektu z polem "checkpoints".');
  }

  const out = [];
  for (const [idx, item] of items.entries()) {
    const path = `element[${idx}]`;
    if (!item || typeof item !== 'object') throw new Error(`${path} nie jest obiektem.`);
    const km = Number(item.km);
    if (!Number.isFinite(km) || km <= 0) throw new Error(`${path}.km musi być dodatnią liczbą.`);

    let cutoffSeconds = null;
    if (item.cutoffSeconds != null) {
      cutoffSeconds = Number(item.cutoffSeconds);
      if (!Number.isFinite(cutoffSeconds) || cutoffSeconds < 0) {
        throw new Error(`${path}.cutoffSeconds musi być nieujemną liczbą.`);
      }
    } else if (item.cutoff != null) {
      cutoffSeconds = hhmmssToSeconds(String(item.cutoff));
      if (cutoffSeconds == null) throw new Error(`${path}.cutoff ma niepoprawny format HH:MM:SS.`);
    } else {
      throw new Error(`${path} wymaga cutoffSeconds lub cutoff (HH:MM:SS).`);
    }
    out.push({ km, cutoffSeconds });
  }

  // ostatnia definicja wygrywa, sort rosnący po km
  const byKm = new Map(out.map(o => [o.km, o]));
  const sorted = Array.from(byKm.values()).sort((a, b) => a.km - b.km);

  // dodatkowa walidacja: limit musi rosnąć z km
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].cutoffSeconds < sorted[i - 1].cutoffSeconds) {
      const prev = `${sorted[i-1].km}km (${secondsToHms(sorted[i-1].cutoffSeconds)})`;
      const cur  = `${sorted[i].km}km (${secondsToHms(sorted[i].cutoffSeconds)})`;
      throw new Error(`Limit czasu powinien rosnąć: ${prev} → ${cur}.`);
    }
  }

  return { checkpoints: sorted, name };
}

function hhmmssToSeconds(text) {
  const parts = text.split(':').map(x => x.trim());
  if (parts.length !== 3) return null;
  const [h, m, s] = parts.map(Number);
  if (![h,m,s].every(Number.isFinite)) return null;
  if (h < 0 || m < 0 || m > 59 || s < 0 || s > 59) return null;
  return h*3600 + m*60 + s;
}