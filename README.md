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
| `js/maze.js` | Protokoll 2: drei Labyrinthe (Schwierigkeitsstufen), Signaturen, Blocklimit, Energie und Darstellung von ANTI-V |
| `lib/blockly/` | Lokale Kopie von Blockly 13.3.0 (Apache 2.0) für den Offline-Betrieb |
| `sounds/` | Platzhalter für Töne (sonst synthetische Töne), siehe `sounds/README.md` |
| `videos/` | Platz für das Hackervideo `intro.mp4`, siehe `videos/README.md` |
| `audio/tts/` | Sprachaufnahmen (Stimme Thorsten, CC0) und `verzeichnis.json` |
| `werkzeuge/` | `tts_erzeugen.py` erzeugt die Sprachaufnahmen neu, `texte_exportieren.js` liest dafür die Texte aus `js/app.js` |
| `img/` | Maske von NULLBYTE (`maske.svg`) und Hintergrundbild der Spielanweisung (`hintergrund-anweisung.webp`) |
| `material/` | Teamsets pro Stufe (Word, PDF folgen), Download auf der Spielleitungsseite |
| `js/netzwerke.js` | Netzwerkpläne für Protokoll 3 pro Stufe mit Lösung |
| `druck/` | Druckmaterial: Auftragsblatt, Chiffrierscheibe (Protokoll 1), Netzwerkplan (Protokoll 3) |
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

1. **Material drucken** (auf `spielleitung.html` unter «Material drucken», pro Team je ein Exemplar):
   * **Auftragsblatt** (`druck/auftrag.html`): Lage, Anmeldung, die drei Protokolle, Regeln, Platz für Notizen.
   * **Protokoll 1** (`druck/protokoll1.html`, 3 Seiten wie im Teamset): Auftragsblatt «Die Nachricht von NULLBYTE» mit Feldern für Geheimtext, Verschiebung, Klartext, Code und Bonusfrage, dann die grosse Scheibe (172 mm, Klartext) und die kleine Scheibe (142 mm, Geheimtext) mit Bauanleitung. Stufe wählbar, Geheimtext optional eindruckbar. In «Tatsächlicher Grösse» drucken, am besten auf festes Papier.
   * **Protokoll 2** (`druck/protokoll2.html`, 1 Seite wie im Teamset): Vorgehen, verfügbare Blöcke nach Kategorie (Scratch-Farben), Regeln mit Blocklimit, Energie und Effizienzbonus, Feld zum Planen des Programms und für die Signaturen. Werte und Blöcke kommen direkt aus `js/maze.js`, passen also immer zur gewählten Stufe.
   * **Protokoll 3: Netzwerkplan** (`druck/protokoll3.html`): Netzwerk mit Servern und Kennzahlen, farbig im Querformat drucken.
2. **Vorbereitung:** Auf dem Beamer-Laptop `spielleitung.html` öffnen, Schwierigkeit für Protokoll 2 wählen. Tablets liegen mit geöffneter Startseite `index.html` bereit.
3. **Spiel starten:** «▶ Spiel starten» drücken. Der Beamer wechselt in den **Vollbildmodus** und das **Hackervideo** läuft (fehlt `videos/intro.mp4`, spricht NULLBYTE mit Maske und Hackerstimme).
4. **Spielanweisung:** Direkt nach dem Video erscheint die **Spielanweisung**, darüber gross der **Beitrittscode** (fünf Buchstaben) und die Adresse des Notfall-Terminals. Die Anweisung wird Absatz für Absatz vorgelesen und hervorgehoben. **Jetzt verteilt ihr das gedruckte Material.** Die Teams geben Teamname und Beitrittscode ein und tippen auf «Wir sind bereit». Die Tablets warten verdeckt.
5. **Aufgaben erhalten:** Am Ende der Anweisung startet automatisch der Countdown auf dem Beamer und alle Tablets erhalten innerhalb weniger Sekunden ihre Aufgaben («Aufgaben empfangen», Protokoll 1). Der Beitrittscode bleibt klein auf der Leinwand, damit Nachzügler noch einsteigen können (sie starten sofort mit derselben Restzeit).
6. Abkürzen: im Video «Weiter zur Spielanweisung ▶», in der Anweisung «Aufgaben jetzt freigeben ▶», in der Steuerung «Aufgaben sofort freigeben (ohne Intro)».
7. **Schluss:** «System gerettet» zeigt die Schlussszene und hält den Beamer-Countdown an.

Für die nächste Runde: «Reset (PIN)» in der Steuerung (erzeugt einen neuen Beitrittscode) und die Tablets zurücksetzen.

### Wie kommt das Startsignal auf die Tablets?

