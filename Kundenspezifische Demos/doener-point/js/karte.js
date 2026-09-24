/* karte.js — Döner Point
   Baut die Speisekarte und die Kategorieleiste aus den Daten in
   demo-daten.js.

   Warum nicht als festes HTML: die Karte hat 77 Artikel in 13
   Kategorien. Von Hand getippt waere jede Preisaenderung Arbeit
   an zwei Stellen, und die Kennungen an den Knoepfen muessten
   immer zum Katalog passen. So gibt es nur eine Quelle.

   WICHTIG zur Reihenfolge: js/bestellen.js haengt seine
   Klicklistener beim Laden an alle .add-to-cart. Dieses Modul
   muss deshalb VORHER laufen, also im HTML weiter oben stehen.
   Beide sind Module und werden in Dokumentreihenfolge
   ausgefuehrt. */

import { KATEGORIEN, KATALOG } from './demo-daten.js';

function euro(betrag) {
  return betrag.toFixed(2).replace('.', ',') + ' \u20ac';
}

function kachel(id, a) {
  const beschreibung = a.beschreibung
    ? `<p class="menu-card__desc">${a.beschreibung}</p>`
    : '';

  return `
        <article class="menu-card">
          <img class="menu-card__img" width="120" height="120" src="${a.img}" alt="${a.name}" loading="lazy">
          <div class="menu-card__body">
            <h3 class="menu-card__name">${a.name}</h3>
            ${beschreibung}
            <div class="menu-card__footer">
              <span class="menu-card__price">${euro(a.price)}</span>
              <button class="btn btn--primary btn--sm add-to-cart"
                      data-id="${id}" data-name="${a.name}" data-price="${a.price.toFixed(2)}">+ Hinzufügen</button>
            </div>
          </div>
        </article>`;
}

export function karteAufbauen() {
  const menu = document.querySelector('.menu');
  if (menu === null) return;

  const leiste = document.querySelector('.category-nav__inner');

  // Artikel nach Kategorie buendeln, Reihenfolge kommt aus KATEGORIEN
  const nachKategorie = new Map();
  for (const [id, a] of Object.entries(KATALOG)) {
    if (!nachKategorie.has(a.kategorie)) nachKategorie.set(a.kategorie, []);
    nachKategorie.get(a.kategorie).push([id, a]);
  }

  const abschnitte = [];
  const links = [];

  for (const kat of KATEGORIEN) {
    const artikel = nachKategorie.get(kat.id) || [];
    if (artikel.length === 0) continue;

    links.push(
      `<a class="cat-link${links.length === 0 ? ' cat-link--active' : ''}" href="#${kat.id}">${kat.name}</a>`
    );

    abschnitte.push(`
      <section class="menu-section" id="${kat.id}">
        <h2 class="menu-section__title">${kat.name}</h2>
        ${artikel.map(([id, a]) => kachel(id, a)).join('')}
      </section>`);
  }

  if (leiste !== null) leiste.innerHTML = links.join('\n        ');
  menu.innerHTML = abschnitte.join('\n');

  /* Die Gerichtbilder werden erst noch erzeugt. Solange sie
     fehlen, bekommt das Bild eine ruhige Flaeche statt des
     zerbrochenen Symbols. */
  for (const bild of menu.querySelectorAll('.menu-card__img')) {
    bild.addEventListener('error', () => {
      bild.classList.add('menu-card__img--leer');
      bild.removeAttribute('alt');
    });
  }
}
