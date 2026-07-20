# Stadtimbiss — Phase 2: Startseite (index.html)

## Kontext

Projekt: Stadtimbiss — Restaurant-Bestellshop Frontend-Demo
Arbeitsordner: `C:\Users\richa\OneDrive - MANERI UG\General\Firmen\Unsortiert\Richie unsortiert\ClaudeCode Workspace\Restaurant Online Shop`
GitHub + Vercel sind bereits eingerichtet (Phase 1 abgeschlossen).
CSS-Grunddateien (reset, tokens, base, layout, components) existieren bereits.

Lies vor dem Start die bestehenden CSS-Dateien vollständig, damit du die Tokens und Klassen kennst.

---

## Aufgabe

Baue die vollständige Startseite `index.html`. Mobile-first.

---

## CSS-Einbindung

```html
<link rel="stylesheet" href="css/reset.css">
<link rel="stylesheet" href="css/tokens.css?v=1">
<link rel="stylesheet" href="css/base.css?v=1">
<link rel="stylesheet" href="css/layout.css?v=1">
<link rel="stylesheet" href="css/components.css?v=1">
<link rel="stylesheet" href="css/index.css?v=1">
```

Seitenspezifisches CSS in `css/index.css`. Bei Änderungen Versionsnummer hochzählen.

---

## Seitenaufbau (von oben nach unten)

### 1. Navigation (sticky)

- Hintergrund: `var(--color-bg-soft)` (weiß)
- Border-bottom: 1px solid `var(--color-line)`
- Box-shadow: leicht (0 2px 8px rgba(0,0,0,0.08))
- Position: sticky, top: 0, z-index: 100
- Innen (Container, flex, space-between):
  - Links: Logo-Text "Stadtimbiss" — Poppins 800, Farbe `var(--color-accent)`, Font-Size ~1.4rem
  - Rechts: Button `.btn.btn--primary` "Jetzt bestellen →" → `bestellen.html`
- Höhe: 60px auf Mobile, 68px auf Desktop
- Touch-Target Button: min. 44px

---

### 2. Hero-Sektion

- Vollbild-Hintergrundbild: `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200`
- `background-size: cover; background-position: center`
- Dunkler Overlay: `background: rgba(0,0,0,0.58)` als Pseudo-Element oder inneres Div
- Min-height: 60vh auf Mobile, 80vh auf Desktop
- Display flex, align-items center, justify-content center
- Inhalt zentriert (text-align center), weißer Text:
  - Kleines Label oben: "🍔 Braunschweigs bester Imbiss" — Inter 600, uppercase, 0.75rem, leicht transparent (opacity 0.85)
  - H1: "Stadtimbiss" — Poppins 800, weiß, groß (3rem Mobile, 4.5rem Desktop)
  - Subline `<p>`: "Frisch. Schnell. Lecker." — Inter 400, 1.1rem, weiß, opacity 0.9
  - Zwei Buttons (gap zwischen ihnen):
    - `.btn.btn--primary` "🛵 Lieferung bestellen" → `bestellen.html?mode=lieferung`
    - `.btn.btn--outline-light` "🏃 Selbst abholen" → `bestellen.html?mode=abholung`
  - Auf Mobile (< 768px): Buttons untereinander, volle Breite (`btn--full`)
  - Auf Desktop: nebeneinander, normale Breite

---

### 3. Info-Banner

- Hintergrund: `var(--color-accent)` (Rot)
- Weißer Text
- Drei Punkte mit Trennlinien (|) dazwischen:
  - "🕐 Mo–So 11–23 Uhr"
  - "🛵 Lieferung ab 2,50 €"
  - "⏱ 30–45 Min Lieferzeit"
- Padding: 1rem oben/unten
- Auf Desktop: alle drei nebeneinander (flex, justify center, gap)
- Auf Mobile (< 768px): alle drei untereinander, zentriert
- Font: Inter 500, 0.95rem

---

### 4. Angebots-Sektion

- Hintergrund: `var(--color-bg)` (hellgrau)
- Section padding oben/unten
- Überschrift `<h2>` zentriert: "Aktuelle Angebote"
- 2 Angebotskarten nebeneinander (`.grid-2`):
  
  **Karte 1 — "2 für 1":**
  - Hintergrund: `var(--color-accent)` (Rot)
  - Weißer Text
  - Großes Emoji: 🍔 (2.5rem)
  - Titel (Poppins 800, 2rem): "2 für 1"
  - Untertitel: "Jeden Dienstag auf alle Burger"
  - Button `.btn.btn--outline-light` "Jetzt bestellen →" → `bestellen.html`
  - Padding: 2rem
  
  **Karte 2 — "Gratis Getränk":**
  - Hintergrund: `var(--color-dark)` (fast schwarz)
  - Weißer Text
  - Großes Emoji: 🥤 (2.5rem)
  - Titel (Poppins 800, 2rem): "Gratis Getränk"
  - Untertitel: "Ab 15 € Bestellwert"
  - Button `.btn.btn--outline-light` "Jetzt bestellen →" → `bestellen.html`
  - Padding: 2rem

