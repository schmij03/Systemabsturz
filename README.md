# Systemabsturz: Escape Game für Zyklus 3

Ein digitales Escape Game für die Sekundarstufe I (12 bis 15 Jahre) zu Kryptografie, Algorithmen und Netzwerken.

**Story:** Die fiktive Hackergruppe NULLBYTE hat das Schulnetz gesperrt. Vier Teams spielen parallel, jedes Team hat ein Tablet mit dem «Notfall-Terminal» der Schule. In 45 Minuten knacken die Teams drei Sicherheitsprotokolle und lösen den Override aus, bevor NULLBYTE alle Daten löscht.

Die App ist eine rein statische Webseite (HTML, CSS, JavaScript). Sie braucht keinen Server, keine Datenbank und keinen Build-Schritt und läuft direkt auf GitHub Pages.

## Inhalt

| Datei | Zweck |
|---|---|
| `index.html` | Startseite: Teamname eingeben, Spiel starten |
| `terminal.html` | Spielansicht der Teams mit den drei Protokollen, Countdown, Help-Desk und Punkten |
| `spielleitung.html` | Beamer-Ansicht: grosser Countdown, Story-Texte, Hackervideo, Schlussszene, Lösungen (PIN), Reset |
| `css/style.css` | Gestaltung im Terminal-Look |
| `js/app.js` | Hauptlogik, **alle Einstellungen oben in der Datei** (PIN, Spieldauer, Punkte, Hashes, Texte, Tipps) |
| `js/blocks.js` | Protokoll 2: Scratch-Blöcke mit Blockly und eigener Interpreter |
| `js/maze.js` | Protokoll 2: Labyrinth, Signaturen und Darstellung von ANTI-V |
| `lib/blockly/` | Lokale Kopie von Blockly 13.3.0 (Apache 2.0) für den Offline-Betrieb |
| `sounds/` | Platzhalter für Töne (sonst synthetische Töne), siehe `sounds/README.md` |
| `videos/` | Platz für das Hackervideo `intro.mp4`, siehe `videos/README.md` |
| `sw.js` | Service Worker: speichert alles für den Offline-Betrieb |
| `TESTPLAN.md` | Kurzer Testplan vor dem Einsatz |

## Veröffentlichen über GitHub Pages

1. Dieses Repository auf GitHub öffnen (oder forken, wenn ihr eine eigene Version wollt).
2. Oben auf **Settings** klicken.
3. Links im Menü **Pages** wählen.
4. Unter «Build and deployment» bei **Source** «Deploy from a branch» wählen.
5. Bei **Branch** `main` und den Ordner **`/ (root)`** wählen, dann **Save**.
6. Nach ein bis zwei Minuten erscheint oben die Adresse, zum Beispiel `https://BENUTZERNAME.github.io/REPOSITORY/`.

Die Startseite für die Teams ist dann `https://BENUTZERNAME.github.io/REPOSITORY/index.html`, die Beamer-Ansicht `.../spielleitung.html`.

Hinweis: Damit die Seite auf GitHub Pages erscheint, muss der Spielstand im Branch `main` liegen. Wird auf einem anderen Branch entwickelt, diesen zuerst in `main` mergen.

## Ablauf in der Lektion

1. **Vorbereitung:** Auf dem Laptop der Lehrperson `spielleitung.html` öffnen. Im Bereich «Countdown synchronisieren» das Spielende wählen, zum Beispiel 10:45.
2. **Tablets:** Auf jedem Tablet den angezeigten Tablet-Link öffnen, zum Beispiel `index.html?ende=10:45`. Alle Geräte zählen dann auf dieselbe Uhrzeit herunter (die Uhren der Geräte sollten automatisch gestellt sein).
3. **Beamer:** Mit «Beamer mit dieser Endzeit öffnen» läuft der grosse Countdown synchron. Mit «Vollbild» wird er bildschirmfüllend.
4. **Einstieg:** «Hackervideo» abspielen (oder «Botschaft von NULLBYTE»), danach die Story-Texte «Alarm», «Auftrag» und «Regeln» zeigen. Die Story wird auf Wunsch automatisch vorgelesen.
5. Die Teams geben ihren Namen ein und tippen auf **«Spiel starten»** (das entsperrt auch den Ton).
6. **Schluss:** «System gerettet» zeigt die Schlussszene und hält den Beamer-Countdown an.

Ohne den Parameter `?ende=HH:MM` startet der Countdown auf jedem Tablet beim Klick auf «Spiel starten» mit 45:00.

### Die drei Protokolle

* **Protokoll 1, Kryptografie (Papier):** Cäsar-Nachricht mit der Chiffrierscheibe entschlüsseln, dreistelligen Code im Terminal eingeben. Der Code öffnet das Zahlenschloss von Sicherheitskiste 1. Danach folgt eine freiwillige Bonusfrage (ein Versuch, plus 10 Punkte).
* **Protokoll 2, Algorithmen (Tablet):** Mit Scratch-ähnlichen Blöcken den Antiviren-Roboter ANTI-V durch ein Labyrinth programmieren. Er muss das Ziel erreichen und genau die Signaturen 3, 8, 5 einsammeln, ohne ein rotes Feld zu betreten. Bei Erfolg erscheint der Code für Sicherheitskiste 2.
* **Protokoll 3, Netzwerke (Papier):** Auf dem Netzwerkplan den kürzesten Weg ohne infizierte Server finden, die Kennzahlen addieren und als Override-Code eingeben. Danach den roten Buzzer «OVERRIDE AUSLÖSEN» drücken.

