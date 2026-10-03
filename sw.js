/* =====================================================================
   Systemabsturz: Service Worker für den Offline-Betrieb
   ---------------------------------------------------------------------
   Beim ersten Aufruf werden alle Dateien im Browser gespeichert.
   Danach funktioniert das Spiel auch ohne Internet (z. B. wenn das
   WLAN der Schule ausfällt). Strategie: zuerst Netz, sonst Cache.
   Nach Änderungen am Spiel CACHE_NAME erhöhen.
   Lizenz: CC BY-SA 4.0, Christof Heiss, Jan Schmid, PH Luzern 2026
   ===================================================================== */

const CACHE_NAME = 'systemabsturz-v23';

const DATEIEN = [
  './',
  'index.html',
  'terminal.html',
  'spielleitung.html',
  'css/style.css',
  'js/app.js',
  'js/blocks.js',
  'js/maze.js',
  'js/netzwerke.js',
  'img/maske.svg',
  'img/hintergrund-anweisung.webp',
  'druck/druck.css',
  'druck/auftrag.html',
  'druck/protokoll1.html',
  'druck/protokoll2.html',
  'druck/protokoll3.html',
  'druck/teamset.html',
  'druck/seiten.js',
  'material/Systemabsturz_Teamset_Leicht.html',
  'material/Systemabsturz_Teamset_Mittel.html',
  'material/Systemabsturz_Teamset_Schwer.html',
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
      const alle = Promise.all(DATEIEN.map(function (d) {
        return cache.add(d).catch(function () { /* Datei fehlt: überspringen */ });
      }));
      // Sprachaufnahmen laut audio/tts/verzeichnis.json ebenfalls speichern
      const stimmen = fetch('audio/tts/verzeichnis.json').then(function (r) { return r.ok ? r.json() : null; })
        .then(function (v) {
          if (!v || !v.dateien) return null;
          const liste = ['audio/tts/verzeichnis.json'].concat(Object.keys(v.dateien).map(function (k) { return 'audio/tts/' + v.dateien[k]; }));
          return Promise.all(liste.map(function (d) { return cache.add(d).catch(function () { /* überspringen */ }); }));
        }).catch(function () { /* ohne Aufnahmen */ });
      return Promise.all([alle, stimmen]);
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

/* Strategie für schnelle Ladezeiten im Schul-WLAN:
   - Seiten (HTML): zuerst Netz (max. 2.5 s warten), sonst gespeicherte Version
   - alle anderen Dateien (JS, CSS, Bilder, Töne, Blockly): sofort aus dem
     Speicher, im Hintergrund wird die Datei aktualisiert (stale-while-revalidate) */
const NETZ_TIMEOUT_MS = 2500;

function speichern(anfrage, antwort) {
  if (antwort && antwort.ok && antwort.status === 200 && antwort.type === 'basic') {
    const kopie = antwort.clone();
    caches.open(CACHE_NAME).then(function (cache) { cache.put(anfrage, kopie); });
  }
  return antwort;
}

self.addEventListener('fetch', function (e) {
  const anfrage = e.request;
  if (anfrage.method !== 'GET' || new URL(anfrage.url).origin !== self.location.origin) return;

  if (anfrage.mode === 'navigate') {
    e.respondWith(new Promise(function (fertig) {
      let erledigt = false;
      const ausCache = function () {
        caches.match(anfrage, { ignoreSearch: true }).then(function (c) {
          if (c && !erledigt) { erledigt = true; fertig(c); }
        });
      };
      const timer = setTimeout(ausCache, NETZ_TIMEOUT_MS);
      fetch(anfrage).then(function (antwort) {
        clearTimeout(timer);
        speichern(anfrage, antwort);
        if (!erledigt) { erledigt = true; fertig(antwort); }
      }).catch(function () {
        clearTimeout(timer);
        caches.match(anfrage, { ignoreSearch: true }).then(function (c) {
          if (!erledigt) { erledigt = true; fertig(c || Response.error()); }
        });
      });
    }));
    return;
  }

  e.respondWith(
    caches.match(anfrage, { ignoreSearch: true }).then(function (gespeichert) {
      const ausNetz = fetch(anfrage).then(function (antwort) { return speichern(anfrage, antwort); });
      if (gespeichert) {
        e.waitUntil(ausNetz.catch(function () { /* offline: Speicher genügt */ }));
        return gespeichert;
      }
      return ausNetz;
    })
  );
});
