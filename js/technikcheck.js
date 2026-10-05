/* =====================================================================
   Systemabsturz: Technikcheck vor dem Spiel
   ---------------------------------------------------------------------
   Prüft, ob ein Gerät bereit ist: lokaler Speicher, Ton, Sprachaufnahmen,
   Blockly, Startsignal (ntfy.sh) und Offline-Cache. Jede Prüfung hat ein
   Zeitlimit und liefert immer ein Ergebnis (auch ohne Netz).
   Spielleitung: sendet eine Testnachricht an einen zufälligen Kanal.
   Gerät eines Teams (index.html, «Gerät prüfen»): fragt nur ab.
   Benötigt js/app.js (SIGNAL_SERVER, SIGNAL_PRAEFIX).
   Lizenz: CC BY-SA 4.0, Christof Heiss, Jan Schmid, PH Luzern 2026
   ===================================================================== */

const Technikcheck = (function () {
  'use strict';

  const NTFY_TIMEOUT_MS = 8000;
  const TIMEOUT_MS = 5000;

  /** Bricht ein Versprechen nach ms Millisekunden mit einem Fehler ab */
  function mitTimeout(versprechen, ms, w) {
    const warte = (w && w.setTimeout) || setTimeout;
    const stoppe = (w && w.clearTimeout) || clearTimeout;
    return new Promise(function (ja, nein) {
      const zeit = warte(function () { nein(new Error('Zeitüberschreitung')); }, ms);
      Promise.resolve(versprechen).then(function (x) { stoppe(zeit); ja(x); }, function (e) { stoppe(zeit); nein(e); });
    });
  }

  async function holen(w, url, optionen, ms) {
    if (!w.fetch) throw new Error('Kein Netzwerkzugriff im Browser');
    const steuerung = w.AbortController ? new w.AbortController() : null;
    const zeit = steuerung ? (w.setTimeout || setTimeout)(function () { steuerung.abort(); }, ms) : null;
    try {
      const r = await mitTimeout(w.fetch(url, Object.assign({ cache: 'no-store' }, optionen || {}, steuerung ? { signal: steuerung.signal } : {})), ms, w);
      if (!r || !r.ok) throw new Error('Server antwortet mit Fehler ' + (r ? r.status : ''));
      return r;
    } catch (e) {
      if (e && /^Server antwortet/.test(e.message)) throw e;
      if (e && (e.name === 'AbortError' || e.message === 'Zeitüberschreitung')) throw new Error('keine Antwort innert ' + Math.round(ms / 1000) + ' Sekunden');
      throw new Error('nicht erreichbar');
    } finally {
      if (zeit !== null) (w.clearTimeout || clearTimeout)(zeit);
    }
  }

  function zufall() {
    return Math.random().toString(36).slice(2, 10);
  }

  /* Die Prüfungen: name, Hinweis bei Fehler und die Prüffunktion.
     Die Funktion liefert einen kurzen Text bei Erfolg oder wirft einen Fehler. */
  const PRUEFUNGEN = [
    {
      id: 'speicher',
      name: 'Lokaler Speicher',
      hinweis: 'Privates Surfen beenden oder Website-Daten im Browser erlauben. Sonst geht der Spielstand beim Neuladen verloren.',
      pruefe: async function (w) {
        const s = w.localStorage;
        if (!s) throw new Error('nicht vorhanden');
        const schluessel = 'systemabsturz-technikcheck';
        const wert = zufall();
        s.setItem(schluessel, wert);
        const gelesen = s.getItem(schluessel);
        s.removeItem(schluessel);
        if (gelesen !== wert) throw new Error('Lesen nicht möglich');
        return 'schreib- und lesbar';
      }
    },
    {
      id: 'ton',
      name: 'Ton',
      hinweis: 'Lautstärke und Stummschalter prüfen, einmal auf den Bildschirm tippen oder klicken und nochmals prüfen.',
      pruefe: async function (w) {
        const AC = w.AudioContext || w.webkitAudioContext;
        if (!AC) throw new Error('Web Audio nicht verfügbar');
        const ctx = new AC();
        if (ctx.state === 'suspended' && ctx.resume) await mitTimeout(ctx.resume(), 2000, w);
        if (ctx.state !== 'running') throw new Error('Ton gesperrt');
        // kurzer, leiser Testton
        const osc = ctx.createOscillator();
        const lautstaerke = ctx.createGain();
        osc.frequency.value = 660;
        lautstaerke.gain.value = 0.06;
        osc.connect(lautstaerke);
        lautstaerke.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
        (w.setTimeout || setTimeout)(function () { if (ctx.close) ctx.close(); }, 400);
        return 'Testton abgespielt (hörbar?)';
      }
    },
    {
      id: 'aufnahmen',
      name: 'Sprachaufnahmen',
      hinweis: 'Vorlesen nutzt dann die Stimme des Browsers. Seite einmal mit Internet laden.',
      pruefe: async function (w) {
        const r = await holen(w, 'audio/tts/verzeichnis.json', {}, TIMEOUT_MS);
        const v = await r.json();
        const anzahl = v && v.dateien ? Object.keys(v.dateien).length : 0;
        if (!anzahl) throw new Error('Verzeichnis leer');
        return anzahl + ' Aufnahmen gefunden';
      }
    },
    {
      id: 'blockly',
      name: 'Blockly (Protokoll 2)',
      hinweis: 'Ohne Blockly funktioniert Protokoll 2 nicht. Seite mit Internet neu laden.',
      pruefe: async function (w) {
        if (w.Blockly) return 'geladen';
        await holen(w, 'lib/blockly/blockly_compressed.js', { method: 'HEAD' }, TIMEOUT_MS);
        return 'ladbar';
      }
    },
    {
      id: 'startsignal',
      name: 'Startsignal (ntfy.sh)',
      hinweis: 'Das zentrale Startsignal funktioniert nicht. Geräte der Teams manuell starten: unten rechts «Spielleitung», PIN, «manuell starten».',
      pruefe: async function (w, optionen) {
        const kanal = SIGNAL_SERVER + '/' + SIGNAL_PRAEFIX + 'technikcheck-' + zufall();
        if (optionen.senden) {
          await holen(w, kanal, { method: 'POST', body: JSON.stringify({ typ: 'technikcheck' }) }, NTFY_TIMEOUT_MS);
          return 'Testnachricht gesendet';
        }
        await holen(w, kanal + '/json?poll=1&since=1m', {}, NTFY_TIMEOUT_MS);
        return 'erreichbar';
      }
    },
    {
      id: 'offline',
      name: 'Offline-Cache',
      hinweis: 'Seite einmal mit Internet öffnen und neu laden. Erst dann funktioniert das Spiel ohne WLAN.',
      pruefe: async function (w) {
        const nav = w.navigator || {};
        const sw = nav.serviceWorker;
        const ort = w.location || {};
        if (ort.protocol && ort.protocol !== 'https:') throw new Error('nur über https möglich');
        if (!sw) throw new Error('Browser ohne Offline-Unterstützung');
        if (sw.controller) return 'aktiv';
        const reg = sw.getRegistration ? await mitTimeout(sw.getRegistration(), 3000, w) : null;
        if (reg && reg.active) throw new Error('bereit, aber Seite noch nicht neu geladen');
        throw new Error('noch nicht aktiv');
      }
    }
  ];

  /**
   * Führt alle Prüfungen aus.
   * optionen.senden: Testnachricht an ntfy.sh senden (Spielleitung), sonst nur abfragen
   * optionen.umgebung: Ersatz für window (für Tests)
   * Liefert [{ id, name, ok, text, hinweis }] in fester Reihenfolge.
   */
  function pruefe(optionen) {
    const o = optionen || {};
    const w = o.umgebung || window;
    return Promise.all(PRUEFUNGEN.map(function (p) {
      let lauf;
      try { lauf = Promise.resolve(p.pruefe(w, o)); } catch (e) { lauf = Promise.reject(e); }
      return mitTimeout(lauf, p.id === 'startsignal' ? NTFY_TIMEOUT_MS + 1000 : TIMEOUT_MS + 1000, w).then(function (text) {
        return { id: p.id, name: p.name, ok: true, text: text || 'in Ordnung', hinweis: '' };
      }, function (e) {
        return { id: p.id, name: p.name, ok: false, text: (e && e.message) || 'Fehler', hinweis: p.hinweis };
      });
    }));
  }

  /** Zeigt die Ergebnisse als Liste mit Haken oder Kreuz */
  function zeige(liste, ergebnisse) {
    liste.innerHTML = '';
    ergebnisse.forEach(function (e) {
      const li = document.createElement('li');
      li.className = e.ok ? 'ok' : 'fehler';
      const zeichen = document.createElement('span');
      zeichen.className = 'technik-zeichen';
      zeichen.textContent = e.ok ? '✓' : '✗';
      zeichen.setAttribute('aria-label', e.ok ? 'in Ordnung' : 'Problem');
      const text = document.createElement('span');
      text.className = 'technik-text';
      const name = document.createElement('strong');
      name.textContent = e.name + ': ';
      text.appendChild(name);
      text.appendChild(document.createTextNode(e.text));
      if (!e.ok && e.hinweis) {
        const h = document.createElement('span');
        h.className = 'technik-hinweis';
        h.textContent = e.hinweis;
        text.appendChild(h);
      }
      li.appendChild(zeichen);
      li.appendChild(text);
      liste.appendChild(li);
    });
  }

  /** Verbindet einen Knopf mit einer Ergebnisliste */
  function verbinde(knopf, liste, optionen) {
    if (!knopf || !liste) return;
    knopf.addEventListener('click', async function () {
      knopf.disabled = true;
      const vorher = knopf.textContent;
      knopf.textContent = 'Prüfe …';
      liste.innerHTML = '';
      try {
        zeige(liste, await pruefe(optionen));
      } finally {
        knopf.disabled = false;
        knopf.textContent = vorher;
      }
    });
  }

  return { pruefe: pruefe, zeige: zeige, verbinde: verbinde, PRUEFUNGEN: PRUEFUNGEN };
})();

document.addEventListener('DOMContentLoaded', function () {
  const seite = document.body.dataset.seite;
  // Spielleitung: mit Testnachricht an ntfy.sh
  Technikcheck.verbinde(document.getElementById('technikcheck-knopf'), document.getElementById('technikcheck-liste'), { senden: seite === 'spielleitung' });
  // Startseite: «Gerät prüfen» klappt den Bereich auf und startet die Prüfung (nur Abfrage)
  const link = document.getElementById('geraet-pruefen');
  const bereich = document.getElementById('geraetecheck');
  if (link && bereich) {
    link.addEventListener('click', function () {
      bereich.hidden = false;
      document.getElementById('technikcheck-knopf').click();
    });
  }
});
