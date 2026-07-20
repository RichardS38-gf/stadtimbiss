# Stadtimbiss — Phase 3: Bestellseite (bestellen.html)

## Kontext

Projekt: Stadtimbiss — Restaurant-Bestellshop Frontend-Demo
Arbeitsordner: `C:\Users\richa\OneDrive - MANERI UG\General\Firmen\Unsortiert\Richie unsortiert\ClaudeCode Workspace\Restaurant Online Shop`
GitHub + Vercel sind eingerichtet, Phase 1 + 2 sind abgeschlossen.
Lies vor dem Start: `css/tokens.css`, `css/components.css`, `js/cart.js`

---

## Aufgabe

Baue die vollständige Bestellseite `bestellen.html` mit Menü, Kategoriefilter und funktionierendem Warenkorb-Counter. Das ist das Herzstück der Demo — sie soll sich anfühlen wie eine echte Bestell-App.

Design-Vorbild: Domino's Deutschland (dominos.de) — besonders der Aufbau der Bestellseite.

---

## CSS-Einbindung

```html
<link rel="stylesheet" href="css/reset.css">
<link rel="stylesheet" href="css/tokens.css?v=1">
<link rel="stylesheet" href="css/base.css?v=1">
<link rel="stylesheet" href="css/layout.css?v=1">
<link rel="stylesheet" href="css/components.css?v=1">
<link rel="stylesheet" href="css/bestellen.css?v=1">
```

JS einbinden:
```html
<script type="module" src="js/bestellen.js"></script>
```

---

## Seitenaufbau

### 1. Navigation (sticky, wie index.html)

Gleicher Header wie die Startseite, aber mit Warenkorb-Icon rechts statt "Jetzt bestellen"-Button:

- Links: "Stadtimbiss" Logo-Text → `index.html`
- Rechts: Warenkorb-Button (Icon + Zähler-Badge):
  ```html
  <button class="cart-btn" id="cart-toggle">
    🛒 <span class="cart-badge" id="cart-count">0</span>
  </button>
  ```
- Cart-Badge: runder Kreis, Hintergrund `var(--color-accent)`, weiße Zahl, absolut positioniert
- Badge versteckt wenn 0 Artikel

---

### 2. Lieferung/Abholung-Toggle

Direkt unter der Nav, prominenter Bereich:
- Hintergrund: `var(--color-bg-soft)` (weiß)
- Border-bottom: 1px solid `var(--color-line)`
- Padding: 1rem

Zwei Tab-Buttons nebeneinander (volle Breite auf Mobile):
```html
<div class="order-mode-toggle">
  <button class="mode-btn mode-btn--active" data-mode="lieferung">
    🛵 Lieferung
  </button>
  <button class="mode-btn" data-mode="abholung">
    🏃 Abholung
  </button>
</div>
```

- Aktiver Tab: Hintergrund `var(--color-accent)`, weißer Text
- Inaktiver Tab: weißer Hintergrund, `var(--color-ink)` Text, border 1px solid `var(--color-line)`
- Bei Klick wechselt active-Klasse (JS)
- Unter den Tabs: kleiner Info-Text der je nach Modus wechselt:
  - Lieferung: "Lieferung in ca. 35 Min · Mindestbestellwert 8,00 €"
  - Abholung: "Abholung in ca. 15 Min · Musterstraße 1, Braunschweig"

URL-Parameter `?mode=lieferung` bzw. `?mode=abholung` soll beim Laden den richtigen Tab vorauswählen.

---

### 3. Angebots-Banner (zwischen Nav und Kategorien)

Schmaler roter Banner:
```html
<div class="promo-banner">
  🔥 Dienstags-Deal: 2 Burger kaufen, 1 gratis bekommen!
  <a href="#burger">Jetzt bestellen</a>
</div>
```
- Hintergrund: `var(--color-accent)`
- Weißer Text, zentriert
- Font: Inter 500, klein
- Link: weiß, underline

---

### 4. Sticky Kategorienleiste

Klebt unter der Nav (sticky, top: 60px bzw. 68px je nach Nav-Höhe):
- Hintergrund: `var(--color-bg-soft)`
- Border-bottom: 1px solid `var(--color-line)`
- Horizontal scrollbar auf Mobile (kein Umbruch):

```html
<nav class="category-nav" id="category-nav">
  <a class="cat-link cat-link--active" href="#burger">🍔 Burger</a>
  <a class="cat-link" href="#doener">🥙 Döner</a>
  <a class="cat-link" href="#beilagen">🍟 Beilagen</a>
  <a class="cat-link" href="#getraenke">🥤 Getränke</a>
</nav>
```

CSS:
- `overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch`
- Kein sichtbarer Scrollbar (`::-webkit-scrollbar { display: none }`)
- Aktiver Link: `border-bottom: 3px solid var(--color-accent)`, fette Schrift
- Padding je Link: 0.75rem 1.25rem, min-height 44px

JS: Beim Scrollen automatisch aktiven Link aktualisieren (IntersectionObserver auf Kategorieabschnitte).

---

### 5. Hauptbereich — Menü

