import React from 'react';
import { secondsToHms } from '../utils/time';

export default function ReportsPreview({ reports, onDeleteReport }) {
  return (
    <section className="card">
      <h3 className="mt-0 mb-8">Dodane raporty</h3>

      {(!reports || reports.length === 0) ? (
        <p className="hint">Brak raportów.</p>
      ) : (
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>km</th>
                <th>Czas od startu</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.km}>
                  <td>{r.km}</td>
                  <td className="mono">{secondsToHms(r.secs)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn danger"
                      onClick={() => onDeleteReport?.(r.km)}
                      aria-label={`Usuń raport dla ${r.km} km`}
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}