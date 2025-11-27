/**
 * Oficjalne punkty kontrolne i limity czasu (sekundy od startu).
 * Utrzymujemy je w jednym miejscu, aby łatwo podmieniać/konfigurować.
 */
export const OFFICIAL_CHECKPOINTS = [
  { km: 18, cutoffSeconds: 1 * 3600 + 52 * 60 }, // 1:52:00
  { km: 28, cutoffSeconds: 3 * 3600 + 13 * 60 }, // 3:13:00
  { km: 38, cutoffSeconds: 4 * 3600 + 35 * 60 }, // 4:35:00
  { km: 43, cutoffSeconds: 5 * 3600 + 17 * 60 }, // 5:17:00
  { km: 50, cutoffSeconds: 6 * 3600 + 15 * 60 }, // 6:15:00 (meta)
];