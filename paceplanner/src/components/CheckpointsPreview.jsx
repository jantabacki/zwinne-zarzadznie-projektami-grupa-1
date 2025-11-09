import React from 'react';
import { OFFICIAL_CHECKPOINTS } from '../constants/checkpoints';
import { secondsToHms } from '../utils/time';

/**
 * Minimalny podgląd listy punktów i ich oficjalnych limitów.
 * (Pełna tabela z raportami pojawi się w innym story/epicu.)
 */
export default function CheckpointsPreview() {
  return (
    <section className="card">
      <h3 className="mt-0 mb-8">Domyślne punkty kontrolne i limity</h3>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>km</th>
              <th>Limit (od startu)</th>
            </tr>
          </thead>
          <tbody>
            {OFFICIAL_CHECKPOINTS.map(cp => (
              <tr key={cp.km}>
                <td>{cp.km}</td>
                <td className="mono">{secondsToHms(cp.cutoffSeconds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="hint" style={{ marginTop: 8 }}>
        Źródło: stała konfiguracyjna w <code>constants/checkpoints.js</code>.
      </p>
    </section>
  );
}