# Datenmodell Kundenkonto und Treueprogramm

**Stand:** August 2026
**Status:** Referenz. Wird NICHT deployed. Liegt bereit für den ersten echten Kunden.
**Gilt für:** Pizzeria, Burger, Asiatisch und alle späteren Shops

## Zweck dieses Dokuments

Der Kontobereich läuft in allen Demos ohne Backend, die Daten liegen im localStorage. Dieses Dokument beschreibt, wie dieselben Daten später in Supabase aussehen. Wenn der erste zahlende Kunde kommt, ist das SQL hier Copy-Paste in den Supabase SQL Editor, und in `js/auth.js` wird nur der Adapter getauscht.

Damit das funktioniert, gelten drei Regeln schon in der Demo:

1. **Alle Feldnamen in snake_case**, exakt wie die späteren Spalten. Kein `firstName`, sondern `first_name`.
2. **Alle Funktionen in `auth.js` sind async**, auch wenn sie heute synchron aus dem localStorage lesen. Sonst muss beim Umstieg jede Aufrufstelle angefasst werden.
3. **Kein direkter localStorage-Zugriff außerhalb von `auth.js`.** Keine Ausnahme.

---

## Übersicht der Tabellen

```
auth.users (Supabase Auth)
    |
    +-- profiles (1:1)
            |
            +-- addresses (1:n)
            +-- payment_methods (1:n)
            +-- favorites (1:n)
            +-- reservations (1:n)
            +-- orders (1:n)
            |       |
            |       +-- order_items (1:n)
            |
            +-- stamp_cards (1:n)
            |       |
            |       +-- stamp_events (1:n) --> verweist auf orders
            |
            +-- vouchers (1:n)

loyalty_programs (Konfiguration, kein Bezug zum Kunden)
```

---

## Tabellen im Detail

### profiles

Erweitert `auth.users` um die Stammdaten. Wird per Trigger bei der Registrierung angelegt.

| Spalte | Typ | Hinweis |
|---|---|---|
| id | uuid PK | = auth.users.id |
| first_name | text | |
| last_name | text | |
| email | text | Spiegel aus auth.users, für Anzeige |
| phone | text | |
| birth_date | date NULL | optional, für Geburtstagsgutschein |
| marketing_consent | boolean | Default false |
| created_at | timestamptz | |
| updated_at | timestamptz | |

`marketing_consent` muss vom Konto getrennt sein. Werbeeinwilligung darf keine Bedingung für die Teilnahme am Treueprogramm sein.

### addresses

| Spalte | Typ | Hinweis |
|---|---|---|
| id | uuid PK | |
| profile_id | uuid FK | |
| label | text | "Zuhause", "Arbeit" |
| first_name | text | Empfänger kann abweichen |
| last_name | text | |
| street | text | Straße und Hausnummer |
| postal_code | text | |
| city | text | |
| phone | text | |
| delivery_note | text NULL | "Klingel defekt, bitte anrufen" |
| is_default | boolean | genau eine pro Profil |
| created_at | timestamptz | |

`is_default` wird per Funktion gesetzt, die vorher alle anderen auf false setzt. Nicht im Client lösen.

### payment_methods

**Hier werden niemals Kartendaten gespeichert.** Nur die Stripe-Referenz und die Anzeigedaten, die Stripe zurückgibt.

| Spalte | Typ | Hinweis |
|---|---|---|
| id | uuid PK | |
| profile_id | uuid FK | |
| type | text | bar, ec, paypal, card |
| stripe_payment_method_id | text NULL | nur bei type = card |
| brand | text NULL | visa, mastercard |
| last4 | text NULL | Anzeige "Visa 4242" |
| exp_month | int NULL | |
| exp_year | int NULL | |
| is_default | boolean | |
| created_at | timestamptz | |

Für Imbisse ohne Online-Zahlung enthält die Tabelle nur Zeilen mit type = bar oder ec. Das ist dann reine Präferenz, keine Zahlungsanbindung. Stripe kommt erst dazu, wenn ein Kunde wirklich online kassieren will.

### orders

