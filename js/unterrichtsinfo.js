/* =====================================================================
   Systemabsturz: Unterrichtsinfo (Fenster in der Spielleitung)
   ---------------------------------------------------------------------
   Erscheint beim Öffnen von spielleitung.html, bevor die Steuerung
   bedienbar ist (ausser ein Spiel läuft bereits). Über den Knopf
   «Unterrichtsinfo» in der Kopfleiste jederzeit wieder erreichbar.

   TEXTE ÄNDERN: nur die Datenstruktur UNTERRICHTSINFO unten anpassen.
   Bausteine eines Abschnitts:
     { p: 'Text' }                 Absatz
     { h: 'Zwischentitel' }        kleiner Titel
     { liste: ['...', '...'] }     Aufzählung
     { tabelle: { kopf: [...], zeilen: [[...], ...] } }
   In Texten: `code` wird als Code gesetzt, https://... wird ein Link,
   **fett** wird fett.

   Lehrplanbezüge: Buchstaben und Zyklusangaben (Z2, Z3) stammen aus dem
   Kompetenzraster des Lehrplans 21, Modullehrplan Medien und
   Informatik (Stand 29.2.2016). Bei Bedarf mit der kantonalen Version
   abgleichen.

   Benötigt js/app.js (SPEICHER_LEITUNG, ladeJson). Keine externen
   Abhängigkeiten.
   Lizenz: CC BY-SA 4.0, Christof Heiss, Jan Schmid, PH Luzern 2026
   ===================================================================== */

