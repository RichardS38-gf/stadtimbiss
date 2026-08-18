# Stadtimbiss — Phase 5: Mobile-Polish & Feinschliff

## Kontext

Projekt: Stadtimbiss — Restaurant-Bestellshop Frontend-Demo
Arbeitsordner: `C:\Users\richa\OneDrive - MANERI UG\General\Firmen\Unsortiert\Richie unsortiert\ClaudeCode Workspace\Restaurant Online Shop`
Alle vorherigen Phasen sind abgeschlossen. Dies ist der finale Schliff vor der Demo.

---

## Aufgabe

Optimiere alle Seiten für die Handy-Präsentation und füge kleine Details hinzu, die die Demo überzeugend wirken lassen.

---

## 1. Mobile-Durchgang (alle 4 Seiten)

Teste und korrigiere auf folgenden Breiten:
- 375px (iPhone SE / 13 mini)
- 390px (iPhone 14/15)
- 430px (iPhone Plus)
- 360px (Standard Android)

Checkliste pro Seite:
- [ ] Kein horizontaler Scrollbalken
- [ ] Alle Buttons min. 44px hoch
- [ ] Schriften lesbar (min. 16px für Body-Text, um iOS-Zoom zu verhindern)
- [ ] Bilder nicht verzerrt
- [ ] Navigation auf Mobile sauber
- [ ] Footer auf Mobile richtig gestapelt

---

## 2. Favicon

Erstelle ein einfaches SVG-Favicon mit Hamburger-Emoji oder rotem "S":

```html
<!-- In allen HTML-Dateien im <head> ergänzen: -->
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍔</text></svg>">
```

---

## 3. Micro-Animationen

### "In den Warenkorb" Button-Feedback (bereits in Phase 3, sicherstellen dass es funktioniert)
Beim Klick: Button kurz grün und "✓ Hinzugefügt", nach 1 Sekunde zurück.

### Warenkorb-Badge Bounce
Wenn ein Artikel hinzugefügt wird, kurze Bounce-Animation auf dem Badge:

```css
@keyframes badge-bounce {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.4); }
  100% { transform: scale(1); }
}

.cart-badge.bounce {
  animation: badge-bounce 0.3s ease;
}
```

JS: Nach addToCart die `.bounce`-Klasse kurz hinzufügen und wieder entfernen.

### Smooth Scroll für Kategorien-Links
Bereits durch `html { scroll-behavior: smooth }` in reset.css — sicherstellen dass es aktiv ist.

### Sticky Nav Shadow
Nav bekommt beim Scrollen einen stärkeren Box-Shadow:

```javascript
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.site-nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
});
```

```css
.site-nav.scrolled {
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
}
```

---

## 4. Performance

- Alle Unsplash-Bilder: `loading="lazy"` und explizite `width` + `height` Attribute setzen
- CSS: Keine ungenutzten `@import` in Dateien
- JS: Sicherstellen dass alle `<script>` Tags `type="module"` haben oder am Ende des Body stehen

---

## 5. Kleinigkeiten die bei der Demo auffallen

- Alle Links zwischen Seiten testen (index → bestellen → checkout → danke → index)
- "Zurück zur Startseite" auf der Danke-Seite funktioniert
- Warenkorb wird auf der danke.html geleert (clearCart())
- Kategorielinks in der Nav scrollen wirklich zu den Sektionen
- Promo-Banner-Link "#burger" scrollt zur Burger-Sektion

---

## 6. Optional: Open Graph Tags (für Teilen via WhatsApp etc.)

In allen HTML-Dateien im `<head>`:
```html
<meta property="og:title" content="Stadtimbiss — Jetzt online bestellen">
<meta property="og:description" content="Frisch. Schnell. Lecker. Jetzt online bestellen und liefern lassen.">
<meta property="og:image" content="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600">
```

---

## Erwartetes Ergebnis

- Demo ist auf iPhone-Größen getestet und funktioniert einwandfrei
- Favicon sichtbar im Browser-Tab
- Alle Animationen laufen flüssig
- Kompletter Flow (Startseite → Bestellen → Warenkorb → Checkout → Danke) ohne Fehler
- Git-Push: `git add -A && git commit -m "Phase 5: Mobile-Polish und Feinschliff" && git push`
- Demo-URL an Florian weitergeben — fertig für Akquise!
