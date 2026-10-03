'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { app, Element, flush } = require('./hilfe.cjs');

function running(c) { c.run("Terminal.stand = neuerSpielstand('Team', Date.now() + 600000, null, null)"); }
function noUi(c) { c.run('aktualisiereKopf = aktualisiereTabs = aktualisiereHelpDesk = zeigeErfolg2 = function () {};'); }

test('SHA-256 mit Web Crypto und JS-Fallback; Umlaute und mehrere Blöcke', async () => {
  for (const native of [true,false]) {
    const c = app(native ? {} : { crypto: {} });
    for (const value of ['', '729', 'Grüsse 🌍'.repeat(30)]) {
      c.value = value;
      const actual = await c.run('Krypto.hashCode(value)');
      assert.equal(actual, crypto.createHash('sha256').update('SYSTEMABSTURZ|' + value).digest('hex'));
    }
  }
});

test('Konfigurierte Codes, Signaturen und Cäsar-Stufen passen zusammen', async () => {
  const c = app();
  assert.equal(await c.run("Krypto.pruefe('729', HASHES.protokoll1)"),true);
  assert.equal(await c.run("Krypto.pruefe('25', HASHES.bonus)"),true);
  assert.equal(await c.run("Krypto.pruefe('3,8,5', HASHES.signaturen)"),true);
  for (const st of ['leicht','mittel','schwer']) {
    c.st = st;
    assert.match(c.run('caesar(p1StandardGeheimtext(p1Verschiebung(st)), -p1Verschiebung(st))'),/SIEBEN ZWEI NEUN/);
  }
  const l = JSON.parse(await c.run('Krypto.entschluessle(LOESUNGEN_VERSCHLUESSELT, SPIELLEITUNG_PIN)'));
  assert.equal(l.kiste2, await c.run("Krypto.entschluessle(KISTE2_VERSCHLUESSELT, '3,8,5')"));
});

for (const st of ['leicht','mittel','schwer']) {
  test('Labyrinth ' + st + ': Musterregel erreicht Ziel mit richtigen Signaturen und Energie', () => {
    const c = app(); c.st = st;
    const result = c.run(`(() => {
      Maze.setzeStufe(st); const z = Maze.neu(); let n = 0;
      while (!Maze.istAmZiel(z) && n++ < 300) {
        if (st === 'leicht') { if (Maze.istFrei(z,'vorne')) Maze.vor(z); else Maze.drehe(z,'rechts'); }
        else if (Maze.istFrei(z,'rechts') && (st !== 'schwer' || !Maze.istInfiziert(z,'rechts'))) { Maze.drehe(z,'rechts'); Maze.vor(z); }
        else if (Maze.istFrei(z,'vorne') && (st !== 'schwer' || !Maze.istInfiziert(z,'vorne'))) Maze.vor(z);
        else Maze.drehe(z,'links');
        if (z.status === 'infiziert' || z.status === 'mauer') break;
      }
      return {status:z.status,signaturen:z.gesammelt.join(','),energie:z.felder,max:Maze.stufe().energie};
    })()`);
    assert.equal(result.status,'ziel'); assert.equal(result.signaturen,'3,8,5'); assert.equal(result.energie,result.max);
  });
  test('Netzwerk ' + st + ': eindeutiger Weg und alle Fallen-Hashes stimmen', async () => {
    const c=app(); c.st=st; const a=c.run('netzwerkAnalyse(st)');
    assert.equal(a.eindeutig,true); assert.equal(await c.run('Krypto.pruefe(netzwerkAnalyse(st).code,HASHES.protokoll3)'),true);
    const hashes=await Promise.all(Array.from(a.fallen,x=>crypto.createHash('sha256').update('SYSTEMABSTURZ|'+x).digest('hex')));
    assert.deepEqual(hashes,Array.from(c.run('HASHES.protokoll3Fallen[st]')));
  });
}

