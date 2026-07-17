# Stadtimbiss — Phase 1: Grundlage

## Kontext

Projekt: Stadtimbiss — Restaurant-Bestellshop Frontend-Demo
Arbeitsordner: `C:\Users\richa\OneDrive - MANERI UG\General\Firmen\Unsortiert\Richie unsortiert\ClaudeCode Workspace\Restaurant Online Shop`
Kein Backend, keine Datenbank — reine Frontend-Demo.
Stack: HTML / CSS / Vanilla JS. Hosting: GitHub + Vercel.

Orientiere dich an der Dateistruktur und CSS-Architektur des SIB-Projekts:
`C:\Users\richa\OneDrive - MANERI UG\General\Firmen\Unsortiert\Richie unsortiert\ClaudeCode Workspace\SIB`

---

## Aufgabe

Lege die vollständige Projektgrundlage an: Ordnerstruktur, alle CSS-Grunddateien, GitHub-Repo, Vercel-Deployment.

---

## Schritt 1 — Ordnerstruktur anlegen

```
Restaurant Online Shop/
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
│   ├── cart.js
│   └── bestellen.js
├── img/
│   └── .gitkeep
├── index.html          (leere Datei, nur HTML-Grundgerüst)
├── bestellen.html      (leere Datei, nur HTML-Grundgerüst)
├── checkout.html       (leere Datei, nur HTML-Grundgerüst)
├── danke.html          (leere Datei, nur HTML-Grundgerüst)
└── README.md
```

---

## Schritt 2 — reset.css

```css
/* reset.css — Stadtimbiss */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

img, video {
  max-width: 100%;
  display: block;
}

input, button, textarea, select {
  font: inherit;
}

ul, ol {
  list-style: none;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
  background: none;
  border: none;
}

/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&family=Inter:wght@400;500;600&display=swap');
```

---

## Schritt 3 — tokens.css

```css
/* tokens.css — Stadtimbiss */
:root {
  /* Farben */
  --color-accent:     #E63946;
  --color-accent-dk:  #C1121F;
  --color-bg:         #F8F8F8;
  --color-bg-soft:    #FFFFFF;
  --color-ink:        #1A1A1A;
  --color-muted:      #888888;
  --color-line:       #E0E0E0;
  --color-dark:       #1A1A1A;
  --color-on-dark:    #FFFFFF;

  /* Typografie */
  --font-head: 'Poppins', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 5rem;

  /* Container */
  --container-pad-mobile:  1rem;
  --container-pad-tablet:  1.5rem;
  --container-pad-desktop: 2rem;
  --max-content-width:     1200px;

  /* Typografische Skala */
  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.25rem;
  --text-2xl:  1.5rem;
  --text-3xl:  2rem;
  --text-4xl:  2.5rem;
  --text-5xl:  3.5rem;

  /* Transitions */
  --transition: 0.2s ease;

  /* Keine border-radius auf primären Elementen */
  --radius-sm: 4px;
  --radius-md: 8px;
}
```

---

## Schritt 4 — base.css

```css
/* base.css — Stadtimbiss */
body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 400;
  color: var(--color-ink);
  background-color: var(--color-bg);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-head);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: var(--color-ink);
}

h1 { font-size: var(--text-4xl); }
h2 { font-size: var(--text-3xl); }
h3 { font-size: var(--text-2xl); }
h4 { font-size: var(--text-xl); }

p {
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.7;
  color: var(--color-ink);
}

a:hover {
  opacity: 0.75;
  transition: opacity var(--transition);
}

.label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-muted);
}

hr {
  border: none;
  border-top: 1px solid var(--color-line);
}

/* Mobile-first Typgrössen */
@media (max-width: 767px) {
  h1 { font-size: var(--text-3xl); }
  h2 { font-size: var(--text-2xl); }
  h3 { font-size: var(--text-xl); }
}
```

---

## Schritt 5 — layout.css

```css
/* layout.css — Stadtimbiss */
.container {
  width: 100%;
  max-width: var(--max-content-width);
  margin-inline: auto;
  padding-inline: var(--container-pad-mobile);
}

@media (min-width: 768px) {
  .container {
    padding-inline: var(--container-pad-tablet);
  }
}

@media (min-width: 1024px) {
  .container {
    padding-inline: var(--container-pad-desktop);
  }
}

.section {
  padding-block: var(--space-7);
}

@media (min-width: 768px) {
  .section {
    padding-block: var(--space-8);
  }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}

.section-header h2 {
  margin: 0;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-5);
}

.grid-3 {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-5);
}

.grid-4 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

@media (min-width: 768px) {
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-4 { grid-template-columns: repeat(4, 1fr); }
}
```

