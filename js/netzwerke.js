/* =====================================================================
   Systemabsturz: Netzwerkpläne für Protokoll 3 (je Schwierigkeitsstufe)
   ---------------------------------------------------------------------
   Pro Stufe: Server mit Kennzahl und Position, Verbindungen und die
   Lösung (nur für die Spielleitung). Die Teamsets (Word/PDF) zeigen
   dieselben Pläne. Auf allen Stufen ist der Override-Code 109,
   geprüft wird er nur als Hash in js/app.js.
   Leicht: 11 Server, 3 infiziert, alle Wege brauchen 4 Verbindungen.
   Mittel: 14 Server, 4 infiziert, sauberer Weg 5 Verbindungen, eine
           verlockende Abkürzung mit 4 Verbindungen ist infiziert.
   Schwer: 18 Server, 5 infiziert, sauberer Weg 6 Verbindungen, alle
           Wege mit 5 Verbindungen sind infiziert.

   Wer einen Plan ändert, prüft mit werkzeuge (oder von Hand):
   genau ein kürzester Weg ohne rote Server, Summe = Override-Code.
   Lizenz: CC BY-SA 4.0, Christof Heiss, Jan Schmid, PH Luzern 2026
   ===================================================================== */

const NETZWERKE = {
  leicht: {
    server: {
      A: { kennzahl: 12, x: 90, y: 450 },
      B: { kennzahl: 17, x: 270, y: 170 },
      C: { kennzahl: 26, x: 500, y: 100, infiziert: true },
      D: { kennzahl: 23, x: 730, y: 170 },
      Z: { kennzahl: 24, x: 910, y: 450 },
      E: { kennzahl: 15, x: 300, y: 450 },
      F: { kennzahl: 29, x: 500, y: 450, infiziert: true },
      G: { kennzahl: 18, x: 700, y: 450 },
      H: { kennzahl: 21, x: 270, y: 730 },
      I: { kennzahl: 34, x: 500, y: 800 },
      J: { kennzahl: 31, x: 730, y: 730, infiziert: true }
    },
    verbindungen: ['A-B', 'B-C', 'C-D', 'D-Z', 'A-E', 'E-F', 'F-G', 'G-Z', 'A-H', 'H-I', 'I-J', 'J-Z', 'B-E', 'E-H', 'I-G', 'D-G', 'C-F', 'F-I'],
    loesung: 'A, H, I, G, Z (4 Verbindungen): 12 + 21 + 34 + 18 + 24 = 109',
    fallen: 'Alle anderen Wege mit 4 Verbindungen führen über rote Server: A, B, C, D, Z = 102; A, E, F, G, Z = 098; A, H, I, J, Z = 122'
  },
  mittel: {
    server: {
      A: { kennzahl: 12, x: 80, y: 450 },
      Z: { kennzahl: 24, x: 920, y: 450 },
      B: { kennzahl: 16, x: 250, y: 130 },
      C: { kennzahl: 22, x: 420, y: 130 },
      D: { kennzahl: 27, x: 590, y: 130, infiziert: true },
      E: { kennzahl: 19, x: 760, y: 130 },
      F: { kennzahl: 14, x: 250, y: 450 },
      G: { kennzahl: 33, x: 420, y: 450, infiziert: true },
      H: { kennzahl: 16, x: 590, y: 450 },
      I: { kennzahl: 28, x: 760, y: 450, infiziert: true },
      J: { kennzahl: 25, x: 250, y: 770 },
      K: { kennzahl: 19, x: 420, y: 770, infiziert: true },
      L: { kennzahl: 31, x: 590, y: 770 },
      M: { kennzahl: 15, x: 760, y: 770 }
    },
    verbindungen: ['A-B', 'B-C', 'C-D', 'D-E', 'E-Z', 'A-F', 'F-G', 'G-H', 'H-I', 'I-Z', 'A-J', 'J-K', 'K-L', 'L-M', 'M-Z', 'B-F', 'F-J', 'C-G', 'C-H', 'H-D', 'H-L', 'H-E', 'E-I', 'L-I', 'G-K', 'J-G', 'D-Z'],
    loesung: 'A, B, C, H, E, Z (5 Verbindungen): 12 + 16 + 22 + 16 + 19 + 24 = 109',
    fallen: 'Verlockend kurz, aber infiziert: A, B, C, D, Z = 101 (4 Verbindungen); weitere Wege über rote Server mit 5 Verbindungen: 115, 117, 118, 120, 126, 127, 129, 132, 137, 138, 139, 143'
  },
  schwer: {
    server: {
      A: { kennzahl: 12, x: 70, y: 410 },
      Z: { kennzahl: 24, x: 930, y: 410 },
      B: { kennzahl: 14, x: 220, y: 80 },
      C: { kennzahl: 17, x: 400, y: 80 },
      D: { kennzahl: 21, x: 580, y: 80, infiziert: true },
      E: { kennzahl: 26, x: 760, y: 80 },
      F: { kennzahl: 18, x: 220, y: 300 },
      G: { kennzahl: 23, x: 400, y: 300, infiziert: true },
      H: { kennzahl: 11, x: 580, y: 300 },
      I: { kennzahl: 29, x: 760, y: 300, infiziert: true },
      J: { kennzahl: 13, x: 220, y: 520 },
      K: { kennzahl: 27, x: 400, y: 520 },
      L: { kennzahl: 19, x: 580, y: 520, infiziert: true },
      M: { kennzahl: 16, x: 760, y: 520 },
      N: { kennzahl: 22, x: 220, y: 740 },
      O: { kennzahl: 25, x: 400, y: 740, infiziert: true },
      P: { kennzahl: 28, x: 580, y: 740 },
      Q: { kennzahl: 15, x: 760, y: 740 }
    },
    verbindungen: ['A-B', 'A-F', 'A-J', 'A-N', 'B-C', 'C-D', 'D-E', 'E-Z', 'F-G', 'G-H', 'H-I', 'I-Z', 'J-K', 'K-L', 'L-M', 'N-O', 'O-P', 'P-Q', 'Q-Z', 'B-F', 'C-G', 'G-K', 'K-O', 'D-H', 'H-L', 'L-P', 'E-I', 'I-M', 'M-Q', 'F-K', 'C-H', 'J-N', 'H-M'],
    loesung: 'A, B, C, H, M, Q, Z (6 Verbindungen): 12 + 14 + 17 + 11 + 16 + 15 + 24 = 109',
    fallen: 'Alle Wege mit 5 Verbindungen sind infiziert: A, B, C, H, I, Z = 107; A, B, C, D, E, Z = 114; A, F, G, H, I, Z = 117; A, N, O, P, Q, Z = 126; dazu viele infizierte Wege mit 6 Verbindungen (119 bis 149)'
  }
};

