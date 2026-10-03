/* =====================================================================
   Systemabsturz: Netzwerkpläne für Protokoll 3 (je Schwierigkeitsstufe)
   ---------------------------------------------------------------------
   Pro Stufe: Server mit Kennzahl und Position, Verbindungen und die
   Lösung (nur für die Spielleitung). Die Pläne entsprechen den
   Teamsets (Word/PDF). Auf allen Stufen ist der Override-Code 109,
   geprüft wird er nur als Hash in js/app.js.

   Wer einen Plan ändert, prüft mit werkzeuge (oder von Hand):
   genau ein kürzester Weg ohne rote Server, Summe = Override-Code.
   Lizenz: CC BY-SA 4.0, Christof Heiss, Jan Schmid, PH Luzern 2026
   ===================================================================== */

const NETZWERKE = {
  leicht: {
    server: {
      A: { kennzahl: 12, x: 95, y: 390 },
      B: { kennzahl: 18, x: 300, y: 135 },
      C: { kennzahl: 34, x: 505, y: 60 },
      D: { kennzahl: 21, x: 710, y: 135 },
      Z: { kennzahl: 24, x: 915, y: 390 },
      H: { kennzahl: 29, x: 505, y: 390, infiziert: true },
      E: { kennzahl: 18, x: 300, y: 660 },
      G: { kennzahl: 25, x: 660, y: 660, infiziert: true }
    },
    verbindungen: ['A-B', 'B-C', 'C-D', 'D-Z', 'A-H', 'H-Z', 'A-E', 'E-G', 'G-Z'],
    loesung: 'A, B, C, D, Z (4 Verbindungen): 12 + 18 + 34 + 21 + 24 = 109',
    fallen: 'A, H, Z = 065; A, E, G, Z = 079'
  },
  mittel: {
    server: {
      A: { kennzahl: 12, x: 110, y: 380 },
      B: { kennzahl: 23, x: 300, y: 95 },
      C: { kennzahl: 31, x: 515, y: 55 },
      E: { kennzahl: 19, x: 735, y: 110 },
      Z: { kennzahl: 24, x: 912, y: 380 },
      D: { kennzahl: 17, x: 400, y: 390 },
      H: { kennzahl: 20, x: 625, y: 390, infiziert: true },
      F: { kennzahl: 46, x: 290, y: 675 },
      G: { kennzahl: 29, x: 515, y: 685, infiziert: true }
    },
    verbindungen: ['A-B', 'A-G', 'A-F', 'B-C', 'B-H', 'C-E', 'C-D', 'D-F', 'E-Z', 'G-Z', 'H-Z', 'F-G'],
    loesung: 'A, B, C, E, Z (4 Verbindungen): 12 + 23 + 31 + 19 + 24 = 109',
    fallen: 'A, G, Z = 065; A, B, H, Z = 079; A, F, G, Z = 111'
  },
  schwer: {
    server: {
      A: { kennzahl: 12, x: 90, y: 455 },
      B: { kennzahl: 17, x: 240, y: 210 },
      E: { kennzahl: 31, x: 385, y: 52 },
      F: { kennzahl: 41, x: 605, y: 52 },
      I: { kennzahl: 33, x: 760, y: 228 },
      J: { kennzahl: 25, x: 485, y: 288, infiziert: true },
      H: { kennzahl: 29, x: 485, y: 475, infiziert: true },
      Z: { kennzahl: 24, x: 910, y: 455 },
      D: { kennzahl: 15, x: 240, y: 700 },
      C: { kennzahl: 22, x: 470, y: 680 },
      K: { kennzahl: 36, x: 685, y: 640 },
      G: { kennzahl: 28, x: 640, y: 855, infiziert: true }
    },
    verbindungen: ['A-B', 'B-E', 'E-F', 'F-I', 'I-Z', 'B-J', 'J-I', 'A-H', 'H-Z', 'A-D', 'D-C', 'C-K', 'K-Z', 'D-G', 'G-Z'],
    loesung: 'A, D, C, K, Z (4 Verbindungen): 12 + 15 + 22 + 36 + 24 = 109',
    fallen: 'A, H, Z = 065; A, D, G, Z = 079; A, B, J, I, Z = 111'
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
      teile.push('<text x="' + sv.x + '" y="' + (sv.y + 64) + '" font-family="Arial, sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#c62828">INFIZIERT</text>');
    }
  });
  teile.push('</svg>');
  return teile.join('');
}
