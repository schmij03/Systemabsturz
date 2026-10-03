/* =====================================================================
   Systemabsturz: Netzwerkpläne für Protokoll 3 (je Schwierigkeitsstufe)
   ---------------------------------------------------------------------
   Pro Stufe: Server mit Kennzahl und Position, Verbindungen und die
   Lösung (nur für die Spielleitung). Die Teamsets (Word/PDF) zeigen
   dieselben Pläne. Auf allen Stufen ist der Override-Code 109,
   geprüft wird er nur als Hash in js/app.js.
   Leicht: 14 Server, 4 infiziert, 25 Verbindungen, richtiger Weg 6 Verbindungen.
   Mittel: 18 Server, 5 infiziert, 32 Verbindungen, richtiger Weg 7 Verbindungen.
   Schwer: 22 Server, 7 infiziert, 38 Verbindungen, richtiger Weg 9 Verbindungen.
   Gerade Wege quer durchs Netz sind alle infiziert, der saubere Weg
   muss Umwege nach oben oder unten machen.
   Lizenz: CC BY-SA 4.0, Christof Heiss, Jan Schmid, PH Luzern 2026
   ===================================================================== */

const NETZWERKE = {
  leicht: {
    server: {
      A: { kennzahl: 12, x: 70, y: 320 },
      B: { kennzahl: 31, x: 250, y: 90, infiziert: true },
      C: { kennzahl: 23, x: 440, y: 90 },
      D: { kennzahl: 10, x: 630, y: 90 },
      E: { kennzahl: 15, x: 820, y: 90 },
      F: { kennzahl: 13, x: 250, y: 320 },
      G: { kennzahl: 12, x: 440, y: 320 },
      H: { kennzahl: 30, x: 630, y: 320, infiziert: true },
      I: { kennzahl: 9, x: 820, y: 320, infiziert: true },
      J: { kennzahl: 27, x: 250, y: 550 },
      K: { kennzahl: 29, x: 440, y: 550 },
      L: { kennzahl: 25, x: 630, y: 550 },
      M: { kennzahl: 31, x: 820, y: 550, infiziert: true },
      Z: { kennzahl: 24, x: 970, y: 320 }
    },
    verbindungen: ['A-B', 'A-F', 'A-J', 'B-C', 'B-F', 'B-G', 'C-D', 'C-G', 'C-H', 'D-E', 'E-I', 'E-Z', 'F-G', 'F-J', 'F-K', 'G-H', 'G-K', 'G-L', 'H-I', 'H-L', 'H-M', 'I-Z', 'K-L', 'L-M', 'M-Z'],
    loesung: 'A, F, G, C, D, E, Z (6 Verbindungen): 12 + 13 + 12 + 23 + 10 + 15 + 24 = 109',
    fallen: 'Verlockende Abkürzungen mit weniger als 6 Verbindungen sind infiziert, zum Beispiel 100, 115, 117, 118, 122, 129'
  },
  mittel: {
    server: {
      A: { kennzahl: 12, x: 70, y: 380 },
      B: { kennzahl: 14, x: 250, y: 80 },
      C: { kennzahl: 22, x: 440, y: 80 },
      D: { kennzahl: 14, x: 630, y: 80 },
      E: { kennzahl: 27, x: 820, y: 80, infiziert: true },
      F: { kennzahl: 20, x: 250, y: 280 },
      G: { kennzahl: 9, x: 440, y: 280 },
      H: { kennzahl: 17, x: 630, y: 280 },
      I: { kennzahl: 26, x: 820, y: 280, infiziert: true },
      J: { kennzahl: 27, x: 250, y: 480 },
      K: { kennzahl: 21, x: 440, y: 480, infiziert: true },
      L: { kennzahl: 14, x: 630, y: 480 },
      M: { kennzahl: 27, x: 820, y: 480, infiziert: true },
      N: { kennzahl: 26, x: 250, y: 680 },
      O: { kennzahl: 15, x: 440, y: 680, infiziert: true },
      P: { kennzahl: 14, x: 630, y: 680 },
      Q: { kennzahl: 5, x: 820, y: 680 },
      Z: { kennzahl: 24, x: 970, y: 380 }
    },
    verbindungen: ['A-B', 'A-J', 'A-N', 'B-C', 'B-F', 'B-G', 'C-D', 'C-G', 'D-H', 'E-H', 'E-Z', 'F-G', 'F-K', 'G-H', 'G-K', 'H-I', 'H-L', 'I-M', 'I-Z', 'J-K', 'J-N', 'K-L', 'K-O', 'L-M', 'L-P', 'M-P', 'M-Q', 'M-Z', 'N-O', 'O-P', 'P-Q', 'Q-Z'],
    loesung: 'A, B, G, H, L, P, Q, Z (7 Verbindungen): 12 + 14 + 9 + 17 + 14 + 14 + 5 + 24 = 109',
    fallen: 'Verlockende Abkürzungen mit weniger als 7 Verbindungen sind infiziert, zum Beispiel 096, 102, 103, 117, 118, 121'
  },
  schwer: {
    server: {
      A: { kennzahl: 12, x: 70, y: 380 },
      B: { kennzahl: 19, x: 230, y: 80, infiziert: true },
      C: { kennzahl: 4, x: 400, y: 80, infiziert: true },
      D: { kennzahl: 20, x: 570, y: 80 },
      E: { kennzahl: 17, x: 740, y: 80 },
      F: { kennzahl: 20, x: 910, y: 80, infiziert: true },
      G: { kennzahl: 21, x: 230, y: 280 },
      H: { kennzahl: 7, x: 400, y: 280 },
      I: { kennzahl: 16, x: 570, y: 280 },
      J: { kennzahl: 16, x: 740, y: 280 },
      K: { kennzahl: 8, x: 910, y: 280 },
      L: { kennzahl: 11, x: 230, y: 480, infiziert: true },
      M: { kennzahl: 9, x: 400, y: 480 },
      N: { kennzahl: 10, x: 570, y: 480, infiziert: true },
      O: { kennzahl: 17, x: 740, y: 480, infiziert: true },
      P: { kennzahl: 4, x: 910, y: 480 },
      Q: { kennzahl: 4, x: 230, y: 680 },
      R: { kennzahl: 6, x: 400, y: 680 },
      S: { kennzahl: 7, x: 570, y: 680 },
      T: { kennzahl: 9, x: 740, y: 680, infiziert: true },
      U: { kennzahl: 21, x: 910, y: 680 },
      Z: { kennzahl: 24, x: 1060, y: 380 }
    },
    verbindungen: ['A-B', 'A-L', 'A-Q', 'B-C', 'B-G', 'C-D', 'D-E', 'D-H', 'D-I', 'E-F', 'E-I', 'E-J', 'F-J', 'F-Z', 'G-H', 'G-L', 'H-I', 'H-M', 'H-N', 'I-J', 'J-K', 'J-O', 'K-P', 'K-Z', 'M-N', 'M-S', 'N-O', 'N-S', 'O-P', 'O-S', 'P-T', 'P-U', 'P-Z', 'Q-R', 'R-S', 'S-T', 'T-U', 'U-Z'],
    loesung: 'A, Q, R, S, M, H, I, J, K, Z (9 Verbindungen): 12 + 4 + 6 + 7 + 9 + 7 + 16 + 16 + 8 + 24 = 109',
    fallen: 'Verlockende Abkürzungen mit weniger als 9 Verbindungen sind infiziert, zum Beispiel 066, 074, 082, 083, 084, 087'
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
  const fallen = Array.from(new Set(wege.filter(function (w) { return infiziert(w) && w.length - 1 < kurz; }).map(summe)))
    .filter(function (z) { return z !== code; }).sort(function (a, b) { return a - b; })
    .map(function (z) { return String(z).padStart(3, '0'); });
  return { weg: beste[0], eindeutig: beste.length === 1, verbindungen: kurz, code: String(code).padStart(3, '0'), fallen: fallen };
}
