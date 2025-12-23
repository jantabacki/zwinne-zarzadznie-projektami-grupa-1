import React from 'react';
import { OFFICIAL_CHECKPOINTS } from '../constants/checkpoints';
import { secondsToHms } from '../utils/time';

export default function CheckpointsPreview({ checkpoints }) {
  const list = checkpoints && checkpoints.length ? checkpoints : OFFICIAL_CHECKPOINTS;
  return (
    <section className="card">
      <h3 className="mt-0 mb-8">Punkty kontrolne i limity</h3>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>km</th>
              <th>Limit (od startu)</th>
            </tr>
          </thead>
          <tbody>
            {list.map(cp => (
              <tr key={cp.km}>
                <td>{cp.km}</td>
                <td className="mono">{secondsToHms(cp.cutoffSeconds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="hint" style={{ marginTop: 8 }}>
        {checkpoints ? 'Załadowano trasę z JSON.' : 'Źródło: domyślna konfiguracja OFFICIAL_CHECKPOINTS.'}
      </p>
    </section>
  );
}