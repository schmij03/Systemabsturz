# Testplan «Systemabsturz»

Vor jedem Einsatz einmal auf einem Tablet durchspielen (Safari auf iPad und Chrome auf Android). Dauer etwa 15 Minuten.

## Leitfaden Spielleitung

1. Kachel «Leitfaden Spielleitung» öffnen. Erwartung: 9 Seiten im Dossier-Layout, Stufe der Spielleitung vorgewählt, auf Seite 4 der Hinweis «Geschützt» statt der Lösungen, nirgends die PIN.
2. Falsche PIN eingeben, «Lösungen einfügen». Erwartung: «Falsche PIN.».
3. PIN 4711. Erwartung: Seite 4 zeigt Codes (Kiste 1, Kiste 2, Override), Schlüssel, Klartext und Fallen der gewählten Stufe. Bei eigenem Code der Spielleitung steht dieser Code.
4. Stufe umstellen: Lösungen, Tipps und Abzeichen passen sich an. Drucken: 9 A4-Seiten, nichts abgeschnitten.
5. «Als HTML herunterladen»: Datei öffnet ohne Internet, mit Lösungen nur, wenn sie vorher eingefügt waren.

## Uhrzeit und Geräte

1. Spielleitung frisch öffnen. Erwartung: Stufe «Mittel» ist vorgewählt, Szene «Alarm» zeigt «Soeben, um HH:MM Uhr, ist das Schulnetz zusammengebrochen» mit der aktuellen Uhrzeit.
2. «▶ Spiel starten» drücken und die Uhrzeit notieren. Erwartung: Die Botschaft von NULLBYTE nennt dieselbe Uhrzeit («Soeben, um HH:MM Uhr, haben wir euch eine Nachricht geschickt»). Vorgelesen wird ohne Uhrzeit.
3. Nach der Freigabe auf dem Gerät eines Teams Protokoll 1 öffnen. Erwartung: «EINGEHENDE NACHRICHT, HH:MM UHR» und «Diese Nachricht erschien soeben, um HH:MM Uhr, …» mit der Startzeit.
4. Ein Team spielt auf einem Laptop mit Maus. Erwartung: Alles lässt sich mit Klicks bedienen, die Blöcke in Protokoll 2 lassen sich ziehen.

## Unterrichtsinfo

1. `spielleitung.html` mit leerem Spielstand öffnen. Erwartung: Fenster «Einsatz im Unterricht» mit Hinweis «Nur für die Lehrperson», Abschnitt A offen, B bis E zu. Steuerung dahinter nicht bedienbar, Hintergrund scrollt nicht, kein Ton, kein Vollbild.
2. Tab mehrmals drücken. Erwartung: Der Fokus bleibt im Fenster.
3. Schliessen nacheinander mit «Weiter zur Spielleitung», dem Kreuz und der Escape-Taste (Seite dazwischen neu laden). Erwartung: Alle drei schliessen gleich, danach ist die Steuerung normal bedienbar.
4. Knopf «ⓘ Unterrichtsinfo» in der Kopfleiste. Erwartung: Fenster öffnet, nach dem Schliessen liegt der Fokus wieder auf dem Knopf.
5. Abschnitt B auf dem iPad im Querformat öffnen. Erwartung: Tabelle lesbar, Text bricht sauber um, das Fenster scrollt.
6. «Drucken oder als PDF sichern». Erwartung: Nur der Fensterinhalt mit allen fünf Abschnitten, A4, hell.
7. Spiel freigeben, dann die Seite neu laden. Erwartung: kein Fenster, Countdown läuft weiter. «Unterrichtsinfo» öffnet es trotzdem, der Countdown läuft dabei weiter.
8. Offline: Seite einmal online laden, WLAN aus, neu laden. Erwartung: Fenster erscheint mit allen Texten.

## Vorbereitung und Spielstart

