// ki-kennzeichnung.js
//
// Kennzeichnet KI-generierte Bilder nach Art. 50 KI-Verordnung mit
// einem Label "KI-generiert" oben rechts direkt im Bild.
//
// In den Beispielshops sind alle Bilder KI-generiert, deshalb arbeitet
// das Skript automatisch: Es sucht alle <img> und alle Elemente mit
// Hintergrundbild und setzt das Label darauf. In den HTML-Dateien muss
// dafuer nichts gepflegt werden, auch nicht bei Karten, die erst per
// JavaScript gerendert werden.
//
// Ausgenommen sind:
//   - Logos ("logo" in Dateiname, alt-Text, Klasse oder id)
//   - SVG-Grafiken und Platzhalter
//   - echte Fotos von Unsplash ("unsplash" im Dateinamen)
//   - Bilder, die kleiner als MIN_BREITE x MIN_HOEHE angezeigt werden
//     (Icons, Mini-Vorschauen), dort passt kein Label hinein
//   - alles mit data-ki="aus" am Element oder an einem Elternelement
//
// Kommt in einen Shop ein echtes Foto, data-ki="aus" an das <img> bzw.
// an das Element mit dem Hintergrundbild haengen.
//
// Das Label wird nicht in die Bildcontainer "hineingebaut", sondern
// per Messung ueber das Bild gelegt. So aendert sich an keinem Layout
// etwas (keine position: relative auf fremden Elementen, keine
// verschobenen nth-child-Zaehlungen). Die Position wird bei Scrollen,
// Groessenaenderung, Nachladen von Bildern und Animationen neu
// berechnet. Liegt eine feste Kopfzeile ueber dem Bild, rutscht das
// Label darunter.
//
// Eingebunden wird die Datei ueber auth.js, die jede Seite laedt.

const LABEL_TEXT = 'KI-generiert';
const MIN_BREITE = 100;
const MIN_HOEHE = 70;
const ABSTAND = 10;

