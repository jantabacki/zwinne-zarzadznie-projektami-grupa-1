const THEME_KEY = 'pacePlannerThemeV1';     // 'dark' | 'light'
const ACCENT_KEY = 'pacePlannerAccentV1';   // np. '#2B8EF0'

function getSystemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function loadInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {}
  return getSystemPrefersDark() ? 'dark' : 'light';
}

export function persistTheme(theme) {
  try { localStorage.setItem(THEME_KEY, theme); } catch {}
}

export function loadInitialAccent() {
  try {
    const saved = localStorage.getItem(ACCENT_KEY);
    if (saved) return saved;
  } catch {}
  return '#2B8EF0';
}

export function persistAccent(hex) {
  try { localStorage.setItem(ACCENT_KEY, hex); } catch {}
}