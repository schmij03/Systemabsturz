/* =====================================================================
   Systemabsturz: Service Worker für den Offline-Betrieb
   ---------------------------------------------------------------------
   Beim ersten Aufruf werden alle Dateien im Browser gespeichert.
   Danach funktioniert das Spiel auch ohne Internet (z. B. wenn das
   WLAN der Schule ausfällt). Strategie: zuerst Netz, sonst Cache.
   Nach Änderungen am Spiel CACHE_NAME erhöhen.
   Lizenz: CC BY-SA 4.0, Christof Heiss, Jan Schmid, PH Luzern 2026
   ===================================================================== */

const CACHE_NAME = 'systemabsturz-v1';

const DATEIEN = [
  './',
  'index.html',
  'terminal.html',
  'spielleitung.html',
  'css/style.css',
  'js/app.js',
  'js/blocks.js',
  'js/maze.js',
  'lib/blockly/blockly_compressed.js',
  'lib/blockly/msg/de.js',
  'lib/blockly/media/1x1.gif',
  'lib/blockly/media/click.mp3',
  'lib/blockly/media/delete-icon.svg',
  'lib/blockly/media/delete.mp3',
  'lib/blockly/media/disconnect.mp3',
  'lib/blockly/media/drop.mp3',
  'lib/blockly/media/dropdown-arrow.svg',
  'lib/blockly/media/foldout-icon.svg',
  'lib/blockly/media/handclosed.cur',
  'lib/blockly/media/handdelete.cur',
  'lib/blockly/media/handopen.cur',
  'lib/blockly/media/pilcrow.png',
  'lib/blockly/media/quote0.png',
  'lib/blockly/media/quote1.png',
  'lib/blockly/media/resize-handle.svg',
  'lib/blockly/media/sprites.svg',
  'sounds/erfolg.mp3',
  'sounds/fehler.mp3',
  'sounds/alarm.mp3',
  'sounds/klick.mp3',
  'sounds/fanfare.mp3'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // Einzeln laden, damit eine fehlende Datei nicht alles verhindert
      return Promise.all(DATEIEN.map(function (d) {
        return cache.add(d).catch(function () { /* Datei fehlt: überspringen */ });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (namen) {
      return Promise.all(namen.filter(function (n) { return n !== CACHE_NAME; }).map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  const anfrage = e.request;
  if (anfrage.method !== 'GET' || new URL(anfrage.url).origin !== self.location.origin) return;
  // Videos nicht cachen (gross, werden in Teilen geladen)
  if (anfrage.url.indexOf('/videos/') >= 0) return;
  e.respondWith(
    fetch(anfrage).then(function (antwort) {
      if (antwort && antwort.ok && antwort.status === 200) {
        const kopie = antwort.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(anfrage, kopie); });
      }
      return antwort;
    }).catch(function () {
      return caches.match(anfrage, { ignoreSearch: true });
    })
  );
});
