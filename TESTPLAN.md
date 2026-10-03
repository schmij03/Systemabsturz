# Testplan «Systemabsturz»

Vor jedem Einsatz einmal auf einem Tablet durchspielen (Safari auf iPad und Chrome auf Android). Dauer etwa 15 Minuten.

## Vorbereitung und Spielstart

1. `spielleitung.html` auf dem Beamer-Laptop öffnen. Erwartung: Auf der Leinwand steht ein Spielcode aus fünf Buchstaben.
2. Auf dem Testtablet `index.html` öffnen, Teamnamen und Spielcode eingeben, «Spiel starten». Erwartung: «Warten auf die Spielleitung», Status «Verbunden. Warte auf das Startsignal». Die Aufgaben sind nicht sichtbar.
3. «Wir sind bereit» tippen. Erwartung: «Bereit ✓ Ton ist eingeschaltet.»
4. Auf dem Laptop «▶ Spiel starten». Erwartung: Video oder Botschaft von NULLBYTE mit Maske und Stimme. Danach startet der Beamer-Countdown, die Story «Euer Auftrag» erscheint, Status «Aufgaben freigegeben».
5. Erwartung auf dem Tablet innerhalb weniger Sekunden: «AUFGABEN EMPFANGEN», dann Protokoll 1 mit Countdown (gleich wie auf dem Beamer), 100 Punkte, drei Joker.
6. Ein zweites Tablet erst jetzt anmelden. Erwartung: Es startet sofort mit derselben Restzeit.
7. Notfall ohne Internet: WLAN auf einem Tablet ausschalten, anmelden. Erwartung: rote Meldung «Keine Verbindung». «Spielleitung: manuell starten (PIN)» startet das Tablet.
8. Lautstärke prüfen: Beim Tippen auf das Ziffernfeld ist ein Klick zu hören.

## Protokoll 1

| Schritt | Erwartung |
|---|---|
| 123 eingeben, Bestätigen | Fehlerton, «ZUGRIFF VERWEIGERT», Ziffernfeld 2 Sekunden gesperrt |
| 729 eingeben, Bestätigen | Erfolgston, «PROTOKOLL 1 GEKNACKT. Code für Sicherheitskiste 1: 729», 120 Punkte, Tab 2 freigeschaltet |
| Bonusfrage: 25 | «Richtig! Plus 10 Punkte.», 130 Punkte, kein zweiter Versuch möglich |

## Protokoll 2 (wichtigster Test)

### Test A: Musterlösung von Hand bauen

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
| 065 (oder 079, 111) | Alarmton, «ACHTUNG: Euer Weg führt über einen infizierten Server!» |
| 123 | «OVERRIDE ABGELEHNT. Zählt Wege und Kennzahlen nach.» |
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
2. Unten rechts «Spielleitung», PIN 4711, «Löschen». Erwartung: zurück auf der Startseite, Spielstand leer.
3. Offline-Test: Seite einmal online laden, dann WLAN ausschalten und neu laden. Das Terminal und die Blöcke funktionieren weiter.