| Spalte | Typ | Hinweis |
|---|---|---|
| id | uuid PK | |
| profile_id | uuid FK NULL | NULL bei Gastbestellung |
| order_number | text | fortlaufend, für den Kunden lesbar |
| status | text | neu, bestaetigt, zubereitung, unterwegs, abgeschlossen, storniert |
| mode | text | lieferung, abholung |
| address_id | uuid FK NULL | bei Abholung NULL |
| address_snapshot | jsonb | Adresse zum Bestellzeitpunkt, unveränderlich |
| payment_type | text | |
| subtotal | numeric(10,2) | |
| delivery_fee | numeric(10,2) | |
| discount | numeric(10,2) | Default 0 |
| voucher_id | uuid FK NULL | eingelöster Gutschein |
| total | numeric(10,2) | |
| note | text NULL | |
| placed_at | timestamptz | |
| completed_at | timestamptz NULL | |

`address_snapshot` ist wichtig: löscht der Kunde später seine Adresse, muss die alte Bestellung nachvollziehbar bleiben. Aufbewahrungspflichten gehen der Löschung vor.

`profile_id` ist NULL-fähig, weil Gastbestellungen möglich bleiben müssen. Ein Kundenkonto darf keine Voraussetzung für die Bestellung sein.

### order_items

| Spalte | Typ | Hinweis |
|---|---|---|
| id | uuid PK | |
| order_id | uuid FK | |
| product_id | text | Artikelnummer aus der Karte |
| name | text | Name zum Bestellzeitpunkt |
| unit_price | numeric(10,2) | Preis zum Bestellzeitpunkt |
| qty | int | |
| options | jsonb NULL | Extras, Soßen, Größe |

Name und Preis werden mitgeschrieben, nicht nur referenziert. Ändert der Wirt den Preis, darf sich die alte Bestellung nicht rückwirkend ändern.

### loyalty_programs

Konfiguration des Treueprogramms. Eine Zeile pro Shop, damit der Wirt sie ohne Codeänderung anpassen kann.

| Spalte | Typ | Default |
|---|---|---|
| id | uuid PK | |
| name | text | "Stempelkarte" |
| target_stamps | int | 8 |
| min_order_value | numeric(10,2) | 15.00 |
| reward_type | text | free_item |
| reward_description | text | "Ein Hauptgericht gratis" |
| voucher_validity_days | int | 60 |
| combinable_with_discounts | boolean | false |
| active | boolean | true |

### stamp_cards

| Spalte | Typ | Hinweis |
|---|---|---|
| id | uuid PK | |
| profile_id | uuid FK | |
| program_id | uuid FK | |
| stamps_count | int | Default 0 |
| status | text | aktiv, voll, eingeloest |
| completed_at | timestamptz NULL | |
| created_at | timestamptz | |

Ist die Karte voll, wird sie auf `voll` gesetzt, ein Gutschein erzeugt und eine neue leere Karte angelegt. Der Kunde sammelt nahtlos weiter.

### stamp_events

Protokolliert jeden einzelnen Stempel. Nicht optional, sondern der Kern des Missbrauchsschutzes.

| Spalte | Typ | Hinweis |
|---|---|---|
| id | uuid PK | |
| stamp_card_id | uuid FK | |
| order_id | uuid FK UNIQUE | eine Bestellung, ein Stempel |
| delta | int | +1 beim Vergeben, -1 bei Storno |
| reason | text | bestellung, storno, manuell |
| created_at | timestamptz | |

Das `UNIQUE` auf `order_id` ist die wichtigste Zeile im ganzen Schema. Ohne sie kann dieselbe Bestellung mehrfach gestempelt werden, egal wie sauber der Rest ist.

### vouchers

| Spalte | Typ | Hinweis |
|---|---|---|
| id | uuid PK | |
| profile_id | uuid FK | |
| code | text UNIQUE | z.B. TREUE-8HK3M2 |
| type | text | free_item, percent, amount |
| value | numeric(10,2) NULL | bei percent oder amount |
| description | text | "Ein Hauptgericht gratis" |
| source | text | stempelkarte, geburtstag, manuell |
| status | text | offen, eingeloest, verfallen |
| valid_until | date | |
| stamp_card_id | uuid FK NULL | Herkunft |
| redeemed_order_id | uuid FK NULL | |
| created_at | timestamptz | |