test('Manipulierte Stufennamen und ungültige/abgelaufene Startsignale werden verworfen', () => {
  const c=app();
  for (const s of ['constructor','__proto__','toString','unbekannt']) { c.st=s; assert.equal(c.run('gueltigeStufe(st)'),false); }
  const valid={typ:'start',ende:Date.now()+600000,stufe:'mittel'};
  c.signal=valid; assert.equal(c.run('gueltigesStartsignal(signal)'),true);
  for (const override of [{ende:'morgen'},{ende:0},{ende:Infinity},{ende:Date.now()-1},{stufe:'constructor'},{p1:{hash:'x'}}]) {
    c.signal={...valid,...override}; assert.equal(c.run('gueltigesStartsignal(signal)'),false);
  }
});

test('Paralleles Polling ist begrenzt; manuelles Starten schützt Status vor verspäteter Antwort', async () => {
  const c=app(); c.run("Terminal.stand = neuerSpielstand('T',null,null,'ABCDE')");
  let resolve, calls=0;
  c.pending=()=>{calls++;return new Promise(r=>resolve=r);}; c.run('Signal.letzte = pending');
  const first=c.run('frageStartsignal()'); await c.run('frageStartsignal()'); assert.equal(calls,1);
  c.run('Terminal.stand.wartet = false'); c.el('#warten-status').textContent='AUFGABEN EMPFANGEN';
  resolve(null); await first;
  assert.equal(c.el('#warten-status').textContent,'AUFGABEN EMPFANGEN'); assert.equal(c.run('Terminal.signalAbfrage'),false);
});

test('Startsignal-Anfrage hat Timeout und räumt Timer auf', async () => {
  const c=app(); c.fetch=(_,o)=>new Promise((_,reject)=>o.signal.addEventListener('abort',()=>reject(new Error('abgebrochen'))));
  const pending=c.run("Signal.letzte('ABCDE','start')"); const check=assert.rejects(pending,/abgebrochen/);
  for (const t of c.timers.values()) if (t.ms===8000) t.fn();
  await check; assert.equal(c.timers.size,0);
});

test('Startsignal behält den Vorleseknopf und aktualisiert Geheimtext/Stufe', () => {
  const c=app(); c.run("Terminal.stand = neuerSpielstand('T',null,null,'ABCDE')");
  const story=c.el('#protokoll-1').querySelector('.story'); const b=new Element('button'); b.className='vorlesen-knopf'; story.appendChild(b);
  c.run("starteNachSignal(Date.now()+600000,'schwer',null,'10:15')");
  assert.equal(story.children.includes(b),true); assert.match(story.textContent,/10:15/);
  assert.equal(c.run('Terminal.stand.stufe'),'schwer'); assert.equal(c.run('Terminal.stand.wartet'),false);
});

test('Warten, Zeitablauf und Sieg sperren Änderungen am Punktestand', () => {
  const c=app(); noUi(c);
  for (const mutation of ['Terminal.stand.wartet=true','Terminal.stand.endzeit=Date.now()-1','Terminal.stand.override=true','Terminal.stand.geloescht=true']) {
    running(c); c.run(mutation); c.run('protokollGeloest(1)'); assert.equal(c.run('Terminal.stand.punkte'),100);
  }
});

test('Blockly-Ergebnis nach Zeitablauf vergibt weder Lösung noch Punkte', async () => {
  const c=app(); running(c); noUi(c); c.Algorithmen={init: options=>{c.options=options;}};
  c.run('starteAlgorithmen()');
  let resolve, ready; const started = new Promise(r=>ready=r);
  c.decrypt=()=>new Promise(r=>{resolve=r;ready();}); c.run('Krypto.entschluessle=decrypt');
  const result=c.options.zielErreicht([3,8,5],{bloecke:8,maxBloecke:9});
  await started; c.run('Terminal.stand.endzeit=Date.now()-1'); resolve('385');
  assert.equal((await result).ok,false); assert.equal(c.run('Terminal.stand.geloest[2]'),false); assert.equal(c.run('Terminal.stand.punkte'),100);
});

test('Effizienzbonus wird nur um neue Bestleistung erhöht', async () => {
  const c=app(); running(c); noUi(c); c.Algorithmen={init: options=>{c.options=options;}}; c.run('starteAlgorithmen()');
  for (const n of [9,9,8,9,8]) await c.options.zielErreicht([3,8,5],{bloecke:n,maxBloecke:9});
  assert.equal(c.run('Terminal.stand.punkte'),135); assert.equal(c.run('Terminal.stand.blockBonus'),15);
});

