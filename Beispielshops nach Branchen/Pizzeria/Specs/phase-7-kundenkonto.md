# Phase 7: Kundenkonto, Stempelkarte, Demo-Login

**Stand:** August 2026
**Repo:** `C:\Users\richa\OneDrive - MANERI UG\ChefShops - Dokumente\Claude Workspace\Restaurant Online Shop`
**Zielshops:** Pizzeria (Leitimplementierung), Burger, Asiatisch
**Voraussetzung:** `Specs/datenmodell.md` gelesen

---

## Ziel

Ein vollständiger Kundenkontobereich, der ohne Backend läuft und trotzdem so gebaut ist, dass er später mit etwa einem Arbeitstag auf Supabase umgestellt werden kann.

Besucher der Demo-Shops sind automatisch als Beispielkunde angemeldet und können sämtliche Funktionen sofort ausprobieren, ohne sich zu registrieren. Der Gastronom sieht in der Präsentation direkt, was seine eigenen Kunden bekämen.

---

## Demo-Prinzip

**Auto-Login.** Findet `auth.js` beim Laden keine Session im localStorage, legt es automatisch die Demo-Session an: Max Mustermann, zwei Adressen, drei vergangene Bestellungen, 6 von 8 Stempeln, ein offener Gutschein, zwei Favoriten.

**Eigene Sandbox pro Besucher.** Alle Daten liegen im localStorage des Besuchers. Änderungen stören niemanden sonst. Wer den Browser-Speicher leert, bekommt wieder den Ausgangszustand.

**Sichtbarer Demo-Hinweis.** Ein schmaler Streifen unter der Navigation: "Demo-Modus: angemeldet als Max Mustermann" plus die Links "Zurücksetzen" und "Abmelden". Ohne den Hinweis wirkt der eingeloggte Zustand wie ein Fehler, mit ihm wie eine bewusste Funktion.

**Abmelden bleibt wichtig.** Der Gastronom will auch Login und Registrierung sehen, das ist Teil dessen, was er kauft. Über "Abmelden" landet er im ausgeloggten Zustand, über einen Klick auf `anmelden.html` wieder im Konto.

**Zurücksetzen.** Löscht alle `si_`-Keys und lädt die Demo-Daten neu. Notwendig, falls ein Besucher die Stempelkarte leergeräumt hat und kurz danach vorgeführt werden soll.

---

## Neue und geänderte Dateien

Pro Shop:

```
konto.html          neu    Kontobereich mit Tab-Navigation
anmelden.html       neu    Login und Registrierung
js/auth.js          neu    Datenschicht, einzige Stelle mit localStorage-Zugriff
js/konto.js         neu    UI-Logik des Kontobereichs
js/demo-daten.js    neu    Shop-spezifische Beispieldaten
css/konto.css       neu    Styling, ausschließlich über Tokens
index.html          geändert   Nav plus Konto-Link und Demo-Banner
bestellen.html      geändert   Nav, Favoriten-Herz an Produktkarten
checkout.html       geändert   Adresse und Zahlungsart vorbefüllen, Gutschein einlösen
reservieren.html    geändert   Nav, Formular vorbefüllen
danke.html          geändert   Nav, Stempel-Hinweis nach Bestellung
```

`auth.js`, `konto.js` und `konto.css` sind shop-neutral und werden unverändert kopiert. Nur `demo-daten.js` unterscheidet sich.

Burger fehlen bisher `checkout.html` und `danke.html`, beide werden in der schlanken Variante ergänzt. Asiatisch hat beide bereits.

---

## Schnittstelle js/auth.js

Alle Funktionen sind `async` und geben Promises zurück, auch wenn sie heute synchron lesen. Alle Objekte nutzen snake_case entsprechend `datenmodell.md`.

