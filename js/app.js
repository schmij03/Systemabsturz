/* =====================================================================
   Systemabsturz: Escape Game für Zyklus 3
   Notfall-Terminal der Schule (Hauptlogik für alle drei Seiten)
   ---------------------------------------------------------------------
   Lizenz: CC BY-SA 4.0, Christof Heiss, Jan Schmid, PH Luzern 2026

   ANPASSEN: Alle wichtigen Einstellungen stehen gleich hier oben.
   Codes werden NIE im Klartext gespeichert, sondern als SHA-256-Hash.
   Neue Hashes erzeugt ihr auf spielleitung.html im Bereich
   «Konfiguration erzeugen» (nach Eingabe der PIN).
   ===================================================================== */

/* ---------------------------- KONSTANTEN ---------------------------- */

/** PIN der Spielleitung für Reset und Lösungen */
const SPIELLEITUNG_PIN = '4711';

/** Spieldauer in Minuten, falls keine Endzeit über ?ende=HH:MM gesetzt ist */
const SPIELDAUER_MINUTEN = 45;

/** Punktesystem */
const START_PUNKTE = 100;
const PUNKTE_PRO_PROTOKOLL = 20;
const JOKER_ANZAHL = 3;
const JOKER_KOSTEN = 20;
const BONUS_PUNKTE = 10;
const PUNKTE_PRO_RESTMINUTE = 1;

/** Effizienzbonus in Protokoll 2: Grundbonus plus Punkte pro Block,
    der unter dem Blocklimit der Stufe bleibt (Limit siehe js/maze.js) */
const BLOCK_BONUS_BASIS = 10;
const BLOCK_BONUS_PRO_BLOCK = 5;

/** Nach so vielen Minuten ohne Lösung erscheint Tipp-Stufe 1 gratis */
const GRATIS_TIPP_MINUTEN = 5;

/** Wartezeit nach einer falschen Code-Eingabe (Schutz vor Durchprobieren) */
const SPERRE_NACH_FEHLER_MS = 2000;

/** Salz für alle Hashes. Wird es geändert, müssen alle Hashes neu erzeugt werden. */
const SALZ = 'SYSTEMABSTURZ|';

/** SHA-256-Hashes der Lösungen (Wert = SHA-256 von SALZ + Code) */
const HASHES = {
  protokoll1: '93e6f5b9a141d8e670f4d9f4347f3b9ebfe49151ada6418067689b9b29f17de8',
  bonus: '2a3cb8ba6b05f0675283ce45ffb61056a32e67c7a6eef8b467f31702a8a766aa',
  signaturen: '671033ca39e74b17f33a3621a5fd01f96fa8ea3683cd4bcf8754d0e196e40626',
  protokoll3: '6c01916c12bd0a1a72370b81ad09dd6c13eca4a371cc8facd0864f4108c34c96',
  /* Fallen: Summen von infizierten Wegen, die kürzer sind als der
     richtige Weg (verlockende Abkürzungen, pro Stufe, js/netzwerke.js).
     Neu berechnen: node werkzeuge/netzwerke_pruefen.js --hashes */
  protokoll3Fallen: {
    leicht: [
      '26a5fbf1ee06446605ddabd2a9d2d9f05f98b58f5f25af500a0c5efd016f396a',
      '210f3aed08830124a2e205ee22677b6925eeaa045e54868f5d463fe9bc253787',
      'c8382f7e15a87bf0616c8e541a68d5ca09814f1a2f149d9d07d69deb8228487a',
      '8bc13d9262e8715e63e3caa1bb23b360ea3e93b29040ef17ef4fad1752f3de04',
      'f5d628fbb6c1f556109dcb0bf43c5ae87d7acddc0c3188721c6997f7a5af4283',
      'c6821638e689d555dbe27721a8af8776f0be16f6f4f757d583bcee62f72434a4',
      'a883f5e1cf68313b28f756182faf71ea12c88f3e3a3f16031d1ba6068cd6a7b7',
      'd9a1fdff45367bc1c415f5fe9f8cfbd195bb00d1342129f2b9585b0cc11cdbef',
      '9a6bc718a23e13b7b8634bb1e4352be1b2e1fdbcab8ea0ef59504e7969b24b6e',
      '58faab6d97ab9e5dc3a58debef6ad324c0e0ee1d9ed28f9c4bdae717992e8b01'
    ],
    mittel: [
      'ab2d3d0296d093cd74dda99ac0e05ad00600a49dbcd33645ae4653f0477d59c0',
      '1caccf7d5033264d58d327b2741d5a36938f39fdedca8adbd826ceb99009febc',
      'ad3481bd70c1e83dece9f6621aa1bd2cb58cdf9833bbee6d36c10ed5a4648394',
      'c8382f7e15a87bf0616c8e541a68d5ca09814f1a2f149d9d07d69deb8228487a',
      '8bc13d9262e8715e63e3caa1bb23b360ea3e93b29040ef17ef4fad1752f3de04',
      '585d6d0b794a578ebd7b66c713a23d2b08d4a329b4b5e44b1ff6fd1601e7b561',
      'f5d628fbb6c1f556109dcb0bf43c5ae87d7acddc0c3188721c6997f7a5af4283',
      'fb1a808db5d2b92077b9fd6daf544384b5a7fb75c0cdab45f1e1f4e8dd8a4191',
      'bc7f31ac8aeb9d258c76b4777ebf3d8e6c74844c4f5adae20c19d82783de1990',
      'c927e85579385ec615025c10a1b39ce3c06af9f83b2d94c469f0a8b0bef76a66',
      'c6821638e689d555dbe27721a8af8776f0be16f6f4f757d583bcee62f72434a4',
      'dccdda9a0f897d5d25b9c8eecf9a6c674f4d22c49c6242616e1689229ac99aae',
      '38e6311336de831e106b52b529ac6cefbf49b270800bf43ca6e275a876f1ab9f',
      '64ff5473b982d89e81b4b579a28836a4d171399767c5fa84f72414893f6dafa0',
      '5dbefc2c5dd4da21471d777c4349dfdf617934d939949caafec2f0e8ee4b3d59',
      '7d97679fc32edf3df1096bc2d608baac478c90ebe6b029b1106c633a8c29ffd6',
      '9a6bc718a23e13b7b8634bb1e4352be1b2e1fdbcab8ea0ef59504e7969b24b6e',
      '7062a8ddee96d736430cd520fe5e173fadf32d8420982d067f30b79e60e8ce00',
      '10a83a5373ac5bb4df928138b50885fbfba0c0408a3f83bb410550eaa007a1af',
      'ddd819f0411e4cbe36f6c00d0d6852adbc454a3b854aa7fc52aaca1b832bc5be',
      'b39bba864c0af61a84e546dc8e94315b011e1c3542dde64f8045bcfaf10019de',
      '58faab6d97ab9e5dc3a58debef6ad324c0e0ee1d9ed28f9c4bdae717992e8b01'
    ],
    schwer: [
      '3029a11dd6e25c27ef00857ced10ae27f990a8943064460d3deb54ca6ccdb3c1',
      '73e4a74c3f63432fdc6ba6c763fd7950319f97413e543d3267bf6b8f6e101224',
      'af6435c64ba510f9958b57eee8363c2b48e893309177db6c29d385945f8fca8b',
      '5386a8d5633c138bba68f8e8b134c0002b4822e82f7dcdcdc502804a8dc0d802',
      '47b5bd9db41c90892b337c60f2c1e871449f3ed8b6cf5d04f12e4ad7e49b2889',
      '40f7804afb1ddff5d443688108ed9dba52032f2a6c85ae750f75a02c4e2d1da6',
      'ae889b596281fd046ee0f22732bcbcfa56b405f1e461da9261bb3a0beef328cb',
      '65c7a0190ddcac1c22dadb65ffa4ae31e8c3651df38e0895518ea8af8930d3e0',
      'eaf3040ef42cec797107897941a35bb2403816e0ff47f62e7dbfe694c2eab4e7',
      '5866551265014d02d5ae3832c14b4c44ec124f594bcff45913427378c55a0419',
      '6d0a1d285584603ab85e41e2c631b0827a3591f4deb4ca8e87fbe7fa485f8a44',
      'f323da148d1e449f02a14a6e154cd8496fa2906222a989d19c0b647d25b6c73b',
      '1e1becf3921489c99ab9d6d5de63112ae0339cbd0af7224266694abc55b8637d',
      '18fbf6a34e3c01a1c42dd46059ef5351f6595e7f2e07aa5d6f38479d4907e6c7',
      'f62babbe07e2a6b963b2e44d0fde2c0e67107d5bf0d85f9506752fa01cba8692',
      '30842b6f8845a5bfd3f05b95c2fb995d96a137df69233efd7fe6372b7a682af7',
      '4adb6dfdc491400c8ca7cebda86e292013258e47e6c70b6658d79c714590cb77',
      '210f3aed08830124a2e205ee22677b6925eeaa045e54868f5d463fe9bc253787',
      '5ff17840d487208594736cd70b38eae62801c852f9fce8ff73211a7301064a59',
      'c8382f7e15a87bf0616c8e541a68d5ca09814f1a2f149d9d07d69deb8228487a',
      'e839abb5ed1b8015cca6bd1f398771c1a88412674e159af0e31b62fa360904b0',
      'c219d914425e28d00919da86ebce879f705c845a78eee33436e1df8ec79b772c',
      '585d6d0b794a578ebd7b66c713a23d2b08d4a329b4b5e44b1ff6fd1601e7b561',
      'f5d628fbb6c1f556109dcb0bf43c5ae87d7acddc0c3188721c6997f7a5af4283',
      'fb1a808db5d2b92077b9fd6daf544384b5a7fb75c0cdab45f1e1f4e8dd8a4191',
      'bc7f31ac8aeb9d258c76b4777ebf3d8e6c74844c4f5adae20c19d82783de1990',
      '2b2cc29a1b670301effba9625d8d478f60d1c69af041080e87d26a8ec35c33b3',
      '5792a97df9b8c0ebecad7ba1f8a3d4a5e49fb4c3b51cb4278474e43e6306476f',
      'edd4ac5a332375086be7a461b63838b2e0d2545933e209681d534c6861fdf154',
      'c6821638e689d555dbe27721a8af8776f0be16f6f4f757d583bcee62f72434a4',
      'dccdda9a0f897d5d25b9c8eecf9a6c674f4d22c49c6242616e1689229ac99aae',
      '8107d344949bd3483fd949dc3a84d824782f89ece525119fd45d1ac5f634e06d',
      '38e6311336de831e106b52b529ac6cefbf49b270800bf43ca6e275a876f1ab9f',
      '4a8daa78b163bacd9366460d186682b1cbb515ee8d863ed3114e4bb8d813ff63',
      'a883f5e1cf68313b28f756182faf71ea12c88f3e3a3f16031d1ba6068cd6a7b7',
      'd9a1fdff45367bc1c415f5fe9f8cfbd195bb00d1342129f2b9585b0cc11cdbef',
      '64ff5473b982d89e81b4b579a28836a4d171399767c5fa84f72414893f6dafa0',
      'fdfc5a5d96a62fd4d45186bdff945353d9be7b878b616a66b2f613d5ac45d805',
      '7d97679fc32edf3df1096bc2d608baac478c90ebe6b029b1106c633a8c29ffd6',
      '9a6bc718a23e13b7b8634bb1e4352be1b2e1fdbcab8ea0ef59504e7969b24b6e',
      '818692191c878b3afb755ef77531bce09b73a6cd0e605f751734c9e33ab37431',
      'ddd819f0411e4cbe36f6c00d0d6852adbc454a3b854aa7fc52aaca1b832bc5be',
      '9c7f305cae8230a94bf8c95df9cff4a65321a32e937d0266dfafd99af541df30',
      '67cbbed1cad3880f0d11c045bda87811dd52b4eb3c779946d6a3bff3ed2d1825',
      '4f9746a5097bf600d2a485e861caf1e659602b547a22b2026fa5e70e10b06ef0',
      '539d806db22b60cc11285bfbde240da1fc24ca54e483564376448f84cd4cdb40',
      '272a1760c2cc7264369850ce3344445185d0142f3945c6bdbaf288116b80b6cc',
      '4cf8e4fd534fa3e41f61a5d2474770e91cb8d6fb0ea06e7275d25b991c4427bc'
    ]
  }
};

/* ------------------------- Protokoll 1 ------------------------------
   Die Nachricht wird aus dem Code erzeugt: {CODE} in der Vorlage wird
   durch den Code in Worten ersetzt (729 wird zu SIEBEN ZWEI NEUN) und
   alles mit der Verschiebung verschlüsselt (Cäsar). Den Code ändert ihr
   auf spielleitung.html unter «Spiel einstellen» (gilt für die Runde)
   oder dauerhaft mit «Konfiguration erzeugen» (P1_GEHEIMTEXT und
   HASHES.protokoll1 hier ersetzen). Der Code selbst steht nirgends im
   Klartext, nur der Geheimtext und der Hash. */
const P1_VORLAGE = 'ACHTUNG SCHULE. WIR HABEN EUER SYSTEM GESPERRT. OHNE CODE SIND ALLE DATEN WEG. DER ERSTE CODE LAUTET {CODE}. NULLBYTE';
/** Verschiebung der Chiffrierscheibe (1 bis 25), bei 4 wird aus A ein E */
const P1_VERSCHIEBUNG = 4;
/** Geheimtext zum Standardcode (passt zu HASHES.protokoll1) */
const P1_GEHEIMTEXT = 'EGLXYRK WGLYPI. AMV LEFIR IYIV WCWXIQ KIWTIVVX. SLRI GSHI WMRH EPPI HEXIR AIK. HIV IVWXI GSHI PEYXIX WMIFIR DAIM RIYR. RYPPFCXI';

/** Code für Sicherheitskiste 2, verschlüsselt mit den Signaturen als Schlüssel */
const KISTE2_VERSCHLUESSELT = '813e87';

