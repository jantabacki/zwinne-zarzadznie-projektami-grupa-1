import { toBase64Url } from './base64url';

/**
 * Tworzy URL z parametrem `s=` zawierającym stan aplikacji (JSON → Base64URL).
 * - origin i pathname bierzemy z bieżącego okna;
 * - kasujemy istniejący `?s=` jeśli był.
 */
export function createShareUrl(stateObj) {
  const json = JSON.stringify({
    v: 3, // wersja formatu
    startClockText: stateObj.startClockText || '',
    spectatorReports: Array.isArray(stateObj.spectatorReports) ? stateObj.spectatorReports : [],
  });

  const encoded = toBase64Url(json);

  const { origin, pathname, hash } = window.location;
  // Usuń istniejące query, zbuduj czysty URL z ?s=
  return `${origin}${pathname}?s=${encoded}${hash || ''}`;
}

/** Kopiuje tekst do schowka (Clipboard API lub fallback). Zwraca true/false. */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  // fallback (tymczasowe textarea)
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select(); ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}