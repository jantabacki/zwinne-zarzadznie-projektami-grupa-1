import { fromBase64Url } from './base64url';
import { normalizeState } from './storage';

/**
 * Próbuje wczytać stan z parametru ?s= (Base64URL JSON).
 * Zwraca { startClockText, spectatorReports } lub null.
 */
export function loadStateFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('s');
    if (!encoded) return null;

    const json = fromBase64Url(encoded);
    const parsed = JSON.parse(json);
    return normalizeState(parsed);
  } catch {
    return null;
  }
}

/**
 * Opcjonalnie usuń ?s= z adresu po wczytaniu (żeby link był „czysty”).
 */
export function stripShareParamFromUrl() {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has('s')) {
      url.searchParams.delete('s');
      window.history.replaceState({}, document.title, url.toString());
    }
  } catch {}
}