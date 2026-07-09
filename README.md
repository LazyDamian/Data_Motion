# Gaming Community & Defense

Eine interaktive Data-Journalism-Website über die deutsche Killerspiel-Debatte und den Wandel von Gaming zum militärischen Werkzeug.

**Live:** [lazydamian.github.io/Data_Motion](https://lazydamian.github.io/Data_Motion/)

---

## Worum es geht

Fast zwanzig Jahre lang stritten Politik und Medien in Deutschland über ein Verbot von „Killerspielen", ohne dass die Forschung diese Sorge je bestätigte. Während dieser Debatte verebbte, entwickelte sich Gaming zu einem der einflussreichsten Werkzeuge unserer Zeit, auch für Institutionen, die in der ursprünglichen Diskussion nie vorkamen: das Militär.

Die Seite erzählt diese Geschichte in zwei Teilen:

**Teil 1 · Die Debatte**
- **Das politische Muster** — der reaktive Kreislauf aus Amoklauf, Verbotsforderung, Debatte und ausbleibendem Gesetz, als animiertes Kreisdiagramm
- **Das Paradox** — Scrollytelling-Graph, der zeigt, wie Jugendgewalt sank während der Gamesmarkt gleichzeitig wuchs
- **Was die Forschung wirklich sagt** — ein interaktiver Mythos-Check (selbst schätzen, dann aufdecken) und der tatsächliche Befund zu Spielzeit und Schulnoten

**Die Wende** — der erzählerische Bruch: vom Feindbild zum Werkzeug

**Teil 2 · Gaming & Defense**
- **Drohnen-Simulator** — Game-Modus vs. Realitäts-Modus, derselbe Klick, zwei Wahrnehmungswelten
- **Ethische Dilemmata** — Skill-Matching-Radar (Spieler-Profil vs. Anforderung Drohnenpilot)
- **Wargames & Rekrutierung** — wie das Militär Gaming-Kultur gezielt nutzt, und was die Forschung dazu wirklich sagt

Ein Gesamt-Fazit schließt den Bogen zwischen beiden Teilen.

---

## Tech-Stack

| Werkzeug | Einsatzzweck |
|---|---|
| [Vite](https://vitejs.dev/) | Build-Tool, Dev-Server, Production-Build |
| [Chart.js](https://www.chartjs.org/) | Scatter-, Radar- und Bar-Line-Charts |
| [GSAP](https://gsap.com/) + ScrollTrigger | Scroll-gekoppelte Animationen |
| Natives SVG (DOM-API) | Kreislauf-Diagramm, Paradox-Graph |
| Canvas 2D | Drohnen-Simulator |
| Vanilla JavaScript | Kein Framework, modularer Aufbau |

Bewusst kein Frontend-Framework: die Seite ist im Kern eine lineare Erzählung durch Scrollen, kein Interface mit vielen wechselnden Zuständen. Direkte DOM-Kontrolle war hier wichtiger als Framework-Komfort.

---

## Projektstruktur

```
├── index.html
├── vite.config.js
├── public/
│   └── favicon.svg, favicon-light.png, favicon-dark.png, ...
├── src/
│   ├── main.js              # Einstiegspunkt, orchestriert alle Module
│   ├── data.js               # Zentrale Datenquelle
│   ├── style.css
│   └── modules/
│       ├── hero.js           # Hero-Sektion, Schlagzeilen-Animation
│       ├── cycle.js           # Politischer Kreislauf (SVG)
│       ├── paradox.js         # Scrollytelling-Graph
│       ├── mythbuster.js      # Mythos-Check-Schieberegler
│       ├── research.js        # Schulnoten-Scatter-Chart
│       ├── simulator.js       # Drohnen-Simulator (Canvas)
│       └── defense.js         # Radar- und Rekrutierungs-Chart
```

---

## Lokal entwickeln

```bash
npm install
npm run dev
```

Öffnet einen lokalen Dev-Server mit Hot Reload.

## Deployen

```bash
npm run deploy
```

Baut das Projekt (`vite build`) und veröffentlicht den `dist`-Ordner auf den `gh-pages`-Branch, von dem GitHub Pages die Seite ausliefert.

---

## Datenquellen

Zentrale Quellen unter anderem: Wissenschaftliche Dienste des Deutschen Bundestages (WD-9-223-06), KFN-Forschungsberichte (Pfeiffer et al.), Hans-Bredow-Institut Hamburg, Bundeskriminalamt (PKS), DJI „Zahlen-Daten-Fakten Jugendgewalt". Die vollständige Liste inklusive Sekundärliteratur zu Gaming & Defense steht im Quellen-Abschnitt der Website selbst.

---

## Kontext

Entstanden im Kurs **Data Motion / Data Interaction** an der TH Nürnberg (Social Data Science & Communication).

**Autor:** Damian Rutz ([@LazyDamian](https://github.com/LazyDamian))
