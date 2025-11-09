/**
 * Parsuje godzinę startu w formacie HH:MM lub HH:MM:SS.
 * Zwraca liczbę sekund od północy albo null, jeśli format niepoprawny.
 */
export function parseStartClockToSeconds(clockText) {
  if (!clockText) return null;
  const parts = String(clockText).trim().split(':');
  if (parts.length < 2 || parts.length > 3) return null;

  const [hRaw, mRaw, sRaw = '0'] = parts;
  const h = Number(hRaw), m = Number(mRaw), s = Number(sRaw);

  if (![h, m, s].every(Number.isFinite)) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) return null;

  return h * 3600 + m * 60 + s;
}