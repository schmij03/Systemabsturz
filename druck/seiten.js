/* =====================================================================
   Systemabsturz: Seiten des Teamsets (Druck und HTML-Download)
   ---------------------------------------------------------------------
   Erzeugt alle Blätter im Layout der Teamsets: Auftrag, Protokoll 1
   (Auftrag und zwei Bastelvorlagen), Protokoll 2, Protokoll 3 (Auftrag
   und Netzwerkplan quer). Die Inhalte kommen aus js/maze.js,
   js/netzwerke.js und js/app.js und passen so immer zum Spiel.
   Benötigt: maze.js, netzwerke.js, app.js (in dieser Reihenfolge).
   Lizenz: CC BY-SA 4.0, Christof Heiss, Jan Schmid, PH Luzern 2026
   ===================================================================== */
var Druck = (function () {
  'use strict';

  /** Adresse des Notfall-Terminals zum Abtippen (ohne https://) */
  var ADRESSE_STANDARD = 'schmij03.github.io/HackingSchule';
  function adresse() {
    var l = window.location;
    if (!/^https?:$/.test(l.protocol) || /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(l.hostname)) return ADRESSE_STANDARD;
    return (l.host + l.pathname.replace(/druck\/[^/]*$/, '')).replace(/\/$/, '');
  }

  function esc(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function linien(n) { return new Array(n + 1).join('<div class="linie"></div>'); }
  function kaestchen(text, n) {
    return '<div class="kaestchen"><span class="text">' + text + '</span>' + new Array(n + 1).join('<span class="feld"></span>') + '</div>';
  }

  /** Gemeinsamer Rahmen jeder Seite: rote Linie, Oberzeile, Titel, Abzeichen, Fusszeile */
  function seite(o, st) {
    var name = STUFEN[st].name;
    return '<section class="seite' + (o.quer ? ' quer' : '') + '">' +
      '<div class="oberzeile">' + esc(o.ober) + '</div>' +
      '<div class="titelzeile"><h1>' + esc(o.titel) + '</h1><span class="stufe ' + st + '">STUFE ' + name.toUpperCase() + '</span></div>' +
      o.inhalt +
      '<div class="fuss"><span>«Systemabsturz» Heiss, Schmid | PH Luzern 2026 | CC BY-SA 4.0</span><span>' + (o.fuss || 'Teamset Stufe ' + name + ' · ' + o.teil) + '</span></div>' +
      '</section>';
  }

  /* ------------------------------ Auftrag ------------------------------ */
  function auftrag(st) {
    return seite({
      ober: 'NOTFALL-TEAM  |  STRENG GEHEIM', titel: 'Systemabsturz: euer Auftrag', teil: 'Auftrag',
      inhalt:
        '<p><strong>Lage:</strong> Soeben hat die Hackergruppe NULLBYTE das Schulnetz gesperrt. Sie will beweisen, dass an unserer Schule niemand auf Datensicherheit achtet. In ' + SPIELDAUER_MINUTEN + ' Minuten löscht NULLBYTE alle Daten: Noten, Stundenpläne, Fotos. Ihr seid ein Notfall-Team und müsst das System retten.</p>' +
        '<div class="kasten"><p class="zeile"><strong>Teamname:</strong> ________________________________________</p>' +
        '<p class="zeile"><strong>Beitrittscode</strong> (steht auf der Leinwand): __________</p></div>' +
        '<h2>So startet ihr</h2><ol>' +
        '<li>Öffnet auf eurem Tablet oder Laptop das <strong>Notfall-Terminal</strong>: ' + esc(adresse()) + '</li>' +
        '<li>Gebt euren <strong>Teamnamen</strong> und den <strong>Beitrittscode</strong> ein und tippt oder klickt auf «Spiel starten».</li>' +
        '<li>Tippt oder klickt auf «Wir sind bereit». Sobald die Spielleitung startet, erscheinen eure Aufgaben und der Countdown läuft.</li></ol>' +
        '<h2>Eure Mission: drei Sicherheitsprotokolle</h2>' +
        '<table class="mission"><tr><th>Protokoll</th><th>Was ihr tut</th><th>Wo</th></tr>' +
        '<tr><td>1  Kryptografie</td><td>Entschlüsselt die Nachricht aus dem Terminal mit der Chiffrierscheibe und gebt den Code ein.</td><td>Papier</td></tr>' +
        '<tr><td>2  Algorithmen</td><td>Programmiert den Antiviren-Roboter ANTI-V mit Blöcken, bis er die drei Viren-Signaturen einsammelt.</td><td>Tablet oder Laptop</td></tr>' +
        '<tr><td>3  Netzwerke</td><td>Findet auf dem Netzwerkplan den kürzesten Weg ohne infizierte Server. Die Summe ist der Override-Code.</td><td>Papier</td></tr></table>' +
        '<h2>Regeln</h2><ul>' +
        '<li>Löst die Protokolle der Reihe nach. Jedes gelöste Protokoll schaltet das nächste frei.</li>' +
        '<li><strong>Help-Desk:</strong> Im Terminal gibt es Tipps. Jedes Team hat ' + JOKER_ANZAHL + ' Joker, jeder Joker kostet ' + JOKER_KOSTEN + ' Punkte. Kommt ihr 5 Minuten nicht weiter, gibt es einen Tipp gratis.</li>' +
        '<li><strong>Punkte:</strong> Start mit ' + START_PUNKTE + ' Punkten, plus ' + PUNKTE_PRO_PROTOKOLL + ' pro Protokoll, Bonus für wenige Blöcke in Protokoll 2 und für jede übrige Minute beim Override.</li>' +
        '<li>Bei 00:00 ist alles verloren. Teilt die Arbeit auf und sprecht euch ab!</li></ul>' +
        '<h2>Notizen</h2>' + linien(4)
    }, st);
  }

  /* ----------------------------- Protokoll 1 ---------------------------- */
  /* Chiffrierscheiben in echter Grösse: gross 172 mm, klein 142 mm */
  function scheibeSvg(o) {
    var c = o.schnitt + 1;
    var t = ['<svg xmlns="http://www.w3.org/2000/svg" width="' + 2 * c + 'mm" height="' + 2 * c + 'mm" viewBox="0 0 ' + 2 * c + ' ' + 2 * c + '">'];
    t.push('<circle cx="' + c + '" cy="' + c + '" r="' + o.schnitt + '" fill="none" stroke="#5f6670" stroke-width="0.3" stroke-dasharray="2 1.2"/>');
    t.push('<circle cx="' + c + '" cy="' + c + '" r="' + o.aussen + '" fill="' + o.flaeche + '" stroke="#111418" stroke-width="0.6"/>');
    t.push('<circle cx="' + c + '" cy="' + c + '" r="' + o.innen + '" fill="none" stroke="#111418" stroke-width="0.25"/>');
    for (var i = 0; i < 26; i++) {
      var w = (i + 0.5) * 2 * Math.PI / 26;
      t.push('<line x1="' + (c + o.innen * Math.sin(w)).toFixed(2) + '" y1="' + (c - o.innen * Math.cos(w)).toFixed(2) +
        '" x2="' + (c + o.aussen * Math.sin(w)).toFixed(2) + '" y2="' + (c - o.aussen * Math.cos(w)).toFixed(2) + '" stroke="#111418" stroke-width="0.25"/>');
      var a = i * 360 / 26;
      var wb = i * 2 * Math.PI / 26;
      var x = c + o.text * Math.sin(wb);
      var y = c - o.text * Math.cos(wb);
      t.push('<text x="' + x.toFixed(2) + '" y="' + y.toFixed(2) + '" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="' + o.schrift +
        '" fill="' + o.farbe + '" text-anchor="middle" dominant-baseline="central" transform="rotate(' + a.toFixed(2) + ' ' + x.toFixed(2) + ' ' + y.toFixed(2) + ')">' +
        String.fromCharCode(65 + i) + '</text>');
    }
    t.push('<circle cx="' + c + '" cy="' + c + '" r="1" fill="#111418"/>');
    t.push('<text x="' + c + '" y="' + (c + 10) + '" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="4.6" fill="#5f6670" text-anchor="middle">' + o.beschriftung + '</text>');
    t.push('</svg>');
    return t.join('');
  }

  /** opt.geheimtext: Text eindrucken statt leerer Linien */
  function protokoll1(st, opt) {
    var geheim = opt && opt.geheimtext ? '<div class="geheimtext">' + esc(opt.geheimtext) + '</div>' : linien(3);
    var s1 = seite({
      ober: 'SICHERHEITSPROTOKOLL 1  ·  KRYPTOGRAFIE', titel: 'Die Nachricht von NULLBYTE', teil: 'Protokoll 1',
      inhalt:
        '<p>Soeben erschien auf allen Bildschirmen der Schule eine verschlüsselte Nachricht. Ihr findet sie im <strong>Notfall-Terminal</strong> unter Protokoll 1. Entschlüsselt sie mit eurer Chiffrierscheibe und gebt den Code, der darin versteckt ist, im Terminal ein.</p>' +
        '<div class="kasten wissen"><span class="label">WAS WIR ÜBER DIE HACKER WISSEN</span>Die Gruppe NULLBYTE unterschreibt jede Nachricht am Schluss mit ihrem Namen. Vergleicht die Unterschrift mit dem Namen, dann wisst ihr, wie die Buchstaben verschoben wurden.</div>' +
        '<p class="feldname">' + (opt && opt.geheimtext ? 'Geheimtext (steht auch im Terminal):' : 'Geheimtext (aus dem Terminal abschreiben):') + '</p>' + geheim +
        '<p class="feldname" style="margin-top: 7mm"><strong>Verschiebung:</strong> <span style="font-weight: 400">Aus dem Buchstaben ____ wird ____, also um ____ Stellen.</span></p>' +
        '<p class="feldname">Entschlüsselte Nachricht (Klartext):</p>' + linien(4) +
        kaestchen('Code für das Terminal:', 3) +
        '<div class="kasten"><p><strong>Bonusfrage im Terminal</strong> (ein Versuch, plus 10 Punkte)<br><span style="font-size: 9.5pt">Wie viele Einstellungen der Chiffrierscheibe verschlüsseln eine Nachricht wirklich? Überlegt hier, bevor ihr antwortet:</span></p>' + linien(2) + '</div>'
    }, st);
    var s2 = seite({
      ober: 'SICHERHEITSPROTOKOLL 1  ·  BASTELVORLAGE 1 VON 2', titel: 'Chiffrierscheibe: grosse Scheibe', teil: 'Protokoll 1',
      inhalt:
        '<p>Entlang des äusseren Kreises ausschneiden. Die schwarzen Buchstaben sind der <strong>Klartext</strong>. Am besten auf festes Papier und in tatsächlicher Grösse (100 %) drucken.</p>' +
        '<div class="scheibe">' + scheibeSvg({ schnitt: 85.5, aussen: 84.5, innen: 69, text: 76.8, schrift: 8.5, farbe: '#111418', flaeche: '#fff', beschriftung: 'KLARTEXT (aussen)' }) + '</div>' +
        '<div class="schere">✂ hier ausschneiden</div>'
    }, st);
    var s3 = seite({
      ober: 'SICHERHEITSPROTOKOLL 1  ·  BASTELVORLAGE 2 VON 2', titel: 'Chiffrierscheibe: kleine Scheibe', teil: 'Protokoll 1',
      inhalt:
        '<p>Entlang des äusseren Kreises ausschneiden. Die roten Buchstaben sind der <strong>Geheimtext</strong>.</p>' +
        '<div class="scheibe">' + scheibeSvg({ schnitt: 70.5, aussen: 69.5, innen: 56, text: 62.8, schrift: 7.5, farbe: '#c62828', flaeche: '#f9eaea', beschriftung: 'GEHEIMTEXT (innen)' }) + '</div>' +
        '<div class="kasten" style="margin-top: 6mm"><h3>So baut ihr die Scheibe zusammen</h3><ol>' +
        '<li>Schneidet beide Scheiben aus (grosse Scheibe auf der vorherigen Seite).</li>' +
        '<li>Legt die kleine rote Scheibe auf die grosse, Mittelpunkt auf Mittelpunkt.</li>' +
        '<li>Stecht mit einem Bleistift durch beide Mittelpunkte und steckt eine Musterklammer durch.</li>' +
        '<li>Dreht die kleine Scheibe: Aussen steht der Klartext, innen der Geheimtext.</li></ol></div>'
    }, st);
    return s1 + s2 + s3;
  }

  /* ----------------------------- Protokoll 2 ---------------------------- */
  var KATEGORIEN = [
    { name: 'Steuerung', farbe: '#FFAB19', bloecke: { antiv_wiederhole: 'wiederhole bis Ziel erreicht', antiv_falls: 'falls ‹ › dann', antiv_falls_sonst: 'falls ‹ › dann sonst' } },
    { name: 'Bewegung', farbe: '#4C97FF', bloecke: { antiv_vor: 'gehe 1 Feld vor', antiv_rechts: 'drehe dich nach rechts', antiv_links: 'drehe dich nach links' } },
    { name: 'Fühlen', farbe: '#5CB1D6', bloecke: { antiv_rechts_frei: 'rechts frei?', antiv_vorne_frei: 'vorne frei?', antiv_links_frei: 'links frei?', antiv_rechts_infiziert: 'rechts infiziert?', antiv_vorne_infiziert: 'vorne infiziert?' } },
    { name: 'Operatoren', farbe: '#59C059', bloecke: { antiv_und: '‹ › und ‹ ›', antiv_oder: '‹ › oder ‹ ›', antiv_nicht: 'nicht ‹ ›' } }
  ];

  function protokoll2(st) {
    var s = STUFEN[st];
    var erlaubt = function (typ) { return !s.toolbox || s.toolbox.indexOf(typ) >= 0; };
    var hatInfiziert = s.labyrinth.some(function (z) { return z.indexOf('X') >= 0; });
    var mitInfiziert = false;
    var zeilen = KATEGORIEN.map(function (k) {
      var liste = Object.keys(k.bloecke).filter(erlaubt);
      if (!liste.length) return '';
      if (liste.indexOf('antiv_rechts_infiziert') >= 0) mitInfiziert = true;
      return '<tr><td class="kategorie" style="background: ' + k.farbe + '">' + k.name + '</td><td>' +
        liste.map(function (t) { return '«' + esc(k.bloecke[t]) + '»'; }).join(', ') + '</td></tr>';
    }).join('');
    return seite({
      ober: 'SICHERHEITSPROTOKOLL 2  ·  ALGORITHMEN', titel: 'Virenscanner programmieren', teil: 'Protokoll 2',
      inhalt:
        '<p>NULLBYTE hat einen Virus ins Netzwerk geschleust. Programmiert im Notfall-Terminal den Antiviren-Roboter <strong>ANTI-V</strong> so, dass er das Ziel erreicht und unterwegs die drei Viren-Signaturen einsammelt.' +
        (hatInfiziert ? ' Rote Felder sind infiziert: Betritt ANTI-V eines, ist er verloren.' : '') + '</p>' +
        '<h2>So geht ihr vor</h2><ol>' +
        '<li>Zieht die Blöcke aus der Werkzeugleiste unter «wenn Programm startet».</li>' +
        '<li>Startet das Programm oder lasst es <strong>Schritt für Schritt</strong> laufen und beobachtet, welcher Block gerade arbeitet.</li>' +
        '<li>Sammelt ANTI-V auf dem Weg ins Ziel die richtigen Signaturen ein, ist Protokoll 2 geknackt.</li></ol>' +
        '<h2>Eure Blöcke</h2><table class="bloecke">' + zeilen + '</table>' +
        '<div class="kasten" style="margin-top: 5mm"><strong>frei</strong> heisst: Auf dem Nachbarfeld steht keine Mauer.' +
        (mitInfiziert ? ' <strong>infiziert</strong> heisst: Das Feld ist rot.' : '') +
        '<br><strong>Rechts und links</strong> gelten aus der Sicht von ANTI-V. Stellt euch hinter den Roboter!</div>' +
        '<h2>Regeln des Terminals</h2><ul>' +
        '<li><strong>Schleife ist Pflicht:</strong> Ohne «wiederhole bis Ziel erreicht» startet das Programm nicht.</li>' +
        '<li><strong>Blocklimit:</strong> Höchstens <strong>' + s.maxBloecke + ' Blöcke</strong>. Ist das Limit erreicht, werden die Blöcke grau.</li>' +
        '<li><strong>Energie:</strong> ANTI-V kann höchstens <strong>' + s.energie + ' Felder</strong> gehen. Umwege enden mit «Energie leer!».</li>' +
        '<li><strong>Effizienzbonus:</strong> ' + BLOCK_BONUS_BASIS + ' Punkte plus ' + BLOCK_BONUS_PRO_BLOCK + ' Punkte für jeden Block unter dem Limit. Nach dem Lösen dürft ihr weiter optimieren.</li></ul>' +
        '<h2>Plant euer Programm</h2><div class="plan"' + (st === 'leicht' ? ' style="height: 52mm"' : '') + '><span class="hut">wenn Programm startet</span></div>' +
        kaestchen('Eingesammelte Signaturen:', 3)
    }, st);
  }

  /* ----------------------------- Protokoll 3 ---------------------------- */
  function protokoll3(st) {
    var s1 = seite({
      ober: 'SICHERHEITSPROTOKOLL 3  ·  NETZWERKE', titel: 'Routing reparieren', teil: 'Protokoll 3',
      inhalt:
        '<p><strong>Virus gefunden!</strong> Doch NULLBYTE hat Server im Schulnetz infiziert. Die Daten müssen von <strong>Server A</strong> zu <strong>Server Z</strong> fliessen, damit ihr den Override auslösen könnt.</p>' +
        '<div class="kasten"><h3>Euer Auftrag</h3><ol>' +
        '<li>Sucht auf dem Netzwerkplan den Weg von Server A zu Server Z mit <strong>möglichst wenigen Verbindungen</strong>.</li>' +
        '<li>Der Weg darf <strong>keinen infizierten (roten) Server</strong> berühren.</li>' +
        '<li>Zählt die Kennzahlen aller Server auf eurem Weg zusammen, <strong>Server A und Server Z eingeschlossen</strong>.</li>' +
        '<li>Die Summe ist der Override-Code. Gebt ihn dreistellig im Terminal ein (zum Beispiel 065) und drückt den roten Buzzer!</li></ol></div>' +
        '<p class="feldname">Verbindungen, die ihr durchgestrichen habt:</p>' + linien(2) +
        '<p class="feldname" style="margin-top: 8mm">Unser Weg: <span style="font-weight: 400">______________________________________________________</span></p>' +
        '<p class="feldname">Anzahl Verbindungen: <span style="font-weight: 400">________</span></p>' +
        '<p class="feldname">Rechnung: <span style="font-weight: 400">_______________________________________________________</span></p>' +
        kaestchen('Override-Code:', 3)
    }, st);
    var s2 = seite({
      quer: true, ober: 'SICHERHEITSPROTOKOLL 3  ·  NETZWERKPLAN', titel: 'Serverarchitektur der Schule', teil: 'Protokoll 3',
      inhalt:
        '<div class="netzplan">' + netzwerkSvg(st) + '</div>' +
        '<div class="legende">' +
        '<span><span class="muster" style="background: #1565c0; color: #fff">A</span>Start und Ziel</span>' +
        '<span><span class="muster" style="border: 0.75pt solid #111418">B</span>sauberer Server (weiss)</span>' +
        '<span><span class="muster" style="background: #c62828; color: #fff">H</span>infiziert</span>' +
        '<span class="grau">Zahl = Kennzahl  ·  Linie = Verbindung</span></div>'
    }, st);
    return s1 + s2;
  }

  var TEILE = { auftrag: auftrag, protokoll1: protokoll1, protokoll2: protokoll2, protokoll3: protokoll3 };

  /** Geheimtext dieser Runde (eigener Code der Spielleitung oder Standard) */
  function geheimtextFuer(st) {
    var leitung = ladeJson(SPEICHER_LEITUNG) || {};
    var v = p1Verschiebung(st);
    return leitung.p1 && leitung.p1.code ? p1Nachricht(leitung.p1.code, v).geheimtext : p1StandardGeheimtext(v);
  }

  /** Erzeugt die gewünschten Teile als HTML-Text */
  function html(teile, st, opt) {
    return teile.map(function (t) { return TEILE[t](st, opt); }).join('');
  }

  /** Eigenständige HTML-Datei: Stil (Inhalt von druck.css) eingebettet, ohne Skripte */
  function eigenstaendig(titel, css) {
    return '<!DOCTYPE html>\n<html lang="de-CH">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      '<title>' + esc(titel) + '</title>\n<style>\n' + css + '</style>\n</head>\n<body>\n' +
      '<div class="druckleiste"><button type="button" class="primaer" onclick="window.print()">Drucken</button><span class="hinweis">A4, «Tatsächliche Grösse» (100 %), farbig. Der Netzwerkplan druckt automatisch im Querformat.</span></div>\n' +
      document.getElementById('seiten').innerHTML + '\n</body>\n</html>\n';
  }

  /** Liest druck.css als Text (für den Download) */
  function ladeCss() {
    return fetch('druck.css').then(function (r) { return r.text(); }).catch(function () {
      var css = '';
      Array.prototype.forEach.call(document.styleSheets, function (sheet) {
        try { Array.prototype.forEach.call(sheet.cssRules, function (r) { css += r.cssText + '\n'; }); } catch (e) { /* nicht lesbar */ }
      });
      return css;
    });
  }

  function herunterladen(dateiname, titel) {
    ladeCss().then(function (css) {
      var blob = new Blob([eigenstaendig(titel, css)], { type: 'text/html;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = dateiname;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    });
  }

  /**
   * Startet eine Druckseite.
   * cfg.teile: z. B. ['protokoll1'] oder alle vier für das Teamset
   * cfg.geheimtextWahl: Kästchen «Geheimtext eindrucken» anbieten
   */
  function start(cfg) {
    var wahl = document.getElementById('stufe');
    var mit = document.getElementById('mit-geheimtext');
    var leitung = ladeJson(SPEICHER_LEITUNG) || {};
    wahl.value = stufeAusUrl() || leitung.stufe || STANDARD_STUFE;
    function zeige() {
      var st = wahl.value;
      var opt = { geheimtext: mit && mit.checked ? geheimtextFuer(st) : null };
      document.getElementById('seiten').innerHTML = html(cfg.teile, st, opt);
      document.title = 'Systemabsturz: ' + cfg.titel + ' ' + STUFEN[st].name;
    }
    wahl.addEventListener('change', zeige);
    if (mit) mit.addEventListener('change', zeige);
    var lade = document.getElementById('als-html');
    if (lade) lade.addEventListener('click', function () {
      var name = STUFEN[wahl.value].name;
      herunterladen('Systemabsturz_' + cfg.datei + '_' + name + '.html', 'Systemabsturz: ' + cfg.titel + ' ' + name);
    });
    zeige();
  }

  return { start: start, html: html, eigenstaendig: eigenstaendig, adresse: adresse, seite: seite, esc: esc, linien: linien, herunterladen: herunterladen };
})();