/** Lösungsliste für die Spielleitung, verschlüsselt mit der PIN als Schlüssel */
const LOESUNGEN_VERSCHLUESSELT = '1916610122a0b351b0f1170885a5dddb3f8ff731699c4acaeb9266ac4a88964bf7876983299050792c8d75671b18077f0a2ed9c3ca11055edc252c688af4e9ee9799f062b19899a8c15b4fdab963a999fd257228fd1268d3124388c4717846fcedd1a9854cef6ad453cff058d8ef981ad7f6030556d03c3e043016d2eb1e467323c02b258c6994465731c4d956cbb4ecdeac53e529eeeb92b98bb675db187cbc0db19c441654e2a86e340bb0f08b401b51ee0cb14f58b52c815d9d0c4adfb1b098cab66fcd8a1c790e8f5a4b1ed7c465052aa09b7271fcb3bcfb9f99f37d5e6be18ae40c87499920b1e4bd0dc5816e596ee43936059e4d47d515e20adb959e016f37ac16abbe3f16fb5d360c8c57316b7aba394baf5983c9a9c765705eb75ee27cff04fe162dfe9d90f7b2c99244f368b44ddd49bb67f0e11e3b7db2180605a23847be2a0ffacf223a93e7c5441bce489c869224218ef176ae88d06dd9601d9f22ef1b703038066f5be7ae23e8648e2bc08087e58e4dc9093ef381a08cd4999916a7796c55c158e9dc1396e74a7da9acd8525f3a69eb59d91c55e051eeebcef8849e747cc83d2a2bb458a67395b8d0b9c33629c240844c493def7a0983f2f00b71e43cbb5f89e804d0ff3804dfd0ae7215370c96c83adb34ea29de6214feda368af6f8f3c17d3420bd322c060a8e9c46321aaa82';

/* Startsignal der Spielleitung an die Tablets.
   Weil das Spiel keinen eigenen Server hat, läuft das Signal über den
   freien Dienst ntfy.sh. Übertragen werden nur der Beitrittscode und die
   Endzeit, keine Teamnamen und keine Punkte. Ohne Internet startet die
   Spielleitung die Tablets manuell mit der PIN. */
const SIGNAL_SERVER = 'https://ntfy.sh';
const SIGNAL_PRAEFIX = 'systemabsturz-phlu-';
const SIGNAL_ABFRAGE_MS = 3000;       // so oft fragen wartende Tablets nach
const SIGNAL_GUELTIG = '6h';          // so lange bleibt ein Startsignal abrufbar
const SPIELCODE_ZEICHEN = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const SPIELCODE_LAENGE = 5;

/** Speicherort im Browser (localStorage) */
const SPEICHER_TEAM = 'systemabsturz-spielstand';
const SPEICHER_LEITUNG = 'systemabsturz-spielleitung';

/* ------------------------------ TEXTE ------------------------------- */

const TEXTE = {
  protokolle: {
    1: {
      titel: 'Protokoll 1: Kryptografie',
      kurz: 'Kryptografie',
      story: 'Diese Nachricht erschien um 08:13 Uhr auf allen Bildschirmen. Entschlüsselt sie mit eurer Chiffrierscheibe und gebt den Code ein.',
      hinweis: 'Die Gruppe NULLBYTE unterschreibt jede Nachricht am Schluss mit ihrem Namen.',
      tipps: [
        'Lest den Hinweis zu den Hackern noch einmal. Welches Wort kennt ihr bereits?',
        /* {SIGNATUR} und {INNEN_A} passen sich der Verschiebung an */
        'Das letzte Wort {SIGNATUR} bedeutet NULLBYTE. Welcher Buchstabe wird zu welchem?',
        'Dreht die Scheibe so, dass innen {INNEN_A} unter dem äusseren A steht.'
      ]
    },
    2: {
      titel: 'Protokoll 2: Algorithmen',
      kurz: 'Algorithmen',
      story: 'Stark, Kiste 1 ist offen! NULLBYTE hat einen Virus ins Netzwerk geschleust. Programmiert den Antiviren-Roboter ANTI-V so, dass er das Ziel erreicht und unterwegs die drei Viren-Signaturen einsammelt. Rote Felder sind infiziert: Betritt ANTI-V eines, ist er verloren.',
      /* Tipps für die Stufen leicht und mittel (schwer: «tipps» darunter) */
      tippsStufen: {
        leicht: [
          'ANTI-V soll geradeaus gehen, solange vorne frei ist. An jeder Ecke biegt der Gang nach rechts ab.',
          'Ihr braucht «wiederhole bis Ziel erreicht» und darin «falls dann sonst» mit der Bedingung «vorne frei?».',
          'wiederhole bis Ziel erreicht: falls vorne frei, dann gehe 1 Feld vor, sonst drehe dich nach rechts. Das sind genau 5 Blöcke.'
        ],
        mittel: [
          'Stellt euch hinter ANTI-V, dann sind rechts und links klar. ANTI-V soll immer der Wand auf seiner rechten Seite folgen.',
          'In der Wiederholung prüft ihr zuerst rechts, dann vorne. Ist beides zu, dreht ANTI-V nach links. Ihr braucht zwei «falls dann sonst» ineinander.',
          'falls rechts frei, dann drehe rechts und gehe vor. Sonst: falls vorne frei, dann gehe vor, sonst drehe links.'
        ]
      },
      tipps: [
        'Stellt euch hinter ANTI-V, dann sind rechts und links klar. ANTI-V soll immer der Wand auf seiner rechten Seite folgen.',
        'Ihr braucht eine Wiederholung und darin «falls dann sonst». Eine Bedingung mit «und» ist nur wahr, wenn beide Teile stimmen. Ein rotes Feld ist nie erlaubt.',
        'Erste Prüfung: rechts frei und nicht rechts infiziert, dann drehe rechts und gehe vor. Sonst prüft ihr vorne. Sonst dreht ihr links.'
      ]
    },
    3: {
      titel: 'Protokoll 3: Netzwerke',
      kurz: 'Netzwerke',
      story: 'Virus gefunden, Kiste 2 ist offen! Repariert das Routing auf eurem Netzwerkplan und gebt die Summe als Override-Code ein.',
      /* Tipps passend zum Netzwerkplan der Stufe (mittel: «tipps» darunter) */
      tippsStufen: {
        leicht: [
          'Streicht zuerst alle Verbindungen zu den vier roten Servern durch.',
          'Der direkte Weg durch die Mitte ist versperrt. Der beste saubere Weg braucht genau sechs Verbindungen.',
          'Der Weg führt über F und G, dann nach oben über C, D und E. Vergesst nicht, A und Z mitzuzählen.'
        ],
        schwer: [
          'Streicht zuerst alle Verbindungen zu den sieben roten Servern durch. Was übrig bleibt, ist euer Netz.',
          'Der beste saubere Weg braucht genau neun Verbindungen. Er beginnt ganz unten.',
          'Der Weg führt unten über Q, R und S, dann hinauf über M, H, I und J bis K. Vergesst nicht, A und Z mitzuzählen.'
        ]
      },
      tipps: [
        'Streicht zuerst alle Verbindungen zu den fünf roten Servern durch.',
        'Alle kurzen Wege führen über rote Server. Der beste saubere Weg braucht genau sieben Verbindungen.',
        'Der Weg führt oben über B, schräg zu G, dann über H, L und P bis Q. Vergesst nicht, A und Z mitzuzählen.'
      ]
    }
  },
  /* Spielanweisung: erscheint nach dem Video auf dem Beamer, darüber der
     Beitrittscode. Jeder Absatz wird einzeln vorgelesen und hervorgehoben.
     Danach startet automatisch der Countdown. */
  spielanweisung: {
    titel: 'SPIELANWEISUNG',
    absaetze: [
      'Ihr seid die Notfall-Teams unserer Schule. Jedes Team erhält ein Tablet, einen Auftrag auf Papier, eine Chiffrierscheibe für Protokoll 1 und einen Netzwerkplan für Protokoll 3.',
      'Öffnet auf dem Tablet das Notfall-Terminal. Gebt euren Teamnamen und den Beitrittscode ein, der oben auf der Leinwand steht. Tippt danach auf «Wir sind bereit».',
      'Knackt die drei Sicherheitsprotokolle der Reihe nach: Kryptografie, Algorithmen und Netzwerke. Jeder geknackte Code öffnet eine Sicherheitskiste. Mit dem letzten Code löst ihr den Override aus.',
      'Kommt ihr nicht weiter, fragt den Help-Desk im Terminal. Jedes Team hat drei Joker, jeder Joker kostet ' + JOKER_KOSTEN + ' Punkte. Kisten dürfen nur mit dem richtigen Code geöffnet werden.',
      'Ihr habt ' + SPIELDAUER_MINUTEN + ' Minuten. Sobald diese Anweisung zu Ende ist, läuft der Countdown und eure Aufgaben erscheinen auf dem Tablet. Viel Erfolg!'
    ]
  },
  /* Botschaft von NULLBYTE (Hackervideo-Ersatz auf dem Beamer, wird vorgelesen).
     Jede Zeile wird einzeln getippt. */
  nullbyte: [
    'VERBINDUNG HERGESTELLT.',
    'Hier spricht NULLBYTE.',
    'Wir sind viele. Wir sind überall. Und jetzt sind wir in eurem Schulnetz.',
    'Seit Wochen beobachten wir euch.',
    'Eure Passwörter heissen 123456, Passwort oder wie euer Haustier.',
    'Ihr klickt auf jeden Link, der euch ein Gratis-Handy verspricht.',
    'Ihr lasst Computer entsperrt stehen und schreibt Codes auf Zettel unter die Tastatur.',
    'Warum wir das tun? Ganz einfach: Wir wollen beweisen, dass niemand eure Daten schützt.',
    'Euch ist Sicherheit egal. Also nehmen wir uns, was ungeschützt herumliegt.',
    'Noten, Stundenpläne, Fotos, alle Dateien: Wir haben alles verschlüsselt.',
    'Um 08:13 Uhr haben wir euch eine Nachricht geschickt. Niemand hat sie verstanden.',
    'Drei Sicherheitsprotokolle schützen den Override. Kryptografie. Algorithmen. Netzwerke.',
    'Ihr glaubt, ihr könnt sie knacken? Ihr habt 45 Minuten.',
    'Danach löschen wir alles. Für immer.',
    'Wir sind NULLBYTE. Wir vergessen nichts. Erwartet uns.'
  ],
  bonusFrage: 'Wie viele Einstellungen der Chiffrierscheibe verschlüsseln eine Nachricht wirklich?',
  /* Texte für die Beamer-Ansicht der Spielleitung */
  szenen: {
    intro: {
      titel: 'ALARM: SCHULNETZ GESPERRT',
      text: 'Heute Morgen um 08:13 Uhr ist das Schulnetz zusammengebrochen. Auf allen Bildschirmen erschien dieselbe verschlüsselte Nachricht. Absender: die Hackergruppe NULLBYTE. Ihr Ziel: Sie wollen beweisen, dass an unserer Schule niemand auf Datensicherheit achtet. Schwache Passwörter, offene Computer, unvorsichtige Klicks. Darum haben sie das Netz gesperrt und drohen, in 45 Minuten alle Daten der Schule zu löschen.'
    },
    auftrag: {
      titel: 'EUER AUFTRAG',
      text: 'Ihr seid die Notfall-Teams der Schule. Jedes Team hat ein Notfall-Terminal. Knackt die drei Sicherheitsprotokolle: Kryptografie, Algorithmen und Netzwerke. Jedes gelöste Protokoll öffnet eine Sicherheitskiste. Mit dem letzten Code löst ihr den Override aus und rettet das System.'
    },
    regeln: {
      titel: 'REGELN',
      text: 'Arbeitet im Team und sprecht euch ab. Der Help-Desk im Terminal gibt Tipps, jeder Joker kostet ' + JOKER_KOSTEN + ' Punkte. Gewaltsames Öffnen der Kisten ist verboten. Wenn der Countdown 00:00 erreicht, löscht NULLBYTE das System.'
    },
    gerettet: {
      titel: 'SYSTEM WIEDERHERGESTELLT',
      text: 'Der Override hat funktioniert. NULLBYTE ist ausgesperrt, alle Daten sind gerettet. Danke, Notfall-Teams: Ihr habt die Schule gerettet!'
    }
  }
};

/* ===================================================================
   KRYPTOGRAFIE: SHA-256 (Web Crypto API mit Ersatz in reinem JavaScript)
   =================================================================== */

const Krypto = (function () {
  'use strict';

  function utf8(text) {
    return new TextEncoder().encode(text);
  }

  function hex(bytes) {
    let s = '';
    for (let i = 0; i < bytes.length; i++) s += bytes[i].toString(16).padStart(2, '0');
    return s;
  }

  function vonHex(text) {
    const out = new Uint8Array(text.length / 2);
    for (let i = 0; i < out.length; i++) out[i] = parseInt(text.substr(i * 2, 2), 16);
    return out;
  }

  /* Ersatz-Implementierung für Geräte ohne Web Crypto (z. B. Aufruf über http
     im lokalen Netz, wo crypto.subtle nicht verfügbar ist). */
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  function sha256Js(daten) {
    const laenge = daten.length;
    const bloecke = Math.ceil((laenge + 9) / 64);
    const m = new Uint8Array(bloecke * 64);
    m.set(daten);
    m[laenge] = 0x80;
    const bits = laenge * 8;
    const dv = new DataView(m.buffer);
    dv.setUint32(m.length - 4, bits >>> 0);
    dv.setUint32(m.length - 8, Math.floor(bits / 0x100000000));
    const h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const w = new Uint32Array(64);
    const rotr = function (x, n) { return (x >>> n) | (x << (32 - n)); };
    for (let b = 0; b < bloecke; b++) {
      for (let i = 0; i < 16; i++) w[i] = dv.getUint32(b * 64 + i * 4);
      for (let i = 16; i < 64; i++) {
        const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }
      let [a, bb, c, d, e, f, g, hh] = h;
      for (let i = 0; i < 64; i++) {
        const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        const ch = (e & f) ^ (~e & g);
        const t1 = (hh + S1 + ch + K[i] + w[i]) >>> 0;
        const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        const maj = (a & bb) ^ (a & c) ^ (bb & c);
        const t2 = (S0 + maj) >>> 0;
        hh = g; g = f; f = e; e = (d + t1) >>> 0;
        d = c; c = bb; bb = a; a = (t1 + t2) >>> 0;
      }
      h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + bb) >>> 0; h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0;
      h[4] = (h[4] + e) >>> 0; h[5] = (h[5] + f) >>> 0; h[6] = (h[6] + g) >>> 0; h[7] = (h[7] + hh) >>> 0;
    }
    const out = new Uint8Array(32);
    const odv = new DataView(out.buffer);
    for (let i = 0; i < 8; i++) odv.setUint32(i * 4, h[i]);
    return out;
  }

  /** SHA-256 als Bytes (Promise). */
  async function sha256(text) {
    const daten = utf8(text);
    if (window.crypto && window.crypto.subtle) {
      try {
        return new Uint8Array(await window.crypto.subtle.digest('SHA-256', daten));
      } catch (e) { /* weiter mit Ersatz */ }
    }
    return sha256Js(daten);
  }

  /** Hash eines Codes, wie er in HASHES steht. */
  async function hashCode(code) {
    return hex(await sha256(SALZ + String(code).trim()));
  }

  /** Vergleicht eine Eingabe mit einem gespeicherten Hash. */
  async function pruefe(code, hash) {
    return (await hashCode(code)) === hash;
  }

  /* Einfache Verschlüsselung (XOR mit SHA-256-Schlüsselstrom), damit
     Kisten-Codes und Lösungen nicht im Klartext im Quellcode stehen. */
  async function schluesselstrom(schluessel, laenge) {
    const strom = new Uint8Array(Math.ceil(laenge / 32) * 32);
    for (let i = 0; i * 32 < laenge; i++) {
      strom.set(await sha256(SALZ + 'schluessel|' + schluessel + '|' + i), i * 32);
    }
    return strom;
  }

  async function verschluessle(text, schluessel) {
    const daten = utf8(text);
    const strom = await schluesselstrom(schluessel, daten.length);
    for (let i = 0; i < daten.length; i++) daten[i] ^= strom[i];
    return hex(daten);
  }

  async function entschluessle(hexText, schluessel) {
    if (!hexText || hexText.length % 2) return null;
    const daten = vonHex(hexText);
    const strom = await schluesselstrom(schluessel, daten.length);
    for (let i = 0; i < daten.length; i++) daten[i] ^= strom[i];
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(daten);
    } catch (e) {
      return null;
    }
  }

  return { hashCode: hashCode, pruefe: pruefe, verschluessle: verschluessle, entschluessle: entschluessle, sha256Js: sha256Js, hex: hex };
})();