const UNTERRICHTSINFO = {
  hinweis: 'Nur für die Lehrperson. Fenster schliessen, bevor der Beamer angeschlossen oder geteilt wird.',
  titel: 'Einsatz im Unterricht',
  untertitel: 'Systemabsturz: Lehrplanbezüge und Ideen für die Lektion',
  abschnitte: [
    {
      titel: 'A  Auf einen Blick',
      inhalt: [
        { liste: [
          '**Fach:** Medien und Informatik, Kompetenzbereich Informatik (MI.2), Zyklus 3 (7. bis 9. Klasse).',
          '**Format:** Escape Game mit vier Teams parallel, je ein Tablet oder Laptop und ein gedrucktes Teamset.',
          '**Drei Protokolle:** Kryptografie (Papier), Algorithmen (Tablet oder Laptop), Netzwerke (Papier). Drei Stufen: leicht, mittel, schwer.',
          '**Zeitbedarf:** Die Spielzeit beträgt standardmässig 40 Minuten, dazu kommen Einstieg (Botschaft und Anweisung) und Auswertung. Für eine Einzellektion von 45 Minuten die Spieldauer in `js/app.js` verkürzen (zum Beispiel auf 30 Minuten) oder eine Doppellektion einplanen.'
        ] }
      ]
    },
    {
      titel: 'B  Lehrplanbezüge',
      inhalt: [
        { p: 'Grundlage: Lehrplan 21, Modullehrplan Medien und Informatik, Kompetenzbereich MI.2 Informatik. «Z2» bedeutet: Aufbau aus Zyklus 2, im Spiel angewendet und vertieft. «Z3» bedeutet: Kompetenzstufe des Zyklus 3.' },
        { h: 'Übergeordnete Kompetenzen' },
        { liste: [
          '**MI.2.1:** Die Schülerinnen und Schüler können Daten aus ihrer Umwelt darstellen, strukturieren und auswerten.',
          '**MI.2.2:** Die Schülerinnen und Schüler können einfache Problemstellungen analysieren, mögliche Lösungsverfahren beschreiben und in Programmen umsetzen.',
          '**MI.2.3:** Die Schülerinnen und Schüler verstehen Aufbau und Funktionsweise von informationsverarbeitenden Systemen und können Konzepte der sicheren Datenverarbeitung anwenden.'
        ] },
        { h: 'Protokoll, Kompetenz, Bezug zum Spiel' },
        { tabelle: {
          kopf: ['Protokoll', 'Kompetenzstufe', 'Bezug zum Spiel'],
          zeilen: [
            ['1 Kryptografie', 'MI.2.1c (Z2): Daten mittels selbstentwickelter Geheimschriften verschlüsseln', 'Cäsar-Verschlüsselung mit der Chiffrierscheibe, Begriffe Schlüssel, Klartext, Geheimtext'],
            ['1 Kryptografie', 'MI.2.3n (Z3): Risiken unverschlüsselter Datenübermittlung und -speicherung abschätzen', 'NULLBYTE liest Klartext mit, die Botschaft wird nur verschlüsselt sicher. Reflexion in der Auswertung'],
            ['1 Kryptografie', 'MI.1.3d (Z2): Sicherheitsregeln im Umgang mit persönlichen Daten (Passwort)', 'Motiv von NULLBYTE (schwache Passwörter, unvorsichtige Klicks) und Reflexion in der Auswertung'],
            ['2 Algorithmen', 'MI.2.2f (Z2): Programme mit Schleifen, bedingten Anweisungen und Parametern schreiben und testen', 'Blockprogramm für ANTI-V, Schleife ist Pflicht, Testen mit Start und Fehlermeldung'],
            ['2 Algorithmen', 'MI.2.2g (Z3): selbstentdeckte Lösungswege in lauffähigen und korrekten Computerprogrammen formulieren', 'Teams entdecken selbst eine allgemeine Regel (zum Beispiel Rechte-Hand-Regel) und setzen sie um'],
            ['2 Algorithmen', 'MI.2.2i (Z3): verschiedene Algorithmen zur Lösung desselben Problems vergleichen und beurteilen', 'Blocklimit, Energie und Effizienzbonus, Vergleich der Teamlösungen in der Auswertung'],
            ['2 Algorithmen', 'MI.2.2c und MI.2.2d (Z2): Abläufe darstellen, einfache Abläufe lesen und manuell ausführen', 'Planungsfeld auf dem Teamset, Programm vor dem Start im Kopf durchspielen'],
            ['2 Algorithmen', 'MI.2.2e (Z2): verstehen, dass ein Computer nur vordefinierte Anweisungen ausführt', 'ANTI-V tut genau, was die Blöcke sagen, nicht, was das Team meint'],
            ['2 Algorithmen', 'MI.2.1i (Z3): logische Operatoren verwenden (und, oder, nicht)', 'Stufen mittel und schwer: Bedingungen mit «und» und «nicht»'],
            ['3 Netzwerke', 'MI.2.1f (Z3): Baum- und Netzstrukturen erkennen und verwenden', 'Netzwerkplan mit Servern und Verbindungen als Netzstruktur'],
            ['3 Netzwerke', 'MI.2.2b (Z2) und MI.2.2i (Z3): Lösungswege suchen, auf Korrektheit prüfen und vergleichen', 'Kürzesten sauberen Weg finden, verlockende infizierte Abkürzungen prüfen und verwerfen'],
            ['3 Netzwerke', 'MI.2.3m (Z3): das Internet als Infrastruktur von seinen Diensten unterscheiden', 'Der Netzwerkplan als Modell für die Verbindungen hinter dem Internet']
          ]
        } },
        { p: '**Querschnitt:** Überfachliche Kompetenzen (soziale und methodische), vor allem Zusammenarbeit im Team, Aufgaben verteilen und systematisches Vorgehen beim Problemlösen. Das Motiv von NULLBYTE (schwache Passwörter, unvorsichtige Klicks) bietet zudem Anschluss an den Kompetenzbereich MI.1 Medien (Sicherheit und Datenschutz).' }
      ]
    },
    {
      titel: 'C  Einsatz im Unterricht',
      inhalt: [
        { h: 'Wann einsetzen' },
        { liste: [
          'Einstieg in eine Einheit zu Kryptografie, Algorithmen oder Netzwerken: Vorwissen erheben, Neugier wecken.',
          'Abschluss und Transfer einer Einheit (Stufe schwer): Gelerntes unter Zeitdruck anwenden.',
          'Zu Beginn des Schuljahres als teambildende Aktivität (Stufe leicht).',
          'Projektwoche oder Vertretungslektion, da kaum Vorbereitung auf Schülerseite nötig ist.'
        ] },
        { h: 'Vor der Lektion (ca. 15 Minuten)' },
        { liste: [
          'Teamsets der gewählten Stufe drucken (A4, 100 %, farbig), Chiffrierscheiben auf festes Papier.',
          'Zahlenschlösser auf die gewählten Codes stellen.',
          'Tablets oder Laptops mit geöffneter Startseite bereitlegen.',
          'Prüfen, ob ntfy.sh im Schulnetz erreichbar ist. Stufe auf der Spielleitung wählen.'
        ] },
        { h: 'Einstieg (ca. 5 Minuten)' },
        { p: 'Botschaft von NULLBYTE und Spielanweisung. Teams zu 3 bis 4 Personen bilden. Rollen vorschlagen (zum Beispiel Entschlüsseln, Programmieren, Netzwerk analysieren, Zeit im Blick), die pro Protokoll wechseln dürfen.' },
        { h: 'Spielphase' },
        { p: 'Die Lehrperson ist Beobachtende und Help-Desk. Nicht vorschnell eingreifen, Joker kosten Punkte. Beobachtungsfragen: Gehen die Teams systematisch vor? Testen sie, bevor sie abgeben? Wie verteilen sie die Aufgaben?' },
        { h: 'Auswertung (10 bis 15 Minuten), Reflexionsfragen' },
        { liste: [
          '**Kryptografie:** Warum ist die Cäsar-Chiffre heute nicht mehr sicher? Wie liesse sie sich ohne Schlüssel knacken? Wo werden heute Daten verschlüsselt (Messenger, WLAN, Webseiten)?',
          '**Algorithmen:** Welche Regel hat ANTI-V ans Ziel gebracht? Warum brauchte es die Schleife? Wann ist eine kürzere Lösung besser, und wann zählt etwas anderes?',
          '**Netzwerke:** Wie habt ihr den Weg gefunden? Was passiert, wenn ein Server ausfällt oder infiziert ist? Was hat das mit dem Internet zu tun?',
          '**Transfer:** Wo steckt ein Algorithmus in einem Navi, einem sozialen Netzwerk oder einem KI-Chatbot?'
        ] }
      ]
    },
    {
      titel: 'D  Differenzierung und Beurteilung',
      inhalt: [
        { liste: [
          '**Stufen als Orientierung:** leicht für Grundanforderungen, mittel für das Regelniveau, schwer für erweiterte Anforderungen. Die Stufe gilt für das ganze Spiel und wird auf der Spielleitung gewählt. Schnelle Teams können die Bonusfrage lösen und ihr Programm weiter optimieren.',
          '**Beurteilung:** Der Punktestand misst auch Tempo und Glück, nicht nur Kompetenz. Er eignet sich nicht als Note. Sinnvoll ist eine formative Rückmeldung über Beobachtung, die Notizen auf dem Teamset (Protokoll 1: Geheimtext, Verschiebung, Klartext, Protokoll 2: Planungsfeld) und die mündliche Reflexion.',
          '**Anschluss an eine Prüfung:** Eine Cäsar-Nachricht entschlüsseln, ein Programm lesen und manuell ausführen (MI.2.2d), im Netzwerkplan den kürzesten sauberen Weg bestimmen.'
        ] }
      ]
    },
    {
      titel: 'E  Voraussetzungen und Technik',
      inhalt: [
        { liste: [
          'Pro Team ein Tablet (zum Beispiel iPad mit Safari, Querformat) oder ein Laptop mit aktuellem Browser (Chrome, Edge, Safari oder Firefox). Dazu ein Beamer-Laptop mit `spielleitung.html`.',
          'Das Startsignal läuft über ntfy.sh und braucht Internet. Ohne Internet: Geräte der Teams manuell mit der PIN starten oder den Link `index.html?ende=HH:MM` verwenden.',
          'Scratch-Erfahrung ist hilfreich, aber nicht nötig. Der Help-Desk liefert gestufte Tipps.',
          'Lizenz: «Systemabsturz» von Christof Heiss und Jan Schmid, PH Luzern 2026, CC BY-SA 4.0.',
          'Quelle der Kompetenzen: Lehrplan 21, Modullehrplan Medien und Informatik, https://v-ef.lehrplan.ch',
          'Bildnachweis: Hintergrund der Spielanweisung KI-generiert mit Google Gemini; Maske von NULLBYTE eigene Zeichnung.'
        ] }
      ]
    }
  ]
};