Das Spiel hat keinen eigenen Server. Das Startsignal läuft deshalb über den freien Benachrichtigungsdienst [ntfy.sh](https://ntfy.sh): Die Spielleitung sendet eine kurze Nachricht an einen Kanal, dessen Name den Beitrittscode enthält, und die wartenden Tablets fragen alle 3 Sekunden nach. Übertragen werden nur der Beitrittscode und die Endzeit, **keine Namen, keine Punkte, keine Personendaten**. Tablets, die sich erst nach dem Start anmelden oder neu laden, erhalten das Signal ebenfalls (es bleibt 6 Stunden abrufbar).

* Voraussetzung: Beamer-Laptop und Tablets haben Internet, und das Schulnetz blockiert ntfy.sh nicht. Am besten vor der Lektion einmal testen.
* **Ohne Internet:** Auf jedem Tablet «Spielleitung: manuell starten (PIN)» tippen. Der Countdown startet dann mit 45:00 (oder synchron, wenn der Tablet-Link `?ende=HH:MM` verwendet wurde).
* Server und Kanalname stehen oben in `js/app.js` (`SIGNAL_SERVER`, `SIGNAL_PRAEFIX`). Wer will, kann einen eigenen ntfy-Server betreiben und dort eintragen.

### Alternative: synchronisieren über die Uhrzeit

Ohne Startsignal funktioniert weiterhin die Synchronisation über die Uhrzeit: Im Bereich «Countdown synchronisieren» ein Spielende wählen und auf den Tablets den Link `index.html?ende=10:45` öffnen. Dann braucht es keinen Beitrittscode, und jedes Tablet startet beim Klick auf «Spiel starten» sofort mit dem Countdown bis 10:45 (die Uhren der Geräte sollten automatisch gestellt sein). Ohne Beitrittscode und ohne `?ende` lässt sich ein Tablet nur mit der PIN starten.

### Spiel einstellen (vor dem Start)

Auf `spielleitung.html` im Bereich **«1. Spiel einstellen»**:

* **Schwierigkeit** Leicht, Mittel oder Schwer. Sie bestimmt das Labyrinth in Protokoll 2 und den **Netzwerkplan in Protokoll 3** (inklusive Tipps und Fallen). Druckt das passende Teamset (Bereich «Material herunterladen und drucken», die gewählte Stufe ist markiert). Der Override-Code ist auf allen Stufen 109.

| Stufe | Netzwerk Protokoll 3 | Richtiger Weg (Summe 109) | Schwierigkeit |
|---|---|---|---|
| Leicht | 14 Server, 4 infiziert, 25 Verbindungen | A, F, G, C, D, E, Z (6 Verbindungen) | Der direkte Weg durch die Mitte ist infiziert, der saubere Weg macht einen Bogen nach oben |
| Mittel | 18 Server, 5 infiziert, 32 Verbindungen | A, B, G, H, L, P, Q, Z (7 Verbindungen) | Alle kurzen Wege sind infiziert, der saubere Weg führt im Zickzack von oben nach unten |
| Schwer | 22 Server, 7 infiziert, 38 Verbindungen | A, Q, R, S, M, H, I, J, K, Z (9 Verbindungen) | Viele verlockende Abkürzungen, der saubere Weg beginnt ganz unten und steigt quer durchs Netz |

Fallen: Gibt ein Team die Summe eines infizierten Weges ein, der kürzer ist als der richtige (verlockende Abkürzung), warnt das Terminal «Euer Weg führt über einen infizierten Server!». Netzwerke ändern: `js/netzwerke.js` anpassen und mit `node werkzeuge/netzwerke_pruefen.js --hashes` prüfen (eindeutiger Weg) und die Fallen-Hashes für `js/app.js` erzeugen. Die Netzwerkbilder in den Teamsets müssen dann ebenfalls ersetzt werden.

* **Code für Protokoll 1:** Dreistelligen Code eures Zahlenschlosses (Kiste 1) und die Verschiebung der Chiffrierscheibe eingeben, «Übernehmen (PIN)». Die geheime Nachricht wird automatisch neu verschlüsselt («... DER ERSTE CODE LAUTET VIER EINS ACHT ...») und mit dem Startsignal an die Tablets geschickt. Auch die Help-Desk-Tipps (Unterschrift von NULLBYTE, Stellung der Scheibe) und das Druckblatt `druck/protokoll1.html` passen sich an. Übertragen werden nur Geheimtext und Hash, nie der Code. «Standard» stellt den Code aus `js/app.js` wieder her.
* Dauerhaft ändern: Im Bereich «Konfiguration erzeugen» den neuen Code und die Verschiebung eintragen. Die Ausgabe enthält `HASHES.protokoll1`, `P1_VERSCHIEBUNG` und `P1_GEHEIMTEXT` für `js/app.js`.

### Die drei Protokolle

* **Protokoll 1, Kryptografie (Papier):** Cäsar-Nachricht mit der Chiffrierscheibe entschlüsseln, dreistelligen Code im Terminal eingeben. Der Code öffnet das Zahlenschloss von Sicherheitskiste 1. Danach folgt eine freiwillige Bonusfrage (ein Versuch, plus 10 Punkte).
* **Protokoll 2, Algorithmen (Tablet):** Mit Scratch-ähnlichen Blöcken den Antiviren-Roboter ANTI-V durch ein Labyrinth programmieren. Er muss das Ziel erreichen und genau die Signaturen 3, 8, 5 einsammeln, ohne ein rotes Feld zu betreten. Bei Erfolg erscheint der Code für Sicherheitskiste 2.

### Protokoll 2: Regeln, Stufen und Effizienzbonus

* **Schleife ist Pflicht:** Ein Programm ohne «wiederhole bis Ziel erreicht» startet nicht («Ihr müsst mit der Schleife arbeiten»).
* **Blocklimit:** Pro Stufe darf das Programm höchstens so viele Blöcke haben, wie die Musterlösung braucht (ohne «wenn Programm startet»). Ist das Limit erreicht, werden die Blöcke in der Toolbox grau. Ein Programm ohne Schleife wäre viel zu lang und passt deshalb nie ins Limit. Die Anzeige «Blöcke 7 / 15» zeigt den Stand.
* **Energie:** ANTI-V darf nur so viele Felder gehen, wie der richtige Weg lang ist («Energie 16 / 16»). Umwege und Hin-und-her-Laufen enden mit «Energie leer!».
* **Effizienzbonus:** Wer Protokoll 2 löst, erhält 10 Punkte plus 5 Punkte für jeden Block unter dem Limit. Die Musterlösung gibt also 10 Punkte, eine kürzere Lösung mehr. Teams dürfen nach dem Lösen weiter optimieren: Ein neuer Rekord bringt die Differenz als Zusatzpunkte.
* **Schwierigkeitsstufen** (Auswahl auf `spielleitung.html` im Bereich «Spielablauf», wird mit dem Startsignal an die Tablets geschickt; alternativ per Link `index.html?stufe=leicht`):

| Stufe | Labyrinth | Nötige Idee | Blocklimit | Energie | Kürzeste bekannte Lösung |
|---|---|---|---|---|---|
| Leicht | Gang mit Ecken, keine roten Felder, Toolbox ohne Operatoren | falls vorne frei, dann vor, sonst rechts drehen | 5 | 38 | 5 Blöcke |
| Mittel | Rechte-Hand-Labyrinth, rote Felder nur als Falle für falsche Regeln | Rechte-Hand-Regel | 9 | 16 | 8 Blöcke |
| Schwer (Standard) | wie Mittel, aber ein rotes Feld direkt rechts am Weg | Rechte-Hand-Regel mit «und» und «nicht» | 15 | 16 | 11 Blöcke |

Die Signaturen sind auf allen Stufen 3, 8, 5, der Code für Kiste 2 bleibt also gleich. Die Musterlösungen aller Stufen stehen in der Lösungsansicht der Spielleitung (PIN). Die Tipps im Help-Desk passen sich der Stufe an.
* **Protokoll 3, Netzwerke (Papier):** Auf dem Netzwerkplan den kürzesten Weg ohne infizierte Server finden, die Kennzahlen addieren und als Override-Code eingeben. Danach den roten Buzzer «OVERRIDE AUSLÖSEN» drücken.

### Help-Desk und Punkte

* Start mit 100 Punkten, plus 20 pro gelöstem Protokoll, minus 20 pro Joker, plus 1 Punkt pro volle Minute Restzeit beim Override, plus 10 für die Bonusfrage, plus Effizienzbonus in Protokoll 2 (10 Punkte plus 5 pro eingespartem Block).
* Jedes Team hat 3 Joker. Ein Joker zeigt die nächste Tippstufe (1, 2, 3) des aktuellen Protokolls.
* Wird in einem Protokoll 5 Minuten lang nichts gelöst, erscheint Tippstufe 1 gratis (einmal pro Protokoll).
* Punkte, Joker, Teamname und Countdown sind immer in der Kopfzeile sichtbar.

### NULLBYTE und das Vorlesen

* **Botschaft von NULLBYTE:** Fehlt `videos/intro.mp4`, erscheint auf dem Beamer die Maske von NULLBYTE (`img/maske.svg`, eigene Zeichnung) und die Botschaft tippt sich Zeile für Zeile. Dabei nennt NULLBYTE auch sein Motiv: Die Gruppe will beweisen, dass an der Schule niemand auf Datensicherheit achtet (schwache Passwörter, offene Computer, unvorsichtige Klicks). Der Text steht in `js/app.js` unter `TEXTE.nullbyte`.
* **Vorlesen (Text-to-Speech):** Alle festen Texte (Botschaft von NULLBYTE, Story-Szenen, Story-Texte und Tipps aller Protokolle und Stufen) liegen als fertige Sprachaufnahmen in `audio/tts/`. Sie wurden mit der neuronalen Stimme **«Thorsten»** (Thorsten-Voice, Lizenz CC0) und der freien Sprachsynthese Piper erzeugt. NULLBYTE spricht mit der Variante «wütend», tiefer gestimmt und mit Roboter-Effekt. Vorteile: natürliche Aussprache, auf jedem Gerät gleich, ohne Internet, ohne Kosten und ohne Datenschutzfragen. Im Terminal haben die Story-Texte und der Help-Desk einen Knopf 🔊, auf dem Beamer wird automatisch vorgelesen.
* **Ersatz:** Fehlt für einen Text eine Aufnahme (zum Beispiel nach einer Textänderung), liest die Sprachausgabe des Browsers vor. Dabei werden neuronale Stimmen bevorzugt (in Edge «Microsoft … Online (Natural)», auf dem iPad «Premium» oder «Erweitert», sofern installiert), zuerst Deutsch (Schweiz), dann Deutsch (Deutschland).
* Auf dem iPad gibt es Ton nur nach einer Berührung und nur, wenn der Stummschalter aus ist.

#### Sprachaufnahmen neu erzeugen (nach Textänderungen)

1. Python 3 und ffmpeg installieren, dann `pip install piper-tts numpy`.
2. Die beiden Stimmen herunterladen und in `werkzeuge/stimmen/` entpacken:
   * https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-de_DE-thorsten-high.tar.bz2
   * https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-de_DE-thorsten_emotional-medium.tar.bz2
3. Im Projektordner `python3 werkzeuge/tts_erzeugen.py` ausführen. Das Skript liest die Texte direkt aus `js/app.js`, erzeugt nur fehlende Aufnahmen, löscht veraltete und schreibt `audio/tts/verzeichnis.json`.
4. Aussprache anpassen: In `werkzeuge/tts_erzeugen.py` steht die Liste `AUSSPRACHE` (zum Beispiel «NULLBYTE» wird als «Nullbeit» gesprochen). Mit `--alle` werden alle Aufnahmen neu erzeugt.

Warum keine Online-Dienste wie ElevenLabs, OpenAI oder Google? Diese brauchen einen geheimen API-Schlüssel. Auf GitHub Pages wäre er für alle sichtbar und könnte missbraucht werden. Ausserdem würden Texte an fremde Server geschickt. Wer trotzdem eine andere Stimme will, kann die MP3-Dateien in `audio/tts/` mit beliebigen Werkzeugen ersetzen, solange die Dateinamen gleich bleiben.

### Bei 00:00

Das Terminal zeigt «SYSTEM GELÖSCHT», alle Eingaben sind gesperrt, der Punktestand bleibt sichtbar.

### Tablets zurücksetzen

Auf dem Tablet unten rechts auf «Spielleitung» tippen und die PIN eingeben (Standard **4711**). Danach wählt ihr «Spiel zurücksetzen» (mit Bestätigung) oder «Zur Spielleitungsansicht», um vom Tablet aus die Spielleitung zu öffnen. Der Spielstand liegt nur im Browser des jeweiligen Geräts (localStorage).

## Anpassen

Alle Einstellungen stehen gut kommentiert ganz oben in den Dateien:

* `js/app.js`: PIN, Spieldauer, Joker-Kosten (Standard 20 Punkte), Botschaft von NULLBYTE, Stimmen fürs Vorlesen, Punkte, Anzahl Joker, Gratis-Tipp-Zeit, Hashes der Codes, Story-Texte und Tipps.
* `js/maze.js`: die drei Stufen mit Labyrinth, Zahlen auf den Feldern, Startrichtung, Blocklimit, Energie, erlaubten Blöcken und Musterlösung, dazu die Standardstufe (`STANDARD_STUFE`). Wer ein Labyrinth ändert, muss Energie und Blocklimit neu bestimmen (Musterlösung einmal durchlaufen lassen).
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

Das Hintergrundbild der Spielanweisung (`img/hintergrund-anweisung.webp`) wurde von der Spielleitung beigesteuert; vor einer Veröffentlichung prüfen, ob seine Lizenz mit CC BY-SA 4.0 vereinbar ist, sonst durch ein eigenes Bild mit gleichem Dateinamen ersetzen.

Enthaltene Fremdsoftware und Medien: [Blockly](https://github.com/RaspberryPiFoundation/blockly) (Apache License 2.0, siehe `lib/blockly/LICENSE`). Sprachaufnahmen erzeugt mit [Piper](https://github.com/rhasspy/piper) (MIT) und der Stimme [Thorsten-Voice](https://github.com/thorstenMueller/Thorsten-Voice) von Thorsten Müller (CC0).