/* ===================================================================
   TÖNE: Dateien aus sounds/ oder synthetisch über die Web Audio API
   =================================================================== */

const Ton = (function () {
  'use strict';

  const NAMEN = ['erfolg', 'fehler', 'alarm', 'klick', 'fanfare'];
  let ctx = null;
  const puffer = {};      // geladene Audiodateien (falls vorhanden)
  let geladen = false;
  let stumm = false;

  /** Muss bei einer Nutzerinteraktion aufgerufen werden (Browser-Regel). */
  function entsperren() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    // Stiller Puffer: entsperrt Ton zuverlässig auf iPad/iPhone
    try {
      const b = ctx.createBuffer(1, 1, 22050);
      const q = ctx.createBufferSource();
      q.buffer = b;
      q.connect(ctx.destination);
      q.start(0);
    } catch (e) { /* egal */ }
    if (!geladen) {
      geladen = true;
      NAMEN.forEach(ladeDatei);
    }
  }

  /** Lädt sounds/<name>.mp3. Leere Platzhalter werden ignoriert. */
  function ladeDatei(name) {
    if (location.protocol === 'file:') return;
    fetch('sounds/' + name + '.mp3')
      .then(function (r) { return r.ok ? r.arrayBuffer() : null; })
      .then(function (daten) {
        if (!daten || daten.byteLength < 500) return null;
        return new Promise(function (ok, fehler) { ctx.decodeAudioData(daten, ok, fehler); });
      })
      .then(function (b) { if (b) puffer[name] = b; })
      .catch(function () { /* synthetischer Ton als Ersatz */ });
  }

  function ton(frequenz, start, dauer, typ, lautstaerke, frequenzEnde) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = typ || 'square';
    o.frequency.setValueAtTime(frequenz, start);
    if (frequenzEnde) o.frequency.linearRampToValueAtTime(frequenzEnde, start + dauer);
    const v = lautstaerke || 0.15;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(v, start + 0.01);
    g.gain.setValueAtTime(v, start + dauer * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dauer);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(start);
    o.stop(start + dauer + 0.02);
  }

  const SYNTH = {
    klick: function (t) { ton(1400, t, 0.04, 'square', 0.06); },
    erfolg: function (t) {
      ton(660, t, 0.12, 'square', 0.12);
      ton(880, t + 0.12, 0.12, 'square', 0.12);
      ton(1320, t + 0.24, 0.25, 'square', 0.12);
    },
    fehler: function (t) {
      ton(220, t, 0.18, 'sawtooth', 0.15, 180);
      ton(150, t + 0.2, 0.3, 'sawtooth', 0.15, 110);
    },
    alarm: function (t) {
      for (let i = 0; i < 4; i++) {
        ton(600, t + i * 0.36, 0.18, 'sawtooth', 0.14, 900);
        ton(900, t + i * 0.36 + 0.18, 0.18, 'sawtooth', 0.14, 600);
      }
    },
    fanfare: function (t) {
      const noten = [523, 659, 784, 1047];
      noten.forEach(function (f, i) { ton(f, t + i * 0.14, 0.14, 'square', 0.12); });
      [523, 659, 784, 1047].forEach(function (f) { ton(f, t + 0.6, 0.8, 'triangle', 0.1); });
      ton(1047, t + 1.45, 0.12, 'square', 0.1);
      ton(1319, t + 1.6, 0.6, 'square', 0.1);
    }
  };

  function spiele(name) {
    if (stumm || !ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    if (puffer[name]) {
      const q = ctx.createBufferSource();
      q.buffer = puffer[name];
      q.connect(ctx.destination);
      q.start(0);
      return;
    }
    if (SYNTH[name]) SYNTH[name](ctx.currentTime + 0.01);
  }

  function setzeStumm(wert) { stumm = wert; }

  // Jede erste Berührung einer Seite entsperrt den Ton (auch nach Neuladen)
  ['pointerdown', 'touchend', 'keydown'].forEach(function (ev) {
    document.addEventListener(ev, entsperren, { passive: true });
  });

  function kontext() { return ctx; }

  return { entsperren: entsperren, spiele: spiele, setzeStumm: setzeStumm, kontext: kontext };
})();

/* ===================================================================
   VORLESEN (Text-to-Speech)
   -------------------------------------------------------------------
   1. Wahl: vorab erzeugte Aufnahmen mit der neuronalen Stimme
      «Thorsten» (Piper, CC0) aus audio/tts/. Sie klingen natürlich,
      sind auf allen Geräten gleich und funktionieren offline.
      Erzeugt werden sie mit werkzeuge/tts_erzeugen.py (siehe README).
   2. Ersatz: die Sprachausgabe des Browsers (Web Speech API), falls
      für einen Text keine Aufnahme existiert (z. B. geänderter Text).
   =================================================================== */

/** Ordner und Verzeichnis der vorab erzeugten Aufnahmen */
const TTS_ORDNER = 'audio/tts/';

/** Browserstimme (Ersatz): «hacker» tief und langsam, «normal» für Story und Tipps */
const STIMMEN = {
  hacker: { tonhoehe: 0.2, tempo: 0.82 },
  normal: { tonhoehe: 1, tempo: 0.95 }
};