1. Auf `spielleitung.html` im Reiter «1 Vorbereiten» unter «Material drucken» die Kachel «Gesamtes Dossier» öffnen. Erwartung: Die Stufe der Spielleitung ist vorgewählt, oben lässt sie sich umstellen. Drucken. Erwartung: 7 A4-Seiten, die Chiffrierscheiben in voller Grösse (gross 172 mm, klein 142 mm), Seite 7 (Netzwerkplan) quer und farbig. «Als HTML herunterladen», die Datei ohne Internet öffnen: gleiche 7 Seiten.
2. «▶ Spiel starten». Erwartung: Vollbild, Botschaft von NULLBYTE mit Maske und Stimme.
3. Nach der Botschaft (oder Taste → bzw. Leertaste): Spielanweisung mit grossem Beitrittscode darüber, Absätze werden nacheinander vorgelesen und grün hervorgehoben. Es sind keine Knöpfe sichtbar. Taste R liest nochmals vor, → oder Enter gibt die Aufgaben sofort frei.
4. Während der Anweisung auf dem Testtablet `index.html` öffnen, Teamname und Beitrittscode eingeben, «Spiel starten», «Wir sind bereit». Erwartung: «Warten auf die Spielleitung», Aufgaben nicht sichtbar.
5. Ende der Anweisung. Erwartung Beamer: Countdown läuft, Story «Euer Auftrag», Beitrittscode klein oben. Erwartung Tablet nach wenigen Sekunden: «AUFGABEN EMPFANGEN», dann Protokoll 1 mit demselben Countdown, 100 Punkte, drei Joker.
6. Ein zweites Tablet erst jetzt anmelden. Erwartung: Es startet sofort mit derselben Restzeit.
7. Notfall ohne Internet: WLAN auf einem Tablet ausschalten, anmelden. Erwartung: rote Meldung «Keine Verbindung». «Spielleitung: manuell starten (PIN)» startet das Tablet.
8. Lautstärke prüfen: Beim Tippen auf das Ziffernfeld ist ein Klick zu hören.

## Spiel einstellen

Die Steuerung zeigt oben immer Phase, Beitrittscode, Stufe und Restzeit. Der passende Reiter öffnet sich automatisch: vor dem Start «1 Vorbereiten», nach der Freigabe «2 Spiel durchführen», nach «System gerettet» oder Zeitablauf «3 Nach dem Spiel».

1. Auf der Spielleitung Stufe «Leicht» wählen, Code 418 eingeben, «Übernehmen (PIN)». Erwartung: «Verschiebung 4 (A wird zu E)», Vorschau zeigt den neuen Geheimtext, Unterschrift RYPPFCXI. Stufe auf «Mittel» stellen: Verschiebung 6, Unterschrift TARRHEZK. Auf «Schwer»: Verschiebung 8, Unterschrift VCTTJGBM. Danach wieder «Leicht».
2. Tablet anmelden und Spiel freigeben. Erwartung: Protokoll 1 zeigt denselben Geheimtext, 729 ergibt «ZUGRIFF VERWEIGERT», 418 öffnet Protokoll 1.
3. `druck/protokoll1.html` öffnen. Erwartung: derselbe Geheimtext.
4. Protokoll 3 auf Stufe Leicht: 100 ergibt die Warnung «infizierter Server», 111 ergibt «OVERRIDE ABGELEHNT», 109 den Buzzer. Tipp 3: «über F und G, dann nach oben über C, D und E».
5. «Standard» stellt Code 729 wieder her (Verschiebung weiterhin nach Stufe).
6. Ohne Spielleitung: `index.html?stufe=mittel` öffnen und manuell starten. Erwartung: Geheimtext endet auf TARRHEZK, 729 öffnet Protokoll 1, Tipp 3 nennt «innen G».

## Netzwerkpläne (Protokoll 3) prüfen

Automatisch: `node werkzeuge/netzwerke_pruefen.js` (meldet einen Fehler, wenn der kürzeste saubere Weg nicht eindeutig ist).

* Leicht: A, F, G, C, D, E, Z = 12 + 13 + 12 + 23 + 10 + 15 + 24 = **109**. Fallen zum Beispiel 100, 115, 117.
* Mittel: A, B, G, H, L, P, Q, Z = 12 + 14 + 9 + 17 + 14 + 14 + 5 + 24 = **109**. Fallen zum Beispiel 096, 102, 103.
* Schwer: A, Q, R, S, M, H, I, J, K, Z = 12 + 4 + 6 + 7 + 9 + 7 + 16 + 16 + 8 + 24 = **109**. Fallen zum Beispiel 066, 074, 104.

## Protokoll 1

| Schritt | Erwartung |
|---|---|
| 123 eingeben, Bestätigen | Fehlerton, «ZUGRIFF VERWEIGERT», Ziffernfeld 2 Sekunden gesperrt |
| 729 eingeben, Bestätigen | Erfolgston, «PROTOKOLL 1 GEKNACKT. Code für Sicherheitskiste 1: 729», 120 Punkte, Tab 2 freigeschaltet |
| Bonusfrage: 25 | «Richtig! Plus 10 Punkte.», 130 Punkte, kein zweiter Versuch möglich |

