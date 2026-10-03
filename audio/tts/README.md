# Sprachaufnahmen

Diese MP3-Dateien wurden mit `werkzeuge/tts_erzeugen.py` erzeugt. Die App spielt sie beim Vorlesen ab. `verzeichnis.json` ordnet jedem Text seine Datei zu.

* Erzähler: Stimme «Thorsten» (high) von Thorsten Müller, [Thorsten-Voice](https://github.com/thorstenMueller/Thorsten-Voice), Lizenz CC0, Sprachsynthese mit [Piper](https://github.com/rhasspy/piper)
* NULLBYTE: «Thorsten emotional» (Sprecher «angry»), tiefer gestimmt und mit Roboter-Effekt

Wird ein Text in `js/app.js` geändert, passt die alte Aufnahme nicht mehr. Die App liest diesen Text dann mit der Browserstimme vor, bis die Aufnahmen neu erzeugt sind (siehe README im Hauptordner).