const Sprache = (function () {
  'use strict';

  const browserTts = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  let stimme = null;
  let verzeichnis = null;        // Text-Schlüssel -> Dateiname
  let quelle = null;             // laufende Aufnahme (Web Audio)
  let audioElement = null;       // Ersatz, falls Web Audio fehlt
  let lauf = 0;                  // bricht ältere Vorlese-Aufträge ab
  let spricht = false;

  // Verzeichnis der Aufnahmen laden (fehlt es, gilt nur die Browserstimme)
  const bereit = fetch(TTS_ORDNER + 'verzeichnis.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) { verzeichnis = j && j.dateien ? j.dateien : null; })
    .catch(function () { verzeichnis = null; });

  /** Schlüssel eines Textes: FNV-1a über UTF-8, gleich wie in tts_erzeugen.py */
  function schluessel(text, art) {
    const daten = new TextEncoder().encode(art + '|' + String(text).trim());
    let h = 0x811c9dc5;
    for (let i = 0; i < daten.length; i++) {
      h ^= daten[i];
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return ('0000000' + h.toString(16)).slice(-8);
  }

  /* Beste deutsche Browserstimme: neuronale Stimmen (Natural, Online,
     Premium, Enhanced) bevorzugt, zuerst Schweiz, dann Deutschland. */
  function waehleStimme() {
    if (!browserTts) return;
    const deutsch = window.speechSynthesis.getVoices().filter(function (v) { return /^de/i.test(v.lang); });
    function punkte(v) {
      let p = 0;
      if (/natural|neural|online|premium|enhanced|erweitert|google/i.test(v.name)) p += 10;
      if (/^de[-_]CH/i.test(v.lang)) p += 3;
      else if (/^de[-_]DE/i.test(v.lang)) p += 2;
      if (v.localService === false) p += 1;
      return p;
    }
    deutsch.sort(function (a, b) { return punkte(b) - punkte(a); });
    stimme = deutsch[0] || null;
  }
  if (browserTts) {
    waehleStimme();
    window.speechSynthesis.addEventListener('voiceschanged', waehleStimme);
  }

  /* Spielt eine Aufnahme ab. Liefert true, wenn es eine gab. */
  async function spieleAufnahme(datei, meinLauf) {
    const url = TTS_ORDNER + datei;
    const ctx = Ton.kontext();
    if (ctx) {
      const antwort = await fetch(url);
      if (!antwort.ok) return false;
      const daten = await antwort.arrayBuffer();
      const puffer = await new Promise(function (ok, fehler) { ctx.decodeAudioData(daten, ok, fehler); });
      if (meinLauf !== lauf) return true;
      if (ctx.state === 'suspended') await ctx.resume();
      return new Promise(function (fertig) {
        const q = ctx.createBufferSource();
        q.buffer = puffer;
        q.connect(ctx.destination);
        q.onended = function () { if (quelle === q) quelle = null; fertig(true); };
        quelle = q;
        q.start(0);
      });
    }
    return new Promise(function (fertig) {
      audioElement = audioElement || new Audio();
      audioElement.src = url;
      audioElement.onended = function () { fertig(true); };
      audioElement.onerror = function () { fertig(false); };
      const p = audioElement.play();
      if (p && p.catch) p.catch(function () { fertig(false); });
    });
  }

  /* Browserstimme als Ersatz */
  function sprichBrowser(text, art) {
    return new Promise(function (fertig) {
      if (!browserTts || !text) { fertig(); return; }
      if (!stimme) waehleStimme();
      const e = STIMMEN[art] || STIMMEN.normal;
      // Zeichen, die schlecht klingen, entfernen
      const sauber = String(text).replace(/[«»>]/g, '').replace(/ANTI-V/g, 'Anti V')
        // Wörter in GROSSBUCHSTABEN normal schreiben, sonst buchstabieren manche Stimmen
        .replace(/[A-ZÄÖÜ]{3,}/g, function (w) { return w[0] + w.slice(1).toLowerCase(); }).replace(/\s+/g, ' ');
      const a = new SpeechSynthesisUtterance(sauber);
      a.lang = stimme ? stimme.lang : 'de-DE';
      if (stimme) a.voice = stimme;
      a.pitch = e.tonhoehe;
      a.rate = e.tempo;
      // Sicherheitsnetz: manche Browser melden das Ende nicht zuverlässig
      let erledigt = false;
      const ende = function () { if (!erledigt) { erledigt = true; fertig(); } };
      a.onend = ende;
      a.onerror = ende;
      setTimeout(ende, 3000 + sauber.length * 140);
      window.speechSynthesis.speak(a);
    });
  }

  /** Liest einen Text (oder eine Liste von Texten nacheinander) vor.
      Liefert ein Promise, das am Ende erfüllt wird. */
  async function sprich(texte, art) {
    art = art || 'normal';
    stopp();
    const meinLauf = ++lauf;
    spricht = true;
    await bereit;
    const liste = Array.isArray(texte) ? texte : [texte];
    for (const text of liste) {
      if (meinLauf !== lauf || !text) break;
      const datei = verzeichnis && verzeichnis[schluessel(text, art)];
      let gespielt = false;
      if (datei) {
        try { gespielt = await spieleAufnahme(datei, meinLauf); } catch (e) { gespielt = false; }
      }
      if (!gespielt && meinLauf === lauf) await sprichBrowser(text, art);
    }
    if (meinLauf === lauf) spricht = false;
  }

  function stopp() {
    lauf++;
    spricht = false;
    if (quelle) { try { quelle.stop(); } catch (e) { /* schon beendet */ } quelle = null; }
    if (audioElement) audioElement.pause();
    if (browserTts) window.speechSynthesis.cancel();
  }

  /** Erstellt einen Vorlese-Knopf. text kann eine Funktion sein (Text oder Liste). */
  function knopf(text, art, beschriftung) {
    const b = erstelle('button', 'knopf vorlesen-knopf', beschriftung || '🔊 Vorlesen');
    b.type = 'button';
    b.setAttribute('aria-label', 'Text vorlesen');
    b.addEventListener('click', function () {
      Ton.entsperren();
      if (spricht) { stopp(); return; }
      sprich(typeof text === 'function' ? text() : text, art);
    });
    return b;
  }

  return {
    verfuegbar: true,            // Aufnahmen oder Browserstimme
    sprich: sprich,
    stopp: stopp,
    knopf: knopf,
    schluessel: schluessel
  };
})();

/* ===================================================================
   STARTSIGNAL (Spielleitung an Tablets, über ntfy.sh)
   =================================================================== */

const Signal = (function () {
  'use strict';

  function thema(code) { return SIGNAL_SERVER + '/' + SIGNAL_PRAEFIX + String(code).toLowerCase(); }

  /** Sendet eine Nachricht an alle Tablets mit diesem Beitrittscode. */
  async function sende(code, daten) {
    const r = await fetch(thema(code), { method: 'POST', body: JSON.stringify(daten) });
    if (!r.ok) throw new Error('Signal nicht gesendet: ' + r.status);
  }

  /** Liefert die neuste Nachricht eines Typs (oder null). */
  async function letzte(code, typ) {
    const r = await fetch(thema(code) + '/json?poll=1&since=' + SIGNAL_GUELTIG, { cache: 'no-store' });
    if (!r.ok) throw new Error('Abfrage fehlgeschlagen: ' + r.status);
    const text = await r.text();
    let treffer = null;
    text.split('\n').forEach(function (zeile) {
      if (!zeile.trim()) return;
      try {
        const ev = JSON.parse(zeile);
        if (ev.event !== 'message' || !ev.message) return;
        const daten = JSON.parse(ev.message);
        if (daten && daten.typ === typ) treffer = daten;
      } catch (e) { /* fremde Nachricht: ignorieren */ }
    });
    return treffer;
  }

  function neuerCode() {
    let c = '';
    const zufall = new Uint32Array(SPIELCODE_LAENGE);
    (window.crypto || window.msCrypto).getRandomValues(zufall);
    for (let i = 0; i < SPIELCODE_LAENGE; i++) c += SPIELCODE_ZEICHEN[zufall[i] % SPIELCODE_ZEICHEN.length];
    return c;
  }

  function normiere(code) { return String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }

  return { sende: sende, letzte: letzte, neuerCode: neuerCode, normiere: normiere };
})();

/* ===================================================================
   HILFSFUNKTIONEN
   =================================================================== */

/** Schreibt Text nur, wenn er sich geändert hat (spart Layout-Arbeit im Takt) */
function setzeText(el, text) {
  if (el && el.textContent !== text) el.textContent = text;
}

function $(selektor, wurzel) { return (wurzel || document).querySelector(selektor); }
function $$(selektor, wurzel) { return Array.prototype.slice.call((wurzel || document).querySelectorAll(selektor)); }

function erstelle(tag, klasse, text) {
  const e = document.createElement(tag);
  if (klasse) e.className = klasse;
  if (text !== undefined) e.textContent = text;
  return e;
}

/* --------------------- Protokoll 1: Cäsar-Nachricht ----------------- */

const ZIFFERN_WORTE = ['NULL', 'EINS', 'ZWEI', 'DREI', 'VIER', 'FUENF', 'SECHS', 'SIEBEN', 'ACHT', 'NEUN'];

/** Verschiebt alle Buchstaben A bis Z um n Stellen (Cäsar). */
function caesar(text, n) {
  n = ((n % 26) + 26) % 26;
  return String(text).toUpperCase().replace(/[A-Z]/g, function (b) {
    return String.fromCharCode((b.charCodeAt(0) - 65 + n) % 26 + 65);
  });
}

/** 729 wird zu SIEBEN ZWEI NEUN */
function codeInWorten(code) {
  return String(code).split('').map(function (z) { return ZIFFERN_WORTE[parseInt(z, 10)]; }).join(' ');
}

/** Klartext und Geheimtext zu einem Code */
function p1Nachricht(code, verschiebung) {
  const klartext = P1_VORLAGE.replace('{CODE}', codeInWorten(code));
  return { klartext: klartext, geheimtext: caesar(klartext, verschiebung) };
}

/** Setzt {SIGNATUR} und {INNEN_A} in einen Tipp ein */
function fuelleTipp(text, verschiebung) {
  return String(text).replace('{SIGNATUR}', caesar('NULLBYTE', verschiebung)).replace('{INNEN_A}', caesar('A', verschiebung));
}

/** Liest ?ende=HH:MM und liefert den Zeitpunkt (heute) in ms oder null. */
function endeAusUrl() {
  const p = new URLSearchParams(location.search).get('ende');
  if (!p) return null;
  const m = /^(\d{1,2})[:.h](\d{2})$/.exec(p.trim());
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (h > 23 || min > 59) return null;
  const d = new Date();
  d.setHours(h, min, 0, 0);
  return { zeit: d.getTime(), text: String(h).padStart(2, '0') + ':' + String(min).padStart(2, '0') };
}

/** Hängt den aktuellen ?ende-Parameter an einen Link an. */
function mitParameter(seite) {
  const q = new URLSearchParams(location.search);
  const teile = [];
  ['ende', 'stufe'].forEach(function (k) { if (q.get(k)) teile.push(k + '=' + encodeURIComponent(q.get(k))); });
  return teile.length ? seite + '?' + teile.join('&') : seite;
}

/** Schwierigkeitsstufe aus ?stufe=leicht|mittel|schwer (oder null). */
function stufeAusUrl() {
  const st = (new URLSearchParams(location.search).get('stufe') || '').toLowerCase();
  return typeof STUFEN !== 'undefined' && STUFEN[st] ? st : null;
}

/** Formatiert Millisekunden als MM:SS (oder H:MM:SS). */
function formatZeit(ms) {
  if (ms <= 0) return '00:00';
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? h + ':' + mm + ':' + ss : mm + ':' + ss;
}

function ladeJson(schluessel) {
  try {
    const t = localStorage.getItem(schluessel);
    return t ? JSON.parse(t) : null;
  } catch (e) {
    return null;
  }
}

function speichereJson(schluessel, wert) {
  try {
    localStorage.setItem(schluessel, JSON.stringify(wert));
  } catch (e) { /* privater Modus: Spiel läuft trotzdem, aber ohne Speicherung */ }
}

/* ------------------------- Dialoge und Meldungen -------------------- */

/** Zeigt einen Dialog. knoepfe: [{text, wert, klasse}]. Liefert Promise mit wert. */
function dialog(titel, inhalt, knoepfe, optionen) {
  optionen = optionen || {};
  return new Promise(function (aufloesen) {
    const hintergrund = erstelle('div', 'dialog-hintergrund');
    const box = erstelle('div', 'dialog' + (optionen.warnung ? ' warnung' : ''));
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.appendChild(erstelle('h2', '', titel));
    if (typeof inhalt === 'string') box.appendChild(erstelle('p', '', inhalt));
    else if (inhalt) box.appendChild(inhalt);
    const leiste = erstelle('div', 'dialog-knoepfe');
    (knoepfe || [{ text: 'OK', wert: true, klasse: 'primaer' }]).forEach(function (k) {
      const b = erstelle('button', 'knopf ' + (k.klasse || ''), k.text);
      b.type = 'button';
      b.addEventListener('click', function () {
        Ton.spiele('klick');
        let wert = k.wert;
        if (typeof wert === 'function') wert = wert(box);
        document.body.removeChild(hintergrund);
        aufloesen(wert);
      });
      leiste.appendChild(b);
    });
    box.appendChild(leiste);
    hintergrund.appendChild(box);
    document.body.appendChild(hintergrund);
    const fokus = box.querySelector('input') || box.querySelector('.primaer') || box.querySelector('button');
    if (fokus) setTimeout(function () { fokus.focus(); }, 50);
  });
}

/** Fragt die PIN der Spielleitung ab. Liefert Promise<string|null>. */
function fragePin(titel) {
  const inhalt = erstelle('div');
  inhalt.appendChild(erstelle('p', '', 'Nur für die Spielleitung. Bitte PIN eingeben.'));
  const feld = erstelle('input', 'pin-feld');
  feld.type = 'password';
  feld.inputMode = 'numeric';
  feld.autocomplete = 'off';
  feld.setAttribute('aria-label', 'PIN');
  inhalt.appendChild(feld);
  return dialog(titel || 'Spielleitung', inhalt, [
    { text: 'Abbrechen', wert: null },
    { text: 'OK', wert: function () { return feld.value; }, klasse: 'primaer' }
  ]);
}

let toastTimer = null;
/** Kurze Einblendung am unteren Bildschirmrand. */
function toast(text, art) {
  let t = $('#toast');
  if (!t) {
    t = erstelle('div', 'toast');
    t.id = 'toast';
    t.setAttribute('role', 'status');
    document.body.appendChild(t);
  }
  t.textContent = text;
  t.className = 'toast sichtbar ' + (art || '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.className = 'toast'; }, 4500);
}

/* ------------------------------ Ziffernfeld ------------------------- */

/**
 * Erstellt ein Ziffernfeld mit Anzeige.
 * optionen: { stellen, beschriftung, beiBestaetigen(code) -> Promise }
 */
function erstelleZiffernfeld(container, optionen) {
  const stellen = optionen.stellen || 3;
  let eingabe = '';
  let gesperrt = false;

  const wurzel = erstelle('div', 'ziffernfeld');
  const anzeige = erstelle('div', 'ziffern-anzeige');
  anzeige.setAttribute('aria-live', 'polite');
  const meldung = erstelle('div', 'ziffern-meldung');
  meldung.setAttribute('role', 'status');
  const tasten = erstelle('div', 'ziffern-tasten');

  function zeichneAnzeige() {
    anzeige.innerHTML = '';
    for (let i = 0; i < stellen; i++) {
      anzeige.appendChild(erstelle('span', 'ziffer' + (i < eingabe.length ? ' voll' : ''), eingabe[i] || '_'));
    }
  }

  function taste(text, klasse, aktion, label) {
    const b = erstelle('button', 'taste ' + (klasse || ''), text);
    b.type = 'button';
    if (label) b.setAttribute('aria-label', label);
    b.addEventListener('click', function () {
      if (gesperrt) return;
      Ton.spiele('klick');
      aktion();
    });
    tasten.appendChild(b);
    return b;
  }

  ['1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach(function (z) {
    taste(z, '', function () { if (eingabe.length < stellen) { eingabe += z; zeichneAnzeige(); } });
  });
  taste('Löschen', 'loeschen', function () { eingabe = eingabe.slice(0, -1); zeichneAnzeige(); }, 'Letzte Ziffer löschen');
  taste('0', '', function () { if (eingabe.length < stellen) { eingabe += '0'; zeichneAnzeige(); } });
  const ok = taste('OK', 'bestaetigen', function () {
    if (eingabe.length < stellen) {
      setzeMeldung('Bitte ' + stellen + ' Ziffern eingeben.', 'warnung');
      return;
    }
    const code = eingabe;
    sperre(true);
    Promise.resolve(optionen.beiBestaetigen(code)).then(function (ergebnis) {
      if (ergebnis === 'fertig') return; // Feld bleibt gesperrt
      eingabe = '';
      zeichneAnzeige();
      setTimeout(function () { sperre(false); }, ergebnis === 'falsch' ? SPERRE_NACH_FEHLER_MS : 0);
    });
  }, 'Bestätigen');
  ok.textContent = 'Bestätigen';

  function setzeMeldung(text, art) {
    meldung.textContent = text || '';
    meldung.className = 'ziffern-meldung ' + (art || '');
  }

  function sperre(wert) {
    gesperrt = wert;
    wurzel.classList.toggle('gesperrt', wert);
  }

  if (optionen.beschriftung) wurzel.appendChild(erstelle('div', 'ziffern-beschriftung', optionen.beschriftung));
  wurzel.appendChild(anzeige);
  wurzel.appendChild(tasten);
  wurzel.appendChild(meldung);
  container.appendChild(wurzel);
  zeichneAnzeige();

  // Tastatur (für Tests am Computer)
  wurzel.tabIndex = 0;
  wurzel.addEventListener('keydown', function (e) {
    if (gesperrt) return;
    if (/^[0-9]$/.test(e.key) && eingabe.length < stellen) { eingabe += e.key; zeichneAnzeige(); }
    else if (e.key === 'Backspace') { eingabe = eingabe.slice(0, -1); zeichneAnzeige(); }
    else if (e.key === 'Enter') ok.click();
  });

  return { setzeMeldung: setzeMeldung, sperre: sperre, element: wurzel };
}

/* ===================================================================
   SPIELSTAND (pro Gerät im localStorage)
   =================================================================== */

function neuerSpielstand(team, endzeit, endeText, spielcode) {
  const jetzt = Date.now();
  return {
    version: 1,
    team: team,
    spielcode: spielcode || null,
    wartet: !!spielcode,                 // wartet auf das Startsignal der Spielleitung
    startzeit: jetzt,
    endzeit: endzeit,
    endeAusUrl: endeText || null,
    geloest: { 1: false, 2: false, 3: false },
    protokollStart: { 1: jetzt, 2: null, 3: null },
    punkte: START_PUNKTE,
    jokerEingeloest: 0,
    tippStufe: { 1: 0, 2: 0, 3: 0 },   // freigeschaltete Tipps pro Protokoll
    gratisTipp: { 1: false, 2: false, 3: false },
    bonus: null,                        // null | 'richtig' | 'falsch'
    kiste2: null,                       // entschlüsselter Code nach Protokoll 2
    override: false,
    restBeiOverride: null,
    geloescht: false,
    programm: null,                     // Blockly-Programm (Protokoll 2)
    stufe: stufeAusUrl() || (typeof STANDARD_STUFE !== 'undefined' ? STANDARD_STUFE : 'schwer'),
    blockBonus: 0,                      // bester Effizienzbonus in Protokoll 2
    bloecke: null
  };
}

function ladeSpielstand() { return ladeJson(SPEICHER_TEAM); }
function speichereSpielstand(s) { speichereJson(SPEICHER_TEAM, s); }

/* ===================================================================
   SEITE: index.html (Teamname eingeben, Spiel starten)
   =================================================================== */

function initStartseite() {
  const stand = ladeSpielstand();
  const ende = endeAusUrl();
  const formular = $('#start-formular');
  const laeuft = $('#spiel-laeuft');

  $('#ende-info').textContent = ende
    ? 'Countdown synchronisiert: Das Spiel endet um ' + ende.text + ' Uhr.'
    : 'Der Countdown startet mit ' + SPIELDAUER_MINUTEN + ':00 beim Klick auf «Spiel starten».';

  if (stand && stand.team) {
    formular.hidden = true;
    laeuft.hidden = false;
    $('#laufendes-team').textContent = stand.team;
    $('#weiter').addEventListener('click', function () {
      Ton.entsperren();
      location.href = mitParameter('terminal.html');
    });
  }

  const codeAusUrl = Signal.normiere(new URLSearchParams(location.search).get('spiel'));
  if (codeAusUrl) $('#spielcode').value = codeAusUrl;

  function starte(name, code) {
    Ton.entsperren();   // Klick auf «Spiel starten» entsperrt den Ton
    Ton.spiele('klick');
    const endzeit = code ? null : (ende ? ende.zeit : Date.now() + SPIELDAUER_MINUTEN * 60000);
    speichereSpielstand(neuerSpielstand(name, endzeit, ende && !code ? ende.text : null, code));
    setTimeout(function () { location.href = mitParameter('terminal.html'); }, 150);
  }

  function teamname() {
    const name = $('#teamname').value.trim().replace(/\s+/g, ' ');
    if (name.length < 2) {
      $('#start-meldung').textContent = 'Bitte gebt einen Teamnamen ein (mindestens 2 Zeichen).';
      return null;
    }
    return name;
  }

  formular.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = teamname();
    if (!name) return;
    const code = Signal.normiere($('#spielcode').value);
    if (!code && !ende) {
      $('#start-meldung').textContent = 'Gebt den Beitrittscode ein, der auf der Leinwand steht.';
      $('#ohne-code').hidden = false;
      return;
    }
    if (code && code.length !== SPIELCODE_LAENGE) {
      $('#start-meldung').textContent = 'Der Beitrittscode hat ' + SPIELCODE_LAENGE + ' Buchstaben. Schaut nochmals auf die Leinwand.';
      return;
    }
    starte(name, code);
  });

  // Notlösung: ohne Beitrittscode sofort starten (nur mit PIN)
  $('#ohne-code').addEventListener('click', async function () {
    const name = teamname();
    if (!name) return;
    const pin = await fragePin('Ohne Beitrittscode starten');
    if (pin === null) return;
    if (pin !== SPIELLEITUNG_PIN) { Ton.spiele('fehler'); toast('Falsche PIN.', 'warnung'); return; }
    starte(name, null);
  });

  $$('.reset-knopf').forEach(function (k) { k.addEventListener('click', resetTablet); });
}

