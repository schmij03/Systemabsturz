# Töne für «Systemabsturz»

Die Dateien in diesem Ordner sind **leere Platzhalter**. Solange sie leer sind, erzeugt die App alle Töne synthetisch über die Web Audio API. Das Spiel funktioniert also sofort, auch ohne eigene Tondateien.

Wer eigene Töne verwenden will, ersetzt die Platzhalter durch echte MP3-Dateien mit genau diesen Namen:

| Datei         | Verwendung                                              |
|---------------|---------------------------------------------------------|
| `erfolg.mp3`  | Code richtig, Protokoll geknackt                        |
| `fehler.mp3`  | Code falsch, ANTI-V läuft gegen eine Mauer              |
| `alarm.mp3`   | ANTI-V infiziert, infizierter Server, Countdown 00:00   |
| `klick.mp3`   | Tastendruck, eingesammelte Signatur                     |
| `fanfare.mp3` | Override-Code richtig und Override ausgelöst            |

Empfehlung: kurze Töne (unter 2 Sekunden), MP3, möglichst klein (unter 100 KB).

## Freie Quellen (CC0, ohne Namensnennung nutzbar)

* [freesound.org](https://freesound.org) mit dem Filter «Creative Commons 0»
* [OpenGameArt.org](https://opengameart.org) mit dem Lizenzfilter «CC0»
* [Kenney.nl Audio](https://kenney.nl/assets?q=audio) (alle Pakete CC0)
* [Pixabay Sound Effects](https://pixabay.com/sound-effects/) (eigene Pixabay-Lizenz, frei nutzbar)

Prüft bei jeder Datei die Lizenz. CC0 ist ideal, weil sie mit der Lizenz des Spiels (CC BY-SA 4.0) problemlos zusammenpasst.

## Hinweis zu Tablets

Browser spielen Ton erst nach einer Berührung ab. Der Klick auf «Spiel starten» und jede erste Berührung im Terminal entsperren den Ton. Auf dem iPad den Stummschalter beziehungsweise die Lautstärke prüfen.
