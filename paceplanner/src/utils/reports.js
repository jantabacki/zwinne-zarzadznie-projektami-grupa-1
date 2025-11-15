import { TOTAL_RACE_LIMIT_SECONDS } from '../constants/config';

/**
 * Zasada interpretacji czasu raportu:
 *  - "MM:SS" → elapsed (od startu)
 *  - "HH:MM:SS" → jeśli suma ≤ limit biegu → elapsed; jeśli > limit → traktuj jako godzina zegarowa
 *  - "HH:MM" → jeśli wygląda na zegar i > limit biegu → godzina zegarowa; inaczej traktuj jak MM:SS (elapsed)
 * Dla godzin zegarowych wymagany jest startClockSeconds (sekundy od północy).
 *
 * Zwraca: sekundy od startu (Number) albo null, gdy format niepoprawny / brak startu dla zegara.
 */
export function parseReportTextToElapsedSeconds(reportText, startClockSeconds) {
  if (!reportText) return null;
  const parts = String(reportText).trim().split(':').map(x => x.trim());
  if (parts.length < 2 || parts.length > 3) return null;

  const nums = parts.map(Number);
  if (nums.some(n => !Number.isFinite(n) || n < 0)) return null;

  if (parts.length === 3) {
    const [h, m, s] = nums;
    if (m > 59 || s > 59) return null;
    const total = h * 3600 + m * 60 + s;
    if (total <= TOTAL_RACE_LIMIT_SECONDS) {
      return total; // elapsed
    }
    // godzina zegarowa
    if (startClockSeconds == null) return null;
    return ((total - startClockSeconds) + 86400) % 86400;
  }

  // parts.length === 2 → HH:MM (zegar?) lub MM:SS (elapsed)
  const [a, b] = nums;
  if (b > 59) return null;
  const looksLikeWallClock = a <= 23 && b <= 59;
  const wallTotal = a * 3600 + b * 60;

  if (looksLikeWallClock && wallTotal > TOTAL_RACE_LIMIT_SECONDS) {
    if (startClockSeconds == null) return null;
    return ((wallTotal - startClockSeconds) + 86400) % 86400;
  }

  // w przeciwnym razie traktuj jako MM:SS
  return a * 60 + b;
}