test('Gratis-Tipp während Joker-Dialog verursacht keinen unbestätigten Kauf', async () => {
  const c=app(); running(c); let resolve; c.confirm=()=>new Promise(r=>resolve=r); c.run('dialog=confirm');
  const pending=c.run('jokerEinloesen()'); c.run('Terminal.stand.tippStufe[1]=1'); resolve(true); await pending;
  assert.equal(c.run('Terminal.stand.jokerEingeloest'),0); assert.equal(c.run('Terminal.stand.punkte'),100);
});

test('Bezahlter Tipp wird nach fünf Minuten nicht nachträglich als gratis markiert', () => {
  const c=app(); running(c); c.run('Terminal.stand.tippStufe[1]=1; Terminal.stand.protokollStart[1]=Date.now()-360000; tick()');
  assert.equal(c.run('Terminal.stand.gratisTipp[1]'),false);
});

test('Reset bewahrt Schwierigkeit/Schlosscode und schliesst Lösungen', async () => {
  const c=app(); c.location.href='https://example.test/HackingSchule/spielleitung.html';
  c.storage.set('systemabsturz-spielleitung',JSON.stringify({stufe:'schwer',spielcode:'ABCDE',freigegeben:true,endzeit:Date.now()+600000,p1:{code:'123',verschiebung:8,geheimtext:'ABC',hash:'x'}}));
  c.run("fragePin = async function () { return '4711'; }; initSpielleitung()");
  await c.el('#reset-countdown').click();
  assert.equal(c.run('Leitung.stand.stufe'),'schwer'); assert.equal(c.run('Leitung.stand.p1.code'),'123');
  assert.equal(c.el('#stufe-wahl').value,'schwer'); assert.equal(c.el('#loesungen').hidden,true);
  assert.equal(c.run('Leitung.stand.freigegeben'),false); assert.equal(c.run('Leitung.stand.endzeit'),null);
});

test('Service Worker auf Druckseite wird im Projektwurzel registriert', async () => {
  const c=app(); let registered;
  c.navigator.serviceWorker={register:async u=>{registered=u;}};
  c.el('script[src$="js/app.js"]').src='https://example.test/HackingSchule/js/app.js';
  c.location.href='https://example.test/HackingSchule/druck/teamset.html';
  await c.document.fire('DOMContentLoaded'); assert.equal(registered,'https://example.test/HackingSchule/sw.js');
});

test('Ziffernfeld erholt sich nach fehlgeschlagener Prüfung', async () => {
  const c=app(); c.container=new Element(); let n=0; c.options={stellen:1,beiBestaetigen:()=>{n++; throw new Error('temporär');}};
  const field=c.run('erstelleZiffernfeld(container,options)');
  await field.element.fire('keydown',{key:'7',preventDefault(){}});
  await field.element.fire('keydown',{key:'Enter',preventDefault(){}}); await flush();
  assert.equal(field.element.classList.contains('gesperrt'),false);
  await field.element.fire('keydown',{key:'Enter',preventDefault(){}}); await flush(); assert.equal(n,2);
});

test('HTML-Audio-Abbruch beendet auch das Vorlese-Promise', async () => {
  let played; const started=new Promise(r=>played=r);
  class Audio {play(){played();return Promise.resolve();} pause(){}}
  const text='Vorlesetest';
  const c=app(); c.text=text; const key=c.run("Sprache.schluessel(text,'normal')");
  const d=app({Audio,fetch:async()=>({ok:true,json:async()=>({dateien:{[key]:'test.mp3'}})})}); d.text=text;
  const pending=d.run("Sprache.sprich(text,'normal')"); await started; d.run('Sprache.stopp()'); await pending;
});

test('Browser-Sprachausgabe-Abbruch löst Promise und Sicherheitstimer auf', async () => {
  let spoken;const started=new Promise(r=>spoken=r);
  const c=app({SpeechSynthesisUtterance:class{},speechSynthesis:{getVoices:()=>[],addEventListener(){},speak(){spoken();},cancel(){}}});
  const pending=c.run("Sprache.sprich('Test','normal')");await started;c.run('Sprache.stopp()');await pending;
  assert.equal(c.timers.size,0);
});