## Protokoll 2 (wichtigster Test)

### Test A: Musterlösung von Hand bauen

Auf Stufe Schwer (Spielleitung «Schwer» wählen oder `index.html?stufe=schwer`). Standard ist Mittel.

Das Programm mit dem Finger aus der Toolbox ziehen (Touch-Drag testen!) und unter «wenn Programm startet» anhängen:

```
wiederhole bis Ziel erreicht
  falls (rechts frei? und nicht rechts infiziert?) dann
    drehe dich nach rechts
    gehe 1 Feld vor
  sonst
    falls (vorne frei? und nicht vorne infiziert?) dann
      gehe 1 Feld vor
    sonst
      drehe dich nach links
```

«Programm starten» drücken. Erwartung:

* ANTI-V läuft den Weg (1,1) bis (8,1), dann (8,2), (7,2), (7,3) bis (7,6), (8,6), (8,7), (8,8).
* Der jeweils ausgeführte Block leuchtet gelb.
* Die Leiste zeigt nacheinander **Signaturen: 3 8 5**, genau diese drei Zahlen in dieser Reihenfolge.
* Erfolgston und «VIRUS GEFUNDEN. Signaturen 3, 8, 5 isoliert. Code für Sicherheitskiste 2: 642».
* Zusatz: «Euer Programm: 15 Blöcke (Limit 15). Effizienzbonus: plus 10 Punkte.»
* Tab 3 wird freigeschaltet, 160 Punkte (mit Bonusfrage und Effizienzbonus, ohne Joker).

### Test B: Programm ohne «nicht»

Im Programm aus Test A die beiden «nicht»-Blöcke und die «und»-Blöcke entfernen, sodass nur noch «rechts frei?» und «vorne frei?» als Bedingungen stehen. «Zurücksetzen», dann «Programm starten». Erwartung:

* Die Leiste zeigt «3 8 _».
* ANTI-V biegt bei (7,5) nach rechts ab und betritt das rote Feld **(8,5)**.
* Absturz-Animation, Alarmton, Meldung «ANTI-V INFIZIERT. Prüft eure Bedingungen.»

### Weitere Kontrollen

| Test | Erwartung |
|---|---|
| Nur «drehe dich nach links» und «gehe 1 Feld vor» anhängen | ANTI-V stösst an die Mauer, «Mauer!» |
| «wiederhole bis Ziel erreicht» mit nur «drehe dich nach rechts» | Abbruch: «Endlosschleife? ANTI-V dreht sich im Kreis.» |
| Nur «gehe 1 Feld vor» ohne Schleife | «Ihr müsst mit der Schleife «wiederhole bis Ziel erreicht» arbeiten.» |
| Mehr als 15 Blöcke ziehen (Stufe schwer) | Ab 15 Blöcken werden die Blöcke in der Toolbox grau, Anzeige «Blöcke 15 / 15» gelb |
| Kürzere Lösung mit 11 Blöcken: wiederhole { falls (rechts frei? und nicht rechts infiziert?) dann drehe rechts }, danach { falls vorne frei? dann gehe vor, sonst drehe links } | «Neuer Rekord! Plus 20 Punkte.» |

### Stufen leicht und mittel

1. Auf der Spielleitung die Stufe «Leicht» wählen und ein Tablet starten (oder `index.html?stufe=leicht`). Erwartung: Spirallabyrinth, Toolbox ohne Operatoren, «Blöcke 0 / 5», «Energie 38 / 38».
2. Programm: wiederhole bis Ziel erreicht { falls vorne frei? dann gehe 1 Feld vor, sonst drehe dich nach rechts }. Erwartung: 3, 8, 5, Code 642, Effizienzbonus 10.
3. Gleiches Programm mit «drehe dich nach links». Erwartung: «Energie leer!».
4. Stufe «Mittel»: Musterlösung ohne «und» und «nicht» (9 Blöcke) erreicht das Ziel mit 3, 8, 5.
| «Schritt für Schritt» mehrmals drücken | Je ein Block wird ausgeführt und hervorgehoben |
| Tempo-Regler verschieben | Animation wird schneller oder langsamer |
| Seite neu laden | Das gebaute Programm ist noch da |

## Protokoll 3