const Unterrichtsinfo = (function () {
  let ausloeser = null;     // Element, das den Fokus nach dem Schliessen zurückerhält
  let gebaut = false;

  /** Setzt einfachen Text mit `code`, **fett** und Links sicher als DOM (ohne innerHTML) */
  function setzeText(ziel, text) {
    const teile = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/);
    teile.forEach(function (t) {
      if (!t) return;
      let el;
      if (/^`.*`$/.test(t)) { el = document.createElement('code'); el.textContent = t.slice(1, -1); }
      else if (/^\*\*.*\*\*$/.test(t)) { el = document.createElement('strong'); el.textContent = t.slice(2, -2); }
      else if (/^https?:\/\//.test(t)) {
        el = document.createElement('a');
        el.href = t;
        el.target = '_blank';
        el.rel = 'noopener';
        el.textContent = t;
      } else { el = document.createTextNode(t); }
      ziel.appendChild(el);
    });
    return ziel;
  }

  function neu(tag, klasse, text) {
    const el = document.createElement(tag);
    if (klasse) el.className = klasse;
    if (text !== undefined) setzeText(el, text);
    return el;
  }

  function baue() {
    if (gebaut) return;
    gebaut = true;
    const d = UNTERRICHTSINFO;
    $('#unterrichtsinfo-hinweis').textContent = d.hinweis;
    $('#unterrichtsinfo-titel').textContent = d.titel;
    $('#unterrichtsinfo-untertitel').textContent = d.untertitel;
    const inhalt = $('#unterrichtsinfo-inhalt');
    d.abschnitte.forEach(function (a, i) {
      const det = document.createElement('details');
      det.className = 'info-abschnitt';
      if (i === 0) det.open = true;
      det.appendChild(neu('summary', '', a.titel));
      const koerper = neu('div', 'info-koerper');
      a.inhalt.forEach(function (b) {
        if (b.p) koerper.appendChild(neu('p', '', b.p));
        else if (b.h) koerper.appendChild(neu('h4', '', b.h));
        else if (b.liste) {
          const ul = neu('ul');
          b.liste.forEach(function (t) { ul.appendChild(neu('li', '', t)); });
          koerper.appendChild(ul);
        } else if (b.tabelle) {
          const huelle = neu('div', 'info-tabelle-huelle');
          const tab = neu('table', 'info-tabelle');
          const kopf = neu('tr');
          b.tabelle.kopf.forEach(function (t) { kopf.appendChild(neu('th', '', t)); });
          const thead = neu('thead');
          thead.appendChild(kopf);
          tab.appendChild(thead);
          const tbody = neu('tbody');
          b.tabelle.zeilen.forEach(function (z) {
            const tr = neu('tr');
            z.forEach(function (t) { tr.appendChild(neu('td', '', t)); });
            tbody.appendChild(tr);
          });
          tab.appendChild(tbody);
          huelle.appendChild(tab);
          koerper.appendChild(huelle);
        }
      });
      det.appendChild(koerper);
      inhalt.appendChild(det);
    });
  }

  /** Alle Elemente ausser dem Fenster für Maus, Touch, Tastatur und Vorlesehilfen sperren */
  function hintergrundSperren(an) {
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el.id === 'unterrichtsinfo' || el.tagName === 'SCRIPT') return;
      if (an) {
        if (el.hasAttribute('inert')) return;
        el.setAttribute('inert', '');
        el.dataset.infoGesperrt = '1';
      } else if (el.dataset.infoGesperrt) {
        el.removeAttribute('inert');
        delete el.dataset.infoGesperrt;
      }
    });
    document.documentElement.classList.toggle('info-offen', an);
  }

  function fokussierbare() {
    return Array.prototype.filter.call(
      $('#unterrichtsinfo').querySelectorAll('button, a[href], summary, [tabindex]:not([tabindex="-1"])'),
      function (el) { return el.offsetParent !== null; }
    );
  }

  function offen() { const f = $('#unterrichtsinfo'); return !!f && !f.hidden; }

  function oeffne(von) {
    baue();
    ausloeser = von || document.activeElement;
    $('#unterrichtsinfo').hidden = false;
    hintergrundSperren(true);
    $('#unterrichtsinfo-box').scrollTop = 0;
    $('#unterrichtsinfo-weiter').focus();
  }

  function schliesse() {
    if (!offen()) return;
    $('#unterrichtsinfo').hidden = true;
    hintergrundSperren(false);
    if (ausloeser && document.contains(ausloeser) && ausloeser !== document.body) ausloeser.focus();
    ausloeser = null;
  }

  /** Nur das Fenster drucken, alle Abschnitte aufgeklappt */
  function drucke() {
    const abschnitte = $$('#unterrichtsinfo .info-abschnitt');
    const vorher = abschnitte.map(function (d) { return d.open; });
    abschnitte.forEach(function (d) { d.open = true; });
    document.documentElement.classList.add('info-druck');
    let zurueck = false;
    const aufraeumen = function () {
      if (zurueck) return;
      zurueck = true;
      document.documentElement.classList.remove('info-druck');
      abschnitte.forEach(function (d, i) { d.open = vorher[i]; });
      window.removeEventListener('afterprint', aufraeumen);
    };
    window.addEventListener('afterprint', aufraeumen);
    window.print();
    setTimeout(aufraeumen, 1000);
  }

  /** Läuft bereits ein Spiel? (Status der Spielleitung nach einem Reload) */
  function spielLaeuft() {
    const s = (typeof Leitung !== 'undefined' && Leitung.stand) || ladeJson(SPEICHER_LEITUNG) || {};
    const countdownAktiv = !!s.endzeit && (s.gestoppt === null || s.gestoppt === undefined) && s.endzeit > Date.now();
    return !!s.freigegeben || countdownAktiv;
  }

  function init() {
    if (!$('#unterrichtsinfo')) return;
    $('#unterrichtsinfo-weiter').addEventListener('click', schliesse);
    $('#unterrichtsinfo-schliessen').addEventListener('click', schliesse);
    $('#unterrichtsinfo-drucken').addEventListener('click', drucke);
    $('#unterrichtsinfo-knopf').addEventListener('click', function () { oeffne(this); });
    // Escape schliesst, Tab bleibt im Fenster (Fokus-Falle)
    document.addEventListener('keydown', function (e) {
      if (!offen()) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); schliesse(); return; }
      if (e.key !== 'Tab') return;
      const f = fokussierbare();
      if (!f.length) return;
      const erstes = f[0];
      const letztes = f[f.length - 1];
      if (!$('#unterrichtsinfo').contains(document.activeElement)) { e.preventDefault(); erstes.focus(); }
      else if (e.shiftKey && document.activeElement === erstes) { e.preventDefault(); letztes.focus(); }
      else if (!e.shiftKey && document.activeElement === letztes) { e.preventDefault(); erstes.focus(); }
    }, true);
    if (!spielLaeuft()) oeffne(null);
  }

  return { init: init, oeffne: oeffne, schliesse: schliesse };
})();

// Nach js/app.js laden: läuft nach initSpielleitung, Leitung.stand ist dann gesetzt
document.addEventListener('DOMContentLoaded', function () {
  if (document.body.dataset.seite === 'spielleitung') Unterrichtsinfo.init();
});
