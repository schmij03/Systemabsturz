#!/usr/bin/env python3
# =====================================================================
#  Systemabsturz: Sprachaufnahmen mit einer neuronalen Stimme erzeugen
# ---------------------------------------------------------------------
#  Erzeugt für alle vorlesbaren Texte MP3-Dateien in audio/tts/ und das
#  Verzeichnis audio/tts/verzeichnis.json. Die App spielt diese
#  Aufnahmen ab. Fehlt eine Aufnahme (z. B. nach einer Textänderung),
#  liest automatisch die Browserstimme vor.
#
#  Stimmen: «Thorsten» von Thorsten Müller (Thorsten-Voice, Lizenz CC0),
#  trainiert für Piper (https://github.com/rhasspy/piper, MIT).
#    Erzähler: de_DE-thorsten-high
#    NULLBYTE: de_DE-thorsten_emotional-medium, Sprecher «angry»,
#              tiefer gestimmt und mit Roboter-Effekt
#
#  Vorbereitung (einmalig):
#    pip install piper-tts numpy
#    ffmpeg installieren (für MP3)
#    Stimmen herunterladen und in werkzeuge/stimmen/ entpacken:
#      https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-de_DE-thorsten-high.tar.bz2
#      https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-de_DE-thorsten_emotional-medium.tar.bz2
#
#  Aufruf im Projektordner:
#    python3 werkzeuge/tts_erzeugen.py
#    python3 werkzeuge/tts_erzeugen.py --stimmen /pfad/zu/stimmen
#
#  Lizenz: CC BY-SA 4.0, Christof Heiss, Jan Schmid, PH Luzern 2026
# =====================================================================

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
from piper import PiperVoice, SynthesisConfig

WURZEL = Path(__file__).resolve().parent.parent
ZIEL = WURZEL / 'audio' / 'tts'

ERZAEHLER = 'vits-piper-de_DE-thorsten-high/de_DE-thorsten-high.onnx'
HACKER = 'vits-piper-de_DE-thorsten_emotional-medium/de_DE-thorsten_emotional-medium.onnx'

# Aussprache: Schreibweisen, die die Stimme sonst falsch liest
AUSSPRACHE = [
    (r'ANTI-V', 'Anti-Vau'),
    (r'NULLBYTE', 'Nullbeit'),
    (r'\b08:13 Uhr', 'acht Uhr dreizehn'),
    (r'\b00:00\b', 'null null'),
    (r'\b123456\b', 'eins zwei drei vier fünf sechs'),
    (r'Help-Desk', 'Hälp-Desk'),
    (r'Override', 'Ower-Reid'),
    (r'Countdown', 'Kaunt-Daun'),
    (r'\bServern?\b', lambda m: m.group(0).replace('Server', 'Sörver')),
    (r'\bTeams?\b', lambda m: m.group(0).replace('Team', 'Tiem')),
    (r'Gratis-Handy', 'Gratis-Händi'),
    (r'\bCodes?\b', lambda m: m.group(0).replace('Code', 'Kohd')),
    (r'Chiffrierscheibe', 'Schiffrierscheibe'),
    (r'Joker', 'Dschoker'),
]


def schluessel(text, art):
    """FNV-1a über UTF-8, gleich wie Sprache.schluessel() in js/app.js."""
    h = 0x811c9dc5
    for b in (art + '|' + text.strip()).encode('utf-8'):
        h ^= b
        h = (h * 0x01000193) & 0xFFFFFFFF
    return '%08x' % h


def fuer_stimme(text):
    """Bereitet einen Text für die Stimme vor (Aussprache, Zeichen)."""
    t = re.sub(r'[«»>]', '', text)
    for muster, ersatz in AUSSPRACHE:
        t = re.sub(muster, ersatz, t)
    # Wörter in GROSSBUCHSTABEN normal schreiben, sonst wird buchstabiert
    t = re.sub(r'[A-ZÄÖÜ]{3,}', lambda m: m.group(0)[0] + m.group(0)[1:].lower(), t)
    return re.sub(r'\s+', ' ', t).strip()


