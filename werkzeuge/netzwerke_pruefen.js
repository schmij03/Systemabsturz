/* =====================================================================
   Systemabsturz: Netzwerkpläne aus js/netzwerke.js prüfen
   ---------------------------------------------------------------------
   Aufruf: node werkzeuge/netzwerke_pruefen.js
   Zeigt pro Stufe den kürzesten Weg ohne infizierte Server (muss
   eindeutig sein), seine Summe (Override-Code) und alle infizierten
   Wege, die höchstens gleich viele Verbindungen haben (Fallen).
   Mit --hashes werden die Fallen-Hashes für js/app.js ausgegeben.
   Lizenz: CC BY-SA 4.0, Christof Heiss, Jan Schmid, PH Luzern 2026
   ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const wurzel = path.join(__dirname, '..');
const NETZWERKE = new Function(fs.readFileSync(path.join(wurzel, 'js/netzwerke.js'), 'utf8') + '; return NETZWERKE;')();
const SALZ = /const SALZ = '([^']*)'/.exec(fs.readFileSync(path.join(wurzel, 'js/app.js'), 'utf8'))[1];
const hash = function (code) { return crypto.createHash('sha256').update(SALZ + code, 'utf8').digest('hex'); };
const mitHashes = process.argv.indexOf('--hashes') >= 0;
let fehler = 0;
const ausgabe = {};

Object.keys(NETZWERKE).forEach(function (stufe) {
  const n = NETZWERKE[stufe];
  const nachbarn = {};
  Object.keys(n.server).forEach(function (k) { nachbarn[k] = []; });
  n.verbindungen.forEach(function (v) {
    const [a, b] = v.split('-');
    nachbarn[a].push(b);
    nachbarn[b].push(a);
  });
  const wege = [];
  (function suche(knoten, weg) {
    if (weg.length > 14) return;
    if (knoten === 'Z') { wege.push(weg); return; }
    nachbarn[knoten].forEach(function (m) { if (weg.indexOf(m) < 0) suche(m, weg.concat(m)); });
  })('A', ['A']);
  const summe = function (w) { return w.reduce(function (s, k) { return s + n.server[k].kennzahl; }, 0); };
  const infiziert = function (w) { return w.some(function (k) { return n.server[k].infiziert; }); };
  const sauber = wege.filter(function (w) { return !infiziert(w); });
  const kurz = Math.min.apply(null, sauber.map(function (w) { return w.length - 1; }));
  const beste = sauber.filter(function (w) { return w.length - 1 === kurz; });
  const code = summe(beste[0]);
  const fallen = Array.from(new Set(wege.filter(function (w) { return infiziert(w) && w.length - 1 < kurz; }).map(summe)))
    .filter(function (z) { return z !== code; }).sort(function (a, b) { return a - b; });
  console.log('== ' + stufe + ': ' + Object.keys(n.server).length + ' Server, ' + n.verbindungen.length + ' Verbindungen');
  console.log('   kürzester sauberer Weg (' + kurz + ' Verbindungen): ' + beste.map(function (w) { return w.join('-') + ' = ' + summe(w); }).join(' | '));
  if (beste.length !== 1) { console.log('   FEHLER: Der kürzeste saubere Weg ist nicht eindeutig.'); fehler++; }
  if (code !== 109) console.log('   Hinweis: Override-Code ist ' + code + ', HASHES.protokoll3 in js/app.js muss dazu passen.');
  console.log('   Fallen: ' + fallen.map(function (z) { return String(z).padStart(3, '0'); }).join(', '));
  ausgabe[stufe] = fallen.map(function (z) { return hash(String(z).padStart(3, '0')); });
});

if (mitHashes) console.log(JSON.stringify(ausgabe, null, 2));
process.exit(fehler ? 1 : 0);
