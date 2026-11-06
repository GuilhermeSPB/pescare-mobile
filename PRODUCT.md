# Product

<!-- impeccable:product-schema 1 -->

## Platform

android

## Users

- **Primary: fishers** (`FISHER` role). Artisanal fishers, often older, with little digital familiarity and limited reading; WhatsApp is usually the extent of their smartphone use (confirmed by the team on 2026-11-01). They use the app to record their own production and to check the defesos and alerts that apply to their municipality.
- **The Pescare team (`ADMIN`) does not use this app.** They maintain catalogs, defesos, and alerts in the web panel "Pescare Admin" (`../pescare-frontend`), which feeds what fishers see here.

## Product Purpose

Pescare lets fishers record their own production — fishing trips (date, municipality, location type, fishing method), catches by species and quantity, and sales to buyer types — so they build a history of what they caught and sold. It also tells them which fishing bans (defesos) and alerts apply to their municipality.

This is the fishers' app: the only place they interact with Pescare. Success means a fisher can register what they caught and sold, find it again later, and know which defesos are in force where they fish.

## Positioning

Open decision — not defined yet (same status as in `../pescare-frontend/PRODUCT.md`). Confirmed so far: for the fisher, the core value is recording their own production (catches and sales); defeso and alert information supports it.

## Operating Context

- Fishers register trips and sales **after the fact, on land and with an internet connection** (at home or at the colônia), not on the boat. Offline use is not a requirement (confirmed 2026-11-01).
- Every fisher belongs to one municipality (7-digit IBGE code), set at sign-up. Defesos and alerts are filtered by it.
- **Alerts** reach the fisher only once `PUBLISHED`. They have a type (`FISHING_BAN`, `NEWS`, `EVENT`, `SYSTEM`) and a scope: `GLOBAL` or `MUNICIPAL`. Fishers choose which alert types they want to receive.
- **Defesos** are instituted by a norm (portaria / instrução normativa), are `CONTINENTAL` or `MARINHO`, and have date periods, affected species, covered municipalities, and restricted location types (or all of them).
- Form options (species, fishing methods, location types, buyer types) come from catalogs the admin team maintains. Inactive entries stop appearing as new options; records already registered keep them.
- Academic project built by a small team (repositories `pescare-mobile`, `pescare-frontend`, `pescare-backend`). No region, partner institution, or store release target defined yet.

## Capabilities and Constraints

Fisher jobs, from the data model and API (no fisher screens are built yet; `src/app/` holds only a splash and an empty home):

- **Account**: sign up and sign in with email and password; view and edit own profile; change password.
- **Fishing records**: a trip with date, municipality, location type, place name (required since 2026-11-04), fishing method, and status; catches per species with quantity and unit.
- **Sales (comercialização)**: linked to a fishing record, with date, total value, municipality, and buyer types.
- **History** of own records and sales.
- **REAP summary**: a month or a whole year of finished records, laid out in the order of the government's REAP form (PesqBrasil) so the fisher, or whoever helps at the colônia, can copy it. It covers the fishing activity only, not personal data. The work relation (autônomo / economia familiar / parceria) is left out; the fisher answers it in PesqBrasil (team decision, 2026-11-04). The fishing environment (Continental / Marinho) comes from the location type.
- **Defesos** in effect for the fisher's municipality, and **alerts** with per-type preferences.

Constraints:

- **One Material Design app on Android and iOS** (team decision, 2026-11-01). On iPhone it still honors iOS guarantees: safe-area insets, Reduce Motion, and edge-swipe back.
- Stack: Expo SDK 57 with Expo Router (routes in `src/app/`), TypeScript, styled-components theme in `src/theme/`.
- Backend status: auth, users (`/me`), catalogs, municipalities, alerts (with `/preferences`), fishing-ban periods (with `/in-effect`), and fishing records (`/fishing-records`, with the sale nested in the record) exist. There is no standalone sales endpoint and no report endpoint: the REAP summary is computed in the app.
- Nothing is deleted: the API has no delete routes. Sessions use a JWT that expires after 1 day.
- Provisional values in the schema: fishing record status (`EM_ANDAMENTO`, `FINALIZADO`) and catch unit (`KG`, `UNIDADE`) are marked "ajustar valores reais".

Terminology (pt-BR UI, shared with the admin panel): pescador, pescaria / registro de pesca, espécie, método de pesca, tipo de local, comercialização, tipo de comprador, defeso, norma, período, município, alerta. Fisher-facing wording beyond these terms is not decided yet.

## Brand Commitments

- Name: **Pescare**. Interface language: Brazilian Portuguese (pt-BR).
- No logo or voice guidelines exist yet. `app.json` still carries the template name `front-mobile`.
- Visual direction (standing preference, chosen by the team on 2026-11-01): the category standard — Material 3 — executed at full craft, not reinvented, in the **same colors as the admin panel** (`../pescare-frontend/DESIGN.md`: blue primary `#2563eb`). Craft bar: Google's own Material apps (Gmail, Files).

## Evidence on Hand

- Database schema: `../pescareSQL_v1.sql`. API contract: `../pescare-backend`. Admin product record: `../pescare-frontend/PRODUCT.md`.
- The fisher profile above is the team's understanding, not user research.
- No real content, logos, screenshots, usage data, user research, partners, or testimonials exist. Do not invent numbers of fishers, regions, institutions, catches, or results.

## Product Principles

1. **Usable by someone whose phone is WhatsApp.** Each step asks for one thing, in plain words the fisher already uses; never codes or system jargon (IBGE codes, enum values, "status").
2. **Pick, don't type.** The catalogs already hold the answers; choosing beats writing and reading.
3. **Recording comes first.** Registering a trip, its catch, and its sale is the core job; defesos and alerts support it.
4. **Defesos must be unmistakable.** Which ban applies, to which species and places, and until when — a misread affects the fisher's compliance.
5. **Nothing is destroyed.** The API has no delete routes; the fisher's history stays intact.

## Accessibility & Inclusion

- Low digital familiarity and limited reading are the norm, not the edge case; many users are older.
- Respect the OS font-size setting on both platforms, pair icons with text labels, and do not depend on reading long passages.
- No formal accessibility standard has been set.
