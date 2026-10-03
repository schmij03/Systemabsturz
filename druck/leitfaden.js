/* =====================================================================
   Systemabsturz: Leitfaden für die Spielleitung (Druck und Download)
   ---------------------------------------------------------------------
   Gleiches Layout wie die Teamsets (druck/seiten.js). Inhalt:
   Vorbereitung, Ablauf, Bedienung und Notfälle, Punkte, Lösungen der
   gewählten Stufe, Help-Desk-Tipps und die Unterrichtsinfo.
   Die Lösungen stehen nicht im Klartext im Quellcode: Sie werden erst
   nach Eingabe der PIN entschlüsselt und eingefügt (wie auf der
   Spielleitung). Ohne PIN enthält der Leitfaden alles ausser den Lösungen.
   Benötigt: maze.js, netzwerke.js, app.js, unterrichtsinfo.js, seiten.js
   Lizenz: CC BY-SA 4.0, Christof Heiss, Jan Schmid, PH Luzern 2026
   ===================================================================== */
var Leitfaden = (function () {
  'use strict';

  var esc = Druck.esc;
  var FUSS = 'Leitfaden Spielleitung · Stufe ';

  /** **fett** und `code` aus den Texten der Unterrichtsinfo in HTML umsetzen */
  function format(t) {
    return esc(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
  }
  function tabelle(kopf, zeilen, klasse) {
    return '<table class="lf ' + (klasse || 'mission') + '"><tr>' + kopf.map(function (k) { return '<th>' + esc(k) + '</th>'; }).join('') + '</tr>' +
      zeilen.map(function (z) { return '<tr>' + z.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  function haken(liste) {
    return '<ul class="haken">' + liste.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>';
  }
  function seite(st, ober, titel, inhalt) {
    return Druck.seite({ ober: ober, titel: titel, inhalt: inhalt, fuss: FUSS + STUFEN[st].name }, st);
  }

  /* ---------------------- Seite 1: Vorbereitung ---------------------- */
  function vorbereitung(st) {
    var s = STUFEN[st];
    var netz = NETZWERKE[st];
    return seite(st, 'SPIELLEITUNG  |  NUR FÜR LEHRPERSONEN', 'Leitfaden für die Spielleitung',
      '<p>«Systemabsturz» ist ein Escape Game für den Zyklus 3 (Medien und Informatik). Vier Teams retten parallel das Schulnetz vor der Hackergruppe NULLBYTE. Jedes Team arbeitet mit einem Tablet oder Laptop und einem gedruckten Dossier. Die Spielleitung steuert alles über <strong>' + esc(Druck.adresse()) + '/spielleitung.html</strong> auf dem Beamer-Laptop.</p>' +
      '<div class="kasten"><h3>Diese Runde: Stufe ' + s.name + '</h3>' +
      '<p class="zeile">Protokoll 1: Verschiebung ' + p1Verschiebung(st) + ' (A wird zu ' + caesar('A', p1Verschiebung(st)) + ')  ·  Protokoll 2: höchstens ' + s.maxBloecke + ' Blöcke, ' + s.energie + ' Felder Energie  ·  Protokoll 3: ' + Object.keys(netz.server).length + ' Server</p>' +
      '<p class="zeile">Spielzeit ' + SPIELDAUER_MINUTEN + ' Minuten, dazu Einstieg (ca. 5 Minuten) und Auswertung (10 bis 15 Minuten).</p></div>' +
      '<h2>Vor der Lektion (ca. 15 Minuten)</h2>' + haken([
        'Auf der Spielleitung im Reiter «1 Vorbereiten» die <strong>Stufe</strong> wählen und bei Bedarf den <strong>Code für Kiste 1</strong> einstellen.',
        'Pro Team ein <strong>Dossier</strong> der gewählten Stufe drucken (7 Seiten, A4, «Tatsächliche Grösse», farbig). Chiffrierscheiben auf festes Papier.',
        'Chiffrierscheiben vorbereiten: ausschneiden und mit einer Musterklammer verbinden (oder als erste Teamaufgabe).',
        '<strong>Zahlenschlösser</strong> der Sicherheitskisten stellen: Kiste 1 auf den Code von Protokoll 1, Kiste 2 auf den Code von Protokoll 2 (siehe Lösungen).',
        'Pro Team ein <strong>Tablet oder Laptop</strong> laden, Startseite des Notfall-Terminals öffnen.',
        '<strong>Beamer-Laptop:</strong> Spielleitung öffnen, Ton einschalten, Vollbild testen.',
        '<strong>Internet prüfen:</strong> Das Startsignal läuft über ntfy.sh. Ist der Dienst gesperrt, die Geräte manuell starten (siehe Notfälle).'
      ]) +
      '<h2>Material pro Team</h2>' + tabelle(['Was', 'Wofür', 'Wo'], [
        ['Auftrag (Seite 1)', 'Lage, Anmeldung, Mission, Regeln, Notizen', 'Papier'],
        ['Protokoll 1 (Seiten 2 bis 4)', 'Nachricht von NULLBYTE entschlüsseln, Chiffrierscheibe', 'Papier'],
        ['Protokoll 2 (Seite 5)', 'Antiviren-Roboter ANTI-V mit Blöcken programmieren', 'Tablet oder Laptop'],
        ['Protokoll 3 (Seiten 6 und 7)', 'Kürzesten sauberen Weg im Netzwerkplan finden', 'Papier'],
        ['Sicherheitskisten', 'Kiste 1 und Kiste 2 mit Zahlenschloss, Override am Schluss', 'im Zimmer']
      ]));
  }

  /* ------------------- Seite 2: Ablauf und Bedienung ------------------ */
  function ablauf(st) {
    return seite(st, 'SPIELLEITUNG  |  ABLAUF', 'Ablauf der Lektion',
      tabelle(['Phase', 'Was passiert', 'Spielleitung'], [
        ['Einstieg<br>ca. 5 Min.', '«▶ Spiel starten»: Vollbild, Botschaft von NULLBYTE, danach die Spielanweisung mit dem <strong>Beitrittscode</strong>. Die Teams melden sich mit Teamname und Code an und warten.', 'Material verteilen, Teams zu 3 bis 4 Personen bilden.'],
        ['Spielphase<br>' + SPIELDAUER_MINUTEN + ' Min.', 'Am Ende der Anweisung startet der Countdown, alle Geräte erhalten gleichzeitig ihre Aufgaben. Protokoll 1, 2 und 3 der Reihe nach.', 'Beobachten, nicht vorschnell helfen. Hat ein Team den Override ausgelöst: «System gerettet».'],
        ['Auswertung<br>10 bis 15 Min.', 'Endpunktestände vergleichen, Lösungswege besprechen.', 'Reflexionsfragen siehe «Einsatz im Unterricht».']
      ], 'mission ablauf') +
      '<h2>Tastatur auf dem Beamer-Laptop</h2>' + tabelle(['Taste', 'Wirkung'], [
        ['→, Leertaste', 'Botschaft von NULLBYTE überspringen, weiter zur Spielanweisung'],
        ['→, Enter', 'In der Spielanweisung: Aufgaben sofort freigeben'],
        ['R', 'Spielanweisung nochmals vorlesen'],
        ['Esc', 'Botschaft abbrechen']
      ], 'mission kompakt') +
      '');
  }

  /* ------------------ Seite 3: Notfälle und Punkte ------------------ */
  function notfaelle(st) {
    return seite(st, 'SPIELLEITUNG  |  NOTFÄLLE', 'Wenn etwas nicht klappt',
      tabelle(['Problem', 'Lösung'], [
        ['Kein Internet, Startsignal kommt nicht an', 'Auf dem Gerät des Teams «Spielleitung: manuell starten» und PIN. Für eine gemeinsame Uhr den Link <code>index.html?ende=HH:MM</code> verwenden (Reiter «Lösungen und Extras»).'],
        ['Ein Gerät wartet noch, obwohl das Spiel läuft', 'Reiter «2 Spiel durchführen», «Probleme?», «Startsignal erneut senden».'],
        ['Ein Team hat die Seite neu geladen', 'Kein Problem: Spielstand, Punkte und Countdown bleiben erhalten.'],
        ['Gerät für die nächste Runde vorbereiten', 'Unten rechts «Spielleitung», PIN, «Spiel zurücksetzen».'],
        ['Kein Ton', 'Lautstärke prüfen und einmal auf den Bildschirm tippen oder klicken. Browser erlauben Ton erst nach einer Berührung.'],
        ['Neue Runde', 'Reiter «3 Nach dem Spiel», «Spiel zurücksetzen (PIN)». Es gibt einen neuen Beitrittscode.']
      ], 'mission notfall') +
      '<h2>Punkte und Help-Desk</h2><ul>' +
      '<li>Start mit ' + START_PUNKTE + ' Punkten, plus ' + PUNKTE_PRO_PROTOKOLL + ' pro gelöstem Protokoll, plus ' + BONUS_PUNKTE + ' für die Bonusfrage in Protokoll 1.</li>' +
      '<li>Effizienzbonus in Protokoll 2: ' + BLOCK_BONUS_BASIS + ' Punkte plus ' + BLOCK_BONUS_PRO_BLOCK + ' für jeden Block unter dem Limit. Zeitbonus: ' + PUNKTE_PRO_RESTMINUTE + ' Punkt pro übrige Minute.</li>' +
      '<li>Help-Desk: ' + JOKER_ANZAHL + ' Joker pro Team, jeder kostet ' + JOKER_KOSTEN + ' Punkte. Nach ' + GRATIS_TIPP_MINUTEN + ' Minuten ohne Fortschritt gibt es einen Tipp gratis.</li></ul>');
  }

  /* --------------------- Seite 3: Lösungen (PIN) --------------------- */
  function loesungen(st, l) {
    var ober = 'SPIELLEITUNG  |  LÖSUNGEN  |  NICHT AUF DEN BEAMER';
    if (!l) {
      return seite(st, ober, 'Lösungen Stufe ' + STUFEN[st].name,
        '<div class="kasten wissen"><span class="label">GESCHÜTZT</span>Die Lösungen werden erst nach Eingabe der PIN der Spielleitung eingefügt (oben in der Leiste «PIN» eingeben, «Lösungen einfügen»). Das verhindert versehentliches Einblenden. Die PIN ist kein Schutz vor dem Auslesen des Quellcodes.</div>');
    }
    var leitung = ladeJson(SPEICHER_LEITUNG) || {};
    var eigen = leitung.p1 && leitung.p1.code;
    var v = p1Verschiebung(st);
    var code1 = eigen ? leitung.p1.code : l.p1;
    var klartext = eigen ? p1Nachricht(leitung.p1.code, v).klartext : caesar(P1_GEHEIMTEXT, -P1_VERSCHIEBUNG);
    var geheim = eigen ? p1Nachricht(leitung.p1.code, v).geheimtext : p1StandardGeheimtext(v);
    var s = STUFEN[st];
    var netz = NETZWERKE[st];
    return seite(st, ober, 'Lösungen Stufe ' + s.name,
      '<p>PIN der Spielleitung: <strong>' + esc(SPIELLEITUNG_PIN) + '</strong> (Spielleitung, Lösungen, manueller Start und Zurücksetzen der Geräte).</p>' +
      '<h2>Protokoll 1: Kryptografie</h2>' + tabelle(['', ''], [
        ['Code Kiste 1', '<strong class="gross">' + esc(code1) + '</strong>' + (eigen ? ' (eigener Code dieser Runde)' : '')],
        ['Schlüssel', 'Verschiebung ' + v + ': innen ' + caesar('A', v) + ' unter dem äusseren A. Unterschrift ' + caesar('NULLBYTE', v) + ' = NULLBYTE.'],
        ['Geheimtext', '<span class="mono-klein">' + esc(geheim) + '</span>'],
        ['Klartext', esc(klartext)],
        ['Bonusfrage', esc(l.bonus || '')]
      ], 'mission loesung') +
      '<h2>Protokoll 2: Algorithmen</h2>' + tabelle(['', ''], [
        ['Signaturen', esc(l.signaturen || '')],
        ['Code Kiste 2', '<strong class="gross">' + esc(l.kiste2 || '') + '</strong>'],
        ['Regeln', 'Höchstens ' + s.maxBloecke + ' Blöcke, ' + s.energie + ' Felder Energie, Schleife ist Pflicht.'],
        ['Musterlösung', esc(s.musterloesung)]
      ], 'mission loesung') +
      '<h2>Protokoll 3: Netzwerke</h2>' + tabelle(['', ''], [
        ['Override-Code', '<strong class="gross">' + esc(l.p3 || '') + '</strong>'],
        ['Richtiger Weg', esc(netz.loesung)],
        ['Fallen', esc(netz.fallen) + '. Das Terminal warnt dann «Euer Weg führt über einen infizierten Server!».']
      ], 'mission loesung'));
  }

  /* ----------------------- Seite 4: Help-Desk ------------------------ */
  function tipps(st) {
    var v = p1Verschiebung(st);
    var teile = [1, 2, 3].map(function (p) {
      var t = TEXTE.protokolle[p];
      var liste = (t.tippsStufen && t.tippsStufen[st]) || t.tipps;
      return '<h2>' + esc(t.titel) + '</h2><ol>' + liste.map(function (x) { return '<li>' + esc(fuelleTipp(x, v)) + '</li>'; }).join('') + '</ol>';
    }).join('');
    return seite(st, 'SPIELLEITUNG  |  HELP-DESK', 'Tipps im Help-Desk',
      '<p>So sehen die Teams die gestuften Tipps im Terminal. Ein Joker schaltet die nächste Stufe frei. Nach ' + GRATIS_TIPP_MINUTEN + ' Minuten ohne Fortschritt ist die erste Stufe gratis. Wenn ihr mündlich helft, orientiert euch an derselben Reihenfolge.</p>' + teile);
  }

  /* -------------- Seiten 5 und 6: Einsatz im Unterricht -------------- */
  function infoAbschnitt(a, von, bis, zusatz) {
    return '<h2>' + esc(a.titel) + (zusatz || '') + '</h2>' + a.inhalt.slice(von || 0, bis).map(function (b) {
      if (b.p) return '<p>' + format(b.p) + '</p>';
      if (b.h) return '<h3 class="zwischentitel">' + format(b.h) + '</h3>';
      if (b.liste) return '<ul>' + b.liste.map(function (x) { return '<li>' + format(x) + '</li>'; }).join('') + '</ul>';
      if (b.tabelle) return tabelle(b.tabelle.kopf, b.tabelle.zeilen.map(function (z) { return z.map(format); }), 'mission lehrplan');
      return '';
    }).join('');
  }
  function unterricht(st) {
    var a = UNTERRICHTSINFO.abschnitte;
    var ober = 'SPIELLEITUNG  |  EINSATZ IM UNTERRICHT';
    // Lehrplanbezüge: Einleitung und Kompetenzen, danach die Tabelle auf eigener Seite
    var tab = a[1].inhalt.findIndex(function (b) { return b.tabelle; });
    var schnitt = tab > 0 && a[1].inhalt[tab - 1].h ? tab - 1 : tab;
    return seite(st, ober, UNTERRICHTSINFO.titel, '<p>' + esc(UNTERRICHTSINFO.untertitel) + '</p>' + infoAbschnitt(a[0]) + infoAbschnitt(a[1], 0, schnitt)) +
      seite(st, ober, UNTERRICHTSINFO.titel, infoAbschnitt(a[1], schnitt, undefined, ' (Fortsetzung)')) +
      seite(st, ober, UNTERRICHTSINFO.titel, infoAbschnitt(a[2])) +
      seite(st, ober, UNTERRICHTSINFO.titel, infoAbschnitt(a[3]) + infoAbschnitt(a[4]));
  }

  function html(st, l) {
    return vorbereitung(st) + ablauf(st) + notfaelle(st) + loesungen(st, l) + tipps(st) + unterricht(st);
  }

  function start() {
    var wahl = document.getElementById('stufe');
    var pinFeld = document.getElementById('pin');
    var status = document.getElementById('pin-status');
    var leitung = ladeJson(SPEICHER_LEITUNG) || {};
    var loesungsDaten = null;
    wahl.value = stufeAusUrl() || leitung.stufe || STANDARD_STUFE;

    function zeige() {
      document.getElementById('seiten').innerHTML = html(wahl.value, loesungsDaten);
      document.title = 'Systemabsturz: Leitfaden Spielleitung ' + STUFEN[wahl.value].name;
    }
    function entsperre() {
      var pin = pinFeld.value.trim();
      if (pin !== SPIELLEITUNG_PIN) { status.textContent = 'Falsche PIN.'; pinFeld.select(); return; }
      Krypto.entschluessle(LOESUNGEN_VERSCHLUESSELT, pin).then(function (text) {
        try { loesungsDaten = JSON.parse(text); } catch (e) { loesungsDaten = null; }
        status.textContent = loesungsDaten ? 'Lösungen eingefügt.' : 'Lösungen konnten nicht entschlüsselt werden.';
        pinFeld.value = '';
        zeige();
      });
    }
    wahl.addEventListener('change', zeige);
    document.getElementById('pin-knopf').addEventListener('click', entsperre);
    pinFeld.addEventListener('keydown', function (e) { if (e.key === 'Enter') entsperre(); });
    document.getElementById('als-html').addEventListener('click', function () {
      var name = STUFEN[wahl.value].name;
      Druck.herunterladen('Systemabsturz_Leitfaden_Spielleitung_' + name + (loesungsDaten ? '_mit_Loesungen' : '') + '.html',
        'Systemabsturz: Leitfaden Spielleitung ' + name);
    });
    zeige();
  }

  return { start: start, html: html };
})();