- Auf Mobile: Karten untereinander, volle Breite

---

### 5. Kategorie-Vorschau

- Hintergrund: `var(--color-bg-soft)` (weiß)
- Section padding
- Section-Header: H2 "Unsere Speisekarte" links, Link "Alle ansehen →" rechts (Farbe accent)
- 4 Kategoriekarten in `.grid-4` (2×2 auf Mobile, 4×1 auf Desktop):

  | Emoji | Name | Anzahl |
  |-------|------|--------|
  | 🍔 | Burger | 8 Gerichte |
  | 🥙 | Döner | 6 Gerichte |
  | 🍟 | Beilagen | 5 Gerichte |
  | 🥤 | Getränke | 10 Getränke |

  Jede Karte:
  - Weißer Hintergrund, border 1px solid `var(--color-line)`
  - Padding 1.5rem, text-align center
  - Großes Emoji (3rem)
  - Name (Poppins 700, 1.1rem)
  - Anzahl-Text (Inter, klein, muted)
  - Hover: border-color wechselt zu `var(--color-accent)`, leichter Box-Shadow
  - Klick → `bestellen.html#[kategorie]`

---

### 6. Bestseller-Sektion

- Hintergrund: `var(--color-bg)` (hellgrau)
- Section padding
- Section-Header: H2 "Unsere Bestseller" links, Link "Alle Gerichte →" rechts
- 3 Produktkarten nebeneinander (`.grid-3`, auf Mobile untereinander):

  Nutze die `.product-card` Komponente aus `components.css`.

  **Produktdaten (Platzhalter):**

  1. Name: "Double Smash Burger"
     Beschreibung: "Zwei Patties, Cheddar, Soße, Gewürzgurken"
     Preis: "8,90 €"
     Bild: `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400`

  2. Name: "Klassischer Döner"
     Beschreibung: "Mit Salat, Tomaten und Knoblauchsoße"
     Preis: "6,50 €"
     Bild: `https://images.unsplash.com/photo-1561651188-d207bbec4ec3?w=400`

  3. Name: "Crispy Chicken Burger"
     Beschreibung: "Knuspriges Hähnchenfilet, Coleslaw, Soße"
     Preis: "7,90 €"
     Bild: `https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400`

  Button auf jeder Karte: `.btn.btn--primary.btn--full` "In den Warenkorb" → `bestellen.html`

---

### 7. Footer

- Hintergrund: `var(--color-dark)` (#1A1A1A)
- Weißer Text
- Padding: 3rem oben, 2rem unten
- Zweispaltig auf Desktop (flex/grid), einspaltig auf Mobile:

  **Spalte links:**
  - "Stadtimbiss" (Poppins 800, 1.3rem, weiß)
  - Claim: "Frisch aus der Küche — direkt zu dir." (Inter, klein, opacity 0.7)
  - Abstand
  - Adresse: "Musterstraße 1, 38100 Braunschweig"
  - Telefon: "0531 / 000 000"
  - E-Mail: "info@stadtimbiss.de"

  **Spalte rechts (oder unter Links):**
  - Links (weißer Text, opacity 0.7, hover opacity 1):
    - Impressum (href="#")
    - Datenschutz (href="#")
    - Kontakt (href="#")
    - Allergene & Zusatzstoffe (href="#")

- Trennlinie (1px solid rgba(255,255,255,0.15))
- Unterzeile: "© 2025 Stadtimbiss — Alle Rechte vorbehalten" (zentriert, Inter, klein, opacity 0.5)

---

## Wichtige Regeln

- Mobile-first: Basis-CSS für < 768px, dann @media (min-width: 768px), dann (min-width: 1024px)
- Keine horizontalen Scrollbalken
- Alle Bilder: `loading="lazy"`, `alt`-Text, `object-fit: cover`
- Touch-Targets: min. 44px Höhe für alle Buttons und Links
- Keine Lorem-Ipsum-Texte
- Unsplash-Bilder direkt per URL (kein Download nötig)

---

## Erwartetes Ergebnis

Nach Abschluss:
- `index.html` vollständig gebaut und live auf Vercel
- `css/index.css` mit allen seitenspezifischen Styles
- Git-Push: `git add -A && git commit -m "Phase 2: Startseite" && git push`
- Kurze Rückmeldung an Florian mit Vercel-URL. Warten auf Go für Phase 3.
