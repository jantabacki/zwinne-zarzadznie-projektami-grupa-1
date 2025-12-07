/** Kodowanie/decoding w wariancie Base64URL (bez paddingu '=') */
export function toBase64Url(strUtf8) {
  // UTF-8 → percent-encoded → binary → base64
  const base64 = btoa(unescape(encodeURIComponent(strUtf8)));
  // base64 → base64url (zamiana +/ i usunięcie '=')
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function fromBase64Url(b64url) {
  const base64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  // uzupełnij padding do /4
  const padLen = (4 - (base64.length % 4)) % 4;
  const padded = base64 + '='.repeat(padLen);
  const utf8 = decodeURIComponent(escape(atob(padded)));
  return utf8;
}