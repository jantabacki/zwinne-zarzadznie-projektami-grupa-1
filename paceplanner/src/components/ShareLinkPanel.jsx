import React, { useMemo, useState } from 'react';
import { createShareUrl, copyToClipboard } from '../utils/share';

/**
 * Generuje link `?s=` na podstawie przekazanego stanu i pozwala skopiować do schowka.
 */
export default function ShareLinkPanel({ state }) {
  const [copied, setCopied] = useState(false);

  const url = useMemo(() => createShareUrl(state), [state]);

  async function handleCopy() {
    const ok = await copyToClipboard(url);
    setCopied(!!ok);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="card">
      <h3 className="mt-0 mb-8">Udostępnij stan</h3>
      <div className="row">
        <input
          type="text"
          readOnly
          value={url}
          onFocus={(e) => e.target.select()}
          style={{ flex: 1 }}
          aria-label="Link udostępniania"
        />
        <button className="btn" onClick={handleCopy}>
          {copied ? 'Skopiowano ✓' : 'Kopiuj link'}
        </button>
      </div>
      <p className="hint" style={{ marginTop: 8 }}>
        Link zawiera godzinę startu i wszystkie raporty (zakodowane w Base64URL).
      </p>
    </section>
  );
}