Ablaufdatum ist Pflicht. Ein unbefristeter Gutschein ist für den Wirt eine unbefristete Verbindlichkeit in der Buchhaltung.

### favorites

| Spalte | Typ |
|---|---|
| id | uuid PK |
| profile_id | uuid FK |
| product_id | text |
| created_at | timestamptz |

UNIQUE auf (profile_id, product_id).

### reservations

Existiert schon als Seite, gehört aber ins Konto.

| Spalte | Typ | Hinweis |
|---|---|---|
| id | uuid PK | |
| profile_id | uuid FK NULL | Gastreservierung möglich |
| reservation_date | date | |
| reservation_time | time | |
| guests | int | |
| first_name | text | |
| last_name | text | |
| phone | text | |
| email | text | |
| note | text NULL | |
| status | text | angefragt, bestaetigt, abgelehnt, storniert |
| created_at | timestamptz | |

---

## Row Level Security

RLS auf allen Tabellen aktivieren. Grundmuster am Beispiel `addresses`:

```sql
alter table addresses enable row level security;

create policy "Eigene Adressen lesen"
  on addresses for select
  using (auth.uid() = profile_id);

create policy "Eigene Adressen anlegen"
  on addresses for insert
  with check (auth.uid() = profile_id);

create policy "Eigene Adressen aendern"
  on addresses for update
  using (auth.uid() = profile_id);

create policy "Eigene Adressen loeschen"
  on addresses for delete
  using (auth.uid() = profile_id);
```

Analog für `payment_methods`, `favorites`, `orders`, `order_items` (über join auf orders), `stamp_cards`, `vouchers`, `reservations`.

**Ausnahmen, die man leicht übersieht:**

- `stamp_cards` und `vouchers`: nur SELECT für den Kunden. Kein INSERT, kein UPDATE. Sonst schenkt sich jeder Stempel und Gutscheine. Geschrieben wird ausschließlich per SECURITY DEFINER Funktion.
- `stamp_events`: gar kein Zugriff für den Kunden, auch kein SELECT nötig.
- `loyalty_programs`: SELECT für alle, Schreibzugriff nur Service Role.
- `orders`: INSERT durch den Kunden erlaubt, UPDATE nicht. Den Status setzt der Betrieb, nicht der Besteller.

---

## Stempel-Logik serverseitig

Die Vergabe darf niemals im Client passieren. Sie hängt am Statuswechsel der Bestellung.

```sql
create or replace function vergebe_stempel()
returns trigger
language plpgsql
security definer
as $$
declare
  prog loyalty_programs%rowtype;
  karte stamp_cards%rowtype;
begin
  -- nur beim Wechsel auf abgeschlossen
  if new.status <> 'abgeschlossen' or old.status = 'abgeschlossen' then
    return new;
  end if;

  -- Gastbestellungen bekommen keinen Stempel
  if new.profile_id is null then
    return new;
  end if;

  select * into prog from loyalty_programs where active limit 1;
  if not found then return new; end if;

  -- Mindestbestellwert pruefen, Lieferkosten zaehlen nicht mit
  if new.subtotal < prog.min_order_value then
    return new;
  end if;

  -- nicht kombinierbar mit anderen Rabatten
  if not prog.combinable_with_discounts and new.discount > 0 then
    return new;
  end if;

  -- aktive Karte holen oder anlegen
  select * into karte from stamp_cards
    where profile_id = new.profile_id and status = 'aktiv' limit 1;
  if not found then
    insert into stamp_cards (profile_id, program_id, stamps_count, status)
      values (new.profile_id, prog.id, 0, 'aktiv')
      returning * into karte;
  end if;

  -- Stempel protokollieren, UNIQUE auf order_id verhindert Doppelvergabe
  insert into stamp_events (stamp_card_id, order_id, delta, reason)
    values (karte.id, new.id, 1, 'bestellung')
    on conflict (order_id) do nothing;

  update stamp_cards
    set stamps_count = stamps_count + 1
    where id = karte.id
    returning * into karte;

  -- Karte voll: Gutschein erzeugen, neue Karte anlegen
  if karte.stamps_count >= prog.target_stamps then
    update stamp_cards
      set status = 'voll', completed_at = now()
      where id = karte.id;

    insert into vouchers (
      profile_id, code, type, description, source,
      status, valid_until, stamp_card_id
    ) values (
      new.profile_id,
      'TREUE-' || upper(substring(md5(random()::text) from 1 for 6)),
      prog.reward_type,
      prog.reward_description,
      'stempelkarte',
      'offen',
      current_date + prog.voucher_validity_days,
      karte.id
    );

    insert into stamp_cards (profile_id, program_id, stamps_count, status)
      values (new.profile_id, prog.id, 0, 'aktiv');
  end if;

  return new;
end;
$$;

create trigger trg_vergebe_stempel
  after update on orders
  for each row
  execute function vergebe_stempel();
```

