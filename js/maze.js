/* =====================================================================
   Systemabsturz: Labyrinth für Protokoll 2 (ANTI-V)
   ---------------------------------------------------------------------
   Diese Datei enthält das Spielfeld, die Spiellogik von ANTI-V
   (Bewegen, Drehen, Fühlen) und die Darstellung als SVG.
   Lehrpersonen können das Labyrinth unten in den KONSTANTEN anpassen.
   Lizenz: CC BY-SA 4.0, Christof Heiss, Jan Schmid, PH Luzern 2026
   ===================================================================== */

/* ---------------------------- KONSTANTEN ---------------------------- */

/* Schwierigkeitsstufen. Die Spielleitung wählt die Stufe auf
   spielleitung.html, sie wird mit dem Startsignal an die Tablets
   geschickt (oder per Link: index.html?stufe=leicht).

   Pro Stufe:
   labyrinth    Zeile 0 oben, Spalte 0 links.
                # = Mauer, . = frei, S = Start, Z = Ziel, X = infiziert
   signaturen   Zahlen auf freien Feldern ("zeile,spalte": Zahl).
                Auf dem richtigen Weg müssen 3, 8, 5 in dieser
                Reihenfolge liegen (geprüft wird nur als Hash in app.js).
   startRichtung  0 = Norden, 1 = Osten, 2 = Süden, 3 = Westen
   maxBloecke   so viele Blöcke dürfen höchstens verwendet werden
                (ohne «wenn Programm startet»). Damit ist ein Programm
                ohne Schleife zu lang und die Musterlösung passt genau.
   energie      so viele Felder darf ANTI-V höchstens gehen
                (genau die Länge des richtigen Weges)
   maxSchritte  Abbruch wegen Endlosschleife nach so vielen Schritten
   toolbox      welche Blöcke zur Verfügung stehen
   musterloesung  nur für die Spielleitung (Lösungsansicht)

   Wer ein Labyrinth ändert, prüft mit der Musterlösung, ob 3, 8, 5
   eingesammelt werden, und passt energie und maxBloecke an. */
const STUFEN = {
  leicht: {
    name: 'Leicht',
    labyrinth: [
      '##########',
      '#S.......#',
      '########.#',
      '#......#.#',
      '#.####.#.#',
      '#.#Z##.#.#',
      '#.#....#.#',
      '#.######.#',
      '#........#',
      '##########'
    ],
    signaturen: { '1,5': 3, '8,4': 8, '3,4': 5 },
    startRichtung: 1,
    maxBloecke: 5,
    energie: 38,
    maxSchritte: 300,
    toolbox: ['antiv_wiederhole', 'antiv_falls', 'antiv_falls_sonst', 'antiv_vor', 'antiv_rechts', 'antiv_links',
      'antiv_rechts_frei', 'antiv_vorne_frei', 'antiv_links_frei'],
    musterloesung: 'wiederhole bis Ziel erreicht { falls vorne frei? dann gehe 1 Feld vor, sonst drehe dich nach rechts } (5 Blöcke)'
  },
  mittel: {
    name: 'Mittel',
    labyrinth: [
      '##########',
      '#S##..####',
      '#..#..##.#',
      '#...###..#',
      '#...#.##.#',
      '#.....#.X#',
      '#.#.....##',
      '#......###',
      '#..###..Z#',
      '##########'
    ],
    signaturen: { '4,1': 3, '7,3': 8, '7,6': 5, '5,3': 1, '6,5': 2, '3,8': 6 },
    startRichtung: 2,
    maxBloecke: 9,
    energie: 16,
    maxSchritte: 200,
    toolbox: null,   // null = alle Blöcke
    musterloesung: 'wiederhole bis Ziel erreicht { falls rechts frei? dann (drehe rechts, gehe vor) sonst { falls vorne frei? dann gehe vor, sonst drehe links } } (9 Blöcke, kürzer mit 8 Blöcken möglich)'
  },
  schwer: {
    name: 'Schwer',
    labyrinth: [
      '##########',
      '#S##..####',
      '#..#..##.#',
      '#...###..#',
      '#...#.##.#',
      '#.....#.X#',
      '#.#.....##',
      '#......###',
      '#..##X..Z#',
      '##########'
    ],
    signaturen: { '4,1': 3, '7,3': 8, '7,6': 5, '5,3': 1, '6,5': 2, '3,8': 6 },
    startRichtung: 2,
    maxBloecke: 15,
    energie: 16,
    maxSchritte: 200,
    toolbox: null,
    musterloesung: 'wiederhole bis Ziel erreicht { falls (rechts frei? und nicht rechts infiziert?) dann (drehe rechts, gehe vor) sonst { falls (vorne frei? und nicht vorne infiziert?) dann gehe vor, sonst drehe links } } (15 Blöcke, kürzer mit 11 Blöcken möglich)'
  }
};