---

## Schritt 6 — components.css

```css
/* components.css — Stadtimbiss */

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 0.75rem 1.5rem;
  min-height: 44px;
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 600;
  line-height: 1;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
}

.btn--primary {
  background: var(--color-accent);
  color: var(--color-on-dark);
  border-color: var(--color-accent);
}
.btn--primary:hover {
  background: var(--color-accent-dk);
  border-color: var(--color-accent-dk);
  opacity: 1;
}

.btn--outline {
  background: transparent;
  color: var(--color-accent);
  border-color: var(--color-accent);
}
.btn--outline:hover {
  background: var(--color-accent);
  color: var(--color-on-dark);
  opacity: 1;
}

.btn--outline-light {
  background: transparent;
  color: var(--color-on-dark);
  border-color: var(--color-on-dark);
}
.btn--outline-light:hover {
  background: var(--color-on-dark);
  color: var(--color-ink);
  opacity: 1;
}

.btn--dark {
  background: var(--color-dark);
  color: var(--color-on-dark);
  border-color: var(--color-dark);
}
.btn--dark:hover {
  background: #333;
  opacity: 1;
}

.btn--full {
  width: 100%;
}

.btn--sm {
  padding: 0.5rem 1rem;
  font-size: var(--text-sm);
  min-height: 36px;
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  font-size: var(--text-xs);
  font-weight: 600;
  background: var(--color-accent);
  color: var(--color-on-dark);
}

.badge--dark {
  background: var(--color-dark);
  color: var(--color-on-dark);
}

/* Karte */
.card {
  background: var(--color-bg-soft);
  border: 1px solid var(--color-line);
  overflow: hidden;
  transition: box-shadow var(--transition);
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

/* Produktkarte */
.product-card {
  background: var(--color-bg-soft);
  border: 1px solid var(--color-line);
  overflow: hidden;
  transition: box-shadow var(--transition);
}

.product-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.product-card__img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  background: var(--color-line);
}

.product-card__body {
  padding: var(--space-4);
}

.product-card__name {
  font-family: var(--font-head);
  font-weight: 700;
  font-size: var(--text-lg);
  margin-bottom: var(--space-2);
}

.product-card__desc {
  font-size: var(--text-sm);
  color: var(--color-muted);
  margin-bottom: var(--space-4);
}

.product-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.product-card__price {
  font-family: var(--font-head);
  font-weight: 800;
  font-size: var(--text-xl);
  color: var(--color-accent);
}
```

---

## Schritt 7 — Leere HTML-Grundgerüste

Alle vier HTML-Dateien mit diesem Grundgerüst anlegen (Titel jeweils anpassen):

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stadtimbiss</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/tokens.css?v=1">
  <link rel="stylesheet" href="css/base.css?v=1">
  <link rel="stylesheet" href="css/layout.css?v=1">
  <link rel="stylesheet" href="css/components.css?v=1">
</head>
<body>
  <p>Kommt bald.</p>
</body>
</html>
```

---

## Schritt 8 — cart.js (Grundgerüst)

```javascript
// cart.js — Stadtimbiss Warenkorb-Logik

const CART_KEY = 'stadtimbiss_cart';

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

export function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

export function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = qty;
    if (item.qty <= 0) return removeFromCart(id);
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

export function getCartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}
```

---

## Schritt 9 — README.md

```markdown
# Stadtimbiss

Frontend-Demo eines Restaurant-Bestellshops. Keine Backend-Anbindung.

**Stack:** HTML / CSS / Vanilla JS
**Hosting:** Vercel

## Seiten
- `index.html` — Startseite
- `bestellen.html` — Bestellseite mit Menü und Warenkorb
- `checkout.html` — Checkout-Formular
- `danke.html` — Bestellbestätigung

## Entwicklung
Dateien direkt bearbeiten, git push löst Vercel-Deployment aus.
```

---

## Schritt 10 — GitHub + Vercel

1. GitHub-Repo anlegen: `stadtimbiss` (public)
2. Alles pushen: `git add -A && git commit -m "Phase 1: Grundlage" && git push`
3. Vercel verbinden: New Project → Import Git Repository → stadtimbiss
4. Kein Build-Command, Output Directory leer lassen (statisches HTML)
5. Deploy

**Nach Abschluss:** Vercel-URL und GitHub-URL in `Specs/projektplan.md` eintragen, dann kurze Rückmeldung an Florian. Warten auf Go für Phase 2.
