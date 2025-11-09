import { secondsToHms } from './time';

/**
 * Akceptowany JSON:
 * [
 *   { "km": 18, "cutoffSeconds": 6720 },          // sekundy od startu
 *   { "km": 28, "cutoff": "3:13:00" }             // alternatywnie HH:MM:SS
 * ]
 * Zwracamy: posortowaną tablicę [{ km:Number, cutoffSeconds:Number }]
 */
export function normalizeCheckpoints(jsonInput) {
  let data = jsonInput;
  if (typeof jsonInput === 'string') {
    try { data = JSON.parse(jsonInput); } 
    catch { throw new Error('Niepoprawny JSON.'); }
  }
  if (!Array.isArray(data)) {
    throw new Error('Oczekiwano tablicy obiektów.');
  }

  const out = [];
  for (const [idx, item] of data.entries()) {
    const path = `element[${idx}]`;
    if (typeof item !== 'object' || item == null) {
      throw new Error(`${path} nie jest obiektem.`);
    }
    // km
    const km = Number(item.km);
    if (!Number.isFinite(km) || km <= 0) {
      throw new Error(`${path}.km musi być dodatnią liczbą.`);
    }

    // cutoffSeconds albo cutoff (HH:MM:SS)
    let cutoffSeconds = null;
    if (item.cutoffSeconds != null) {
      cutoffSeconds = Number(item.cutoffSeconds);
      if (!Number.isFinite(cutoffSeconds) || cutoffSeconds < 0) {
        throw new Error(`${path}.cutoffSeconds musi być nieujemną liczbą.`);
      }
    } else if (item.cutoff != null) {
      cutoffSeconds = hhmmssToSeconds(String(item.cutoff));
      if (cutoffSeconds == null) {
        throw new Error(`${path}.cutoff ma niepoprawny format HH:MM:SS.`);
      }
    } else {
      throw new Error(`${path} wymaga cutoffSeconds lub cutoff (HH:MM:SS).`);
    }

    out.push({ km, cutoffSeconds });
  }

  // Scal duplikaty km (zachowaj ostatnią definicję), posortuj po km
  const byKm = new Map(out.map(o => [o.km, o]));
  const sorted = Array.from(byKm.values()).sort((a,b)=>a.km - b.km);

  // Walidacje dodatkowe: rosnące limity czasu (opcjonalnie, ale sensowne)
  for (let i=1; i<sorted.length; i++) {
    if (sorted[i].cutoffSeconds < sorted[i-1].cutoffSeconds) {
      const prev = `${sorted[i-1].km}km (${secondsToHms(sorted[i-1].cutoffSeconds)})`;
      const cur  = `${sorted[i].km}km (${secondsToHms(sorted[i].cutoffSeconds)})`;
      throw new Error(`Limit czasu powinien rosnąć: ${prev} → ${cur}.`);
    }
  }

  return sorted;
}

function hhmmssToSeconds(text) {
  const parts = text.split(':').map(x=>x.trim());
  if (parts.length !== 3) return null;
  const [h, m, s] = parts.map(Number);
  if (![h,m,s].every(Number.isFinite)) return null;
  if (h < 0 || m < 0 || m > 59 || s < 0 || s > 59) return null;
  return h*3600 + m*60 + s;
}