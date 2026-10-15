/* =====================================================================
   Systemabsturz: Leitfaden für die Spielleitung (Druck und Download)
   ---------------------------------------------------------------------
   Gleiches Layout wie die Teamsets (druck/seiten.js). Inhalt:
   Vorbereitung, Voraussetzungen der Klasse, Testlauf, Drucken und
   Material, Ablauf, Bedienung und Notfälle, Punkte, Lösungen der
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
      '<p class="zeile">Protokoll 1: Verschiebung ' + p1Verschiebung(st) + ' (A wird zu ' + caesar('A', p1Verschiebung(st)) + ')  ·  Protokoll 2: ' + (s.kurz ? s.kurz + ', ' : '') + 'höchstens ' + s.maxBloecke + ' Blöcke, ' + s.energie + ' Felder Energie  ·  Protokoll 3: ' + Object.keys(netz.server).length + ' Server</p>' +
      '<p class="zeile">Spielzeit ' + SPIELDAUER_MINUTEN + ' Minuten, dazu Einstieg (ca. 5 Minuten) und Auswertung (10 bis 15 Minuten).</p></div>' +
      '<h2>Vor der Lektion (ca. 15 Minuten)</h2>' + haken([
        '<strong>Erster Einsatz?</strong> Zuerst Seite 2 (Voraussetzungen der Klasse) und Seite 3 (selbst ausprobieren, Druckliste) lesen.',
        'Auf der Spielleitung im Reiter «1 Vorbereiten» die <strong>Stufe</strong> wählen und bei Bedarf einen eigenen <strong>Code für Protokoll 1</strong> einstellen.',
        'Pro Team ein <strong>Dossier</strong> der gewählten Stufe drucken (7 Seiten, A4, «Tatsächliche Grösse», farbig). Chiffrierscheiben auf festes Papier.',
        'Chiffrierscheiben vorbereiten: ausschneiden und mit einer Musterklammer verbinden (oder als erste Teamaufgabe).',
        'Pro Team ein <strong>Tablet oder Laptop</strong> laden, Startseite des Notfall-Terminals öffnen.',
        '<strong>Beamer-Laptop:</strong> Spielleitung öffnen, Ton einschalten, Vollbild testen.',
        '<strong>Internet prüfen:</strong> Das Startsignal läuft über ntfy.sh. Ist der Dienst gesperrt, die Geräte manuell starten (siehe Notfälle).'
      ]) +
      '<h2>Material pro Team</h2>' + tabelle(['Was', 'Wofür', 'Wo'], [
        ['Auftrag (Seite 1)', 'Lage, Anmeldung, Mission, Regeln, Notizen', 'Papier'],
        ['Protokoll 1 (Seiten 2 bis 4)', 'Nachricht von NULLBYTE entschlüsseln, Chiffrierscheibe', 'Papier'],
        ['Protokoll 2 (Seite 5)', 'Antiviren-Roboter ANTI-V mit Blöcken programmieren', 'Tablet oder Laptop'],
        ['Protokoll 3 (Seiten 6 und 7)', 'Sauberen Weg mit den wenigsten Verbindungen im Netzwerkplan finden, Override auslösen', 'Papier']
      ]));
  }

  /* ------------- Seite 2: Voraussetzungen der Schülerinnen und Schüler ------------- */
  function voraussetzungen(st) {
    return seite(st, 'SPIELLEITUNG  |  VORAUSSETZUNGEN', 'Was die Klasse mitbringen sollte',
      '<p>«Systemabsturz» ist für den Zyklus 3 gedacht (7. bis 9. Klasse). Auf der Stufe leicht ist es ohne Vorwissen spielbar. Auf den Stufen mittel und schwer helfen Grundlagen aus dem Unterricht in Medien und Informatik.</p>' +
      tabelle(['Bereich', 'Das sollten die Schülerinnen und Schüler können', 'Hilfreich, aber nicht nötig'], [
        ['Allgemein', 'Anleitungen genau lesen, sich im Team absprechen und Aufgaben verteilen. Tablet oder Laptop bedienen (tippen, ziehen, scrollen).', 'Erfahrung mit Rätseln oder Escape Games unter Zeitdruck'],
        ['Protokoll 1<br>Kryptografie', 'Das Alphabet sicher kennen, Buchstaben sorgfältig abschreiben und mit der Scheibe zuordnen. Zahlwörter in Ziffern umsetzen (SIEBEN ZWEI NEUN wird 729).', 'Die Begriffe Klartext, Geheimtext und Verschlüsselung'],
        ['Protokoll 2<br>Algorithmen', 'Blöcke ziehen und aneinanderhängen wie in Scratch. Verstehen, dass Befehle der Reihe nach ausgeführt werden. Rechts und links aus der Sicht einer Figur bestimmen.', 'Schleife «wiederhole» und «falls dann sonst», auf Stufe schwer auch «und» und «nicht»'],
        ['Protokoll 3<br>Netzwerke', 'Einen Plan mit Punkten und Verbindungen lesen. Mehrere Zahlen zusammenzählen (bis etwa 200).', 'Die Begriffe Server und Verbindung, systematisch alle Wege vergleichen']
      ], 'mission vorwissen') +
      '<h2>Welche Stufe passt?</h2>' + tabelle(['Stufe', 'Passt, wenn die Klasse …'], [
        ['Leicht', 'noch kaum mit Scratch gearbeitet hat. Gut als Einstieg in eine Einheit oder als teambildende Aktivität.'],
        ['Mittel (Standard)', 'Schleifen und «falls dann sonst» aus Scratch oder einer ähnlichen Umgebung kennt.'],
        ['Schwer', 'verschachtelte Bedingungen und die Operatoren «und», «oder», «nicht» kennt. Gut als Abschluss einer Einheit.']
      ], 'mission kompakt') +
      '<h2>Wenn Vorwissen fehlt</h2><ul>' +
      '<li>Stufe leicht wählen. Die Tipps im Help-Desk führen schrittweise zur Lösung.</li>' +
      '<li>In einer Lektion vorher 10 bis 15 Minuten Scratch: Eine Figur mit «wiederhole» und «falls dann sonst» durch einen Gang steuern.</li>' +
      '<li>Rechts und links aus der Sicht einer Figur kurz üben, zum Beispiel mit einer Person, die durchs Zimmer geführt wird.</li>' +
      '<li>Die Cäsar-Verschlüsselung <strong>nicht</strong> vorher erklären: Die Verschiebung selbst zu entdecken, ist Teil des Rätsels.</li></ul>');
  }

  /* --------- Seite 3: Zuerst selbst ausprobieren, Drucken und Material --------- */
  function ausprobieren(st) {
    var adr = esc(Druck.adresse());
    return seite(st, 'SPIELLEITUNG  |  VOR DEM ERSTEN EINSATZ', 'Zuerst selbst ausprobieren',
      '<div class="kasten wissen"><span class="label">WICHTIG</span>Spielt das Spiel vor dem ersten Einsatz einmal selbst ganz durch (ca. 45 Minuten), am besten im Schulzimmer mit dem WLAN der Schule. So kennt ihr die Rätsel, die typischen Stolpersteine und die Technik.</div>' +
      '<ol>' +
      '<li><strong>' + adr + '/spielleitung.html</strong> öffnen, Unterrichtsinfo lesen und eine Stufe wählen.</li>' +
      '<li>In einem zweiten Fenster oder auf einem Tablet <strong>' + adr + '</strong> öffnen und sich mit dem Beitrittscode als Team anmelden.</li>' +
      '<li>Auf der Spielleitung «▶ Spiel starten»: Botschaft und Spielanweisung anschauen, Ton und Beamer prüfen.</li>' +
      '<li>Alle drei Protokolle selbst lösen, ohne Lösungen: mit gebastelter Chiffrierscheibe, eigenem Programm und gedrucktem Netzwerkplan.</li>' +
      '<li>Den Help-Desk öffnen und die Tipps ansehen. Ein Joker kostet ' + JOKER_KOSTEN + ' Punkte.</li>' +
      '<li>Technikcheck: Spielleitung, Reiter «1 Vorbereiten», Karte «Technikcheck». Auf einem Gerät der Teams «Gerät prüfen».</li>' +
      '<li>Danach auf dem Gerät «Neues Spiel» und auf der Spielleitung «Spiel zurücksetzen (PIN)».</li></ol>' +
      '<h2>Drucken</h2>' + tabelle(['Was', 'Anzahl', 'Hinweis'], [
        ['Dossier der gewählten Stufe (7 Seiten)', '1 pro Team', 'Spielleitung, Reiter «1 Vorbereiten», «Gesamtes Dossier». A4, «Tatsächliche Grösse», farbig. Seite 7 (Netzwerkplan) ist quer.'],
        ['Bastelvorlagen Chiffrierscheibe (Dossier Seiten 3 und 4)', '1 pro Team', 'Auf festes Papier (ab 160 g/m²).'],
        ['Reserve-Dossier', '1 bis 2', 'Falls ein Blatt verloren geht oder eine Scheibe misslingt.'],
        ['Leitfaden mit Lösungen', '1 für euch', 'PIN eingeben, «Lösungen einfügen». Nicht im Zimmer liegen lassen.']
      ], 'mission kompakt') +
      '<h2>Weiteres Material</h2>' + haken([
        'Pro Team eine Schere, eine Musterklammer und Stifte.',
        'Pro Team ein geladenes Tablet oder Laptop, dazu Beamer mit Lautsprecher.'
      ]));
  }

  /* ------------------- Seite 4: Ablauf und Bedienung ------------------ */
  function ablauf(st) {
    return seite(st, 'SPIELLEITUNG  |  ABLAUF', 'Ablauf der Lektion',
      tabelle(['Phase', 'Was passiert', 'Spielleitung'], [
        ['Einstieg<br>ca. 5 Min.', '«▶ Spiel starten»: Vollbild, Botschaft von NULLBYTE, danach die Spielanweisung mit dem <strong>Beitrittscode</strong>. Die Teams geben Teamname und Code ein, tippen auf «Spiel starten» und «Wir sind bereit» und warten.', 'Material verteilen, Teams zu 3 bis 4 Personen bilden.'],
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

  /* ------------------ Seite 5: Notfälle und Punkte ------------------ */
  function notfaelle(st) {
    return seite(st, 'SPIELLEITUNG  |  NOTFÄLLE', 'Wenn etwas nicht klappt',
      tabelle(['Problem', 'Lösung'], [
        ['Kein Internet, Startsignal kommt nicht an', 'Auf dem Gerät des Teams «Spielleitung: manuell starten» und PIN. Für eine gemeinsame Uhr den Link <code>index.html?ende=HH:MM</code> verwenden (Reiter «Lösungen und Extras»).'],
        ['Ein Gerät wartet noch, obwohl das Spiel läuft', 'Reiter «2 Spiel durchführen», «Probleme?», «Startsignal erneut senden».'],
        ['Ein Team hat die Seite neu geladen', 'Kein Problem: Spielstand, Punkte und Countdown bleiben erhalten.'],
        ['Gerät für die nächste Runde', 'Nichts löschen: Die Teams tippen nach Spielende auf «Neues Spiel» oder melden sich auf der Startseite mit dem neuen Beitrittscode an. Mitten im Spiel: unten rechts «Spielleitung», PIN, «Spiel zurücksetzen».'],
        ['Protokoll 2: Team weiss nicht, welche Zahlen zählen', 'ANTI-V sammelt jede gelbe Zahl auf seinem Weg. Nur der richtige Weg führt über genau 3, 8, 5. Die Meldung im Terminal nennt die eingesammelten Zahlen.'],
        ['Protokoll 3: «Euer Weg ist sauber, aber …»', 'Der Weg meidet die roten Server, hat aber zu viele Verbindungen. Hinweis: Verbindungen (Linien) zählen, nicht die Kennzahlen.'],
        ['Kein Ton', 'Lautstärke prüfen und einmal auf den Bildschirm tippen oder klicken. Browser erlauben Ton erst nach einer Berührung.'],
        ['Neue Runde', 'Reiter «3 Nach dem Spiel», «Spiel zurücksetzen (PIN)». Es gibt einen neuen Beitrittscode.']
      ], 'mission notfall') +
      '<h2>Punkte und Help-Desk</h2><ul>' +
      '<li>Start mit ' + START_PUNKTE + ' Punkten, plus ' + PUNKTE_PRO_PROTOKOLL + ' pro gelöstem Protokoll, plus ' + BONUS_PUNKTE + ' für jede Bonusfrage (nach Protokoll 1 und nach Protokoll 2, je ein Versuch).</li>' +
      '<li>Effizienzbonus in Protokoll 2: ' + BLOCK_BONUS_BASIS + ' Punkte plus ' + BLOCK_BONUS_PRO_BLOCK + ' für jeden Block unter dem Limit. Zeitbonus: ' + PUNKTE_PRO_RESTMINUTE + ' Punkt pro übrige Minute.</li>' +
      '<li>Help-Desk: ' + JOKER_ANZAHL + ' Joker pro Team, jeder kostet ' + JOKER_KOSTEN + ' Punkte. Nach ' + GRATIS_TIPP_MINUTEN + ' Minuten ohne Fortschritt gibt es einen Tipp gratis.</li></ul>');
  }

  /* --------------------- Seite 6: Lösungen (PIN) --------------------- */
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
        ['Code', '<strong class="gross">' + esc(code1) + '</strong>' + (eigen ? ' (eigener Code dieser Runde)' : '')],
        ['Schlüssel', 'Verschiebung ' + v + ': innen ' + caesar('A', v) + ' unter dem äusseren A. Unterschrift ' + caesar('NULLBYTE', v) + ' = NULLBYTE.'],
        ['Geheimtext', '<span class="mono-klein">' + esc(geheim) + '</span>'],
        ['Klartext', esc(klartext)],
        ['Bonusfrage', esc(l.bonus || '')]
      ], 'mission loesung') +
      '<h2>Protokoll 2: Algorithmen</h2>' + tabelle(['', ''], [
        ['Signaturen', esc(l.signaturen || '')],
        ['Bonusfrage', esc(TEXTE.bonusFrage2.frage) + ' Antwort <strong>B</strong>: ' + esc(TEXTE.bonusFrage2.antworten[1][1])],
        ['Regeln', 'Höchstens ' + s.maxBloecke + ' Blöcke, ' + s.energie + ' Felder Energie, Schleife ist Pflicht.'],
        ['Musterlösung', esc(s.musterloesung)]
      ], 'mission loesung') +
      '<h2>Protokoll 3: Netzwerke</h2>' + tabelle(['', ''], [
        ['Override-Code', '<strong class="gross">' + esc(l.p3 || '') + '</strong>'],
        ['Richtiger Weg', esc(netz.loesung)],
        ['Fallen', esc(netz.fallen) + '. Das Terminal warnt dann «Euer Weg führt über einen infizierten Server!».']
      ], 'mission loesung'));
  }

  /* ----------------------- Seite 7: Help-Desk ------------------------ */
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

  /* ----------- Seiten 8 bis 11: Einsatz im Unterricht ----------- */
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
    return vorbereitung(st) + voraussetzungen(st) + ausprobieren(st) + ablauf(st) + notfaelle(st) + loesungen(st, l) + tipps(st) + unterricht(st);
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