```js
// Konfiguration ganz oben in der Datei, damit sie im Kundengespraech
// in Sekunden anpassbar ist
export const TREUE = {
  target_stamps: 8,
  min_order_value: 15.00,
  reward_description: 'Ein Hauptgericht gratis',
  voucher_validity_days: 60
};

// Session
async function getSession()
async function login(email, password)
async function register(daten)
async function logout()
async function resetDemo()

// Profil
async function getProfile()
async function updateProfile(patch)
async function deleteAccount()
async function exportData()

// Adressen
async function getAddresses()
async function addAddress(adresse)
async function updateAddress(id, patch)
async function deleteAddress(id)
async function setDefaultAddress(id)

// Zahlungsarten
async function getPaymentMethods()
async function addPaymentMethod(methode)
async function deletePaymentMethod(id)
async function setDefaultPaymentMethod(id)

// Bestellungen
async function getOrders()
async function getOrder(id)
async function createOrder(bestellung)
async function reorder(id)          // legt Positionen in den Warenkorb

// Treueprogramm
async function getStampCard()       // { stamps_count, target_stamps, status }
async function getVouchers()
async function redeemVoucher(code)

// Favoriten
async function getFavorites()
async function toggleFavorite(product_id)
async function isFavorite(product_id)

// Reservierungen
async function getReservations()
async function createReservation(reservierung)
async function cancelReservation(id)
```

**Aufbau der Datei:** ganz oben ein Adapter-Objekt, das den localStorage kapselt. Alle öffentlichen Funktionen greifen nur darauf zu. Beim Umstieg auf Supabase wird ausschließlich dieses Objekt ersetzt.

**Stempel-Vergabe in der Demo:** `createOrder()` vergibt den Stempel direkt, wenn `subtotal >= TREUE.min_order_value` und kein Gutschein eingelöst wurde. In der Demo unkritisch, weil es nichts zu betrügen gibt. Im Echtbetrieb übernimmt das die Postgres-Funktion aus `datenmodell.md`, die Schnittstelle bleibt gleich.

---

## Seite konto.html

Tab-Navigation, auf Mobile horizontal scrollbar wie die Kategorienleiste in `bestellen.html`.

### Tab Übersicht

- Begrüßung mit Vornamen
- Stempelkarte als Blickfang, siehe unten
- Letzte Bestellung mit Button "Nochmal bestellen"
- Offene Gutscheine, falls vorhanden
- Kurzinfo Standardadresse und Standardzahlungsart

### Tab Bestellungen

Liste, neueste zuerst. Pro Eintrag:

- Bestellnummer und Datum
- Statusbadge, Farbe über `--color-accent` bei laufenden, `--color-muted` bei abgeschlossenen
- Positionen zusammengefasst, z.B. "3 Artikel"
- Gesamtbetrag
- Aufklappbar für die Einzelpositionen
- Button "Nochmal bestellen", legt alles in den Warenkorb und leitet auf `bestellen.html`

Der Reorder-Button ist die wichtigste Funktion im ganzen Konto. Er gehört sichtbar an jede Bestellung, nicht ins Aufklappmenü.

### Tab Adressen

- Karten nebeneinander, Standardadresse mit Badge markiert
- Aktionen je Karte: Bearbeiten, Löschen, Als Standard
- Button "Neue Adresse", öffnet ein Modal mit demselben Formularraster wie `checkout.html`

### Tab Zahlung

- Liste der hinterlegten Zahlungsarten
- In der Demo nur Bar und EC bei Lieferung, dazu eine deaktivierte Karte "Kreditkarte hinterlegen" mit Badge "Bald verfügbar"
- Hinweistext: Kartendaten werden niemals bei uns gespeichert, sondern beim Zahlungsdienstleister

### Tab Stempelkarte

- Große Darstellung, siehe unten
- Darunter die Teilnahmebedingungen in Kurzform, die acht Regeln aus `datenmodell.md`
- Liste der Gutscheine mit Code, Beschreibung, gültig bis, Status

### Tab Favoriten

- Produktkarten wie in `bestellen.html`
- Button "In den Warenkorb"
- Herz zum Entfernen

### Tab Reservierungen

