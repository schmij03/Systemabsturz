/* =====================================================================
   Systemabsturz: alle vorlesbaren Texte als JSON ausgeben
   ---------------------------------------------------------------------
   Lädt js/maze.js und js/app.js ohne Browser und schreibt die Liste
   der Texte (Art und Text) auf die Standardausgabe. Wird von
   tts_erzeugen.py aufgerufen. Aufruf: node werkzeuge/texte_exportieren.js
   Lizenz: CC BY-SA 4.0, Christof Heiss, Jan Schmid, PH Luzern 2026
   ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const wurzel = path.join(__dirname, '..');
const quelltext = ['js/maze.js', 'js/app.js']
  .map(function (d) { return fs.readFileSync(path.join(wurzel, d), 'utf8'); })
  .join('\n;\n') + '\n;globalThis.__export = { TEXTE: TEXTE, STUFEN: STUFEN, JOKER_ANZAHL: JOKER_ANZAHL, fuelleTipp: fuelleTipp, P1_VERSCHIEBUNG: P1_VERSCHIEBUNG };';

// Minimale Browser-Attrappe, damit app.js ohne Fehler geladen werden kann
const leer = function () { return null; };
const dokument = { addEventListener: leer, querySelector: leer, querySelectorAll: function () { return []; }, createElement: function () { return {}; } };
const kontext = {
  console: console, TextEncoder: TextEncoder, TextDecoder: TextDecoder, URLSearchParams: URLSearchParams,
  setTimeout: setTimeout, clearTimeout: clearTimeout, setInterval: setInterval, clearInterval: clearInterval,
  document: dokument, navigator: {}, location: { search: '', protocol: 'file:', href: '' },
  localStorage: { getItem: leer, setItem: leer, removeItem: leer },
  fetch: function () { return Promise.reject(new Error('kein Netz')); }
};
kontext.window = kontext;
kontext.globalThis = kontext;
vm.createContext(kontext);
vm.runInContext(quelltext, kontext);
const { TEXTE, JOKER_ANZAHL, fuelleTipp, P1_VERSCHIEBUNG } = kontext.__export;

const texte = [];
function dazu(art, text) {
  text = String(text).trim();
  if (text && !texte.some(function (t) { return t.art === art && t.text === text; })) texte.push({ art: art, text: text });
}

// Story-Texte der Protokolle (Knopf 🔊 im Terminal)
[1, 2, 3].forEach(function (p) {
  const t = TEXTE.protokolle[p];
  dazu('normal', t.story + (t.hinweis ? ' Hinweis: ' + t.hinweis : ''));
  // Tipps (alle Stufen)
  const listen = [t.tipps].concat(t.tippsStufen ? Object.keys(t.tippsStufen).map(function (k) { return t.tippsStufen[k]; }) : []);
  listen.forEach(function (liste) {
    liste.forEach(function (tipp, i) { dazu('normal', 'Tipp ' + (i + 1) + ': ' + fuelleTipp(tipp, P1_VERSCHIEBUNG)); });
  });
});
for (let n = 0; n <= JOKER_ANZAHL; n++) dazu('normal', 'Noch kein Tipp freigeschaltet. Ihr habt ' + n + ' Joker.');

// Story-Szenen auf dem Beamer
Object.keys(TEXTE.szenen).forEach(function (k) {
  const sz = TEXTE.szenen[k];
  dazu('normal', sz.titel + '. ' + sz.text);
});

// Spielanweisung nach dem Video (Absatz für Absatz)
TEXTE.spielanweisung.absaetze.forEach(function (absatz) { dazu('normal', absatz); });

// Botschaft von NULLBYTE (Hackerstimme)
TEXTE.nullbyte.forEach(function (zeile) { dazu('hacker', zeile); });

process.stdout.write(JSON.stringify(texte, null, 2));
