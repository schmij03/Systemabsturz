/* =====================================================================
   Systemabsturz: Protokoll 2 (Algorithmen mit Scratch-Blöcken)
   ---------------------------------------------------------------------
   Blockly mit dem Renderer «zelos» (sieht aus wie Scratch), deutsche
   Blöcke und ein eigener kleiner Interpreter über den Blockbaum
   (kein eval). ANTI-V wird Schritt für Schritt animiert.
   Lizenz: CC BY-SA 4.0, Christof Heiss, Jan Schmid, PH Luzern 2026
   ===================================================================== */

/* ---------------------------- KONSTANTEN ---------------------------- */

/* Blockly wird zuerst lokal aus /lib geladen (offline), sonst vom CDN. */
const BLOCKLY_VERSION = '13.3.0';
const BLOCKLY_QUELLEN = [
  { kern: 'lib/blockly/blockly_compressed.js', sprache: 'lib/blockly/msg/de.js', medien: 'lib/blockly/media/' },
  {
    kern: 'https://unpkg.com/blockly@' + BLOCKLY_VERSION + '/blockly_compressed.js',
    sprache: 'https://unpkg.com/blockly@' + BLOCKLY_VERSION + '/msg/de.js',
    medien: 'https://unpkg.com/blockly@' + BLOCKLY_VERSION + '/media/'
  }
];

/* Farben wie in Scratch */
const FARBEN = {
  ereignisse: '#FFBF00',
  steuerung: '#FFAB19',
  bewegung: '#4C97FF',
  fuehlen: '#5CB1D6',
  operatoren: '#59C059'
};

/* Tempo der Animation in Millisekunden pro Schritt */
const TEMPO_STANDARD = 400;
const TEMPO_MIN = 100;
const TEMPO_MAX = 1000;

/* Anzahl Signaturen, die in der Leiste angezeigt werden */
const SIGNATUR_PLAETZE = 3;

/* ------------------------------ MODUL ------------------------------- */