def synthese(stimme, text, konfig):
    teile = [c.audio_float_array for c in stimme.synthesize(text, syn_config=konfig)]
    pause = np.zeros(int(stimme.config.sample_rate * 0.25), dtype=np.float32)
    audio = []
    for t in teile:
        audio += [t, pause]
    return np.concatenate(audio) if audio else pause


def hacker_effekt(x, rate):
    """Tiefer, metallischer Klang für NULLBYTE."""
    # 1. tiefer stimmen: langsamer abspielen (Tonhöhe sinkt)
    faktor = 0.80
    n = int(len(x) / faktor)
    x = np.interp(np.arange(n) * faktor, np.arange(len(x)), x).astype(np.float32)
    t = np.arange(len(x)) / rate
    # 2. Roboter: Ringmodulation und leichtes Flattern
    ring = x * np.sin(2 * np.pi * 55 * t)
    x = 0.7 * x + 0.45 * ring
    x = x * (0.85 + 0.15 * np.sin(2 * np.pi * 7 * t))
    # 3. Echo
    d = int(0.085 * rate)
    y = np.copy(x)
    y[d:] += 0.35 * x[:-d]
    # 4. sanft übersteuern
    y = np.tanh(1.8 * y) / np.tanh(1.8)
    return y.astype(np.float32)


def als_mp3(audio, rate, datei):
    spitze = float(np.max(np.abs(audio))) or 1.0
    pcm = (audio / spitze * 0.89 * 32767).astype('<i2').tobytes()
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 's16le', '-ar', str(rate), '-ac', '1', '-i', '-',
                    '-codec:a', 'libmp3lame', '-b:a', '56k', str(datei)], input=pcm, check=True)


def main():
    p = argparse.ArgumentParser(description='Sprachaufnahmen für Systemabsturz erzeugen')
    p.add_argument('--stimmen', default=str(WURZEL / 'werkzeuge' / 'stimmen'), help='Ordner mit den entpackten Stimmen')
    p.add_argument('--alle', action='store_true', help='auch bereits vorhandene Aufnahmen neu erzeugen')
    a = p.parse_args()

    texte = json.loads(subprocess.run(['node', str(WURZEL / 'werkzeuge' / 'texte_exportieren.js')],
                                      capture_output=True, text=True, check=True).stdout)
    stimmen_ordner = Path(a.stimmen)
    erzaehler = PiperVoice.load(str(stimmen_ordner / ERZAEHLER))
    hacker = PiperVoice.load(str(stimmen_ordner / HACKER))
    zorn = hacker.config.speaker_id_map.get('angry', 0) if hacker.config.speaker_id_map else None

    ZIEL.mkdir(parents=True, exist_ok=True)
    dateien = {}
    for eintrag in texte:
        art, text = eintrag['art'], eintrag['text']
        k = schluessel(text, art)
        name = art + '-' + k + '.mp3'
        dateien[k] = name
        ziel = ZIEL / name
        if ziel.exists() and not a.alle:
            continue
        gesprochen = fuer_stimme(text)
        if art == 'hacker':
            audio = synthese(hacker, gesprochen, SynthesisConfig(speaker_id=zorn, length_scale=0.88, noise_scale=0.5))
            rate = hacker.config.sample_rate
            audio = hacker_effekt(audio, rate)
        else:
            audio = synthese(erzaehler, gesprochen, SynthesisConfig(length_scale=1.05))
            rate = erzaehler.config.sample_rate
        als_mp3(audio, rate, ziel)
        print('erzeugt', name, '|', gesprochen[:70])

    # alte Dateien entfernen, die zu keinem Text mehr gehören
    for alt in ZIEL.glob('*.mp3'):
        if alt.name not in dateien.values():
            alt.unlink()
            print('entfernt', alt.name)

    verzeichnis = {
        'hinweis': 'Erzeugt mit werkzeuge/tts_erzeugen.py. Stimme: Thorsten (Thorsten-Voice, CC0) mit Piper.',
        'dateien': dateien
    }
    (ZIEL / 'verzeichnis.json').write_text(json.dumps(verzeichnis, indent=1, ensure_ascii=False), encoding='utf-8')
    print(len(dateien), 'Aufnahmen im Verzeichnis.')


if __name__ == '__main__':
    sys.exit(main())
