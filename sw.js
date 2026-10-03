/* =====================================================================
   Systemabsturz: Service Worker für den Offline-Betrieb
   ---------------------------------------------------------------------
   Beim ersten Aufruf werden alle Dateien im Browser gespeichert.
   Danach funktioniert das Spiel auch ohne Internet (z. B. wenn das
   WLAN der Schule ausfällt). Strategie: zuerst Netz, sonst Cache.
   Nach Änderungen am Spiel CACHE_NAME erhöhen.
   Lizenz: CC BY-SA 4.0, Christof Heiss, Jan Schmid, PH Luzern 2026
   ===================================================================== */

const CACHE_PRAEFIX = 'systemabsturz:' + self.registration.scope + ':';
const CACHE_NAME = CACHE_PRAEFIX + 'v30';

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
  'js/unterrichtsinfo.js',
  'img/maske.svg',
  'img/hintergrund-anweisung.webp',
  'druck/druck.css',
  'druck/auftrag.html',
  'druck/protokoll1.html',
  'druck/protokoll2.html',
  'druck/protokoll3.html',
  'druck/teamset.html',
  'druck/leitfaden.html',
  'druck/leitfaden.js',
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
      return Promise.all(namen.filter(function (n) { return n.startsWith(CACHE_PRAEFIX) && n !== CACHE_NAME; }).map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* Strategie für schnelle Ladezeiten im Schul-WLAN:
   - Seiten (HTML): zuerst Netz (max. 2.5 s warten), sonst gespeicherte Version
   - alle anderen Dateien (JS, CSS, Bilder, Töne, Blockly): sofort aus dem
     Speicher, im Hintergrund wird die Datei aktualisiert (stale-while-revalidate) */
const NETZ_TIMEOUT_MS = 2500;

// Query-Parameter ändern nur den Spielstand, nicht die statischen Dateien.
function cacheSchluessel(anfrage) {
  const url = new URL(anfrage.url);
  url.search = '';
  url.hash = '';
  return url.href;
}

async function speichern(cache, anfrage, antwort) {
  if (antwort && antwort.ok && antwort.status === 200 && antwort.type === 'basic') {
    try { await cache.put(cacheSchluessel(anfrage), antwort.clone()); }
    catch (e) { /* Speicher voll: die Netzantwort bleibt trotzdem nutzbar */ }
  }
  return antwort;
}

self.addEventListener('fetch', function (e) {
  const anfrage = e.request;
  if (anfrage.method !== 'GET' || !anfrage.url.startsWith(self.registration.scope)) return;

  const cache = caches.open(CACHE_NAME);
  const gespeichert = cache.then(function (c) { return c.match(cacheSchluessel(anfrage)); });
  const ausNetz = fetch(anfrage).then(async function (antwort) {
    return speichern(await cache, anfrage, antwort);
  });
  // Auch nach einer schnellen Cache-Antwort darf der Worker erst nach dem
  // Aktualisieren beendet werden. waitUntil synchron im Ereignis registrieren.
  e.waitUntil(ausNetz.catch(function () { /* offline */ }));

  if (anfrage.mode === 'navigate') {
    e.respondWith(new Promise(function (fertig) {
      let erledigt = false;
      function liefere(antwort) {
        if (!erledigt) { erledigt = true; fertig(antwort); }
      }
      const timer = setTimeout(function () {
        gespeichert.then(function (c) { if (c) liefere(c); });
      }, NETZ_TIMEOUT_MS);
      ausNetz.then(async function (antwort) {
        clearTimeout(timer);
        liefere(antwort.ok ? antwort : ((await gespeichert) || antwort));
      }).catch(async function () {
        clearTimeout(timer);
        liefere((await gespeichert) || Response.error());
      });
    }));
    return;
  }
  e.respondWith(gespeichert.then(function (c) { return c || ausNetz; }));
});
