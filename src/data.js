/* ═══════════════════════════════════════════════════════════════
   data.js  ·  Zentrale Datenquelle
   ═══════════════════════════════════════════════════════════════ */

/* Schwebende Schlagzeilen für den Hero (atmosphärisch, sinngemäß) */
export const headlines = [
  'Killerspiele verbieten!',
  'Wann handelt die Politik?',
  'Ethische Bedenken bleiben',
  'Fakten statt Panikmache',



];

/* Der reaktive politische Kreislauf.
   Jede Phase hat eine Liste konkreter historischer Beispiele,
   die thematisch zu dieser Phase passen (statt sie 1:1 zu den Knoten zu mappen). */
export const cyclePhases = [
  { key: 'amoklauf',  label: 'Amoklauf',         desc: 'Ein Einzelereignis erschüttert die Öffentlichkeit.',
    examples: [
      { year: 2002, title: 'Erfurt',    text: 'Ein 19-Jähriger tötet an seiner ehemaligen Schule 16 Menschen. Er wird als Counter-Strike-Spieler identifiziert.' },
      { year: 2009, title: 'Winnenden', text: 'Ein 17-Jähriger tötet an der Albertville-Realschule 15 Menschen. In den Medien wird sein PC-Konsum schnell thematisiert.' },
    ] },
  { key: 'forderung', label: 'Verbotsforderung', desc: 'Politiker fordern reflexartig ein Verbot von „Killerspielen".',
    examples: [
      { year: 2002, title: 'Erste Forderungen', text: 'Im Bundestag werden direkt nach Erfurt erstmals Verbote von Killerspielen gefordert.' },
      { year: 2007, title: 'Bayerischer Antrag', text: 'Bayern beantragt im Bundesrat, Herstellung und Verbreitung von Killerspielen unter Strafe zu stellen.' },
    ] },
  { key: 'debatte',   label: 'Debatte',          desc: 'Es folgt eine hitzige öffentliche Diskussion, oft ohne klare Faktenbasis.',
    examples: [
      { year: 2005, title: 'Koalitionsvertrag', text: 'CDU/CSU und SPD nehmen das Thema in den Koalitionsvertrag auf (S. 123). Eine breite öffentliche Debatte folgt.' },
      { year: 2006, title: 'Bundestags-Gutachten', text: 'Der Wissenschaftliche Dienst des Bundestags stellt fest: keine Evidenz für einen Kausalzusammenhang.' },
    ] },
  { key: 'kein',      label: 'Kein Gesetz',      desc: 'Die Forderung verläuft im Sande. Ein Bundesgesetz kommt nie.',
    examples: [
      { year: 2007, title: 'Antrag scheitert', text: 'Der bayerische Antrag scheitert an der unscharfen Definition von „Killerspielen".' },
      { year: 2009, title: 'Nach Winnenden',   text: 'Die Innenministerkonferenz beschließt Verschärfungen, ein bundesweites Verbot bleibt aus.' },
    ] },
];

/* TVBZ Jugendliche (14-17) bei Gewaltkriminalität (deutsche Tatverdächtige je 100.000)
   Zeitraum 2007-2019: nach dem Höchststand 2007 sinkt die Jugendgewalt kontinuierlich.
   Quellen: BKA PKS, DJI/KFN. 2007 ca. 1.267 (Höchststand), 2015 ca. 493, 2019 ca. 616.
   Werte für Zwischenjahre interpoliert aus den DJI-Berichten (Zahlen-Daten-Fakten Jugendgewalt). */
export const years    = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019];
export const pksTsd   = [1267, 1190, 1100, 1000,  910,  820,  720,  610,  493,  520,  545,  580,  616];

/* Deutscher Gamesmarkt in Mio. Euro (Umsatz Games + Hardware)
   Quellen: game-Verband / GfK, BIU Jahresberichte.
   Werte vor 2012 sind Branchen-Schätzungen, ab 2012 game-Verband-Daten.
   2007-2011 vor Mobile-Boom, ab 2012 mit Smartphone-Spielen, ab 2017 Methodikwechsel. */
export const marktMio = [1500, 1700, 1860, 1990, 2070, 2200, 2280, 2540, 2810, 2890, 3370, 4377, 6200];

/* Jahre, die als politisches Ereignis markiert werden */
export const eventYears = [2007, 2009];

/* Forschung: Spielzeit (h/Tag) vs. Schulnote, nach Geschlecht
   (modellierter Verlauf nach Pfeiffer/KFN: mehr Spielzeit, schlechtere Noten) */
export const researchBoys = [
  { x: 0,   y: 2.1 }, { x: 0.5, y: 2.2 }, { x: 1, y: 2.4 },
  { x: 2,   y: 2.6 }, { x: 3,   y: 2.8 }, { x: 4.5, y: 3.1 }, { x: 6, y: 3.4 },
];
export const researchGirls = [
  { x: 0,   y: 2.0 }, { x: 0.5, y: 2.1 }, { x: 1, y: 2.15 },
  { x: 2,   y: 2.2 }, { x: 3,   y: 2.25 }, { x: 4.5, y: 2.3 },
];

/* ─── Defense / Gamification: Kennzahlen Hero-Block ─── */
export const defenseStats = [
  { num: '3,2 Mrd.', label: 'Gamer weltweit' },
  { num: '2002',     label: "America's Army erschien" },
  { num: 'MQ-9',     label: 'Drohne via Gamepad gesteuert' },
];

/* Schwerpunkte der ethischen Bedenken (Original-Aufteilung der HTML) */
export const ethicsConcerns = {
  labels: ['Dehumanisierung', 'Rekrutierung durch Spiele', 'PlayStation-Mentalität', 'Datenschutz', 'Sonstiges'],
  values: [35, 28, 20, 10, 7],
};

/* Skill-Matching Radar (Spieler-Profil vs. Anforderung Drohnenpilot) */
export const radarLabels = ['Strategie', 'Reflexe', 'Technik'];
export const radarRequirement = [90, 80, 70];
export const radarDefaultPlayer = [75, 85, 60];

/* ─── Wargames & Rekrutierung (Kapitel) ─── */
export const recruitmentFindings = [
  { title: 'Militärische Inhalte', text: 'Wargames wie Call of Duty, Battlefield oder Squad orientieren sich an realen Strukturen: Waffen, Ränge, Taktiken und moderne Technik wie Drohnen oder Panzer.' },
  { title: 'Einstellung zum Militär', text: 'Gamer zeigen häufig höheres Interesse an Militärtechnik und nehmen das Militär eher neutral bis positiv wahr. Interesse bedeutet aber nicht automatisch Rekrutierungsbereitschaft.' },
  { title: 'Gezielte Nutzung', text: 'Die Bundeswehr tritt auf der Gamescom auf, America\u2019s Army wurde direkt als Rekrutierungsinstrument entwickelt, die U.S. Army betreibt Esports auf Twitch und Discord.' },
  { title: 'Wissenschaftliche Einordnung', text: 'Es gibt keinen eindeutigen Nachweis, dass Wargames direkt zu Soldaten machen. Die Forschung spricht von indirekter Korrelation statt direkter Kausalität.' },
];

/* Rekrutierungen vs. America's Army Spielerzahlen (Original-Chart-Daten) */
export const recruitChart = {
  labels: ['2000', '2002', '2004', '2006', '2008', '2010'],
  recruits: [75, 80, 110, 125, 118, 130],
  players:  [0, 0.5, 4, 8, 10, 13],
};