/* Stufe, wenn die Spielleitung nichts anderes wählt */
const STANDARD_STUFE = 'mittel';

/* ------------------------------ LOGIK ------------------------------- */

const Maze = (function () {
  'use strict';

  // Richtungsvektoren für N, O, S, W
  const DZ = [-1, 0, 1, 0];
  const DS = [0, 1, 0, -1];
  const ZELLE = 40; // Grösse eines Feldes im SVG (ViewBox-Einheiten)
  const SVG_NS = 'http://www.w3.org/2000/svg';

  let stufeName = STANDARD_STUFE;
  let stufe = STUFEN[stufeName];
  let LABYRINTH, SIGNATUR_FELDER, START_RICHTUNG, zeilen, spalten;
  let start = { zeile: 1, spalte: 1 };
  let ziel = { zeile: 1, spalte: 1 };

  /** Wählt die Schwierigkeitsstufe (leicht, mittel, schwer). */
  function setzeStufe(name) {
    stufeName = STUFEN[name] ? name : STANDARD_STUFE;
    stufe = STUFEN[stufeName];
    LABYRINTH = stufe.labyrinth;
    SIGNATUR_FELDER = stufe.signaturen;
    START_RICHTUNG = stufe.startRichtung;
    zeilen = LABYRINTH.length;
    spalten = LABYRINTH[0].length;
    // Start und Ziel aus dem Labyrinth lesen
    LABYRINTH.forEach(function (zeile, z) {
      for (let s = 0; s < zeile.length; s++) {
        if (zeile[s] === 'S') start = { zeile: z, spalte: s };
        if (zeile[s] === 'Z') ziel = { zeile: z, spalte: s };
      }
    });
  }
  setzeStufe(STANDARD_STUFE);

  /** Liefert das Zeichen eines Feldes, ausserhalb gilt als Mauer. */
  function feld(z, s) {
    if (z < 0 || s < 0 || z >= zeilen || s >= spalten) return '#';
    return LABYRINTH[z][s];
  }

  /** Neuer Zustand von ANTI-V auf dem Startfeld. */
  function neu() {
    return {
      zeile: start.zeile,
      spalte: start.spalte,
      richtung: START_RICHTUNG,
      gesammelt: [],          // eingesammelte Zahlen in Reihenfolge
      felder: 0,              // verbrauchte Energie (gegangene Felder)
      eingesammelt: {},       // bereits eingesammelte Felder
      schritte: 0,
      status: 'bereit'        // bereit | laeuft | ziel | mauer | infiziert | ende | endlos
    };
  }

  /** Richtung relativ zu ANTI-V: vorne, rechts, links. */
  function absoluteRichtung(zustand, relativ) {
    if (relativ === 'rechts') return (zustand.richtung + 1) % 4;
    if (relativ === 'links') return (zustand.richtung + 3) % 4;
    return zustand.richtung;
  }

  function nachbar(zustand, relativ) {
    const r = absoluteRichtung(zustand, relativ);
    return { zeile: zustand.zeile + DZ[r], spalte: zustand.spalte + DS[r] };
  }

  /** «frei»: Nachbarfeld ist keine Mauer und nicht ausserhalb. */
  function istFrei(zustand, relativ) {
    const n = nachbar(zustand, relativ);
    return feld(n.zeile, n.spalte) !== '#';
  }

  /** «infiziert»: Nachbarfeld ist rot. */
  function istInfiziert(zustand, relativ) {
    const n = nachbar(zustand, relativ);
    return feld(n.zeile, n.spalte) === 'X';
  }

  function istAmZiel(zustand) {
    return zustand.zeile === ziel.zeile && zustand.spalte === ziel.spalte;
  }

  /** Dreht ANTI-V um 90 Grad. */
  function drehe(zustand, seite) {
    zustand.richtung = absoluteRichtung(zustand, seite);
    return { typ: 'gedreht' };
  }

  /** Geht ein Feld vor. Liefert ein Ereignis zurück. */
  function vor(zustand) {
    const n = nachbar(zustand, 'vorne');
    const f = feld(n.zeile, n.spalte);
    if (f === '#') {
      zustand.status = 'mauer';
      return { typ: 'mauer' };
    }
    zustand.zeile = n.zeile;
    zustand.spalte = n.spalte;
    zustand.felder++;
    if (f === 'X') {
      zustand.status = 'infiziert';
      return { typ: 'infiziert' };
    }
    const schluessel = n.zeile + ',' + n.spalte;
    let zahl = null;
    if (SIGNATUR_FELDER[schluessel] !== undefined && !zustand.eingesammelt[schluessel]) {
      zahl = SIGNATUR_FELDER[schluessel];
      zustand.eingesammelt[schluessel] = true;
      zustand.gesammelt.push(zahl);
    }
    if (f === 'Z') {
      zustand.status = 'ziel';
      return { typ: 'ziel', zahl: zahl, schluessel: schluessel };
    }
    return { typ: 'bewegt', zahl: zahl, schluessel: schluessel };
  }

  /* --------------------------- DARSTELLUNG --------------------------- */

  let svg = null;
  let roboter = null;
  let roboterKoerper = null;
  let meldungText = null;
  const zahlElemente = {};
  let gesamtWinkel = 0;  // für weiche Drehungen ohne Sprung bei 360 Grad

  function el(name, attribute, eltern) {
    const e = document.createElementNS(SVG_NS, name);
    for (const k in attribute) e.setAttribute(k, attribute[k]);
    if (eltern) eltern.appendChild(e);
    return e;
  }

  /** Zeichnet das ganze Labyrinth in ein SVG-Element. */
  function zeichne(svgElement) {
    svg = svgElement;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    for (const k in zahlElemente) delete zahlElemente[k];
    svg.setAttribute('viewBox', '0 0 ' + spalten * ZELLE + ' ' + zeilen * ZELLE);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Labyrinth mit ANTI-V');

    const defs = el('defs', {}, svg);
    const muster = el('pattern', { id: 'gitter', width: ZELLE, height: ZELLE, patternUnits: 'userSpaceOnUse' }, defs);
    el('rect', { width: ZELLE, height: ZELLE, fill: '#0f1a12' }, muster);
    el('path', { d: 'M ' + ZELLE + ' 0 L 0 0 0 ' + ZELLE, fill: 'none', stroke: '#1f3a26', 'stroke-width': 1 }, muster);
    el('rect', { x: 0, y: 0, width: spalten * ZELLE, height: zeilen * ZELLE, fill: 'url(#gitter)' }, svg);

    for (let z = 0; z < zeilen; z++) {
      for (let s = 0; s < spalten; s++) {
        const f = feld(z, s);
        const x = s * ZELLE;
        const y = z * ZELLE;
        if (f === '#') {
          el('rect', { x: x, y: y, width: ZELLE, height: ZELLE, fill: '#3a3f44', stroke: '#2a2e32', 'stroke-width': 2 }, svg);
        } else if (f === 'X') {
          el('rect', { x: x + 2, y: y + 2, width: ZELLE - 4, height: ZELLE - 4, rx: 4, fill: '#c62828', class: 'feld-infiziert' }, svg);
          el('path', { d: 'M' + (x + 10) + ' ' + (y + 10) + ' L' + (x + 30) + ' ' + (y + 30) + ' M' + (x + 30) + ' ' + (y + 10) + ' L' + (x + 10) + ' ' + (y + 30), stroke: '#fff', 'stroke-width': 5, 'stroke-linecap': 'round' }, svg);
        } else if (f === 'S') {
          el('rect', { x: x + 2, y: y + 2, width: ZELLE - 4, height: ZELLE - 4, rx: 4, fill: '#1e63c4' }, svg);
          // Pfeil in Startrichtung
          const pfeil = el('path', { d: 'M0 -12 L9 2 L3 2 L3 12 L-3 12 L-3 2 L-9 2 Z', fill: '#fff', opacity: 0.85 }, svg);
          pfeil.setAttribute('transform', 'translate(' + (x + ZELLE / 2) + ' ' + (y + ZELLE / 2) + ') rotate(' + START_RICHTUNG * 90 + ')');
        } else if (f === 'Z') {
          el('rect', { x: x + 2, y: y + 2, width: ZELLE - 4, height: ZELLE - 4, rx: 4, fill: '#2e9e45' }, svg);
          const t = el('text', { x: x + ZELLE / 2, y: y + ZELLE / 2 + 7, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 'bold', fill: '#fff', 'font-family': 'monospace' }, svg);
          t.textContent = 'Z';
        }
        const zahl = SIGNATUR_FELDER[z + ',' + s];
        if (zahl !== undefined) {
          const t = el('text', { x: x + ZELLE / 2, y: y + ZELLE / 2 + 10, 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 'bold', fill: '#ffd54f', 'font-family': 'monospace', class: 'signatur' }, svg);
          t.textContent = String(zahl);
          zahlElemente[z + ',' + s] = t;
        }
      }
    }

    // ANTI-V: einfache Roboterfigur, die Antenne zeigt nach vorne
    roboter = el('g', { class: 'roboter' }, svg);
    roboterKoerper = el('g', { class: 'roboter-koerper' }, roboter);
    el('rect', { x: -13, y: -11, width: 26, height: 24, rx: 6, fill: '#e0f7fa', stroke: '#00acc1', 'stroke-width': 2 }, roboterKoerper);
    el('rect', { x: -8, y: -6, width: 16, height: 9, rx: 3, fill: '#263238' }, roboterKoerper);
    el('circle', { cx: -4, cy: -2, r: 2.2, fill: '#76ff03' }, roboterKoerper);
    el('circle', { cx: 4, cy: -2, r: 2.2, fill: '#76ff03' }, roboterKoerper);
    el('line', { x1: 0, y1: -11, x2: 0, y2: -17, stroke: '#00acc1', 'stroke-width': 2 }, roboterKoerper);
    el('path', { d: 'M0 -20 L5 -14 L-5 -14 Z', fill: '#ff9100' }, roboterKoerper); // Blickrichtung
    el('rect', { x: -9, y: 6, width: 18, height: 3, rx: 1.5, fill: '#00acc1' }, roboterKoerper);

    meldungText = el('text', { x: 0, y: 0, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 'bold', fill: '#ff5252', 'font-family': 'monospace', class: 'maze-meldung', opacity: 0 }, svg);
  }

  /** Setzt die Darstellung auf den Startzustand zurück. */
  function zuruecksetzen(zustand) {
    for (const k in zahlElemente) zahlElemente[k].classList.remove('eingesammelt');
    roboter.classList.remove('infiziert', 'ziel', 'mauer');
    meldungText.setAttribute('opacity', 0);
    gesamtWinkel = zustand.richtung * 90;
    setzeRoboter(zustand, 0);
  }

  /** Bewegt die Roboterfigur zum aktuellen Zustand (animiert). */
  function setzeRoboter(zustand, dauerMs) {
    // kürzeste Drehung bestimmen, damit ANTI-V nie 270 Grad zurückdreht
    const ziel = zustand.richtung * 90;
    let diff = ((ziel - gesamtWinkel) % 360 + 540) % 360 - 180;
    gesamtWinkel += diff;
    const x = zustand.spalte * ZELLE + ZELLE / 2;
    const y = zustand.zeile * ZELLE + ZELLE / 2;
    roboter.style.transition = dauerMs > 0 ? 'transform ' + Math.round(dauerMs * 0.8) + 'ms ease-in-out' : 'none';
    roboter.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + gesamtWinkel + 'deg)';
  }

  function zahlEingesammelt(schluessel) {
    if (zahlElemente[schluessel]) zahlElemente[schluessel].classList.add('eingesammelt');
  }

  function zeigeMeldung(zustand, text) {
    meldungText.textContent = text;
    meldungText.setAttribute('x', Math.min(Math.max(zustand.spalte * ZELLE + ZELLE / 2, 50), spalten * ZELLE - 50));
    meldungText.setAttribute('y', Math.max(zustand.zeile * ZELLE - 6, 16));
    meldungText.setAttribute('opacity', 1);
  }

  /** Animation: ANTI-V läuft gegen eine Mauer. */
  function animiereMauer(zustand) {
    roboter.classList.add('mauer');
    zeigeMeldung(zustand, 'Mauer!');
    roboterKoerper.classList.remove('stoss');
    void roboterKoerper.getBBox();
    roboterKoerper.classList.add('stoss');
  }

  /** Animation: ANTI-V ist auf ein rotes Feld gefahren. */
  function animiereInfiziert(zustand) {
    roboter.classList.add('infiziert');
    zeigeMeldung(zustand, 'INFIZIERT!');
  }

  function animiereZiel() {
    roboter.classList.add('ziel');
  }

  return {
    neu: neu,
    feld: feld,
    istFrei: istFrei,
    istInfiziert: istInfiziert,
    istAmZiel: istAmZiel,
    vor: vor,
    drehe: drehe,
    zeichne: zeichne,
    zuruecksetzen: zuruecksetzen,
    setzeRoboter: setzeRoboter,
    zahlEingesammelt: zahlEingesammelt,
    animiereMauer: animiereMauer,
    animiereInfiziert: animiereInfiziert,
    animiereZiel: animiereZiel,
    setzeStufe: setzeStufe,
    stufe: function () { return stufe; },
    stufeName: function () { return stufeName; }
  };
})();