Layout auf Desktop: 2 Spalten (Menü 65%, Warenkorb 35% als Sidebar).
Layout auf Mobile: 1 Spalte (Warenkorb kommt als Slide-in Panel, Phase 4).

#### Kategorieabschnitte

Jeder Abschnitt:
```html
<section class="menu-section" id="burger">
  <h2 class="menu-section__title">🍔 Burger</h2>
  <!-- Produktkarten Grid -->
</section>
```

Zwischen Burger- und Döner-Sektion: weiterer Promo-Banner:
```html
<div class="promo-banner promo-banner--dark">
  🥤 Gratis Getränk ab 15 € Bestellwert!
</div>
```
(Dunkler Hintergrund `var(--color-dark)`, weißer Text)

#### Produktkarten auf der Bestellseite

Anders als auf der Startseite — horizontale Karte (Bild links, Info rechts):

```html
<article class="menu-card">
  <img class="menu-card__img" src="..." alt="...">
  <div class="menu-card__body">
    <h3 class="menu-card__name">Double Smash Burger</h3>
    <p class="menu-card__desc">Zwei Patties, Cheddar, Soße, Gewürzgurken</p>
    <div class="menu-card__footer">
      <span class="menu-card__price">8,90 €</span>
      <button class="btn btn--primary btn--sm add-to-cart"
              data-id="burger-1"
              data-name="Double Smash Burger"
              data-price="8.90">
        + Hinzufügen
      </button>
    </div>
  </div>
</article>
```

CSS der `.menu-card`:
- Display: flex, flex-direction: row
- Bild: 100px × 100px, object-fit: cover, flex-shrink: 0 (auf Mobile), 120px auf Desktop
- Body: flex 1, padding 0.75rem
- Name: Poppins 700
- Desc: Inter, klein, muted
- Footer: flex, space-between, align-items center
- Preis: Poppins 800, accent-Farbe
- Border-bottom: 1px solid `var(--color-line)`, letztes Kind kein Border

---

### Menüdaten (Platzhalter)

#### 🍔 Burger (id="burger")

| Name | Beschreibung | Preis | Bild-URL |
|------|-------------|-------|---------|
| Double Smash Burger | Zwei Patties, Cheddar, Soße, Gewürzgurken | 8,90 € | https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300 |
| Classic Cheeseburger | Rindfleisch-Patty, Cheddar, Zwiebeln, Senf | 6,90 € | https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300 |
| BBQ Bacon Burger | Bacon, BBQ-Soße, Ringe, Cheddar | 9,50 € | https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300 |
| Crispy Chicken Burger | Knuspriges Hähnchenfilet, Coleslaw, Soße | 7,90 € | https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300 |
| Veggie Burger | Gemüse-Patty, Salat, Tomate, Avocado-Creme | 7,50 € | https://images.unsplash.com/photo-1550547660-d9450f859349?w=300 |

#### 🥙 Döner (id="doener")

| Name | Beschreibung | Preis | Bild-URL |
|------|-------------|-------|---------|
| Klassischer Döner | Hähnchen, Salat, Tomaten, Knoblauchsoße | 6,50 € | https://images.unsplash.com/photo-1561651188-d207bbec4ec3?w=300 |
| Döner mit Scharf | Wie klassisch, mit scharfer Soße | 6,50 € | https://images.unsplash.com/photo-1561651188-d207bbec4ec3?w=300 |
| Dürüm Döner | Wrap-Version, extra knusprig | 7,00 € | https://images.unsplash.com/photo-1561651188-d207bbec4ec3?w=300 |
| Lahmacun | Türkische Fladenbrot-Pizza, mit Salat | 5,50 € | https://images.unsplash.com/photo-1574484284002-952d92456975?w=300 |

#### 🍟 Beilagen (id="beilagen")

| Name | Beschreibung | Preis | Bild-URL |
|------|-------------|-------|---------|
| Pommes Frites | Klassisch, mit Ketchup | 2,50 € | https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300 |
| Süßkartoffel-Pommes | Mit Dip | 3,50 € | https://images.unsplash.com/photo-1623238913973-21e45cda7b63?w=300 |
| Onion Rings | 8 Stück, knusprig | 3,00 € | https://images.unsplash.com/photo-1639024471283-03518883512d?w=300 |
| Coleslaw | Hausgemachter Krautsalat | 2,00 € | https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=300 |

#### 🥤 Getränke (id="getraenke")

| Name | Beschreibung | Preis | Bild-URL |
|------|-------------|-------|---------|
| Cola 0,5l | Klassisch | 2,50 € | https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300 |
| Cola Zero 0,5l | Ohne Zucker | 2,50 € | https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300 |
| Sprite 0,5l | Zitrone-Limette | 2,50 € | https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300 |
| Wasser 0,5l | Still | 1,50 € | https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300 |
| Ayran 0,25l | Türkisches Joghurtgetränk | 1,50 € | https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300 |

---

### 6. Desktop Warenkorb-Sidebar

Nur auf Desktop sichtbar (ab 1024px), auf Mobile kommt der Slide-in (Phase 4):

