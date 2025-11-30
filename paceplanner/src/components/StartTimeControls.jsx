import React, { useEffect, useState } from 'react';
import { parseStartClockToSeconds } from '../utils/time';

/**
 * Kontrolka ustawiania godziny startu.
 * - Przyjmuje startClockText (string) i onChangeStart(newText)
 * - Waliduje format HH:MM opcjonalnie HH:MM:SS
 * - onChangeStart wywoływany TYLKO, gdy wpis jest poprawny
 */
export default function StartTimeControls({ startClockText, onChangeStart }) {
  const [inputValue, setInputValue] = useState(startClockText || '');
  const [error, setError] = useState('');

  // Gdy wartość z "góry" się zmieni (np. reset), zsynchronizuj input
  useEffect(() => {
    setInputValue(startClockText || '');
    setError('');
  }, [startClockText]);

  function validateAndPropagate(next) {
    setInputValue(next);

    // Pusta wartość: traktujemy neutralnie (nie wysyłamy do parenta)
    if (!next.trim()) {
      setError('');
      return;
    }

    const secs = parseStartClockToSeconds(next);
    if (secs == null) {
      setError('Nieprawidłowy format. Użyj HH:MM lub HH:MM:SS (np. 07:30 lub 07:30:00).');
      return;
    }

    // Poprawny format → czyść błąd i przekaż do parenta
    setError('');
    onChangeStart(next);
  }

  return (
    <section className="card">
      <label>Godzina startu (HH:MM lub HH:MM:SS)</label>
      <input
        type="text"
        placeholder="07:30"
        value={inputValue}
        onChange={(e) => validateAndPropagate(e.target.value)}
        aria-invalid={error ? 'true' : 'false'}
      />
      {!error ? (
        <p className="hint">Przykład: <code>07:30</code> lub <code>07:30:00</code>.</p>
      ) : (
        <p className="hint" style={{ color: '#ef4444' }}>{error}</p>
      )}
    </section>
  );
}