/** Setzt den Spielstand dieses Geräts zurück (nur mit PIN). */
/** Knopf «Spielleitung» unten rechts: nach der PIN Spiel zurücksetzen
    oder zur Spielleitungsansicht wechseln. */
async function resetTablet() {
  const pin = await fragePin('Spielleitung');
  if (pin === null) return;
  if (pin !== SPIELLEITUNG_PIN) {
    Ton.spiele('fehler');
    toast('Falsche PIN.', 'warnung');
    return;
  }
  const wahl = await dialog('Spielleitung', 'Was möchtet ihr tun? Der Spielstand dieses Tablets bleibt erhalten, ausser ihr setzt das Spiel zurück.', [
    { text: 'Abbrechen', wert: null },
    { text: 'Spiel zurücksetzen', wert: 'reset', klasse: 'gefahr' },
    { text: 'Zur Spielleitungsansicht', wert: 'leitung', klasse: 'primaer' }
  ]);
  if (wahl === 'leitung') {
    location.href = 'spielleitung.html';
    return;
  }
  if (wahl !== 'reset') return;
  const ja = await dialog('Spielstand löschen?', 'Teamname, Punkte, gelöste Protokolle und Joker auf diesem Tablet werden gelöscht.', [
    { text: 'Abbrechen', wert: false },
    { text: 'Löschen', wert: true, klasse: 'gefahr' }
  ], { warnung: true });
  if (!ja) return;
  try { localStorage.removeItem(SPEICHER_TEAM); } catch (e) { /* egal */ }
  location.href = mitParameter('index.html');
}

/* ===================================================================
   SEITE: terminal.html (Spielansicht)
   =================================================================== */

const Terminal = {
  stand: null,
  aktivesTab: 1,
  timer: null,
  warnungFuenfMinuten: false,
  algorithmenGestartet: false
};

function initTerminal() {
  const stand = ladeSpielstand();
  if (!stand || !stand.team) {
    location.replace(mitParameter('index.html'));
    return;
  }
  // Endzeit aus der URL hat Vorrang (Synchronisation durch die Spielleitung)
  const ende = endeAusUrl();
  if (ende && !stand.override && !stand.wartet && stand.endeAusUrl !== ende.text) {
    stand.endzeit = ende.zeit;
    stand.endeAusUrl = ende.text;
  }
  Terminal.stand = stand;
  speichereSpielstand(stand);

  $('#team-name').textContent = stand.team;
  $('#helpdesk-knopf').addEventListener('click', oeffneHelpDesk);
  $('#helpdesk-schliessen').addEventListener('click', schliesseHelpDesk);
  $('#helpdesk-hintergrund').addEventListener('click', schliesseHelpDesk);
  $('#joker-knopf').addEventListener('click', jokerEinloesen);
  $$('.reset-knopf').forEach(function (k) { k.addEventListener('click', resetTablet); });
  $$('[data-gehe-zu]').forEach(function (k) {
    k.addEventListener('click', function () {
      Ton.spiele('klick');
      zeigeTab(parseInt(k.dataset.geheZu, 10));
    });
  });
  $$('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      if (t.disabled) return;
      Ton.spiele('klick');
      zeigeTab(parseInt(t.dataset.protokoll, 10));
    });
  });

  baueProtokoll1();
  baueProtokoll2();
  baueProtokoll3();
  // Vorlese-Knöpfe neben den Story-Texten
  [1, 2, 3].forEach(function (p) {
    const story = $('#protokoll-' + p + ' .story');
    story.insertBefore(Sprache.knopf(function () {
      return TEXTE.protokolle[p].story + (TEXTE.protokolle[p].hinweis ? ' Hinweis: ' + TEXTE.protokolle[p].hinweis : '');
    }, 'normal', '🔊'), story.firstChild);
  });
  $('#helpdesk-vorlesen').appendChild(Sprache.knopf(function () {
    const s = Terminal.stand;
    const p = aktuellesProtokoll();
    const frei = tippsFuer(p).slice(0, s.tippStufe[p]);
    if (!frei.length) return 'Noch kein Tipp freigeschaltet. Ihr habt ' + (JOKER_ANZAHL - s.jokerEingeloest) + ' Joker.';
    return frei.map(function (t, i) { return 'Tipp ' + (i + 1) + ': ' + t; });
  }, 'normal', '🔊 Tipps vorlesen'));
  aktualisiereKopf();
  aktualisiereTabs();
  zeigeTab(aktuellesProtokoll());

  if (stand.override) zeigeSieg(false);
  if (stand.wartet) zeigeWarten();
  tick();
  Terminal.timer = setInterval(tick, 250);

  // Blockly (640 KB) im Leerlauf vorladen, damit Protokoll 2 ohne Wartezeit öffnet
  const vorladen = function () { if (window.Algorithmen && window.Algorithmen.vorladen) window.Algorithmen.vorladen(); };
  if (window.requestIdleCallback) window.requestIdleCallback(vorladen, { timeout: 4000 });
  else setTimeout(vorladen, 1500);
}

/* --------------------- Warten auf die Spielleitung ------------------ */

function zeigeWarten() {
  const s = Terminal.stand;
  $('#warten').hidden = false;
  $('#warten-team').textContent = s.team;
  $('#warten-code').textContent = s.spielcode;
  $('#bereit-knopf').addEventListener('click', function () {
    Ton.entsperren();
    Ton.spiele('klick');
    $('#bereit-knopf').hidden = true;
    $('#bereit-info').hidden = false;
  });
  $('#manuell-start').addEventListener('click', async function () {
    const pin = await fragePin('Tablet manuell starten');
    if (pin === null) return;
    if (pin !== SPIELLEITUNG_PIN) { Ton.spiele('fehler'); toast('Falsche PIN.', 'warnung'); return; }
    const ende = endeAusUrl();
    starteNachSignal(ende ? ende.zeit : Date.now() + SPIELDAUER_MINUTEN * 60000);
  });
  frageStartsignal();
  Terminal.signalTimer = setInterval(frageStartsignal, SIGNAL_ABFRAGE_MS);
}

async function frageStartsignal() {
  const s = Terminal.stand;
  if (!s.wartet) return;
  const status = $('#warten-status');
  try {
    const start = await Signal.letzte(s.spielcode, 'start');
    const zeit = new Date().toLocaleTimeString('de-CH');
    if (start && start.ende && s.wartet) {
      starteNachSignal(start.ende, start.stufe, start.p1);
      return;
    }
    status.textContent = 'Verbunden. Warte auf das Startsignal … (geprüft ' + zeit + ')';
    status.className = 'warten-status ok';
  } catch (e) {
    status.textContent = 'Keine Verbindung zum Startsignal. Prüft das WLAN. Die Spielleitung kann das Tablet auch manuell starten.';
    status.className = 'warten-status fehler';
  }
}

/** Startsignal erhalten: Countdown setzen, Aufgaben freischalten. */
function starteNachSignal(endzeit, stufe, p1) {
  const s = Terminal.stand;
  if (!s.wartet) return;
  if (stufe && STUFEN[stufe]) s.stufe = stufe;
  if (p1 && p1.geheimtext && p1.hash) {
    s.p1 = { geheimtext: p1.geheimtext, hash: p1.hash, verschiebung: p1.verschiebung };
    $('#protokoll-1 .geheimnachricht').textContent = p1.geheimtext;
  }
  clearInterval(Terminal.signalTimer);
  const jetzt = Date.now();
  s.wartet = false;
  s.endzeit = endzeit;
  s.startzeit = jetzt;
  s.protokollStart[1] = jetzt;
  speichere();
  Ton.entsperren();
  Ton.spiele('alarm');
  const box = $('#warten');
  box.classList.add('empfangen');
  $('#warten-titel').textContent = 'AUFGABEN EMPFANGEN';
  $('#warten-status').textContent = 'Sicherheitsprotokolle werden geladen …';
  $('#warten-status').className = 'warten-status ok';
  $('#bereit-knopf').hidden = true;
  $('#bereit-info').hidden = true;
  setTimeout(function () {
    box.hidden = true;
    zeigeTab(1);
    tick();
    toast('Los geht es! Knackt Protokoll 1.', 'info');
  }, 2500);
}

/** Tipps zu einem Protokoll, in Protokoll 2 passend zur Stufe. */
function tippsFuer(p) {
  const t = TEXTE.protokolle[p];
  const stufe = Terminal.stand && Terminal.stand.stufe;
  const liste = (t.tippsStufen && t.tippsStufen[stufe]) || t.tipps;
  const v = aktiveP1().verschiebung;
  return liste.map(function (tipp) { return fuelleTipp(tipp, v); });
}

/** Protokoll 1 dieser Runde: von der Spielleitung gesendet oder Standard */
function aktiveP1() {
  const p1 = Terminal.stand && Terminal.stand.p1;
  if (p1 && p1.geheimtext && p1.hash) return p1;
  return { geheimtext: P1_GEHEIMTEXT, hash: HASHES.protokoll1, verschiebung: P1_VERSCHIEBUNG };
}

/** Das erste noch nicht gelöste Protokoll (3, falls alles gelöst ist). */
function aktuellesProtokoll() {
  const g = Terminal.stand.geloest;
  if (!g[1]) return 1;
  if (!g[2]) return 2;
  return 3;
}

function restzeit() {
  const s = Terminal.stand;
  if (s.wartet || !s.endzeit) return SPIELDAUER_MINUTEN * 60000;
  if (s.override) return s.restBeiOverride;
  return s.endzeit - Date.now();
}

function speichere() { speichereSpielstand(Terminal.stand); }

/* ------------------------------ Kopfzeile --------------------------- */

function aktualisiereKopf() {
  const s = Terminal.stand;
  $('#punkte').textContent = s.punkte;
  const rest = JOKER_ANZAHL - s.jokerEingeloest;
  const joker = $('#joker');
  joker.innerHTML = '';
  for (let i = 0; i < JOKER_ANZAHL; i++) {
    joker.appendChild(erstelle('span', 'joker-punkt' + (i < rest ? ' voll' : ''), i < rest ? '◆' : '◇'));
  }
  joker.setAttribute('aria-label', rest + ' Joker übrig');
}

function tick() {
  const s = Terminal.stand;
  const rest = restzeit();
  const uhr = Terminal.uhr || (Terminal.uhr = $('#countdown'));
  setzeText(uhr, formatZeit(rest));
  const knapp = !s.override && rest <= 5 * 60000;
  if (Terminal.uhrKnapp !== knapp) { uhr.classList.toggle('knapp', knapp); Terminal.uhrKnapp = knapp; }
  if (Terminal.uhrGestoppt !== !!s.override) { uhr.classList.toggle('gestoppt', !!s.override); Terminal.uhrGestoppt = !!s.override; }

  if (s.override || s.wartet) return;

  if (!Terminal.warnungFuenfMinuten && rest <= 5 * 60000 && rest > 4.9 * 60000) {
    Terminal.warnungFuenfMinuten = true;
    Ton.spiele('alarm');
    toast('WARNUNG: Noch 5 Minuten bis zur Löschung!', 'warnung');
  }

  if (rest <= 0) {
    if (!s.geloescht) {
      s.geloescht = true;
      speichere();
      Ton.spiele('alarm');
    }
    zeigeGeloescht();
    return;
  }

  // Gratis-Tipp nach 5 Minuten ohne Lösung im aktuellen Protokoll
  const p = aktuellesProtokoll();
  if (!s.geloest[p] && !s.gratisTipp[p] && s.protokollStart[p]) {
    if (Date.now() - s.protokollStart[p] >= GRATIS_TIPP_MINUTEN * 60000) {
      s.gratisTipp[p] = true;
      if (s.tippStufe[p] === 0) {
        s.tippStufe[p] = 1;
        toast('Gratis-Tipp freigeschaltet! Öffnet den Help-Desk.', 'info');
        $('#helpdesk-knopf').classList.add('blinkt');
        Ton.spiele('klick');
      }
      speichere();
      aktualisiereHelpDesk();
    }
  }
}

/** Bei 00:00: SYSTEM GELÖSCHT, Eingaben gesperrt, Punkte bleiben sichtbar. */
function zeigeGeloescht() {
  const o = $('#geloescht');
  if (!o.hidden) return;
  o.hidden = false;
  $('#geloescht-punkte').textContent = Terminal.stand.punkte;
  $('#geloescht-team').textContent = Terminal.stand.team;
  schliesseHelpDesk();
  if (window.Algorithmen) window.Algorithmen.stoppe();
  document.body.classList.add('spiel-gesperrt');
  clearInterval(Terminal.timer);
  $('#countdown').textContent = '00:00';
}

function spielGesperrt() {
  return Terminal.stand.geloescht || restzeit() <= 0;
}

/* -------------------------------- Tabs ------------------------------ */

function aktualisiereTabs() {
  const g = Terminal.stand.geloest;
  $$('.tab').forEach(function (t) {
    const p = parseInt(t.dataset.protokoll, 10);
    const frei = p === 1 || g[p - 1];
    t.disabled = !frei;
    t.classList.toggle('geloest', !!g[p]);
    t.querySelector('.tab-status').textContent = g[p] ? '✔' : (frei ? '▶' : '🔒');
    t.setAttribute('aria-label', TEXTE.protokolle[p].titel + (g[p] ? ', gelöst' : (frei ? '' : ', gesperrt')));
  });
}

function zeigeTab(p) {
  Terminal.aktivesTab = p;
  $$('.tab').forEach(function (t) {
    const aktiv = parseInt(t.dataset.protokoll, 10) === p;
    t.classList.toggle('aktiv', aktiv);
    t.setAttribute('aria-selected', aktiv ? 'true' : 'false');
  });
  $$('.protokoll').forEach(function (el) { el.hidden = el.id !== 'protokoll-' + p; });
  if (p === 2) starteAlgorithmen();
  aktualisiereHelpDesk();
}

/** Schaltet das nächste Protokoll frei. */
function protokollGeloest(p) {
  const s = Terminal.stand;
  if (s.geloest[p]) return;
  s.geloest[p] = true;
  s.punkte += PUNKTE_PRO_PROTOKOLL;
  if (p < 3) s.protokollStart[p + 1] = Date.now();
  speichere();
  aktualisiereKopf();
  aktualisiereTabs();
  aktualisiereHelpDesk();
  $('#helpdesk-knopf').classList.remove('blinkt');
}

/* ----------------------------- Protokoll 1 -------------------------- */

