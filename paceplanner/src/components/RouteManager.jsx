import React, { useRef, useState } from 'react';
import { normalizeCheckpointsFile } from '../utils/checkpoints';
import { addRoute, updateRoute, deleteRoute, saveActiveRouteId } from '../utils/storage';

/**
 * RouteManager — zarządzanie wieloma trasami.
 * props:
 *  - routes: Array<{id,name,checkpoints}>
 *  - activeId: string|null
 *  - onChangeActive(id)
 *  - onRefresh()  // wywołaj po zmianach CRUD żeby odczytać z storage i odświeżyć listę w App
 */
export default function RouteManager({ routes, activeId, onChangeActive, onRefresh }) {
  const fileRef = useRef(null);
  const [error, setError] = useState('');
  const [renameMap, setRenameMap] = useState({}); // id -> text

  function setActive(id) {
    saveActiveRouteId(id);
    onChangeActive?.(id);
  }

  async function handleImport(e) {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const { checkpoints, name } = normalizeCheckpointsFile(text);
      const res = addRoute({ name: name || file.name.replace(/\.[^.]+$/, ''), checkpoints });
      if (res?.id) setActive(res.id);
      onRefresh?.();
    } catch (err) {
      setError(err?.message || 'Nie udało się wczytać pliku.');
    } finally {
      e.target.value = '';
    }
  }

  function handleDelete(id) {
    if (!confirm('Usunąć tę trasę?')) return;
    deleteRoute(id);
    onRefresh?.();
  }

  function handleRename(id) {
    const name = (renameMap[id] || '').trim();
    if (!name) return;
    updateRoute({ id, name });
    onRefresh?.();
    setRenameMap(prev => ({ ...prev, [id]: '' }));
  }

  function exportRoute(route) {
    const blob = new Blob([JSON.stringify({ name: route.name, checkpoints: route.checkpoints }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${route.name || 'trasa'}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="card">
      <h3 className="mt-0 mb-8">Menedżer tras</h3>

      <div className="row">
        <input type="file" ref={fileRef} accept=".json,application/json" onChange={handleImport} />
        <button className="btn" onClick={() => fileRef.current?.click()}>Importuj z pliku…</button>
      </div>

      {error && <p className="hint" style={{ color: '#ef4444', marginTop: 8 }}>{error}</p>}

      {!routes?.length ? (
        <p className="hint" style={{ marginTop: 8 }}>Brak zapisanych tras. Zaimportuj pierwszą z pliku JSON.</p>
      ) : (
        <div className="tableWrap" style={{ marginTop: 10 }}>
          <table>
            <thead>
              <tr>
                <th>Aktywna</th>
                <th>Nazwa</th>
                <th>Checkpointy</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {routes.map(r => (
                <tr key={r.id}>
                  <td>
                    <input
                      type="radio"
                      name="activeRoute"
                      checked={activeId === r.id}
                      onChange={() => setActive(r.id)}
                      aria-label={`Ustaw trasę ${r.name} jako aktywną`}
                    />
                  </td>
                  <td>
                    <div className="row">
                      <input
                        type="text"
                        placeholder={r.name || 'Trasa'}
                        value={renameMap[r.id] ?? ''}
                        onChange={e => setRenameMap(prev => ({ ...prev, [r.id]: e.target.value }))}
                      />
                      <button className="btn" onClick={() => handleRename(r.id)}>Zmień</button>
                    </div>
                  </td>
                  <td className="mono">{r.checkpoints.length}</td>
                  <td className="row" style={{ justifyContent: 'flex-end' }}>
                    <button className="btn" onClick={() => exportRoute(r)}>Eksportuj</button>
                    <button className="btn danger" onClick={() => handleDelete(r.id)}>Usuń</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="hint" style={{ marginTop: 8 }}>
        Ustaw aktywną trasę (radio), zmień nazwę, eksportuj do JSON lub usuń. Import dodaje nową trasę i ustawia ją jako aktywną.
      </p>
    </section>
  );
}