const AUSNAHME = /logo|platzhalter|unsplash|\.svg(\?|#|$|["')])/i;
const KOPFZEILEN = 'header, nav, .nav, .header, .site-header, .demo-banner';
const OHNE_KINDER = new Set(['IMG', 'INPUT', 'TEXTAREA', 'SELECT', 'HR', 'BR',
  'IFRAME', 'VIDEO', 'AUDIO', 'CANVAS', 'OBJECT', 'EMBED', 'PICTURE']);

const labels = new Map();
let zieleNeu = true;
let geplant = false;

function stilEinfuegen() {
  if (document.getElementById('ki-kennzeichnung-stil')) return;
  const stil = document.createElement('style');
  stil.id = 'ki-kennzeichnung-stil';
  stil.textContent = `
    ki-label.ki-label {
      position: absolute !important;
      display: block;
      z-index: 5;
      margin: 0;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: clamp(10px, 0.55rem + 0.25vw, 12px);
      font-style: normal;
      font-weight: 500;
      letter-spacing: 0.02em;
      line-height: 1.3;
      text-transform: none;
      padding: 0.2em 0.6em;
      border: 0;
      border-radius: 3px;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      white-space: nowrap;
      pointer-events: none;
      user-select: none;
      box-shadow: none;
      transform: none;
      transition: none;
    }
    ki-label.ki-label[hidden] { display: none !important; }
  `;
  document.head.appendChild(stil);
}

function klassenText(el) {
  return typeof el.className === 'string' ? el.className : '';
}

function istAusgenommen(el, quelle) {
  if (el.closest('[data-ki="aus"], .demo-banner, ki-label')) return true;
  const text = [quelle, el.getAttribute('alt') || '', klassenText(el), el.id || ''].join(' ');
  return AUSNAHME.test(text);
}

function hintergrundBild(stil) {
  const bg = stil.backgroundImage;
  if (!bg || bg === 'none' || !bg.includes('url(')) return '';
  return bg;
}

function zieleSammeln() {
  const ziele = [];
  document.querySelectorAll('img').forEach(img => {
    const quelle = img.currentSrc || img.getAttribute('src') || '';
    if (!quelle || istAusgenommen(img, quelle)) return;
    ziele.push(img);
  });
  document.querySelectorAll('body *').forEach(el => {
    if (el.tagName === 'IMG' || el.tagName === 'KI-LABEL') return;
    if (el instanceof SVGElement) return;
    const bg = hintergrundBild(getComputedStyle(el));
    if (!bg || istAusgenommen(el, bg)) return;
    ziele.push(el);
  });
  return ziele;
}

// Das Label haengt im selben Element wie das Bild (Bild: am Ende des
// Elternelements, Hintergrund: im Element selbst). Damit scrollt es in
// Slidern und Scrollbereichen mit und wird mit eingeblendet.
function wirtFuer(ziel) {
  if (!OHNE_KINDER.has(ziel.tagName)) return ziel;
  let wirt = ziel.parentElement;
  while (wirt && OHNE_KINDER.has(wirt.tagName)) wirt = wirt.parentElement;
  return wirt;
}

function labelFuer(ziel) {
  const vorhanden = labels.get(ziel);
  if (vorhanden && vorhanden.isConnected) return vorhanden;
  const wirt = wirtFuer(ziel);
  if (!wirt) return null;
  const label = document.createElement('ki-label');
  label.className = 'ki-label';
  label.textContent = LABEL_TEXT;
  wirt.appendChild(label);
  labels.set(ziel, label);
  return label;
}

// Sichtbarer Teil des Bildes: abgeschnitten durch Elternelemente mit
// overflow und durch feste Kopfzeilen, die darueber liegen.
function sichtbarerBereich(ziel, rect, overflowCache, hindernisse, labelHoehe) {
  let links = rect.left, oben = rect.top, rechts = rect.right, unten = rect.bottom;
  let el = ziel.parentElement;
  while (el && el !== document.documentElement) {
    let clip = overflowCache.get(el);
    if (clip === undefined) {
      const s = getComputedStyle(el);
      clip = (s.overflowX !== 'visible' || s.overflowY !== 'visible')
        ? el.getBoundingClientRect() : null;
      overflowCache.set(el, clip);
    }
    if (clip) {
      links = Math.max(links, clip.left);
      oben = Math.max(oben, clip.top);
      rechts = Math.min(rechts, clip.right);
      unten = Math.min(unten, clip.bottom);
    }
    el = el.parentElement;
  }
  // Rechts nicht ueber den Bildschirmrand hinaus
  rechts = Math.min(rechts, document.documentElement.clientWidth);
  // Kopfzeile liegt ueber dem oberen Bildrand: Label darunter setzen
  const streifen = labelHoehe + 2 * ABSTAND;
  for (const h of hindernisse) {
    if (h.el.contains(ziel)) continue;
    const ueberlapptX = h.rect.left < rechts && h.rect.right > rechts - 40;
    const deckt = h.rect.top < oben + streifen || h.rect.top <= 1;
    if (ueberlapptX && h.rect.bottom > oben && deckt) {
      oben = h.rect.bottom;
    }
  }
  return { links, oben, rechts, unten, breite: rechts - links, hoehe: unten - oben };
}

// Runde Ecken (bis hin zu Kreisen): Label so weit einruecken, dass es
// nicht ueber die sichtbare Rundung hinausragt. Geprueft werden das
// Bild selbst und sein Elternelement, weil oft der Rahmen rund ist.
function eckRadius(el, rect) {
  let radius = 0;
  [el, el.parentElement].forEach(k => {
    if (!k) return;
    const wert = getComputedStyle(k).borderTopRightRadius.split(' ')[0];
    const r = k.getBoundingClientRect();
    if (Math.abs(r.width - rect.width) > 4 && k !== el) return;
    const px = wert.endsWith('%')
      ? parseFloat(wert) / 100 * Math.min(r.width, r.height)
      : parseFloat(wert) || 0;
    radius = Math.max(radius, Math.min(px, Math.min(r.width, r.height) / 2));
  });
  // Abstand der Rundung zur Ecke auf der Diagonalen
  return radius * (1 - Math.SQRT1_2);
}

function hindernisseFinden() {
  const liste = [];
  document.querySelectorAll(KOPFZEILEN).forEach(el => {
    const pos = getComputedStyle(el).position;
    if (pos !== 'fixed' && pos !== 'sticky' && pos !== 'absolute') return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    liste.push({ el, rect });
  });
  return liste;
}

function istVersteckt(stil) {
  return stil.display === 'none' || stil.visibility === 'hidden';
}

function aktualisieren() {
  geplant = false;

  if (zieleNeu) {
    zieleNeu = false;
    const ziele = new Set(zieleSammeln());
    labels.forEach((label, ziel) => {
      if (!ziele.has(ziel) || !ziel.isConnected) {
        label.remove();
        labels.delete(ziel);
      }
    });
    ziele.forEach(ziel => labelFuer(ziel));
  }

  // 1. Schreiben: alle Labels auf Ursprung setzen
  const eintraege = [];
  labels.forEach((label, ziel) => {
    label.hidden = false;
    label.style.left = '0px';
    label.style.top = '0px';
    eintraege.push({ ziel, label });
  });

  // 2. Lesen: alle Masse auf einmal
  const overflowCache = new Map();
  const hindernisse = hindernisseFinden();
  const messungen = eintraege.map(({ ziel, label }) => {
    const stil = getComputedStyle(ziel);
    const rect = ziel.getBoundingClientRect();
    const ursprung = label.getBoundingClientRect();
    const sichtbar = sichtbarerBereich(ziel, rect, overflowCache, hindernisse, ursprung.height);
    const einzug = eckRadius(ziel, rect);
    return { ziel, label, stil, rect, ursprung, sichtbar, einzug };
  });

  // 3. Schreiben: Positionen setzen
  const belegt = [];
  messungen.forEach(({ ziel, label, stil, rect, ursprung, sichtbar, einzug }) => {
    const zuKlein = rect.width < MIN_BREITE || rect.height < MIN_HOEHE;
    const kaumSichtbar = sichtbar.breite < ursprung.width + 2 * ABSTAND
      || sichtbar.hoehe < ursprung.height + 2 * ABSTAND;
    if (zuKlein || kaumSichtbar || istVersteckt(stil)) {
      label.hidden = true;
      return;
    }
    // Einzug fuer runde Ecken nur, solange die Ecke wirklich sichtbar ist
    const einzugX = sichtbar.rechts >= rect.right - 1 ? einzug : 0;
    const einzugY = sichtbar.oben <= rect.top + 1 ? einzug : 0;
    const x = sichtbar.rechts - ursprung.width - ABSTAND - einzugX;
    const y = sichtbar.oben + ABSTAND + einzugY;

    // Liegen zwei Bilder deckungsgleich uebereinander, nur ein Label
    if (belegt.some(p => Math.abs(p.x - x) < 8 && Math.abs(p.y - y) < 8)) {
      label.hidden = true;
      return;
    }
    belegt.push({ x, y });

    label.style.left = Math.round(x - ursprung.left) + 'px';
    label.style.top = Math.round(y - ursprung.top) + 'px';
    // Wird das Bild selbst ein- oder ausgeblendet, macht das Label mit
    label.style.opacity = ziel.tagName === 'IMG' ? stil.opacity : '';
  });
}

function planen(neuSammeln) {
  if (neuSammeln) zieleNeu = true;
  if (geplant) return;
  geplant = true;
  requestAnimationFrame(aktualisieren);
}

let sammelTimer = null;
function spaeterSammeln() {
  clearTimeout(sammelTimer);
  sammelTimer = setTimeout(() => planen(true), 150);
}

function nurLabelAenderung(mutation) {
  if (mutation.target.tagName === 'KI-LABEL') return true;
  if (mutation.type !== 'childList') return false;
  const knoten = [...mutation.addedNodes, ...mutation.removedNodes];
  return knoten.length > 0 && knoten.every(k => k.nodeName === 'KI-LABEL');
}

function starten() {
  stilEinfuegen();
  planen(true);

  new MutationObserver(liste => {
    if (liste.every(nurLabelAenderung)) return;
    spaeterSammeln();
  }).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'srcset', 'style', 'class', 'hidden'],
  });

  window.addEventListener('resize', () => planen(false));
  window.addEventListener('load', () => planen(true));
  document.addEventListener('scroll', () => planen(false), { capture: true, passive: true });
  document.addEventListener('load', () => planen(false), true);
  document.addEventListener('transitionend', () => planen(false), true);
  document.addEventListener('animationend', () => planen(false), true);

  if ('ResizeObserver' in window) {
    new ResizeObserver(() => planen(false)).observe(document.body);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', starten);
} else {
  starten();
}