Für Stornos analog eine Funktion, die bei Statuswechsel auf `storniert` ein Event mit `delta = -1` schreibt und `stamps_count` reduziert.

---

## Regeln des Treueprogramms

Diese Regeln gehören in die Teilnahmebedingungen und müssen im Code abgebildet sein:

1. Stempel erst bei abgeschlossener Bestellung, nicht bei Bestellabgabe.
2. Mindestbestellwert bezieht sich auf die Zwischensumme ohne Lieferkosten.
3. Eine Bestellung ergibt genau einen Stempel, unabhängig vom Betrag.
4. Keine Stempel auf Bestellungen, bei denen bereits ein Rabatt oder Gutschein eingelöst wurde.
5. Storno zieht den Stempel wieder ab.
6. Gutscheine sind an das Konto gebunden und nicht übertragbar.
7. Gutscheine verfallen nach 60 Tagen.
8. Der Betrieb kann das Programm beenden, ausgegebene Gutscheine bleiben bis zum Ablauf gültig.

---

## Rechtliche Punkte für den Echtbetrieb

Gilt nicht für die Demos, dort werden keine echten Daten verarbeitet.

- **Gastbestellung muss möglich bleiben.** Ein Kundenkonto lässt sich nicht auf Vertragserfüllung stützen, es braucht eine Einwilligung. Wer keine dauerhafte Beziehung will, muss trotzdem bestellen können.
- **Einwilligung fürs Treueprogramm getrennt einholen** und dokumentieren. Werbeeinwilligung nochmal getrennt davon.
- **Datenschutzerklärung** muss das Treueprogramm ausdrücklich nennen.
- **Verfahrensverzeichnis** nach Art. 30 DSGVO anlegen.
- **Auskunft, Export und Löschung** müssen im Konto selbst möglich sein.
- **Inaktive Konten** nach definierter Frist automatisch löschen.
- **Rabattbuchungen** müssen kassenseitig sauber erfasst werden, die KassenSichV verlangt unveränderbare Protokollierung auch für Rabatte aus Treueprogrammen.
- **Kartendaten niemals selbst speichern.** Ausschließlich Stripe Customer plus SetupIntent, wir halten nur die IDs.

---

## Mapping localStorage zu Supabase

| localStorage-Key (Demo) | Tabelle |
|---|---|
| `si_session` | auth.users Session |
| `si_profile` | profiles |
| `si_addresses` | addresses |
| `si_payment_methods` | payment_methods |
| `si_orders` | orders + order_items |
| `si_stamp_card` | stamp_cards |
| `si_vouchers` | vouchers |
| `si_favorites` | favorites |
| `si_reservations` | reservations |

Präfix `si_` für alle Keys, damit sie sich vom bestehenden `stadtimbiss_cart` unterscheiden und sich gesammelt zurücksetzen lassen.

---

## Aufwandsschätzung Umstieg

Wenn die drei Regeln oben eingehalten werden:

- Schema in Supabase anlegen und RLS setzen: 2 bis 3 Stunden
- Supabase-Adapter in `auth.js` schreiben: 3 bis 4 Stunden
- Auth-Flows (Registrierung, Passwort vergessen, E-Mail-Bestätigung): 2 bis 3 Stunden
- Testen: 2 Stunden

Zusammen etwa ein Arbeitstag. Ohne die Disziplin bei async und snake_case wird daraus eine Woche.