```html
<aside class="cart-sidebar" id="cart-sidebar">
  <h3>Deine Bestellung</h3>
  <div class="cart-items" id="cart-items">
    <!-- JS befüllt dies -->
  </div>
  <div class="cart-empty" id="cart-empty">
    <p>Noch keine Artikel im Warenkorb.</p>
  </div>
  <div class="cart-summary" id="cart-summary">
    <div class="cart-summary__row">
      <span>Zwischensumme</span>
      <span id="cart-subtotal">0,00 €</span>
    </div>
    <div class="cart-summary__row">
      <span>Lieferung</span>
      <span>2,50 €</span>
    </div>
    <div class="cart-summary__row cart-summary__total">
      <span>Gesamt</span>
      <span id="cart-total">0,00 €</span>
    </div>
    <a href="checkout.html" class="btn btn--primary btn--full">
      Zur Kasse →
    </a>
  </div>
</aside>
```

CSS Sidebar:
- Width: 340px, flex-shrink: 0
- Position: sticky, top: 130px (unter Nav + Kategorienleiste)
- Max-height: calc(100vh - 150px)
- Overflow-y: auto
- Background: `var(--color-bg-soft)`
- Border: 1px solid `var(--color-line)`
- Padding: 1.5rem
- Versteckt auf Mobile (`display: none` unter 1024px)

---

## JS — bestellen.js

```javascript
import { addToCart, getCart, getCartTotal, getCartCount } from './cart.js';

// Warenkorb-Anzeige aktualisieren
function renderCart() {
  const cart = getCart();
  const itemsEl = document.getElementById('cart-items');
  const emptyEl = document.getElementById('cart-empty');
  const summaryEl = document.getElementById('cart-summary');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-count');

  if (!itemsEl) return;

  countEl.textContent = getCartCount();
  countEl.style.display = getCartCount() > 0 ? 'flex' : 'none';

  if (cart.length === 0) {
    itemsEl.innerHTML = '';
    emptyEl.style.display = 'block';
    summaryEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  summaryEl.style.display = 'block';

  const subtotal = getCartTotal();
  subtotalEl.textContent = subtotal.toFixed(2).replace('.', ',') + ' €';
  totalEl.textContent = (subtotal + 2.50).toFixed(2).replace('.', ',') + ' €';

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item__name">${item.name}</span>
      <span class="cart-item__qty">×${item.qty}</span>
      <span class="cart-item__price">${(item.price * item.qty).toFixed(2).replace('.', ',')} €</span>
    </div>
  `).join('');
}

// "Hinzufügen"-Buttons
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    addToCart({
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: parseFloat(btn.dataset.price)
    });
    renderCart();
    // Visuelles Feedback
    btn.textContent = '✓ Hinzugefügt';
    btn.style.background = '#2a9d4e';
    setTimeout(() => {
      btn.textContent = '+ Hinzufügen';
      btn.style.background = '';
    }, 1000);
  });
});

// Lieferung/Abholung Toggle
const modeBtns = document.querySelectorAll('.mode-btn');
const modeInfo = document.getElementById('mode-info');

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => b.classList.remove('mode-btn--active'));
    btn.classList.add('mode-btn--active');
    if (modeInfo) {
      modeInfo.textContent = btn.dataset.mode === 'lieferung'
        ? 'Lieferung in ca. 35 Min · Mindestbestellwert 8,00 €'
        : 'Abholung in ca. 15 Min · Musterstraße 1, Braunschweig';
    }
  });
});

// URL-Parameter auslesen für Modus
const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');
if (mode) {
  const targetBtn = document.querySelector(`[data-mode="${mode}"]`);
  if (targetBtn) targetBtn.click();
}

// IntersectionObserver für aktive Kategorie
const sections = document.querySelectorAll('.menu-section');
const catLinks = document.querySelectorAll('.cat-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      catLinks.forEach(l => l.classList.remove('cat-link--active'));
      const active = document.querySelector(`.cat-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('cat-link--active');
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(s => observer.observe(s));

// Initial rendern
renderCart();
```

---

## Wichtige Regeln

- Mobile-first: Basis-CSS für < 1024px (1-Spalten-Layout), Desktop-Sidebar erst ab 1024px
- Sticky Kategorienleiste: `position: sticky; top: 68px` (Höhe der Nav)
- Unsplash-Bilder: `loading="lazy"`, definierte Höhe damit kein Layout-Shift
- Alle "Hinzufügen"-Buttons: min. 44px Touch-Target
- Kein Lorem Ipsum

---

## Erwartetes Ergebnis

- `bestellen.html` vollständig mit allen 4 Kategorien und 18 Gerichten
- `css/bestellen.css` mit seitenspezifischen Styles
- `js/bestellen.js` funktioniert: Artikel in Warenkorb, Counter aktualisiert, Modus-Toggle
- Desktop: Sidebar zeigt Warenkorb live
- Mobile: Sidebar versteckt (Slide-in kommt in Phase 4)
- Git-Push: `git add -A && git commit -m "Phase 3: Bestellseite" && git push`
- Kurze Rückmeldung an Florian. Warten auf Go für Phase 4.
