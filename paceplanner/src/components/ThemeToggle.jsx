import React, { useEffect, useState } from 'react';
import { loadInitialTheme, persistTheme, loadInitialAccent, persistAccent } from '../hooks/useTheme';

/**
 * Panel sterowania motywem i kolorem akcentu.
 * - Przełącza atrybut data-theme na <html>
 * - Ustawia CSS var(--accent)
 * - Zapisuje preferencje w localStorage
 */
export default function ThemeToggle(){
  const [theme, setTheme] = useState('dark');
  const [accent, setAccent] = useState('#2B8EF0');

  useEffect(() => {
    setTheme(loadInitialTheme());
    setAccent(loadInitialAccent());
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    persistTheme(theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
    persistAccent(accent);
  }, [accent]);

  return (
    <section className="card">
      <h3 className="mt-0 mb-8">Motyw i akcent</h3>

      <div className="row">
        <label className="hint" style={{ minWidth: 90 }}>Motyw</label>
        <div className="row" style={{ gap: 8 }}>
          <button
            className="btn"
            onClick={() => setTheme('dark')}
            aria-pressed={theme==='dark'}
            style={{ opacity: theme==='dark' ? 1 : .7 }}
          >Dark</button>
          <button
            className="btn"
            onClick={() => setTheme('light')}
            aria-pressed={theme==='light'}
            style={{ opacity: theme==='light' ? 1 : .7 }}
          >Light</button>
        </div>
      </div>

      <div className="row" style={{ marginTop: 10 }}>
        <label className="hint" style={{ minWidth: 90 }}>Akcent</label>
        <div className="row" style={{ gap: 8 }}>
          {[
            '#2B8EF0', // blue
            '#7C3AED', // violet
            '#06B6D4', // cyan
            '#10B981', // emerald
            '#F59E0B', // amber
            '#EF4444', // red
          ].map(hex => (
            <button
              key={hex}
              className="btn"
              onClick={() => setAccent(hex)}
              aria-label={`Ustaw akcent ${hex}`}
              style={{
                background: hex,
                borderColor: hex,
                color: '#071021',
                opacity: accent===hex ? 1 : .75
              }}
            >
              {hex.toUpperCase()}
            </button>
          ))}
          <input
            type="color"
            value={accent}
            onChange={(e)=>setAccent(e.target.value)}
            title="Własny kolor akcentu"
            style={{ width: 44, height: 36, padding: 0, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--soft)' }}
          />
        </div>
      </div>

      <p className="hint" style={{ marginTop: 8 }}>
        Akcent zmienia kolor przycisków i podkreśleń, motyw wpływa na tła i typografię.
      </p>
    </section>
  );
}