| Schritt | Erwartung |
|---|---|
| 104 (Stufe schwer, Abkürzung über rote Server) | Alarmton, «ACHTUNG: Euer Weg führt über einen infizierten Server!» |
| 999 | «OVERRIDE ABGELEHNT. Zählt Wege und Kennzahlen nach.» |
| 109 | Fanfare, grosser roter Knopf «OVERRIDE AUSLÖSEN» |
| Knopf drücken | «SYSTEM WIEDERHERGESTELLT. Ihr habt die Schule gerettet!», Restzeit, Zeitbonus, Endpunktestand, Countdown steht still |

## Help-Desk

| Schritt | Erwartung |
|---|---|
| Help-Desk öffnen, Joker einlösen | Bestätigungsdialog, danach Tipp Stufe 1 sichtbar, minus 20 Punkte, ein Joker weniger in der Kopfzeile |
| 5 Minuten in einem Protokoll nichts lösen | Hinweis «Gratis-Tipp freigeschaltet», Stufe 1 ist mit «(gratis)» markiert, kein Joker verbraucht |
| Alle 3 Joker verbrauchen | «Keine Joker mehr. Wendet euch an die Spielleitung.» |

## Vorlesen und NULLBYTE

| Schritt | Erwartung |
|---|---|
| Im Terminal auf 🔊 neben dem Story-Text tippen | Der Text wird auf Deutsch vorgelesen, nochmals tippen stoppt |
| Help-Desk, «Tipps vorlesen» | Die freigeschalteten Tipps werden vorgelesen |
| Spielleitung: «Botschaft von NULLBYTE» | Maske erscheint, Botschaft mit Motiv tippt sich Zeile für Zeile und wird mit tiefer Stimme vorgelesen |
| Spielleitung: Story-Knopf wechseln | Story wird automatisch vorgelesen (abschaltbar) |

## Zeitablauf und Reset

1. Auf einem zweiten Tablet die Startseite mit einer Endzeit in 2 Minuten öffnen (zum Beispiel `index.html?ende=10:02`). Nach Ablauf: «SYSTEM GELÖSCHT», Eingaben gesperrt, Punkte bleiben sichtbar.
2. Unten rechts «Spielleitung», PIN 4711. Erwartung: Auswahl «Spiel zurücksetzen» oder «Zur Spielleitungsansicht». «Zur Spielleitungsansicht» öffnet spielleitung.html. «Spiel zurücksetzen», dann «Löschen». Erwartung: zurück auf der Startseite, Spielstand leer.
3. Offline-Test: Seite einmal online laden, dann WLAN ausschalten und neu laden. Das Terminal und die Blöcke funktionieren weiter.


## Regressionen nach dem Code-Audit

Vor dem Gerätetest `node --test tests/*.test.js` ausführen.

* Startsignal empfangen: Der Vorleseknopf von Protokoll 1 bleibt sichtbar und bedienbar.
* Kurz vor 00:00 eine Codeprüfung oder den letzten Blockly-Schritt auslösen: Nach Ablauf keine zusätzlichen Punkte und keine neu freigeschalteten Protokolle.
* Blockly unmittelbar nach Erreichen des Ziels zurücksetzen: Keine verspätete Auswertung des alten Durchlaufs.
* Joker-Dialog offen lassen, bis ein Gratis-Tipp erscheint: Bestätigen darf keinen anderen Tipp ungefragt kaufen.
* Schwierigkeit Schwer und eigenen Schlosscode einstellen, Runde zurücksetzen: Auswahl, Vorschau, Druckmaterial und Startsignal behalten dieselben Einstellungen; Lösungen werden verborgen.
* Bei `?ende=HH:MM` den Beamer stoppen und neu laden: Die gestoppte Restzeit bleibt erhalten.
* PIN-Dialog per Enter bestätigen, per Escape abbrechen und mit Tab bedienen. Währenddessen dürfen Beamer-Tastenkürzel nicht reagieren.
* Vorlesen mehrfach starten und stoppen, sowohl mit Aufnahme als auch Browserstimme; Intro und Anweisung dürfen nicht hängen bleiben.
* Druckseite als erste Seite öffnen: Offline-Dateien müssen über den Service Worker im Projektwurzel geladen werden.
* Nach vollständigem ersten Online-Laden und Neuladen WLAN deaktivieren: Startseite, Terminal und Druckseiten öffnen; manuellen Start prüfen.
* Vor dem Einsatz iPad/Safari und Chrome/Edge im Querformat testen, insbesondere Touch-Blockly und Audiowiedergabe. Dossier/Leitfaden weiterhin visuell auf A4 prüfen.