function baueProtokoll1() {
  const t = TEXTE.protokolle[1];
  const wurzel = $('#protokoll-1');
  $('.story', wurzel).textContent = t.story;
  $('.geheimnachricht', wurzel).textContent = aktiveP1().geheimtext;
  $('.hinweis', wurzel).textContent = t.hinweis;

  const feld = erstelleZiffernfeld($('.eingabe', wurzel), {
    stellen: 3,
    beschriftung: 'Code eingeben',
    beiBestaetigen: async function (code) {
      if (spielGesperrt()) return 'fertig';
      if (await Krypto.pruefe(code, aktiveP1().hash)) {
        Ton.spiele('erfolg');
        Terminal.stand.kiste1 = code;
        protokollGeloest(1);
        zeigeErfolg1(true);
        return 'fertig';
      }
      Ton.spiele('fehler');
      feld.setzeMeldung('ZUGRIFF VERWEIGERT', 'fehler');
      return 'falsch';
    }
  });
  wurzel._feld = feld;
  if (Terminal.stand.geloest[1]) zeigeErfolg1(false);
}

function zeigeErfolg1(neu) {
  const wurzel = $('#protokoll-1');
  const s = Terminal.stand;
  $('.eingabe', wurzel).hidden = true;
  const erfolg = $('.erfolg', wurzel);
  erfolg.hidden = false;
  $('.erfolg-text', erfolg).textContent = 'PROTOKOLL 1 GEKNACKT. Code für Sicherheitskiste 1: ' + (s.kiste1 || '???');
  if (neu) erfolg.classList.add('neu');
  baueBonus();
}

/** Bonusfrage nach Protokoll 1 (nur ein Versuch). */
function baueBonus() {
  const box = $('#bonus');
  const s = Terminal.stand;
  box.hidden = false;
  $('.bonus-frage', box).textContent = TEXTE.bonusFrage;
  const inhalt = $('.bonus-inhalt', box);
  inhalt.innerHTML = '';
  if (s.bonus) {
    inhalt.appendChild(erstelle('p', s.bonus === 'richtig' ? 'ok' : 'fehler',
      s.bonus === 'richtig' ? 'Richtig! Plus ' + BONUS_PUNKTE + ' Punkte.' : 'Leider falsch. Überlegt später: Welche Einstellung verändert die Nachricht gar nicht?'));
    return;
  }
  inhalt.appendChild(erstelle('p', 'klein', 'Freiwillig, nur ein Versuch. Richtig gibt es ' + BONUS_PUNKTE + ' Extrapunkte.'));
  erstelleZiffernfeld(inhalt, {
    stellen: 2,
    beiBestaetigen: async function (code) {
      if (spielGesperrt() || s.bonus) return 'fertig';
      const richtig = await Krypto.pruefe(code, HASHES.bonus);
      s.bonus = richtig ? 'richtig' : 'falsch';
      if (richtig) s.punkte += BONUS_PUNKTE;
      speichere();
      aktualisiereKopf();
      Ton.spiele(richtig ? 'erfolg' : 'fehler');
      baueBonus();
      return 'fertig';
    }
  });
}

/* ----------------------------- Protokoll 2 -------------------------- */

function baueProtokoll2() {
  const wurzel = $('#protokoll-2');
  $('.story', wurzel).textContent = TEXTE.protokolle[2].story;
  if (Terminal.stand.geloest[2]) zeigeErfolg2(false);
}

function starteAlgorithmen() {
  if (Terminal.algorithmenGestartet || !window.Algorithmen) return;
  Terminal.algorithmenGestartet = true;
  window.Algorithmen.init({
    programm: Terminal.stand.programm,
    stufe: Terminal.stand.stufe,
    speichereProgramm: function (daten) {
      Terminal.stand.programm = daten;
      speichere();
    },
    gesperrt: spielGesperrt,
    ton: Ton.spiele,
    /* Wird aufgerufen, wenn ANTI-V das Ziel erreicht. Liefert die Meldung. */
    zielErreicht: async function (gesammelt, info) {
      const schluessel = gesammelt.join(',');
      if (await Krypto.pruefe(schluessel, HASHES.signaturen)) {
        const s = Terminal.stand;
        const kiste = await Krypto.entschluessle(KISTE2_VERSCHLUESSELT, schluessel);
        s.kiste2 = kiste;
        const neu = !s.geloest[2];
        // Effizienzbonus: weniger Blöcke gibt mehr Punkte, Verbesserungen zählen auch später
        const bonus = Math.max(0, BLOCK_BONUS_BASIS + BLOCK_BONUS_PRO_BLOCK * (info.maxBloecke - info.bloecke));
        let zusatz = 'Euer Programm: ' + info.bloecke + ' Blöcke (Limit ' + info.maxBloecke + ').';
        if (bonus > (s.blockBonus || 0) && !spielGesperrt() && !s.override) {
          const plus = bonus - (s.blockBonus || 0);
          zusatz += neu ? ' Effizienzbonus: plus ' + plus + ' Punkte.' : ' Neuer Rekord! Plus ' + plus + ' Punkte.';
          s.punkte += plus;
          s.blockBonus = bonus;
          s.bloecke = info.bloecke;
        } else if (!neu) {
          zusatz += ' Euer Rekord: ' + s.bloecke + ' Blöcke. Schafft ihr es mit weniger?';
        }
        speichere();
        aktualisiereKopf();
        protokollGeloest(2);
        Ton.spiele('erfolg');
        zeigeErfolg2(neu);
        return { ok: true, text: erfolgstext2() + ' ' + zusatz };
      }
      Ton.spiele('fehler');
      return { ok: false, text: 'Ziel erreicht, aber Signaturen unvollständig. ANTI-V muss den richtigen Weg nehmen.' };
    }
  });
}

function erfolgstext2() {
  const s = Terminal.stand;
  return 'VIRUS GEFUNDEN. Signaturen 3, 8, 5 isoliert. Code für Sicherheitskiste 2: ' + (s.kiste2 || '???') +
    (s.blockBonus ? ' (Effizienzbonus ' + s.blockBonus + ' Punkte für ' + s.bloecke + ' Blöcke)' : '');
}

function zeigeErfolg2(neu) {
  const banner = $('#protokoll-2 .erfolg');
  banner.hidden = false;
  $('#protokoll-2 .story').hidden = true;
  $('.erfolg-text', banner).textContent = erfolgstext2();
  if (neu) {
    banner.classList.add('neu');
    $('.erfolg-weiter', banner).hidden = false;
  }
}

/* ----------------------------- Protokoll 3 -------------------------- */

function baueProtokoll3() {
  const wurzel = $('#protokoll-3');
  $('.story', wurzel).textContent = TEXTE.protokolle[3].story;
  const feld = erstelleZiffernfeld($('.eingabe', wurzel), {
    stellen: 3,
    beschriftung: 'Override-Code',
    beiBestaetigen: async function (code) {
      if (spielGesperrt()) return 'fertig';
      if (await Krypto.pruefe(code, HASHES.protokoll3)) {
        Ton.spiele('fanfare');
        protokollGeloest(3);
        zeigeBuzzer();
        return 'fertig';
      }
      const hash = await Krypto.hashCode(code);
      const f = HASHES.protokoll3Fallen;
      const fallen = Array.isArray(f) ? f : (f[Terminal.stand.stufe] || f.mittel || []);
      if (fallen.indexOf(hash) >= 0) {
        Ton.spiele('alarm');
        feld.setzeMeldung('ACHTUNG: Euer Weg führt über einen infizierten Server!', 'fehler');
      } else {
        Ton.spiele('fehler');
        feld.setzeMeldung('OVERRIDE ABGELEHNT. Zählt Wege und Kennzahlen nach.', 'fehler');
      }
      return 'falsch';
    }
  });
  if (Terminal.stand.geloest[3] && !Terminal.stand.override) zeigeBuzzer();
  $('#buzzer').addEventListener('click', overrideAusloesen);
}

function zeigeBuzzer() {
  const wurzel = $('#protokoll-3');
  $('.eingabe', wurzel).hidden = true;
  $('.buzzer-bereich', wurzel).hidden = false;
}

function overrideAusloesen() {
  const s = Terminal.stand;
  if (s.override || !s.geloest[3] || spielGesperrt()) return;
  const rest = Math.max(0, s.endzeit - Date.now());
  s.override = true;
  s.restBeiOverride = rest;
  s.restMinutenPunkte = Math.floor(rest / 60000) * PUNKTE_PRO_RESTMINUTE;
  s.punkte += s.restMinutenPunkte;
  speichere();
  Ton.spiele('fanfare');
  aktualisiereKopf();
  tick();
  zeigeSieg(true);
}

function zeigeSieg(neu) {
  const s = Terminal.stand;
  const o = $('#sieg');
  o.hidden = false;
  $('#sieg-team').textContent = s.team;
  $('#sieg-zeit').textContent = formatZeit(s.restBeiOverride);
  $('#sieg-bonus').textContent = s.restMinutenPunkte || 0;
  $('#sieg-blockbonus').textContent = (s.blockBonus || 0) + ' Punkte' + (s.bloecke ? ' (' + s.bloecke + ' Blöcke)' : '');
  $('#sieg-punkte').textContent = s.punkte;
  if (neu) o.classList.add('neu');
  $('#protokoll-3 .buzzer-bereich').hidden = true;
  $('#protokoll-3 .eingabe').hidden = true;
}

/* ------------------------------ Help-Desk --------------------------- */

function oeffneHelpDesk() {
  Ton.spiele('klick');
  $('#helpdesk-knopf').classList.remove('blinkt');
  aktualisiereHelpDesk();
  $('#helpdesk').classList.add('offen');
  $('#helpdesk').setAttribute('aria-hidden', 'false');
  $('#helpdesk-hintergrund').hidden = false;
}

function schliesseHelpDesk() {
  Sprache.stopp();
  $('#helpdesk').classList.remove('offen');
  $('#helpdesk').setAttribute('aria-hidden', 'true');
  $('#helpdesk-hintergrund').hidden = true;
}

function aktualisiereHelpDesk() {
  if (!Terminal.stand) return;
  const s = Terminal.stand;
  const p = aktuellesProtokoll();
  const t = TEXTE.protokolle[p];
  $('#helpdesk-titel').textContent = t.titel;
  const liste = $('#tipp-liste');
  liste.innerHTML = '';
  tippsFuer(p).forEach(function (tipp, i) {
    const li = erstelle('li', 'tipp' + (i < s.tippStufe[p] ? ' frei' : ''));
    li.appendChild(erstelle('strong', '', 'Stufe ' + (i + 1) + ': '));
    li.appendChild(document.createTextNode(i < s.tippStufe[p] ? tipp : 'gesperrt'));
    if (i === 0 && s.gratisTipp[p] && i < s.tippStufe[p]) li.appendChild(erstelle('span', 'gratis', ' (gratis)'));
    liste.appendChild(li);
  });
  const rest = JOKER_ANZAHL - s.jokerEingeloest;
  $('#joker-rest').textContent = rest;
  const knopf = $('#joker-knopf');
  const info = $('#joker-info');
  if (s.geloest[p] && p === 3) {
    knopf.hidden = true;
    info.textContent = 'Alle Protokolle gelöst.';
  } else if (s.tippStufe[p] >= tippsFuer(p).length) {
    knopf.hidden = true;
    info.textContent = 'Alle Tipps zu diesem Protokoll sind freigeschaltet.';
  } else if (rest <= 0) {
    knopf.hidden = true;
    info.textContent = 'Keine Joker mehr. Wendet euch an die Spielleitung.';
  } else {
    knopf.hidden = false;
    knopf.textContent = 'Joker einlösen: Tipp Stufe ' + (s.tippStufe[p] + 1) + ' (minus ' + JOKER_KOSTEN + ' Punkte)';
    info.textContent = s.tippStufe[p] === 0 && !s.gratisTipp[p]
      ? 'Wenn ihr ' + GRATIS_TIPP_MINUTEN + ' Minuten lang nicht weiterkommt, erscheint Stufe 1 gratis.'
      : '';
  }
}

async function jokerEinloesen() {
  const s = Terminal.stand;
  const p = aktuellesProtokoll();
  if (spielGesperrt()) return;
  if (s.jokerEingeloest >= JOKER_ANZAHL) {
    toast('Keine Joker mehr. Wendet euch an die Spielleitung.', 'warnung');
    return;
  }
  const rest = JOKER_ANZAHL - s.jokerEingeloest;
  const ja = await dialog('Joker einlösen?',
    'Ihr erhaltet Tipp Stufe ' + (s.tippStufe[p] + 1) + ' zu ' + TEXTE.protokolle[p].titel + '. Das kostet ' + JOKER_KOSTEN + ' Punkte. Ihr habt noch ' + rest + (rest === 1 ? ' Joker.' : ' Joker.'),
    [{ text: 'Abbrechen', wert: false }, { text: 'Ja, Joker einlösen', wert: true, klasse: 'primaer' }]);
  if (!ja || spielGesperrt()) return;
  if (s.tippStufe[p] >= tippsFuer(p).length || s.jokerEingeloest >= JOKER_ANZAHL) return;
  s.jokerEingeloest += 1;
  s.punkte -= JOKER_KOSTEN;
  s.tippStufe[p] += 1;
  speichere();
  aktualisiereKopf();
  aktualisiereHelpDesk();
}

/* ===================================================================
   SEITE: spielleitung.html (Beamer-Ansicht)
   =================================================================== */

const Leitung = { stand: null, loesungenOffen: false };

