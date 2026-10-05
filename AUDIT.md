# Code-Audit «Systemabsturz»

Ausgangsstand: `main`, 3. Oktober 2026.

Geprüft wurden die eigenen HTML-/JavaScript-Dateien, Spielzustände, Blockly-Interpreter und Labyrinthe, Netzwerkdaten, Offline-Strategie, Druckgeneratoren, TTS-Werkzeuge und Dokumentation. Die eingebundene Blockly-Bibliothek wurde nicht auf interne Sicherheitslücken auditiert. Ein Code-Audit garantiert keine vollständige Fehlerfreiheit.

## Behobene Fehler und Optimierungen

| Bereich | Befund | Änderung |
|---|---|---|
| Spielende | Asynchrone Code-/Blockly-Prüfungen konnten nach 00:00 Punkte oder Lösungen hinzufügen. Nach dem Sieg waren weitere Aktionen nicht zentral gesperrt. | Zustand nach asynchronen Prüfungen erneut prüfen; Warten, Sieg und Ablauf sperren Änderungen. |
| Blockly | Bereits geplante Ziel-/Infektionsaktionen blieben nach Reset oder Stop aktiv. Die Blockzahl konnte inzwischen zu einem anderen Programm gehören. | Durchlaufkennung, abbrechbarer Effekttimer und eingefrorene Auswertungsdaten. |
| Protokoll 1 | Die Aktualisierung der Absturzuhrzeit entfernte den Vorleseknopf. | Vorhandenen Knopf beim Textwechsel erhalten. |
| Joker | Ein inzwischen gratis freigeschalteter Tipp änderte den Kaufgegenstand eines offenen Bestätigungsdialogs. Bezahlte Tipps wurden später als gratis markiert. | Kauf nur bei unverändertem Protokoll/Tipp; gratis nur bei tatsächlicher Gratis-Freischaltung. |
| Reset | Einstellungen wurden gelöscht, Auswahl/Vorschau blieben aber auf dem alten Stand. | Schwierigkeit und eigener Schlosscode bleiben erhalten; Anzeigen aktualisieren, Intro stoppen, Lösungen verbergen. |
| Zeit | Beim Aufrunden von Minute 56–59 sprang die vorgeschlagene Endzeit eine Stunde zurück. Neuladen mit Endzeitparameter reaktivierte gestoppte Beamer-Uhren. | Datum korrekt aufrunden; aktive Runde beim Neuladen erhalten. |
| Startsignal | Langsame Abfragen überlappten unbegrenzt; fremde oder veraltete Daten wurden ungeprüft übernommen. | Acht Sekunden Timeout, höchstens eine Abfrage gleichzeitig, Plausibilitäts-/Typprüfung und Schutz vor verspäteten Antworten nach manuellem Start. Keine Authentifizierung des Senders; siehe unten. |
| Offline | Aktivierung löschte auch Caches anderer Apps derselben Domain. Updates konnten vor Abschluss des Schreibens beendet werden. | Cache-Namensraum je Projektpfad; nur eigene alte Versionen löschen; Schreibvorgänge an Ereignislebensdauer binden. Alte unzugeordnete Legacy-Caches bleiben vorsichtshalber erhalten. |
| Offline | HTTP-Fehler ersetzten verfügbare Seiten durch Fehlerantworten; Query-Parameter erzeugten Cache-Duplikate. | Vorhandene Seite bei HTTP-Fehler nutzen; statische Cache-Schlüssel ohne Query. |
| Druckseiten | Service Worker wurde relativ zu `druck/` unter einem falschen Pfad registriert. Fehlerseiten konnten als CSS heruntergeladen werden. | Worker-Pfad aus der Adresse von `app.js` ermitteln; HTTP-Status des CSS prüfen. |
| Audio | Abbruch von HTML-Audio/Browserstimme konnte wartende Vorlese-Aufträge ungelöst lassen. | Abbruch löst das Promise auf; Sicherheitstimer wird entfernt; abgebrochene Web-Audio-Aufträge nach `resume()` nicht mehr starten. |
| Bedienung | PIN-Dialog ohne Enter/Escape/Fokusbegrenzung; Tastendrücke konnten Beamer-Aktionen auslösen. Ziffernfeld blieb nach Prüfungsfehler gesperrt. | Dialog-Tastaturführung, Fokus-Rückgabe, Fehlerbehandlung und Wiederholungsmöglichkeit. |
| Speicher | Bei gesperrtem/vollen lokalem Speicher führte die Anmeldung ins Terminal ohne gespeicherten Spielstand. | Anmeldung bleibt mit Fehlermeldung sichtbar; Speicherfehler während des Teamspiels werden gemeldet. |
| Konfiguration | Bonus-/Override-/Kistencodes mit unpassender Länge konnten generiert werden; PIN-Sonderzeichen konnten ungültigen JavaScript-Code erzeugen. | Längen und Signaturformat prüfen; PIN als JSON-String ausgeben. |
| Dokumentation | Falsche Standardstufe, kaputte Tabelle, falscher Netzwerk-Testcode, unzutreffende Sicherheits-/Übertragungsbehauptungen. | README und Testplan korrigiert; PIN-Schutz realistisch beschrieben. |