/** Zeichnet einen Netzwerkplan als SVG-Text (für Druckseite und Spielleitung). */
function netzwerkSvg(stufe) {
  const n = NETZWERKE[stufe] || NETZWERKE.mittel;
  const s = n.server;
  let breite = 0;
  let hoehe = 0;
  Object.keys(s).forEach(function (k) { breite = Math.max(breite, s[k].x + 70); hoehe = Math.max(hoehe, s[k].y + 80); });
  const teile = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + breite + ' ' + hoehe + '" class="netzwerk-svg" role="img" aria-label="Netzwerkplan">'];
  n.verbindungen.forEach(function (v) {
    const a = s[v.split('-')[0]];
    const b = s[v.split('-')[1]];
    teile.push('<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="#111" stroke-width="5"/>');
  });
  Object.keys(s).forEach(function (name) {
    const sv = s[name];
    const start = name === 'A' || name === 'Z';
    const farbe = sv.infiziert ? '#c62828' : (start ? '#1565c0' : '#fff');
    const text = sv.infiziert || start ? '#fff' : '#111';
    teile.push('<rect x="' + (sv.x - 50) + '" y="' + (sv.y - 40) + '" width="100" height="80" rx="12" fill="' + farbe + '" stroke="#111" stroke-width="4"/>');
    for (let i = 0; i < 3; i++) {
      teile.push('<line x1="' + (sv.x - 36) + '" y1="' + (sv.y - 27 + i * 7) + '" x2="' + (sv.x + 6) + '" y2="' + (sv.y - 27 + i * 7) + '" stroke="' + text + '" stroke-width="2"/>');
    }
    teile.push('<text x="' + (sv.x - 36) + '" y="' + (sv.y + 28) + '" font-family="Arial, sans-serif" font-weight="bold" font-size="34" fill="' + text + '">' + name + '</text>');
    teile.push('<text x="' + (sv.x + 42) + '" y="' + (sv.y + 28) + '" font-family="Arial, sans-serif" font-weight="bold" font-size="30" text-anchor="end" fill="' + text + '">' + sv.kennzahl + '</text>');
    if (sv.infiziert) {
      teile.push('<text x="' + sv.x + '" y="' + (sv.y + 64) + '" font-family="Arial, sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#c62828" stroke="#fff" stroke-width="6" paint-order="stroke">INFIZIERT</text>');
    }
  });
  teile.push('</svg>');
  return teile.join('');
}

/** Berechnet für eine Stufe den kürzesten sauberen Weg, den Override-Code
    und die Fallen (infizierte Wege, die nicht länger sind). */
function netzwerkAnalyse(stufe) {
  const n = NETZWERKE[stufe];
  const nachbarn = {};
  Object.keys(n.server).forEach(function (k) { nachbarn[k] = []; });
  n.verbindungen.forEach(function (v) {
    const t = v.split('-');
    nachbarn[t[0]].push(t[1]);
    nachbarn[t[1]].push(t[0]);
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
  const fallen = Array.from(new Set(wege.filter(function (w) { return infiziert(w) && w.length - 1 <= kurz; }).map(summe)))
    .filter(function (z) { return z !== code; }).sort(function (a, b) { return a - b; })
    .map(function (z) { return String(z).padStart(3, '0'); });
  return { weg: beste[0], eindeutig: beste.length === 1, verbindungen: kurz, code: String(code).padStart(3, '0'), fallen: fallen };
}
