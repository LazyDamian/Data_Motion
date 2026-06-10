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

/* Mediennutzung an Schultagen in Minuten (Mößle et al. 2010, KFN FB108)
   Jungen spielen an Schultagen rund 130 Min., Mädchen rund 53 Min. */
export const media = {
  Jungen:  { fernsehen: 120, videospiele: 130, computer: 40 },
  Mädchen: { fernsehen: 110, videospiele: 53,  computer: 30 },
};