- Kommende und vergangene Reservierungen
- Stornieren möglich bei kommenden
- Button "Neue Reservierung", verlinkt auf `reservieren.html`

### Tab Einstellungen

- Profilfelder: Vorname, Nachname, E-Mail, Telefon, Geburtsdatum optional
- Checkbox Werbeeinwilligung, klar getrennt vom Konto
- Button "Daten exportieren", lädt eine JSON-Datei
- Button "Konto löschen" mit Sicherheitsabfrage
- Beide letzten Punkte sind im Echtbetrieb Pflicht und gehören deshalb schon in die Demo

---

## Stempelkarte

Visuell der Verkaufsmoment des ganzen Bereichs. Nicht als Fortschrittsbalken bauen, sondern als echte Karte mit einzelnen Stempelfeldern.

- Raster aus `target_stamps` Kreisen, 4 pro Reihe auf Mobile
- Gefüllte Stempel: Hintergrund `--color-accent`, darin ein Häkchen in `var(--color-on-accent, #fff)`
- Leere Stempel: Rahmen `2px dashed var(--color-line)`, transparent
- Der zuletzt gesetzte Stempel bekommt beim Laden eine kurze Scale-Animation
- Darunter Text: "Noch 2 Bestellungen bis zu deinem Gratisgericht"
- Ist die Karte voll: Karte wechselt auf Akzentfarbe, Text "Deine Belohnung wartet", Button "Gutschein ansehen"

**Zweitplatzierung im Warenkorb.** Eine kompakte Zeile im Warenkorb-Drawer und im Checkout: "Diese Bestellung bringt dir Stempel 7 von 8". Das ist der Moment, in dem der Kunde den Warenkorb noch aufstockt. Nur einblenden, wenn die Zwischensumme den Mindestbestellwert erreicht, sonst umgekehrt: "Noch 3,20 Euro bis zum nächsten Stempel", das ist der stärkere Anreiz.

---

## Navigation und Demo-Banner

In allen Seiten des Shops:

**Eingeloggt:** Konto-Icon plus Vorname rechts in der Nav, führt auf `konto.html`. Auf Mobile nur das Icon.

**Ausgeloggt:** Textlink "Anmelden" führt auf `anmelden.html`.

**Demo-Banner** direkt unter der Nav, volle Breite, Hintergrund `--color-bg-soft`, Rahmen unten `--color-line`, Schriftgröße `--text-xs`:

```
Demo-Modus: angemeldet als Max Mustermann     Zurücksetzen · Abmelden
```

Der Banner wird von `auth.js` gerendert, nicht in jede HTML-Datei kopiert. Eine Funktion `renderDemoBanner()`, die an eine leere `<div id="demo-banner">` andockt.

---

## Integration in checkout.html

- Ist ein Kunde angemeldet, wird das Adressformular aus der Standardadresse vorbefüllt
- Darüber ein Auswahlfeld "Andere Adresse verwenden", falls mehrere hinterlegt sind
- Zahlungsart auf die Standardzahlungsart vorausgewählt
- Neues Feld "Gutscheincode", prüft gegen `getVouchers()`, zieht bei Erfolg den Rabatt ab
- Nach erfolgreichem Absenden `createOrder()` aufrufen, dann auf `danke.html`
- Gastbestellung bleibt jederzeit möglich, das Konto ist nie Voraussetzung

Auf `danke.html` ein Hinweis, falls ein Stempel vergeben wurde: "Stempel 7 von 8 gesammelt", mit Link ins Konto.

---

## CSS-Konventionen

`konto.css` wird in drei Shops mit sehr unterschiedlichen Designs eingesetzt. Asiatisch ist ein Dark Theme mit Gold-Akzent, Burger ein warmes Creme mit Diner-Rot, Pizzeria hell mit Signalrot.

**Regeln:**