function initSpielleitung() {
  let stand = ladeJson(SPEICHER_LEITUNG) || { endzeit: null, gestoppt: null };
  if (!stand.spielcode) stand.spielcode = Signal.neuerCode();
  const ende = endeAusUrl();
  if (ende) {
    stand.endzeit = ende.zeit;
    stand.gestoppt = null;
  }
  Leitung.stand = stand;
  speichereJson(SPEICHER_LEITUNG, stand);

  $('#sync-info').textContent = ende
    ? 'Synchronisiert: Countdown bis ' + ende.text + ' Uhr.'
    : 'Nicht synchronisiert. Startet den Countdown hier oder öffnet die Seite mit ?ende=HH:MM.';

  // Szenen (Story-Texte)
  $$('[data-szene]').forEach(function (k) {
    k.addEventListener('click', function () { Ton.spiele('klick'); zeigeSzene(k.dataset.szene); });
  });
  zeigeSzene('intro');
  $('#szene-vorlesen').appendChild(Sprache.knopf(function () {
    return $('#szene-titel').textContent + '. ' + $('#szene-text').textContent;
  }, 'normal', '🔊 Story vorlesen'));
  if (!Sprache.verfuegbar) $('#auto-vorlesen-zeile').hidden = true;

  // Spielablauf: Intro (Video oder Botschaft), danach Aufgaben freigeben
  $('#spiel-starten').addEventListener('click', function () {
    Ton.entsperren();
    if (Leitung.stand.freigegeben) {
      toast('Das Spiel läuft bereits. Für eine neue Runde zuerst «Reset (PIN)».', 'info');
      return;
    }
    Leitung.ablauf = true;
    setzeStatus('Intro läuft (Video, danach Spielanweisung mit Beitrittscode). Danach werden die Aufgaben automatisch freigegeben.', 'info');
    vollbild(true);
    window.scrollTo(0, 0);
    zeigeVideo();
  });
  $('#start-countdown').addEventListener('click', function () { Ton.entsperren(); freigeben(); });
  $('#video-freigeben').addEventListener('click', function () { Leitung.ablauf = true; introFertig(); });
  $('#anweisung-freigeben').addEventListener('click', function () { freigeben(); });
  $('#anweisung-nochmals').addEventListener('click', function () { Leitung.ablauf = true; zeigeAnweisung(); });
  $('#signal-erneut').addEventListener('click', function () {
    if (!Leitung.stand.freigegeben) { toast('Die Aufgaben sind noch nicht freigegeben.', 'info'); return; }
    sendeStartsignal();
  });
  $('#neuer-code').addEventListener('click', function () {
    if (Leitung.stand.freigegeben) { toast('Das Spiel läuft bereits. Für eine neue Runde zuerst «Reset (PIN)».', 'info'); return; }
    Leitung.stand.spielcode = Signal.neuerCode();
    speichereJson(SPEICHER_LEITUNG, Leitung.stand);
    zeigeSpielcode();
  });
  // Protokoll 1: eigener Code
  const vs = $('#p1-verschiebung');
  for (let i = 1; i <= 25; i++) {
    const o = erstelle('option', '', i + ' (A wird zu ' + caesar('A', i) + ')');
    o.value = i;
    vs.appendChild(o);
  }
  vs.value = (Leitung.stand.p1 && Leitung.stand.p1.verschiebung) || P1_VERSCHIEBUNG;
  zeigeP1Einstellung();
  $('#p1-uebernehmen').addEventListener('click', uebernehmeP1);
  $('#p1-standard').addEventListener('click', async function () {
    const pin = await fragePin('Standard für Protokoll 1');
    if (pin === null) return;
    if (pin !== SPIELLEITUNG_PIN) { toast('Falsche PIN.', 'warnung'); return; }
    delete Leitung.stand.p1;
    speichereJson(SPEICHER_LEITUNG, Leitung.stand);
    vs.value = P1_VERSCHIEBUNG;
    $('#p1-code').value = '';
    zeigeP1Einstellung();
    hinweisNachStart();
  });
  zeigeMaterial();

  // Schwierigkeit (Labyrinth Protokoll 2 und Netzwerkplan Protokoll 3)
  const wahl = $('#stufe-wahl');
  Object.keys(STUFEN).forEach(function (k) {
    const o = erstelle('option', '', STUFEN[k].name);
    o.value = k;
    wahl.appendChild(o);
  });
  if (!Leitung.stand.stufe) Leitung.stand.stufe = stufeAusUrl() || STANDARD_STUFE;
  wahl.value = Leitung.stand.stufe;
  wahl.addEventListener('change', function () {
    Leitung.stand.stufe = wahl.value;
    speichereJson(SPEICHER_LEITUNG, Leitung.stand);
    hinweisNachStart();
    aktualisiereLinks();
    zeigeMaterial();
  });

  zeigeSpielcode();
  if (Leitung.stand.freigegeben) setzeStatus('Aufgaben wurden freigegeben. Bei Problemen «Startsignal erneut senden».', 'ok');

  $('#reset-countdown').addEventListener('click', async function () {
    const pin = await fragePin('Countdown zurücksetzen');
    if (pin === null) return;
    if (pin !== SPIELLEITUNG_PIN) { toast('Falsche PIN.', 'warnung'); return; }
    Leitung.stand = { endzeit: null, gestoppt: null, spielcode: Signal.neuerCode(), freigegeben: false };
    speichereJson(SPEICHER_LEITUNG, Leitung.stand);
    zeigeSpielcode();
    setzeStatus('', '');
    $('#gerettet').hidden = true;
    zeigeSzene('intro');
    // Parameter entfernen, sonst setzt ein Neuladen die alte Endzeit
    history.replaceState(null, '', location.pathname);
    $('#sync-info').textContent = 'Zurückgesetzt. Startet den Countdown neu oder öffnet die Seite mit ?ende=HH:MM.';
  });

  $('#hackervideo').addEventListener('click', zeigeVideo);
  // Tastatur während Video und Botschaft (Knöpfe sind dort unsichtbar)
  document.addEventListener('keydown', function (e) {
    if ($('#video-box').hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); $('#video-schliessen').click(); }
    else if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); $('#video-freigeben').click(); }
  });
  // Tastatur während der Spielanweisung (Knöpfe sind dort ebenfalls unsichtbar)
  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || $('#anweisung').hidden || !$('#video-box').hidden) return;
    if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); $('#anweisung-freigeben').click(); }
    else if (e.key === 'r' || e.key === 'R') { e.preventDefault(); $('#anweisung-nochmals').click(); }
  });
  $('#video-schliessen').addEventListener('click', function () {
    const warAblauf = Leitung.ablauf;
    schliesseVideo();
    if (warAblauf) setzeStatus('Intro abgebrochen. Mit «Aufgaben jetzt freigeben» startet das Spiel auf den Tablets.', 'warnung');
  });
  $('#nochmals-vorlesen').addEventListener('click', spieleNullbyteBotschaft);
  $('#nur-botschaft').addEventListener('click', function () {
    Ton.entsperren();
    $('#video-box').hidden = false;
    $('#hacker-video').pause();
    $('#hacker-video').hidden = true;
    $('#video-ersatz').hidden = false;
    spieleNullbyteBotschaft();
  });
  $('#system-gerettet').addEventListener('click', function () {
    Ton.entsperren();
    if (Leitung.stand.endzeit && !Leitung.stand.gestoppt) {
      Leitung.stand.gestoppt = Math.max(0, Leitung.stand.endzeit - Date.now());
      speichereJson(SPEICHER_LEITUNG, Leitung.stand);
    }
    $('#gerettet').hidden = false;
    Ton.spiele('fanfare');
  });
  $('#gerettet').addEventListener('click', function () { $('#gerettet').hidden = true; });

  $('#loesungen-knopf').addEventListener('click', zeigeLoesungen);
  $('#vollbild').addEventListener('click', function () {
    const d = document.documentElement;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (d.requestFullscreen) d.requestFullscreen();
    else if (d.webkitRequestFullscreen) d.webkitRequestFullscreen();
  });

  // Link-Generator für die Tablets
  const zeitFeld = $('#link-zeit');
  const vorschlag = new Date(Date.now() + (SPIELDAUER_MINUTEN + 5) * 60000);
  zeitFeld.value = String(vorschlag.getHours()).padStart(2, '0') + ':' + String(Math.ceil(vorschlag.getMinutes() / 5) * 5 % 60).padStart(2, '0');
  if (ende) zeitFeld.value = ende.text;
  function aktualisiereLinks() {
    const basis = location.href.replace(/[^/]*$/, '');
    const z = zeitFeld.value;
    const st = Leitung.stand.stufe ? '&stufe=' + Leitung.stand.stufe : '';
    $('#link-tablet').textContent = basis + 'index.html?ende=' + z + st;
    $('#link-beamer').textContent = basis + 'spielleitung.html?ende=' + z;
  }
  zeitFeld.addEventListener('input', aktualisiereLinks);
  aktualisiereLinks();
  $('#link-oeffnen').addEventListener('click', function () {
    location.href = 'spielleitung.html?ende=' + encodeURIComponent(zeitFeld.value);
  });
  $$('.kopieren').forEach(function (k) {
    k.addEventListener('click', function () {
      const text = $(k.dataset.ziel).textContent;
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { toast('Link kopiert.', 'info'); });
    });
  });

  $('#generator-knopf').addEventListener('click', erzeugeKonfiguration);

  setInterval(tickLeitung, 250);
  tickLeitung();
}

function tickLeitung() {
  const s = Leitung.stand;
  const uhr = $('#gross-countdown');
  let rest;
  if (!s.endzeit) rest = SPIELDAUER_MINUTEN * 60000;
  else if (s.gestoppt !== null && s.gestoppt !== undefined) rest = s.gestoppt;
  else rest = s.endzeit - Date.now();
  setzeText(uhr, formatZeit(rest));
  uhr.classList.toggle('lang', uhr.textContent.length > 5);
  uhr.classList.toggle('knapp', !!s.endzeit && !s.gestoppt && rest <= 5 * 60000);
  uhr.classList.toggle('abgelaufen', !!s.endzeit && !s.gestoppt && rest <= 0);
  uhr.classList.toggle('wartet', !s.endzeit);
  $('#buehne-anmeldung').classList.toggle('klein', !!s.freigegeben);
  setzeText($('#gross-label'), !s.endzeit ? 'BEREIT' : (s.gestoppt !== null && s.gestoppt !== undefined ? 'GESTOPPT' : (rest <= 0 ? 'SYSTEM GELÖSCHT' : 'BIS ZUR LÖSCHUNG')));
}

function hinweisNachStart() {
  if (Leitung.stand.freigegeben) toast('Gilt nur für Tablets, die noch nicht gestartet sind. Startsignal erneut senden.', 'info');
}

/** Übernimmt einen eigenen Code für Protokoll 1 (nur mit PIN). */
async function uebernehmeP1() {
  const code = $('#p1-code').value.trim();
  const v = parseInt($('#p1-verschiebung').value, 10);
  if (!/^\d{3}$/.test(code)) { toast('Bitte einen dreistelligen Code eingeben.', 'warnung'); return; }
  const pin = await fragePin('Code für Protokoll 1');
  if (pin === null) return;
  if (pin !== SPIELLEITUNG_PIN) { toast('Falsche PIN.', 'warnung'); return; }
  const n = p1Nachricht(code, v);
  Leitung.stand.p1 = { code: code, verschiebung: v, geheimtext: n.geheimtext, hash: await Krypto.hashCode(code) };
  speichereJson(SPEICHER_LEITUNG, Leitung.stand);
  $('#p1-code').value = '';
  zeigeP1Einstellung();
  toast('Protokoll 1 eingestellt.', 'info');
  hinweisNachStart();
}

/* Zeigt, welche Nachricht die Tablets in Protokoll 1 erhalten (ohne den Code). */
function zeigeP1Einstellung() {
  const p1 = Leitung.stand.p1;
  const v = p1 ? p1.verschiebung : P1_VERSCHIEBUNG;
  const text = p1 ? p1.geheimtext : P1_GEHEIMTEXT;
  $('#p1-status').textContent = p1
    ? 'Eigener Code ist eingestellt (Verschiebung ' + v + '). Den Code seht ihr unter «Lösungen».'
    : 'Standard: Code und Nachricht aus js/app.js (Verschiebung ' + v + ').';
  const box = $('#p1-vorschau');
  box.innerHTML = '';
  box.appendChild(erstelle('span', 'label', 'Geheimtext auf den Tablets'));
  box.appendChild(erstelle('p', 'mono', text));
  box.appendChild(erstelle('p', 'klein', 'Unterschrift: ' + caesar('NULLBYTE', v) + '. Tipp 3 im Help-Desk: innen ' + caesar('A', v) + ' unter dem äusseren A.'));
  box.hidden = false;
}

/* Material: PDF-Teamsets anzeigen, sobald sie im Ordner material/ liegen */
function zeigeMaterial() {
  $$('[data-material]').forEach(function (zeile) {
    const stufe = zeile.dataset.material;
    const datei = 'material/Systemabsturz_Teamset_' + stufe + '.pdf';
    const zelle = $('.pdf-zelle', zeile);
    zelle.textContent = 'PDF folgt';
    zelle.className = 'pdf-zelle klein';
    fetch(datei, { method: 'HEAD', cache: 'no-cache' }).then(function (r) {
      if (!r.ok) return;
      zelle.innerHTML = '';
      const a = erstelle('a', '', 'Teamset ' + stufe + ' (PDF)');
      a.href = datei;
      a.setAttribute('download', '');
      zelle.appendChild(a);
      zelle.className = 'pdf-zelle';
    }).catch(function () { /* offline */ });
    zeile.classList.toggle('gewaehlt', (Leitung.stand.stufe || STANDARD_STUFE) === stufe.toLowerCase());
  });
  const link = $('#link-netzwerk');
  if (link) link.href = 'druck/protokoll3.html?stufe=' + (Leitung.stand.stufe || STANDARD_STUFE);
  const link2 = $('#link-protokoll2');
  if (link2) link2.href = 'druck/protokoll2.html?stufe=' + (Leitung.stand.stufe || STANDARD_STUFE);
}

