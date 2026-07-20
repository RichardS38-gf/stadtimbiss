# Stadtimbiss — Projektplan

**Stand:** Juli 2026
**Ziel:** Frontend-Demo eines Restaurant-Bestellshops für einen fiktiven Imbiss namens "Stadtimbiss". Keine Backend-Anbindung — reine Präsentations-Demo für Akquise bei echten Restaurants.
**Vercel-URL:** https://stadtimbiss.vercel.app
**GitHub:** https://github.com/RichardS38-gf/stadtimbiss
**Tech-Stack:** Reines HTML/CSS/Vanilla-JS
**Hosting:** Vercel (automatisches Deployment via GitHub)

---

## Produktvision in einem Satz

Eine überzeugende, mobile-first Bestell-Demo die potenziellen Restaurantkunden zeigt, wie ihr eigener Bestellshop aussehen könnte — direkt auf dem Handy präsentierbar.

---

## Designsprache

**Farbschema:** Dunkel/Modern mit rotem Akzent (angelehnt an Domino's).
- `--color-accent:     #E63946` (Rot, primäre Akzentfarbe)
- `--color-accent-dk:  #C1121F` (Rot dunkel, Hover-Zustand)
- `--color-bg:         #F8F8F8`
- `--color-bg-soft:    #FFFFFF`
- `--color-ink:        #1A1A1A`
- `--color-muted:      #888888`
- `--color-line:       #E0E0E0`
- `--color-dark:       #1A1A1A`
- `--color-on-dark:    #FFFFFF`

**Typografie** (Google Fonts):
- Headlines: `Poppins`, weight 700/800
- Body/UI: `Inter`, weight 400/500/600

**Stil:** Flat, kein border-radius auf primären Elementen, mobile-first, Touch-Targets min. 44px.

---

## CSS-Architektur

Jede HTML-Seite bindet ein:

```html
<link rel="stylesheet" href="css/reset.css">
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/[seitenname].css?v=1">
```

Bei jeder CSS-Änderung Versionsnummer hochzählen (`?v=2`, `?v=3` usw.).

---

## Ordnerstruktur

```
Restaurant Online Shop/  (Git-Repo)
├── css/
│   ├── reset.css
│   ├── tokens.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── index.css
│   ├── bestellen.css
│   └── checkout.css
├── js/
│   ├── cart.js         (Warenkorb-Logik, localStorage)
│   └── bestellen.js    (Kategorie-Filter, UI-Interaktion)
├── img/
│   └── .gitkeep
├── Specs/
│   ├── projektplan.md
│   ├── phase-1-grundlage.md
│   ├── phase-2-startseite.md
│   ├── phase-3-bestellseite.md
│   ├── phase-4-warenkorb-checkout.md
│   └── phase-5-polish.md
├── index.html
├── bestellen.html
├── checkout.html
├── danke.html
└── README.md
```

---

## Seitenstruktur

| Seite | Datei | Inhalt |
|-------|-------|--------|
| Startseite | `index.html` | Hero, Info-Banner, Angebote, Kategorien, Bestseller, Footer |
| Bestellseite | `bestellen.html` | Lieferung/Abholung-Toggle, Kategorienleiste, Produktkarten, Warenkorb |
| Checkout | `checkout.html` | Adressformular, Bestellübersicht |
| Danke | `danke.html` | Bestätigung, animiertes Häkchen |

---

## Phasenübersicht

| Phase | Inhalt | Datei | Status |
|-------|--------|-------|--------|
| 1 | GitHub-Repo, Vercel, Ordnerstruktur, CSS-Grunddateien | phase-1-grundlage.md | abgeschlossen |
| 2 | Startseite index.html | phase-2-startseite.md | abgeschlossen |
| 3 | Bestellseite bestellen.html | phase-3-bestellseite.md | abgeschlossen |
| 4 | Warenkorb (Slide-in) + Checkout + Danke-Seite | phase-4-warenkorb-checkout.md | abgeschlossen |
| 5 | Mobile-Polish, Animationen, Favicon | phase-5-polish.md | abgeschlossen |
| 6 | Neue vollwertige Startseite (Über uns, Highlights, Bewertungen, Kontakt) | phase-6-startseite-neu.md | abgeschlossen |

---

## Referenz

Design-Vorbild: Domino's Deutschland (dominos.de) — besonders:
- Lieferung/Abholung-Toggle
- Sticky Kategorienleiste auf der Bestellseite
- Angebots-Banner zwischen Kategorien
- Warenkorb immer sichtbar

## Arbeitskonventionen

- Immer vollständige Datei lesen bevor etwas geändert wird
- Bei jedem CSS-Change Versionsnummer hochzählen (`?v=N`)
- Mobile-first: Basis-CSS für Mobile, dann min-width Breakpoints (768px, 1024px)
- Kein Lorem Ipsum — sinnvolle deutsche Platzhaltentexte
- Git nach jeder abgeschlossenen Phase:

```bash
git add -A && git commit -m "Phase X: Beschreibung" && git push
```