const Algorithmen = (function () {
  'use strict';

  let ws = null;            // Blockly-Arbeitsbereich
  let rueckrufe = null;     // Verbindung zu app.js
  let zustand = null;       // Zustand von ANTI-V (siehe maze.js)
  let ablauf = null;        // laufender Interpreter (Generator)
  let modus = 'aus';        // aus | auto | schritt | fertig
  let timer = null;
  let tempo = TEMPO_STANDARD;
  let schritte = 0;
  let ignoriereAenderung = false;
  let verwendeteBloecke = 0;

  /* ------------------------ Blockly laden ------------------------- */

  function ladeSkript(src) {
    return new Promise(function (ok, fehler) {
      const s = document.createElement('script');
      s.src = src;
      s.onload = ok;
      s.onerror = fehler;
      document.head.appendChild(s);
    });
  }

  let ladeVersprechen = null;

  /* Lädt Blockly genau einmal (auch wenn vorladen() und init() gleichzeitig fragen) */
  function ladeBlockly() {
    if (!ladeVersprechen) ladeVersprechen = ladeBlocklyJetzt().catch(function (e) { ladeVersprechen = null; throw e; });
    return ladeVersprechen;
  }

  async function ladeBlocklyJetzt() {
    if (window.Blockly && window.Blockly.inject) return BLOCKLY_QUELLEN[0].medien;
    for (const q of BLOCKLY_QUELLEN) {
      try {
        await ladeSkript(q.kern);
        await ladeSkript(q.sprache);
        if (window.Blockly && window.Blockly.inject) return q.medien;
      } catch (e) { /* nächste Quelle versuchen */ }
    }
    throw new Error('Blockly konnte nicht geladen werden');
  }

  /* --------------------------- Blöcke ----------------------------- */

  function definiereBloecke() {
    // Schweizer Rechtschreibung: «ss» statt Eszett in den Blockly-Meldungen
    for (const k in Blockly.Msg) {
      if (typeof Blockly.Msg[k] === 'string') Blockly.Msg[k] = Blockly.Msg[k].replace(/\u00df/g, 'ss');
    }

    const bool = 'Boolean';
    const json = [
      {
        type: 'antiv_start',
        message0: 'wenn Programm startet',
        nextStatement: null,
        colour: FARBEN.ereignisse,
        style: { hat: 'cap' },
        tooltip: 'Hier beginnt das Programm von ANTI-V.'
      },
      {
        type: 'antiv_wiederhole',
        message0: 'wiederhole bis Ziel erreicht',
        message1: '%1',
        args1: [{ type: 'input_statement', name: 'TUE' }],
        previousStatement: null,
        nextStatement: null,
        colour: FARBEN.steuerung,
        tooltip: 'Wiederholt die Blöcke darin, bis ANTI-V auf dem Ziel steht.'
      },
      {
        type: 'antiv_falls',
        message0: 'falls %1 dann',
        args0: [{ type: 'input_value', name: 'BEDINGUNG', check: bool }],
        message1: '%1',
        args1: [{ type: 'input_statement', name: 'DANN' }],
        previousStatement: null,
        nextStatement: null,
        colour: FARBEN.steuerung,
        tooltip: 'Führt die Blöcke nur aus, wenn die Bedingung stimmt.'
      },
      {
        type: 'antiv_falls_sonst',
        message0: 'falls %1 dann',
        args0: [{ type: 'input_value', name: 'BEDINGUNG', check: bool }],
        message1: '%1',
        args1: [{ type: 'input_statement', name: 'DANN' }],
        message2: 'sonst',
        message3: '%1',
        args3: [{ type: 'input_statement', name: 'SONST' }],
        previousStatement: null,
        nextStatement: null,
        colour: FARBEN.steuerung,
        tooltip: 'Stimmt die Bedingung, laufen die oberen Blöcke, sonst die unteren.'
      },
      {
        type: 'antiv_vor',
        message0: 'gehe 1 Feld vor',
        previousStatement: null,
        nextStatement: null,
        colour: FARBEN.bewegung,
        tooltip: 'ANTI-V geht ein Feld in Blickrichtung.'
      },
      {
        type: 'antiv_rechts',
        message0: 'drehe dich nach rechts ↻',
        previousStatement: null,
        nextStatement: null,
        colour: FARBEN.bewegung,
        tooltip: 'ANTI-V dreht sich um 90 Grad nach rechts.'
      },
      {
        type: 'antiv_links',
        message0: 'drehe dich nach links ↺',
        previousStatement: null,
        nextStatement: null,
        colour: FARBEN.bewegung,
        tooltip: 'ANTI-V dreht sich um 90 Grad nach links.'
      },
      {
        type: 'antiv_und',
        message0: '%1 und %2',
        args0: [{ type: 'input_value', name: 'A', check: bool }, { type: 'input_value', name: 'B', check: bool }],
        inputsInline: true,
        output: bool,
        colour: FARBEN.operatoren,
        tooltip: 'Wahr, wenn beide Bedingungen stimmen.'
      },
      {
        type: 'antiv_oder',
        message0: '%1 oder %2',
        args0: [{ type: 'input_value', name: 'A', check: bool }, { type: 'input_value', name: 'B', check: bool }],
        inputsInline: true,
        output: bool,
        colour: FARBEN.operatoren,
        tooltip: 'Wahr, wenn mindestens eine Bedingung stimmt.'
      },
      {
        type: 'antiv_nicht',
        message0: 'nicht %1',
        args0: [{ type: 'input_value', name: 'A', check: bool }],
        inputsInline: true,
        output: bool,
        colour: FARBEN.operatoren,
        tooltip: 'Kehrt die Bedingung um: aus wahr wird falsch und umgekehrt.'
      }
    ];

    // Fühlen-Blöcke (Sechseck-Form durch Ausgabe-Typ Boolean)
    FUEHLEN.forEach(function (f) {
      json.push({
        type: f.typ,
        message0: f.text,
        output: bool,
        colour: FARBEN.fuehlen,
        tooltip: f.art === 'frei'
          ? 'Wahr, wenn das Feld ' + (f.seite === 'vorne' ? 'vor' : f.seite + ' von') + ' ANTI-V keine Mauer ist.'
          : 'Wahr, wenn das Feld ' + (f.seite === 'vorne' ? 'vor' : f.seite + ' von') + ' ANTI-V rot (infiziert) ist.'
      });
    });

    Blockly.defineBlocksWithJsonArray(json);

    // Startblock: nicht löschbar, nicht kopierbar
    const startInit = Blockly.Blocks.antiv_start.init;
    Blockly.Blocks.antiv_start.init = function () {
      startInit.call(this);
      this.setDeletable(false);
      this.contextMenu = false;
    };
  }

  const FUEHLEN = [
    { typ: 'antiv_rechts_frei', text: 'rechts frei?', art: 'frei', seite: 'rechts' },
    { typ: 'antiv_vorne_frei', text: 'vorne frei?', art: 'frei', seite: 'vorne' },
    { typ: 'antiv_links_frei', text: 'links frei?', art: 'frei', seite: 'links' },
    { typ: 'antiv_rechts_infiziert', text: 'rechts infiziert?', art: 'infiziert', seite: 'rechts' },
    { typ: 'antiv_vorne_infiziert', text: 'vorne infiziert?', art: 'infiziert', seite: 'vorne' }
  ];

  const TOOLBOX = {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category', name: 'Steuerung', colour: FARBEN.steuerung,
        contents: [
          { kind: 'block', type: 'antiv_wiederhole' },
          { kind: 'block', type: 'antiv_falls' },
          { kind: 'block', type: 'antiv_falls_sonst' }
        ]
      },
      {
        kind: 'category', name: 'Bewegung', colour: FARBEN.bewegung,
        contents: [
          { kind: 'block', type: 'antiv_vor' },
          { kind: 'block', type: 'antiv_rechts' },
          { kind: 'block', type: 'antiv_links' }
        ]
      },
      {
        kind: 'category', name: 'Fühlen', colour: FARBEN.fuehlen,
        contents: FUEHLEN.map(function (f) { return { kind: 'block', type: f.typ }; })
      },
      {
        kind: 'category', name: 'Operatoren', colour: FARBEN.operatoren,
        contents: [
          { kind: 'block', type: 'antiv_und' },
          { kind: 'block', type: 'antiv_oder' },
          { kind: 'block', type: 'antiv_nicht' }
        ]
      }
    ]
  };

  /** Toolbox der aktuellen Stufe (nur erlaubte Blöcke, leere Kategorien weg). */
  function toolboxFuerStufe() {
    const erlaubt = Maze.stufe().toolbox;
    if (!erlaubt) return TOOLBOX;
    return {
      kind: 'categoryToolbox',
      contents: TOOLBOX.contents.map(function (k) {
        return Object.assign({}, k, { contents: k.contents.filter(function (b) { return erlaubt.indexOf(b.type) >= 0; }) });
      }).filter(function (k) { return k.contents.length > 0; })
    };
  }

  /* ------------------------- Blöcke zählen ------------------------- */

  /** Blöcke im Programm (unter «wenn Programm startet», ohne den Startblock). */
  function programmBloecke() {
    const start = startBlock();
    if (!start) return [];
    return start.getDescendants(false).filter(function (b) { return b !== start && b.isEnabled(); });
  }

  /** Alle Blöcke im Arbeitsbereich ohne Startblock (auch lose). */
  function alleBloecke() {
    return ws ? ws.getAllBlocks(false).filter(function (b) { return b.type !== 'antiv_start'; }).length : 0;
  }

  function zeigeZaehler() {
    const max = Maze.stufe().maxBloecke;
    const n = alleBloecke();
    const el = document.getElementById('block-zaehler');
    if (!el) return;
    el.textContent = 'Blöcke ' + n + ' / ' + max;
    el.classList.toggle('voll', n >= max);
    el.title = n >= max ? 'Keine Blöcke mehr übrig. Löscht Blöcke, um andere zu verwenden.' : 'Noch ' + (max - n) + ' Blöcke übrig';
  }

  function zeigeEnergie() {
    const el = document.getElementById('energie-zaehler');
    if (!el) return;
    const max = Maze.stufe().energie;
    el.textContent = 'Energie ' + (max - zustand.felder) + ' / ' + max;
    el.classList.toggle('leer', zustand.felder >= max && zustand.status !== 'ziel');
  }

  /* ------------------------- Interpreter -------------------------- */

  /* Wertet eine Bedingung aus. Leere Felder gelten als «falsch». */
  function wert(block) {
    if (!block || !block.isEnabled()) return false;
    switch (block.type) {
      case 'antiv_und': return wert(block.getInputTargetBlock('A')) && wert(block.getInputTargetBlock('B'));
      case 'antiv_oder': return wert(block.getInputTargetBlock('A')) || wert(block.getInputTargetBlock('B'));
      case 'antiv_nicht': return !wert(block.getInputTargetBlock('A'));
    }
    for (const f of FUEHLEN) {
      if (f.typ === block.type) {
        return f.art === 'frei' ? Maze.istFrei(zustand, f.seite) : Maze.istInfiziert(zustand, f.seite);
      }
    }
    return false;
  }

  /* Führt eine Kette von Blöcken aus. Jedes yield ist ein Schritt,
     den der Animator anzeigt und ausführt. */
  function* kette(block) {
    while (block) {
      if (block.isEnabled()) yield* anweisung(block);
      block = block.getNextBlock();
    }
  }

  function* anweisung(block) {
    switch (block.type) {
      case 'antiv_wiederhole':
        while (!Maze.istAmZiel(zustand)) {
          yield { block: block, aktion: 'schleife' };
          yield* kette(block.getInputTargetBlock('TUE'));
        }
        break;
      case 'antiv_falls':
        yield { block: block, aktion: 'pruefe' };
        if (wert(block.getInputTargetBlock('BEDINGUNG'))) yield* kette(block.getInputTargetBlock('DANN'));
        break;
      case 'antiv_falls_sonst':
        yield { block: block, aktion: 'pruefe' };
        if (wert(block.getInputTargetBlock('BEDINGUNG'))) yield* kette(block.getInputTargetBlock('DANN'));
        else yield* kette(block.getInputTargetBlock('SONST'));
        break;
      case 'antiv_vor': yield { block: block, aktion: 'vor' }; break;
      case 'antiv_rechts': yield { block: block, aktion: 'rechts' }; break;
      case 'antiv_links': yield { block: block, aktion: 'links' }; break;
    }
  }

  function startBlock() {
    const hats = ws.getBlocksByType('antiv_start', true);
    return hats.length ? hats[0] : null;
  }

  /* -------------------------- Animation --------------------------- */

  function meldung(text, art) {
    const m = document.getElementById('algo-meldung');
    m.textContent = text || '';
    m.className = 'algo-meldung ' + (art || '');
  }

  function zeigeSignaturen() {
    const leiste = document.getElementById('signaturen');
    leiste.innerHTML = '';
    const n = Math.max(SIGNATUR_PLAETZE, zustand.gesammelt.length);
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'signatur-platz' + (i < zustand.gesammelt.length ? ' voll' : '');
      s.textContent = i < zustand.gesammelt.length ? zustand.gesammelt[i] : '_';
      leiste.appendChild(s);
    }
    zeigeEnergie();
  }

  function setzeKnoepfe() {
    const laeuft = modus === 'auto';
    document.getElementById('algo-start').textContent = laeuft ? '⏸ Pause' : '▶ Programm starten';
    document.getElementById('algo-start').classList.toggle('laeuft', laeuft);
    document.getElementById('blockly-sperre').hidden = !laeuft;
  }

  function stoppeTimer() {
    clearTimeout(timer);
    timer = null;
  }

  function beende(text, art) {
    stoppeTimer();
    modus = 'fertig';
    ablauf = null;
    if (ws) ws.highlightBlock(null);
    setzeKnoepfe();
    if (text) meldung(text, art);
  }

  /** Neuer Durchlauf: ANTI-V zurück auf den Start. */
  function zuruecksetzen() {
    stoppeTimer();
    zustand = Maze.neu();
    ablauf = null;
    schritte = 0;
    modus = 'aus';
    if (ws) ws.highlightBlock(null);
    Maze.zuruecksetzen(zustand);
    zeigeSignaturen();
    setzeKnoepfe();
    meldung('Baut euer Programm unter «wenn Programm startet» und drückt auf «Programm starten».', 'info');
  }

  function bereiteVor() {
    if (modus === 'fertig' || !ablauf) {
      if (modus === 'fertig' || zustand.status !== 'bereit') {
        zuruecksetzen();
      }
      const start = startBlock();
      if (!start || !start.getNextBlock()) {
        meldung('Hängt Blöcke unter «wenn Programm startet» an.', 'warnung');
        rueckrufe.ton('fehler');
        return false;
      }
      const bloecke = programmBloecke();
      const max = Maze.stufe().maxBloecke;
      if (bloecke.length > max || alleBloecke() > max) {
        meldung('Zu viele Blöcke! Erlaubt sind höchstens ' + max + '. Löscht überflüssige Blöcke.', 'warnung');
        rueckrufe.ton('fehler');
        return false;
      }
      if (!bloecke.some(function (b) { return b.type === 'antiv_wiederhole'; })) {
        meldung('Ihr müsst mit der Schleife «wiederhole bis Ziel erreicht» arbeiten.', 'warnung');
        rueckrufe.ton('fehler');
        return false;
      }
      verwendeteBloecke = bloecke.length;
      ablauf = kette(start.getNextBlock());
      schritte = 0;
      zustand.status = 'laeuft';
      meldung('ANTI-V läuft …', 'info');
    }
    return true;
  }

  /** Führt genau einen Schritt aus. Liefert die Wartezeit bis zum nächsten oder -1 (Ende). */
  function einSchritt() {
    if (rueckrufe.gesperrt()) { beende('SYSTEM GELÖSCHT', 'fehler'); return -1; }
    const r = ablauf.next();
    if (r.done) {
      beende('Programm beendet, aber ANTI-V hat das Ziel nicht erreicht.', 'warnung');
      rueckrufe.ton('fehler');
      return -1;
    }
    schritte++;
    if (schritte > Maze.stufe().maxSchritte) {
      beende('Endlosschleife? ANTI-V dreht sich im Kreis.', 'warnung');
      rueckrufe.ton('fehler');
      return -1;
    }
    const s = r.value;
    ws.highlightBlock(s.block.id);

    if (s.aktion === 'schleife' || s.aktion === 'pruefe') return Math.round(tempo * 0.4);

    if (s.aktion === 'rechts' || s.aktion === 'links') {
      Maze.drehe(zustand, s.aktion);
      Maze.setzeRoboter(zustand, tempo);
      return tempo;
    }

    // gehe 1 Feld vor, aber nur mit genug Energie
    if (zustand.felder >= Maze.stufe().energie) {
      Maze.animiereMauer(zustand);
      rueckrufe.ton('fehler');
      beende('Energie leer! ANTI-V darf höchstens ' + Maze.stufe().energie + ' Felder gehen. Sucht den richtigen Weg ohne Umwege.', 'fehler');
      return -1;
    }
    const ev = Maze.vor(zustand);
    zeigeEnergie();
    if (ev.typ === 'mauer') {
      Maze.animiereMauer(zustand);
      rueckrufe.ton('fehler');
      beende('Mauer! ANTI-V ist gegen eine Mauer gelaufen und bleibt stehen.', 'fehler');
      return -1;
    }
    Maze.setzeRoboter(zustand, tempo);
    if (ev.zahl !== null && ev.zahl !== undefined) {
      Maze.zahlEingesammelt(ev.schluessel);
      zeigeSignaturen();
      rueckrufe.ton('klick');
    }
    if (ev.typ === 'infiziert') {
      modus = 'fertig';
      setTimeout(function () {
        Maze.animiereInfiziert(zustand);
        rueckrufe.ton('alarm');
      }, tempo * 0.8);
      beende('ANTI-V INFIZIERT. Prüft eure Bedingungen.', 'fehler');
      return -1;
    }
    if (ev.typ === 'ziel') {
      const gesammelt = zustand.gesammelt.slice();
      beende('Ziel erreicht. Signaturen werden geprüft …', 'info');
      setTimeout(function () {
        Maze.animiereZiel();
        rueckrufe.zielErreicht(gesammelt, { bloecke: verwendeteBloecke, maxBloecke: Maze.stufe().maxBloecke }).then(function (antwort) {
          meldung(antwort.text, antwort.ok ? 'ok' : 'warnung');
        });
      }, tempo * 0.8);
      return -1;
    }
    return tempo;
  }

  function automatisch() {
    if (modus !== 'auto') return;
    const warte = einSchritt();
    if (warte >= 0 && modus === 'auto') timer = setTimeout(automatisch, warte);
  }

  /** Knopf «Programm starten» (bzw. Pause während des Laufs). */
  function start() {
    if (rueckrufe.gesperrt()) return;
    rueckrufe.ton('klick');
    if (modus === 'auto') {
      stoppeTimer();
      modus = 'schritt';
      setzeKnoepfe();
      meldung('Pausiert. Weiter mit «Programm starten» oder «Schritt für Schritt».', 'info');
      return;
    }
    if (!bereiteVor()) return;
    modus = 'auto';
    setzeKnoepfe();
    automatisch();
  }

  /** Knopf «Schritt für Schritt». */
  function schritt() {
    if (rueckrufe.gesperrt()) return;
    rueckrufe.ton('klick');
    if (modus === 'auto') stoppeTimer();
    if (!bereiteVor()) return;
    modus = 'schritt';
    setzeKnoepfe();
    einSchritt();
  }

  /* --------------------------- Start ------------------------------ */

  async function init(optionen) {
    rueckrufe = optionen;
    const svg = document.getElementById('labyrinth');
    Maze.setzeStufe(optionen.stufe);
    const info = document.getElementById('stufe-info');
    if (info) info.textContent = 'Stufe ' + Maze.stufe().name;
    Maze.zeichne(svg);
    zustand = Maze.neu();
    Maze.zuruecksetzen(zustand);
    zeigeSignaturen();

    document.getElementById('algo-start').addEventListener('click', start);
    document.getElementById('algo-schritt').addEventListener('click', schritt);
    document.getElementById('algo-reset').addEventListener('click', function () {
      rueckrufe.ton('klick');
      zuruecksetzen();
    });
    const regler = document.getElementById('algo-tempo');
    regler.min = 0;
    regler.max = TEMPO_MAX - TEMPO_MIN;
    regler.value = TEMPO_MAX - TEMPO_STANDARD;
    regler.addEventListener('input', function () {
      tempo = TEMPO_MAX - parseInt(regler.value, 10);
    });

    let medien;
    try {
      medien = await ladeBlockly();
    } catch (e) {
      meldung('Die Blöcke konnten nicht geladen werden. Bitte Internetverbindung prüfen und Seite neu laden.', 'fehler');
      return;
    }
    definiereBloecke();

    const thema = Blockly.Theme.defineTheme('systemabsturz', {
      name: 'systemabsturz',
      base: Blockly.Themes.Classic,
      componentStyles: {
        workspaceBackgroundColour: '#0d1417',
        toolboxBackgroundColour: '#111c20',
        toolboxForegroundColour: '#e8f5e9',
        flyoutBackgroundColour: '#1a272c',
        flyoutForegroundColour: '#e8f5e9',
        flyoutOpacity: 0.96,
        scrollbarColour: '#3ddc84',
        scrollbarOpacity: 0.5,
        insertionMarkerColour: '#ffffff',
        insertionMarkerOpacity: 0.4
      },
      fontStyle: { family: 'Helvetica Neue, Arial, sans-serif', weight: 'bold', size: 12 }
    });

    const container = document.getElementById('blockly');

    ws = Blockly.inject(container, {
      toolbox: toolboxFuerStufe(),
      maxBlocks: Maze.stufe().maxBloecke + 1,   // +1 für «wenn Programm startet»
      renderer: 'zelos',
      theme: thema,
      media: medien,
      trashcan: true,
      sounds: true,
      grid: { spacing: 32, length: 2, colour: '#1f3a2a', snap: false },
      move: { scrollbars: true, drag: true, wheel: true },
      zoom: { controls: true, wheel: false, startScale: 0.8, maxScale: 1.6, minScale: 0.4, scaleSpeed: 1.15, pinch: true }
    });

    // Gespeichertes Programm laden oder Startblock setzen
    ignoriereAenderung = true;
    let geladen = false;
    if (optionen.programm) {
      try {
        Blockly.serialization.workspaces.load(optionen.programm, ws);
        geladen = !!startBlock();
      } catch (e) { geladen = false; }
    }
    if (!geladen) {
      ws.clear();
      const b = ws.newBlock('antiv_start');
      b.initSvg();
      b.render();
      b.moveBy(24, 24);
    }
    ignoriereAenderung = false;

    // Lose Blöcke werden grau (wie nicht verbundene Scratch-Blöcke)
    ws.addChangeListener(Blockly.Events.disableOrphans);
    ws.addChangeListener(function (e) {
      if (e.isUiEvent || ignoriereAenderung) return;
      zeigeZaehler();
      // Programm geändert: laufenden Durchlauf abbrechen
      if (modus === 'schritt' || modus === 'fertig') zuruecksetzen();
      clearTimeout(ws._speicherTimer);
      ws._speicherTimer = setTimeout(function () {
        rueckrufe.speichereProgramm(Blockly.serialization.workspaces.save(ws));
      }, 400);
    });

    // Grösse anpassen, wenn sich das Layout ändert (z. B. Drehen des Tablets)
    if (window.ResizeObserver) {
      new ResizeObserver(function () { Blockly.svgResize(ws); }).observe(container);
    }
    window.addEventListener('resize', function () { Blockly.svgResize(ws); });
    zuruecksetzen();
    zeigeZaehler();
  }

  /** Wird bei 00:00 aufgerufen. */
  function stoppe() {
    if (modus === 'auto' || modus === 'schritt') beende('SYSTEM GELÖSCHT', 'fehler');
  }

  /* Für automatische Tests: Zugriff auf den Arbeitsbereich */
  function arbeitsbereich() { return ws; }

  /** Lädt Blockly im Hintergrund, damit Protokoll 2 später sofort bereit ist. */
  function vorladen() {
    ladeBlockly().catch(function () { /* wird beim Öffnen nochmals versucht */ });
  }

  return { init: init, stoppe: stoppe, arbeitsbereich: arbeitsbereich, vorladen: vorladen };
})();

window.Algorithmen = Algorithmen;