for (const name of ['baueProtokoll1','baueBonus','baueProtokoll3']) test(name+': Zeitablauf während Hash-Prüfung vergibt keine Punkte',async()=>{
  const c=app();running(c);noUi(c);let resolve;
  c.pending=()=>new Promise(r=>resolve=r);c.capture=(_,o)=>{c.input=o.beiBestaetigen;return {setzeMeldung(){}};};
  c.run('Krypto.pruefe=pending; erstelleZiffernfeld=capture; '+name+'()');
  const result=c.input('123');c.run('Terminal.stand.endzeit=Date.now()-1');resolve(true);await result;
  assert.equal(c.run('Terminal.stand.punkte'),100);assert.equal(c.run('Terminal.stand.bonus'),null);
});

test('PIN-Dialog unterstützt Enter und Escape ohne Beamer-Tastenkürzel auszulösen',async()=>{
  const c=app();const pin=c.run("fragePin('Test')");
  const box=c.document.body.children[0].children[0], input=box.children[1].children[1];input.value='4711';
  let stopped=false;
  await box.fire('keydown',{key:'Enter',target:input,preventDefault(){},stopPropagation(){stopped=true;}});
  assert.equal(await pin,'4711');assert.equal(stopped,true);
  const cancel=c.run("fragePin('Test')");const second=c.document.body.children[0].children[0];
  await second.fire('keydown',{key:'Escape',preventDefault(){},stopPropagation(){}});assert.equal(await cancel,null);
});

test('Zeitvorschlag rundet bei Minuten 56–59 in die nächste Stunde',()=>{
  const fixed=new Date(2026,9,3,10,14).getTime();
  class FixedDate extends Date {constructor(...args){super(...(args.length?args:[fixed]));}static now(){return fixed;}}
  const c=app({Date:FixedDate});c.run('initSpielleitung()');assert.equal(c.el('#link-zeit').value,'11:00');
});

test('Neuladen der laufenden Spielleitung setzt gestoppten Countdown nicht zurück',()=>{
  const c=app();c.location.search='?ende=12:00';
  c.storage.set('systemabsturz-spielleitung',JSON.stringify({stufe:'mittel',spielcode:'ABCDE',freigegeben:true,endzeit:123456,gestoppt:1234}));
  c.run('initSpielleitung()');assert.equal(c.run('Leitung.stand.endzeit'),123456);assert.equal(c.run('Leitung.stand.gestoppt'),1234);
});

test('Gesperrter Speicher hält Anmeldung mit Fehlermeldung auf der Startseite',async()=>{
  const c=app();c.localStorage.setItem=()=>{throw new Error('quota');};c.run('initStartseite()');
  c.el('#teamname').value='Team';c.el('#spielcode').value='ABCDE';
  await c.el('#start-formular').fire('submit',{preventDefault(){}});
  assert.match(c.el('#start-meldung').textContent,/nicht speichern/);
  assert.equal([...c.timers.values()].some(t=>t.ms===150),false);
});

test('Speicherfehler während des Spiels wird einmalig sichtbar gemeldet',()=>{
  const c=app();running(c);c.localStorage.setItem=()=>{throw new Error('quota');};c.run('speichere(); speichere()');
  assert.equal(c.run('Terminal.speicherWarnung'),true);
});

test('Konfigurationsgenerator lehnt unerreichbare Code-Längen ab',async()=>{
  const c=app();c.run("fragePin=async function(){return '4711'}");
  c.el('#gen-p1').value='729';c.el('#gen-bonus').value='123';c.el('#gen-kiste2').value='385';c.el('#gen-p3').value='109';c.el('#gen-signaturen').value='3,8,5';
  await c.run('erzeugeKonfiguration()');assert.equal(c.el('#generator-ausgabe').value,'');
  c.el('#gen-bonus').value='25';await c.run('erzeugeKonfiguration()');assert.match(c.el('#generator-ausgabe').value,/const HASHES/);
});
