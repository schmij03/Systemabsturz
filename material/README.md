# Material für die Spielleitung

Hier liegen die Teamsets pro Schwierigkeitsstufe als eigenständige HTML-Dateien (Stil eingebettet, ohne Skripte, funktionieren auch offline). Auf der Spielleitung öffnet die Kachel «Gesamtes Dossier» dasselbe Dossier mit Stufenwahl und dem Knopf «Als HTML herunterladen».

| Datei | Inhalt (7 Seiten) |
|---|---|
| `Systemabsturz_Teamset_Leicht.html` | Auftrag, Protokoll 1 (Auftrag und Chiffrierscheibe), Protokoll 2, Protokoll 3 (Auftrag und Netzwerkplan quer), Stufe Leicht |
| `Systemabsturz_Teamset_Mittel.html` | dasselbe für Stufe Mittel |
| `Systemabsturz_Teamset_Schwer.html` | dasselbe für Stufe Schwer |

Druckeinstellung: A4, «Tatsächliche Grösse» (100 %), farbig. Der Netzwerkplan druckt automatisch im Querformat.

**Neu erzeugen:** Die Dateien entstehen aus `druck/teamset.html` (Inhalt in `druck/seiten.js`, Gestaltung in `druck/druck.css`). Nach Änderungen an Texten, Labyrinth oder Netzwerken neu erzeugen:

```
node werkzeuge/teamsets_erzeugen.js
```

Das Teamset im Browser (`druck/teamset.html?stufe=leicht`) passt sich zusätzlich an die Einstellungen der Spielleitung an und hat einen Knopf «Als HTML herunterladen».

**PDF (optional):** Legt ihr `Systemabsturz_Teamset_Leicht.pdf` (und Mittel, Schwer) in diesen Ordner, erscheint auf der Spielleitungsseite automatisch ein PDF-Link.
