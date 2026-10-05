'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { app, root } = require('./hilfe.cjs');

function lade(c, datei) {
  c.run(fs.readFileSync(path.join(root, datei), 'utf8'));
}

test('Lösungsliste ist mit der PIN entschlüsselbar und enthält keine veralteten Angaben zu Protokoll 3', async () => {
  const c = app();
  const text = await c.run('Krypto.entschluessle(LOESUNGEN_VERSCHLUESSELT, SPIELLEITUNG_PIN)');
  const l = JSON.parse(text);
  assert.equal(l.p1, '729');
  assert.match(l.bonus, /^25\b/);
  assert.equal(l.signaturen, '3, 8, 5');
  assert.equal(l.kiste2, '642');
  assert.equal(l.p3, '109');
  for (const feld of ['p3info', 'fallen']) assert.equal(typeof l[feld], 'string');
  const alles = JSON.stringify(l);
  assert.doesNotMatch(alles, /Server C/);
  assert.doesNotMatch(alles, /vier Verbindungen/);
  for (const alt of ['065', '079', '111']) assert.ok(!alles.includes(alt), 'veraltete Falle ' + alt);
  assert.match(l.p3info, /Leitfaden/);
});

test('Lehrplanstufen in der Unterrichtsinfo entsprechen dem Lehrplan 21', () => {
  const c = app();
  lade(c, 'js/unterrichtsinfo.js');
  const erwartet = {
    'MI.1.3.d': 'Z2',
    'MI.2.1.c': 'Z2', 'MI.2.2.b': 'Z2', 'MI.2.2.c': 'Z2', 'MI.2.2.d': 'Z2', 'MI.2.2.e': 'Z2', 'MI.2.2.f': 'Z2',
    'MI.2.1.f': 'Z3', 'MI.2.1.i': 'Z3', 'MI.2.2.g': 'Z3', 'MI.2.2.i': 'Z3', 'MI.2.3.m': 'Z3', 'MI.2.3.n': 'Z3'
  };
  const tabelle = c.run('UNTERRICHTSINFO.abschnitte[1].inhalt.find(function (b) { return b.tabelle; }).tabelle');
  const gefunden = {};
  for (const zeile of tabelle.zeilen) {
    const zelle = zeile[1];
    // Jede Kompetenz erhält die nächste Zyklusangabe in Klammern dahinter
    const re = /MI\.(\d)\.(\d)([a-z])/g;
    let m;
    while ((m = re.exec(zelle))) {
      const rest = zelle.slice(m.index);
      const z = /\((Z\d)\)/.exec(rest);
      assert.ok(z, 'Zyklusangabe fehlt bei ' + m[0]);
      gefunden['MI.' + m[1] + '.' + m[2] + '.' + m[3]] = z[1];
    }
  }
  for (const k of Object.keys(gefunden)) assert.equal(gefunden[k], erwartet[k], k);
  for (const k of Object.keys(erwartet)) assert.ok(gefunden[k], k + ' fehlt in der Tabelle');
  assert.ok(tabelle.zeilen.some(z => z[0] === '1 Kryptografie' && /MI\.1\.3d \(Z2\)/.test(z[1])));
});

test('Technikcheck liefert für jede Prüfung ein Ergebnis, auch ohne Netz', async () => {
  const c = app();
  lade(c, 'js/technikcheck.js');
  const ergebnisse = await c.run('Technikcheck.pruefe({ senden: true })');
  assert.equal(ergebnisse.length, 6);
  const ids = Array.from(ergebnisse, e => e.id);
  assert.deepEqual(ids, ['speicher', 'ton', 'aufnahmen', 'blockly', 'startsignal', 'offline']);
  for (const e of ergebnisse) {
    assert.equal(typeof e.ok, 'boolean', e.id);
    assert.ok(e.text, e.id + ' ohne Text');
    if (!e.ok) assert.ok(e.hinweis, e.id + ' ohne Lösungshinweis');
  }
  const nach = Object.fromEntries(ergebnisse.map(e => [e.id, e]));
  assert.equal(nach.speicher.ok, true);
  assert.equal(nach.startsignal.ok, false);
  assert.equal(nach.aufnahmen.ok, false);
  assert.equal(nach.offline.ok, false);
});

test('Technikcheck bricht hängende Anfragen ab und meldet trotzdem alle Ergebnisse', async () => {
  const c = app();
  lade(c, 'js/technikcheck.js');
  const daten = new Map();
  c.umgebung = {
    fetch: () => new Promise(() => {}), // Netz hängt
    setTimeout: (f) => { setImmediate(f); return 1; }, // Zeitlimit sofort erreicht
    clearTimeout() {},
    localStorage: { setItem: (k, v) => daten.set(k, v), getItem: k => daten.get(k) || null, removeItem: k => daten.delete(k) },
    navigator: {},
    location: { protocol: 'https:' }
  };
  const ergebnisse = await c.run('Technikcheck.pruefe({ umgebung: umgebung })');
  assert.equal(ergebnisse.length, 6);
  const nach = Object.fromEntries(ergebnisse.map(e => [e.id, e]));
  assert.equal(nach.speicher.ok, true);
  for (const id of ['aufnahmen', 'blockly', 'startsignal']) {
    assert.equal(nach[id].ok, false, id);
    assert.match(nach[id].text, /keine Antwort|nicht erreichbar/, id);
  }
});