1. Keine festen Farbwerte. Ausschließlich Tokens.
2. Nicht alle Tokens existieren in allen Shops. Immer mit Fallback arbeiten:
   - `var(--color-on-accent, #fff)`, fehlt in Pizzeria, ist in Asiatisch dunkel
   - `var(--radius-md, 8px)`, existiert nur in Pizzeria
   - `var(--color-bg-card, var(--color-bg-soft))`, existiert nur in Asiatisch
3. Keine Annahme über hell oder dunkel. Karten bekommen `--color-bg-soft`, Text `--color-ink`, Rahmen `--color-line`.
4. Keine `box-shadow` mit schwarzem Schatten, auf dunklem Grund unsichtbar. Stattdessen Rahmen über `--color-line`.
5. Mobile first, Breakpoints bei 768px und 1024px.
6. Bei jeder Änderung Versionsnummer in der Einbindung hochzählen.

Neue Klassen: `konto-tabs`, `konto-tab`, `konto-panel`, `stamp-card`, `stamp-slot`, `stamp-slot--filled`, `voucher-card`, `order-row`, `order-row__toggle`, `address-card`, `address-card--default`, `demo-banner`.

---

## iOS-Fixes beachten

Aus den bekannten Problemen des Projekts:

- Datumsfeld im Profil und in Reservierungen: `height: 48px; -webkit-appearance: none; appearance: none;`
- Adress-Modal: `min-width: 0; box-sizing: border-box;` auf jeder Ebene der Grid-Verschachtelung, nicht nur am Input
- Tab-Leiste unter 480px scrollbar, nicht umbrechend

---

## Reihenfolge der Umsetzung

1. `auth.js` mit Adapter und allen Funktionen, dazu `demo-daten.js` für Pizzeria
2. `konto.css` und `konto.html` mit Tabs, zunächst nur Übersicht und Bestellungen
3. Stempelkarte inklusive Animation
4. Adressen, Zahlung, Favoriten, Reservierungen, Einstellungen
5. `anmelden.html` mit Login, Registrierung, Passwort vergessen
6. Nav und Demo-Banner in allen Pizzeria-Seiten
7. Checkout-Integration und Gutscheineinlösung
8. Test auf iPhone
9. Kopie nach Burger, dazu schlanke `checkout.html` und `danke.html`, eigene `demo-daten.js`
10. Kopie nach Asiatisch, eigene `demo-daten.js`, Kontrast auf Dark Theme prüfen

---

## Demo-Daten pro Shop

Gleiche Struktur, unterschiedliche Gerichte:

| Shop | Bestellhistorie |
|---|---|
| Pizzeria | Pizza Diavolo, Calzone, Tiramisu |
| Burger | Double Smash Burger, Süßkartoffelpommes, Milchshake |
| Asiatisch | Gyoza, Pad Thai, Mango Sticky Rice |

Kunde ist überall Max Mustermann mit derselben Adresse, damit die Demos untereinander konsistent wirken.

---

## Fertig, wenn

- Besucher landet eingeloggt und sieht den Demo-Banner
- Alle acht Tabs sind befüllt und funktionieren
- Stempelkarte zeigt 6 von 8, eine Testbestellung erhöht auf 7
- Eine Bestellung unter 15 Euro erhöht den Zähler nicht
- "Nochmal bestellen" füllt den Warenkorb korrekt
- Checkout ist mit Adresse und Zahlungsart vorbefüllt
- Abmelden zeigt den ausgeloggten Zustand, Anmelden führt zurück
- Zurücksetzen stellt den Ausgangszustand her
- Kein `localStorage` außerhalb von `auth.js` im Code
- Alle `auth.js`-Aufrufe mit `await`
- Getestet auf iPhone Safari, hell und dunkel
- Keine Gedankenstriche in Texten

---

## Abschluss

```powershell
cd "C:\Users\richa\OneDrive - MANERI UG\ChefShops - Dokumente\Claude Workspace\Restaurant Online Shop"
git add -A
git commit -m "Phase 7: Kundenkonto, Stempelkarte, Demo-Login"
git push
```