## Nachweise und Grenzen

* 44 automatisierte Tests bestehen: `node --test tests/*.test.js` (Node.js 24 in der Prüfumgebung).
* Zehn ausgewählte Regressionstests scheitern am unveränderten Ausgangsstand und bestehen mit den Korrekturen.
* Alle drei Musterprogramme erreichen im eigenen Interpreter das Ziel mit Signaturen 3, 8, 5, passender Energie und Blockzahl.
* Alle drei Netzwerke haben genau einen kürzesten sauberen Weg mit Summe 109. Die hinterlegten Fallen-Hashes stimmen mit den berechneten Wegen überein.
* Alle 55 exportierten Vorlesetexte haben einen Manifest-Eintrag und eine nichtleere MP3-Datei im Repository. Audioqualität wurde nicht angehört.
* JavaScript-Syntax und Diff-Format wurden geprüft. Druck-/Rätselinhalte und Layouts der Teamsets wurden nicht geändert, daher keine Neugenerierung der vorbereiteten Teamsets.
* Kein vollständiger Browser-, Geräte- oder visueller Drucktest: Playwright war vorhanden, Chromium nicht; der Browserdownload lieferte kein verwendbares Archiv. DOM-/Cache-Attrappen prüfen Verhalten, nicht Rendering, Touch, tatsächliche Browser-Speicherregeln oder Audio-Autoplay.
* Kein echtes ntfy-Startsignal gesendet; Netzwerkverhalten ist simuliert. Vor Unterrichtseinsatz bleibt ein Durchlauf auf den tatsächlichen Geräten erforderlich.

## Priorisierte Verbesserungsvorschläge

| Priorität | Vorschlag | Nutzen und konkrete Umsetzung |
|---|---|---|
| Hoch | Technikcheck vor Spielbeginn | Anzeige für lokalen Speicher, Audio, Blockly, vollständigen Offline-Cache und Erreichbarkeit des Startdienstes. Fehlende Voraussetzungen vor dem Austeilen erkennen. |
| Hoch | Startkanal besser schützen | Der Beitrittscode bestimmt derzeit einen öffentlich beschreibbaren ntfy-Kanal. Für vertrauenswürdige Freigaben authentifizierten Relay-/ntfy-Dienst oder signierte Nachrichten planen. Geheime Schreibschlüssel dürfen nicht in der statischen App liegen. |
| Mittel | Spielstände sichern und wiederherstellen | Zusätzlich zur neuen Fehlermeldung einen Export/Import und einen Speichercheck für die Spielleitung anbieten. So kann ein defektes Gerät während der Runde ersetzt werden. |
| Hoch | Browserprüfungen automatisieren | Playwright-Durchlauf für Anmeldung, alle Protokolle, Timer, Reset und Offline-Betrieb; zusätzlich echter iPad-Test. Node-Tests bei jedem Pull Request als CI-Gate ausführen. |
| Mittel | Offline-Status und kontrollierte Updates | «Offline bereit» erst nach erfolgreichem Caching aller erforderlichen Dateien anzeigen. Neue Versionen zwischen Runden aktivieren, damit während des Spiels keine alten/neuen Dateien gemischt werden. |
| Mittel | Offline-Notstart vollständig konfigurieren | Beim manuellen Start auch Stufe, Endzeit und eigenen P1-Code über eine klare Lehrpersonenmaske bzw. vorbereiteten Offline-Konfigurationsimport wählen. Der aktuelle Notstart übernimmt keine Einstellungen von einem unerreichbaren Beamer. |
| Mittel | Konfigurationsgenerator absichern | Über die jetzt geprüften Code-Längen und Signaturformate hinaus die Beziehungen zu Labyrinth/Netzwerk validieren. Eine neue Konfiguration vor Übernahme durch Testläufe prüfen. |
| Mittel | Zustände und Module trennen | Das grosse `app.js` schrittweise in Spielzustand, Signal, Audio und Ansichten teilen. Gespeicherte Spielstände mit Schema-/Versionsprüfung und gezielter Migration versehen. |
| Mittel | Barrierefreiheit vervollständigen | Help-Desk und Endbildschirme mit sauberer Fokusführung, Tastaturbedienung der Tabs sowie Screenreader-Tests prüfen. PIN-Dialoge sind in diesem PR verbessert. |
| Mittel | Teamsicht für die Spielleitung | Optional Beitritt/Bereitschaft/Protokollstatus anzeigen. Dafür wäre ein Rückkanal samt bewusster Entscheidung zu Datenhaltung und Offline-Verhalten nötig. |
| Niedrig | Didaktische Auswertung | Nach dem Spiel kurze Reflexion zu Verschlüsselung, Schleifen und Routing; Lösungsschritte statt ausschliesslich Punkte vergleichen. |

Die PIN ist eine Bedienhürde, keine Sicherheitsgrenze: Quellcode, Prüfwerte und Spielzustand sind auf den Geräten verfügbar. Für einen lokalen Unterrichts-Escape-Room kann das passen; für manipulationssichere Wettbewerbe wären serverseitige Prüfungen notwendig.