function zeigeSpielcode() {
  const s = Leitung.stand;
  $$('.spielcode-wert').forEach(function (e) { e.textContent = s.spielcode; });
  const basis = location.href.replace(/[^/]*$/, '');
  $('#anmelde-link').textContent = basis + 'index.html?spiel=' + s.spielcode;
  // kurze Adresse zum Abtippen (ohne https://)
  $$('.anmelde-kurz').forEach(function (e) { e.textContent = basis.replace(/^https?:\/\//, '').replace(/\/$/, ''); });
  if (s.stufe && STUFEN[s.stufe]) $$('.stufe-wert').forEach(function (e) { e.textContent = STUFEN[s.stufe].name; });
}

function setzeStatus(text, art) {
  const st = $('#ablauf-status');
  st.textContent = text;
  st.className = 'ablauf-status ' + (art || '');
}

/** Intro ist zu Ende: Aufgaben freigeben, wenn der Spielablauf läuft. */
function introFertig() {
  if (!Leitung.ablauf) return;
  if (!$('#video-box').hidden) schliesseVideo();
  Leitung.ablauf = true;
  zeigeAnweisung();
}

/** Bildschirm füllen (nur nach einem Klick erlaubt) */
function vollbild(an) {
  const d = document.documentElement;
  try {
    if (an && !document.fullscreenElement && !document.webkitFullscreenElement) {
      const p = d.requestFullscreen ? d.requestFullscreen() : (d.webkitRequestFullscreen ? d.webkitRequestFullscreen() : null);
      if (p && p.catch) p.catch(function () { /* Browser erlaubt es nicht: egal */ });
    } else if (!an && document.fullscreenElement) {
      document.exitFullscreen();
    }
  } catch (e) { /* egal */ }
}

/* Spielanweisung nach dem Video: Beitrittscode oben, Absätze werden
   nacheinander vorgelesen und hervorgehoben. Danach Freigabe. */
async function zeigeAnweisung() {
  const box = $('#anweisung');
  const liste = $('#anweisung-text');
  const a = TEXTE.spielanweisung;
  const lauf = (box._lauf || 0) + 1;
  box._lauf = lauf;
  zeigeSpielcode();
  $('#anweisung-titel').textContent = a.titel;
  liste.innerHTML = '';
  const elemente = a.absaetze.map(function (t) {
    const p = erstelle('p', 'anweisung-absatz', t);
    liste.appendChild(p);
    return p;
  });
  box.hidden = false;
  setzeStatus('Spielanweisung läuft. Teams melden sich mit dem Beitrittscode an.', 'info');
  for (let i = 0; i < elemente.length; i++) {
    if (box._lauf !== lauf || box.hidden) return;
    elemente.forEach(function (e, j) { e.classList.toggle('aktiv', j === i); e.classList.toggle('gelesen', j < i); });
    // aktuellen Absatz sichtbar halten (kleine Beamer)
    if (elemente[i].scrollIntoView) elemente[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    if ($('#auto-vorlesen').checked) {
      await Sprache.sprich(a.absaetze[i], 'normal');
    } else {
      await new Promise(function (ok) { setTimeout(ok, 2500 + a.absaetze[i].length * 45); });
    }
    if (box._lauf !== lauf || box.hidden) return;
    await new Promise(function (ok) { setTimeout(ok, 500); });
  }
  elemente.forEach(function (e) { e.classList.remove('aktiv'); e.classList.add('gelesen'); });
  if (Leitung.ablauf && box._lauf === lauf) setTimeout(function () { if (box._lauf === lauf) freigeben(); }, 1200);
}

function schliesseAnweisung() {
  const box = $('#anweisung');
  box._lauf = (box._lauf || 0) + 1;
  box.hidden = true;
  Sprache.stopp();
}

/** Startet den Countdown und schickt das Startsignal an die Tablets. */
async function freigeben() {
  const s = Leitung.stand;
  Leitung.ablauf = false;
  if (!s.freigegeben) {
    const ende = endeAusUrl();
    s.endzeit = ende && ende.zeit > Date.now() ? ende.zeit : Date.now() + SPIELDAUER_MINUTEN * 60000;
    s.gestoppt = null;
    s.freigegeben = true;
    speichereJson(SPEICHER_LEITUNG, s);
  }
  if (!$('#video-box').hidden) schliesseVideo();
  const nachAnweisung = !$('#anweisung').hidden;
  schliesseAnweisung();
  window.scrollTo(0, 0);
  Ton.spiele('alarm');
  zeigeSzene('auftrag', nachAnweisung);
  await sendeStartsignal();
}

async function sendeStartsignal() {
  const s = Leitung.stand;
  setzeStatus('Startsignal wird gesendet …', 'info');
  try {
    const nachricht = { typ: 'start', ende: s.endzeit, stufe: s.stufe || STANDARD_STUFE, gesendet: Date.now() };
    // eigener Code für Protokoll 1: nur Geheimtext und Hash, nie der Code
    if (s.p1) nachricht.p1 = { geheimtext: s.p1.geheimtext, hash: s.p1.hash, verschiebung: s.p1.verschiebung };
    await Signal.sende(s.spielcode, nachricht);
    setzeStatus('Aufgaben freigegeben um ' + new Date().toLocaleTimeString('de-CH') + '. Die Tablets starten innerhalb weniger Sekunden.', 'ok');
    toast('Startsignal gesendet.', 'info');
  } catch (e) {
    setzeStatus('Startsignal konnte nicht gesendet werden (Internet?). Erneut versuchen oder die Tablets manuell starten: auf dem Tablet «Spielleitung: manuell starten» und PIN.', 'fehler');
    toast('Startsignal nicht gesendet.', 'warnung');
  }
}

function zeigeSzene(name, ohneVorlesen) {
  const sz = TEXTE.szenen[name];
  if (!sz) return;
  $('#szene-titel').textContent = sz.titel;
  $('#szene-text').textContent = sz.text;
  Sprache.stopp();
  const auto = $('#auto-vorlesen');
  if (auto && auto.checked && Leitung.szeneGezeigt && !ohneVorlesen) Sprache.sprich(sz.titel + '. ' + sz.text, 'normal');
  Leitung.szeneGezeigt = true;
  $$('[data-szene]').forEach(function (k) { k.classList.toggle('aktiv', k.dataset.szene === name); });
}

function zeigeVideo() {
  Ton.entsperren();
  const box = $('#video-box');
  const video = $('#hacker-video');
  const ersatz = $('#video-ersatz');
  box.hidden = false;
  ersatz.hidden = true;
  video.hidden = false;
  video.currentTime = 0;
  video.controls = false;   // keine Bedienleiste auf dem Beamer
  const p = video.play();
  if (p && p.catch) p.catch(function () { zeigeVideoErsatz(); });
  video.onerror = zeigeVideoErsatz;
  video.onended = introFertig;
  if (video.error || video.networkState === 3) zeigeVideoErsatz();
}

/* Ersatz, solange videos/intro.mp4 fehlt: Hackertext tippt sich selbst */
function zeigeVideoErsatz() {
  const video = $('#hacker-video');
  const ersatz = $('#video-ersatz');
  if (!ersatz.hidden) return;
  video.hidden = true;
  ersatz.hidden = false;
  spieleNullbyteBotschaft();
}

/* Tippt die Botschaft Zeile für Zeile und liest jede Zeile mit Hackerstimme vor */
function spieleNullbyteBotschaft() {
  const ersatz = $('#video-ersatz');
  const ziel = $('#ersatz-text');
  const zeilen = TEXTE.nullbyte;
  const lauf = (ersatz._lauf || 0) + 1;   // bricht einen älteren Durchlauf ab
  ersatz._lauf = lauf;
  ziel.textContent = '';
  Sprache.stopp();
  clearInterval(ersatz._timer);
  Ton.spiele('alarm');
  let z = 0;
  function naechsteZeile() {
    if (ersatz._lauf !== lauf) return;
    if (z >= zeilen.length) { introFertig(); return; }
    const zeile = '> ' + zeilen[z];
    let i = 0;
    let getippt = false;
    let gesprochen = !Sprache.verfuegbar || !$('#hacker-stimme').checked;
    const vorher = ziel.textContent;
    function weiter() {
      if (getippt && gesprochen && ersatz._lauf === lauf) {
        z++;
        setTimeout(naechsteZeile, 350);
      }
    }
    if (!gesprochen) Sprache.sprich(zeilen[z], 'hacker').then(function () { gesprochen = true; weiter(); });
    ersatz._timer = setInterval(function () {
      ziel.textContent = vorher + zeile.slice(0, ++i);
      if (i >= zeile.length) {
        clearInterval(ersatz._timer);
        ziel.textContent += '\n';
        ziel.scrollTop = ziel.scrollHeight;
        getippt = true;
        // ohne Sprachausgabe: Lesezeit abhängig von der Länge
        if (gesprochen) setTimeout(weiter, 400 + zeile.length * 25);
        else weiter();
      }
    }, 38);
  }
  naechsteZeile();
}

function schliesseVideo() {
  Leitung.ablauf = false;
  const video = $('#hacker-video');
  video.pause();
  clearInterval($('#video-ersatz')._timer);
  $('#video-ersatz')._lauf = ($('#video-ersatz')._lauf || 0) + 1;
  Sprache.stopp();
  $('#video-box').hidden = true;
}

async function zeigeLoesungen() {
  const box = $('#loesungen');
  if (Leitung.loesungenOffen) {
    box.hidden = true;
    Leitung.loesungenOffen = false;
    $('#loesungen-knopf').textContent = 'Lösungen anzeigen';
    return;
  }
  const pin = await fragePin('Lösungen anzeigen');
  if (pin === null) return;
  if (pin !== SPIELLEITUNG_PIN) { toast('Falsche PIN.', 'warnung'); return; }
  const text = await Krypto.entschluessle(LOESUNGEN_VERSCHLUESSELT, pin);
  let l = null;
  try { l = JSON.parse(text); } catch (e) { l = null; }
  const liste = $('#loesungen-liste');
  liste.innerHTML = '';
  if (!l) {
    liste.appendChild(erstelle('p', 'fehler', 'Die Lösungen konnten nicht entschlüsselt werden. Wurde die PIN geändert? Erzeugt die Konfiguration unten neu.'));
  } else {
    // Protokoll 1: eingestellter Code dieser Runde ersetzt den Standard
    const p1 = Leitung.stand.p1;
    if (p1) {
      l.p1 = p1.code + ' (für diese Runde eingestellt)';
      l.p1info = 'Cäsar-Verschiebung ' + p1.verschiebung + ' (innen ' + caesar('A', p1.verschiebung) + ' unter dem äusseren A, Unterschrift ' +
        caesar('NULLBYTE', p1.verschiebung) + '). Klartext: ' + p1Nachricht(p1.code, p1.verschiebung).klartext;
    }
    // Protokoll 3: Weg und Fallen der gewählten Stufe
    const stufe = Leitung.stand.stufe || STANDARD_STUFE;
    if (typeof NETZWERKE !== 'undefined' && NETZWERKE[stufe]) {
      l.p3info = 'Stufe ' + STUFEN[stufe].name + ': ' + NETZWERKE[stufe].loesung;
      l.fallen = NETZWERKE[stufe].fallen;
    }
    [
      ['Protokoll 1 (Code Kiste 1)', l.p1],
      ['Protokoll 1 Erklärung', l.p1info],
      ['Bonusfrage', l.bonus],
      ['Protokoll 2 Signaturen', l.signaturen],
      ['Code Kiste 2', l.kiste2],
      ['Protokoll 3 (Override)', l.p3],
      ['Protokoll 3 Erklärung', l.p3info],
      ['Protokoll 3 Fallen (infizierte Server)', l.fallen]
    ].forEach(function (z) {
      if (!z[1]) return;
      liste.appendChild(erstelle('dt', '', z[0]));
      liste.appendChild(erstelle('dd', '', z[1]));
    });
    // Netzwerkpläne Protokoll 3 der anderen Stufen (aus js/netzwerke.js)
    if (typeof NETZWERKE !== 'undefined') {
      Object.keys(NETZWERKE).forEach(function (k) {
        if (k === stufe) return;
        liste.appendChild(erstelle('dt', '', 'Protokoll 3, Stufe ' + (STUFEN[k] ? STUFEN[k].name : k)));
        liste.appendChild(erstelle('dd', 'programm', NETZWERKE[k].loesung + '. Fallen: ' + NETZWERKE[k].fallen + '.'));
      });
    }
    // Musterlösungen Protokoll 2 pro Stufe (aus js/maze.js)
    Object.keys(STUFEN).forEach(function (k) {
      const st = STUFEN[k];
      liste.appendChild(erstelle('dt', '', 'Protokoll 2, Stufe ' + st.name));
      liste.appendChild(erstelle('dd', 'programm', st.musterloesung + '. Energie: ' + st.energie + ' Felder.'));
    });
  }
  box.hidden = false;
  Leitung.loesungenOffen = true;
  $('#loesungen-knopf').textContent = 'Lösungen verbergen';
}

/** Erzeugt die Konstanten für app.js aus neuen Codes (Bereich «Konfiguration erzeugen»). */
async function erzeugeKonfiguration() {
  const pin = await fragePin('Konfiguration erzeugen');
  if (pin === null) return;
  if (pin !== SPIELLEITUNG_PIN) { toast('Falsche PIN.', 'warnung'); return; }
  const w = function (id) { return $('#gen-' + id).value.trim(); };
  const neuePin = w('pin') || SPIELLEITUNG_PIN;
  const sig = w('signaturen').split(/[^0-9]+/).filter(Boolean).join(',');
  // Fallen für Protokoll 3 direkt aus den Netzwerkplänen (js/netzwerke.js)
  const fallenStufen = {};
  Object.keys(NETZWERKE).forEach(function (st) { fallenStufen[st] = netzwerkAnalyse(st).fallen; });
  const verschiebung = parseInt(w('verschiebung') || P1_VERSCHIEBUNG, 10);
  if (!/^\d{3}$/.test(w('p1')) || !(verschiebung >= 1 && verschiebung <= 25)) {
    toast('Code Protokoll 1 muss dreistellig sein, Verschiebung zwischen 1 und 25.', 'warnung');
    return;
  }
  const loesungen = {
    p1: w('p1'), p1info: w('p1info'), bonus: w('bonus'),
    signaturen: sig.split(',').join(', '), kiste2: w('kiste2'),
    p3: w('p3'), p3info: w('p3info'), fallen: ''
  };
  const zeilen = [];
  zeilen.push("const SPIELLEITUNG_PIN = '" + neuePin + "';");
  zeilen.push('');
  zeilen.push('const HASHES = {');
  zeilen.push("  protokoll1: '" + await Krypto.hashCode(loesungen.p1) + "',");
  zeilen.push("  bonus: '" + await Krypto.hashCode(loesungen.bonus) + "',");
  zeilen.push("  signaturen: '" + await Krypto.hashCode(sig) + "',");
  zeilen.push("  protokoll3: '" + await Krypto.hashCode(loesungen.p3) + "',");
  zeilen.push('  /* Fallen pro Stufe, berechnet aus js/netzwerke.js */');
  zeilen.push('  protokoll3Fallen: {');
  const stufenZeilen = [];
  for (const st of Object.keys(fallenStufen)) {
    const fh = [];
    for (const f of fallenStufen[st]) fh.push("      '" + await Krypto.hashCode(f) + "'");
    stufenZeilen.push('    ' + st + ': [\n' + fh.join(',\n') + '\n    ]');
  }
  zeilen.push(stufenZeilen.join(',\n'));
  zeilen.push('  }');
  zeilen.push('};');
  zeilen.push('');
  zeilen.push('const P1_VERSCHIEBUNG = ' + verschiebung + ';');
  zeilen.push("const P1_GEHEIMTEXT = '" + p1Nachricht(w('p1'), verschiebung).geheimtext + "';");
  zeilen.push('');
  zeilen.push("const KISTE2_VERSCHLUESSELT = '" + await Krypto.verschluessle(loesungen.kiste2, sig) + "';");
  zeilen.push('');
  zeilen.push("const LOESUNGEN_VERSCHLUESSELT = '" + await Krypto.verschluessle(JSON.stringify(loesungen), neuePin) + "';");
  $('#generator-ausgabe').value = zeilen.join('\n');
  $('#generator-ausgabe').hidden = false;
  toast('Konfiguration erzeugt. Ersetzt die entsprechenden Zeilen oben in js/app.js.', 'info');
}

/* ===================================================================
   START: je nach Seite die passende Initialisierung
   =================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  const seite = document.body.dataset.seite;
  if (seite === 'start') initStartseite();
  else if (seite === 'terminal') initTerminal();
  else if (seite === 'spielleitung') initSpielleitung();

  // Offline-Fähigkeit: Service Worker speichert alle Dateien im Cache
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(function () { /* egal */ });
  }
});
