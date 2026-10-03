/* =====================================================================
   Systemabsturz: Teamsets als eigenständige HTML-Dateien erzeugen
   ---------------------------------------------------------------------
   Öffnet druck/teamset.html für jede Stufe im Browser (Playwright,
   Chromium) und speichert das fertige Dossier mit eingebettetem Stil
   und ohne Skripte als material/Systemabsturz_Teamset_<Stufe>.html.
   Nach Änderungen an druck/seiten.js, js/maze.js oder js/netzwerke.js
   neu ausführen: node werkzeuge/teamsets_erzeugen.js
   Lizenz: CC BY-SA 4.0, Christof Heiss, Jan Schmid, PH Luzern 2026
   ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const wurzel = path.join(__dirname, '..');
const STUFEN = { leicht: 'Leicht', mittel: 'Mittel', schwer: 'Schwer' };
const css = fs.readFileSync(path.join(wurzel, 'druck', 'druck.css'), 'utf8');

(async function () {
  const browser = await chromium.launch();
  const seite = await browser.newPage();
  for (const key of Object.keys(STUFEN)) {
    const name = STUFEN[key];
    await seite.goto('file://' + path.join(wurzel, 'druck', 'teamset.html') + '?stufe=' + key);
    await seite.waitForFunction(() => document.querySelectorAll('#seiten .seite').length === 7);
    const html = await seite.evaluate((a) => Druck.eigenstaendig(a.titel, a.css), { titel: 'Systemabsturz: Teamset ' + name, css: css });
    const ziel = path.join(wurzel, 'material', 'Systemabsturz_Teamset_' + name + '.html');
    fs.writeFileSync(ziel, html);
    console.log('erzeugt', path.relative(wurzel, ziel), Math.round(html.length / 1024) + ' KB');
  }
  await browser.close();
})();
