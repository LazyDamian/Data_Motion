/* ═══════════════════════════════════════════════════════════════
   data.js  ·  Zentrale Datenquelle
   ═══════════════════════════════════════════════════════════════ */

/* Schwebende Schlagzeilen für den Hero (atmosphärisch, sinngemäß) */
export const headlines = [

];

/* Der reaktive politische Kreislauf */
export const cyclePhases = [
  { key: 'amoklauf',  label: 'Amoklauf',         desc: 'Ein Einzelereignis erschüttert die Öffentlichkeit.' },
  { key: 'forderung', label: 'Verbotsforderung', desc: 'Politiker fordern reflexartig ein Verbot von „Killerspielen".' },
  { key: 'debatte',   label: 'Debatte',          desc: 'Es folgt eine hitzige öffentliche Diskussion ohne klare Faktenbasis.' },
  { key: 'kein',      label: 'Kein Gesetz',      desc: 'Die Forderung verläuft im Sande. Ein Bundesgesetz kommt nie.' },
];

/* Historische Ereignisse */
export const events = [
  { year: 2002, title: 'Erfurt', text: 'Ein Counter-Strike-Spieler tötet 16 Menschen. Im Bundestag werden erstmals Verbote von „Killerspielen" gefordert. Ein konkretes Gesetz folgt nicht.' },
  { year: 2005, title: 'Koalitionsvertrag', text: 'CDU/CSU und SPD schreiben ein Verbot in den Koalitionsvertrag (S. 123). Gesetzliche Schritte bleiben aus.' },
  { year: 2007, title: 'Bayerischer Antrag', text: 'Bayern beantragt, Herstellung und Verbreitung unter Strafe zu stellen. Der Antrag scheitert an der unscharfen Definition.' },
  { year: 2009, title: 'Winnenden', text: 'Ein Täter tötet 15 Menschen. Die Innenministerkonferenz beschließt Verschärfungen. Erneut folgt kein Bundesgesetz.' },
];

/* PKS: Tatverdächtige unter 21 bei Gewaltdelikten, in Tausend
   (BKA PKS, Trendverlauf 1993–2009 mit rund 28 % Rückgang) */
export const years   = [1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009];
export const pksTsd  = [162,168,175,181,188,193,186,179,171,162,155,150,143,135,127,119,112];

/* Spielemarkt Deutschland in Mio. Euro (game Verband / GfK) */
export const marktMio = [380,420,470,520,580,620,670,730,820,900,1010,1130,1250,1390,1510,1620,1700];

/* Jahre, die als politisches Ereignis markiert werden */
export const eventYears = [2002, 2005, 2007, 2009];

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