### Help-Desk und Punkte

* Start mit 100 Punkten, plus 20 pro gelöstem Protokoll, minus 20 pro Joker, plus 1 Punkt pro volle Minute Restzeit beim Override, plus 10 für die Bonusfrage.
* Jedes Team hat 3 Joker. Ein Joker zeigt die nächste Tippstufe (1, 2, 3) des aktuellen Protokolls.
* Wird in einem Protokoll 5 Minuten lang nichts gelöst, erscheint Tippstufe 1 gratis (einmal pro Protokoll).
* Punkte, Joker, Teamname und Countdown sind immer in der Kopfzeile sichtbar.

### NULLBYTE und das Vorlesen

* **Botschaft von NULLBYTE:** Fehlt `videos/intro.mp4`, erscheint auf dem Beamer die Maske von NULLBYTE (`img/maske.svg`, eigene Zeichnung) und die Botschaft tippt sich Zeile für Zeile. Dabei nennt NULLBYTE auch sein Motiv: Die Gruppe will beweisen, dass an der Schule niemand auf Datensicherheit achtet (schwache Passwörter, offene Computer, unvorsichtige Klicks). Der Text steht in `js/app.js` unter `TEXTE.nullbyte`.
* **Vorlesen (Text-to-Speech):** Die Botschaft wird mit tiefer Hackerstimme vorgelesen, die Story-Texte mit normaler Stimme. Im Terminal haben die Story-Texte und der Help-Desk einen Knopf 🔊. Verwendet wird die Sprachausgabe des Browsers (Web Speech API), bevorzugt eine Stimme für Deutsch (Schweiz), sonst Deutsch (Deutschland). Es braucht keine Internetverbindung, sofern das Gerät eine deutsche Stimme installiert hat. Tonhöhe und Tempo lassen sich in `js/app.js` unter `STIMMEN` anpassen.
* Auf dem iPad gibt es Sprachausgabe nur nach einer Berührung und nur, wenn der Stummschalter aus ist. Weitere Stimmen lassen sich unter Einstellungen, Bedienungshilfen, Gesprochene Inhalte, Stimmen laden.

### Bei 00:00

Das Terminal zeigt «SYSTEM GELÖSCHT», alle Eingaben sind gesperrt, der Punktestand bleibt sichtbar.

### Tablets zurücksetzen

Auf dem Tablet unten rechts auf «Spielleitung» tippen, PIN eingeben (Standard **4711**) und bestätigen. Der Spielstand liegt nur im Browser des jeweiligen Geräts (localStorage).

## Anpassen

Alle Einstellungen stehen gut kommentiert ganz oben in den Dateien:

* `js/app.js`: PIN, Spieldauer, Joker-Kosten (Standard 20 Punkte), Botschaft von NULLBYTE, Stimmen fürs Vorlesen, Punkte, Anzahl Joker, Gratis-Tipp-Zeit, Hashes der Codes, Story-Texte und Tipps.
* `js/maze.js`: Labyrinth, Zahlen auf den Feldern, Startrichtung, maximale Schrittzahl.
* `js/blocks.js`: Blockfarben, Tempo, Blockly-Version.

**Codes ändern:** Die Codes stehen nicht im Klartext im Quellcode, sondern nur als SHA-256-Hash (mit Salz). So finden die Schülerinnen und Schüler die Lösungen nicht über «Quelltext anzeigen». Neue Hashes erzeugt ihr auf `spielleitung.html` im Bereich «Konfiguration erzeugen (Codes ändern)»: Codes eintragen, PIN eingeben und die Ausgabe in `js/app.js` einsetzen. Der Code von Kiste 2 und die Lösungsliste für die Spielleitung werden dabei verschlüsselt mitgeneriert.

## Technik

* Läuft in aktuellen Versionen von Safari (iPad) und Chrome (Android). Optimiert für Tablets im Querformat, alle Touch-Ziele mindestens 48 px.
* Blockly wird zuerst lokal aus `lib/blockly/` geladen, bei Bedarf als Ersatz vom CDN unpkg.com. Renderer «zelos», damit die Blöcke wie in Scratch aussehen.
* Protokoll 2 läuft über einen eigenen Interpreter über den Blockbaum, ohne `eval`.
* Nach dem ersten Laden funktioniert alles offline (Service Worker). Nach Änderungen am Spiel in `sw.js` die Zahl in `CACHE_NAME` erhöhen.
* Töne: Fehlen eigene MP3-Dateien in `sounds/`, erzeugt die Web Audio API die Töne synthetisch.
* Zum lokalen Testen einen kleinen Webserver verwenden, zum Beispiel `python3 -m http.server` im Projektordner, dann `http://localhost:8000` öffnen.

## Lizenz

«Systemabsturz» von Christof Heiss, Jan Schmid, PH Luzern 2026, steht unter der Lizenz [Creative Commons Namensnennung, Weitergabe unter gleichen Bedingungen 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/deed.de).

Enthaltene Fremdsoftware: [Blockly](https://github.com/RaspberryPiFoundation/blockly) (Apache License 2.0, siehe `lib/blockly/LICENSE`).
