<div align="center">

# 📅 OmniCalendar

### *Every Day Has a Story.*

A modern, responsive web app for discovering the special days of the year: UN international days, national holidays, cultural celebrations, awareness days and fun unofficial observances.

**React · TypeScript · Vite · Tailwind CSS**

You can visit the website from here: https://alhassan-programming-projects.github.io/OmniCalendar/

</div>

---

## Overview

OmniCalendar answers one question: **"What's special today, and what's coming up?"**

It is a frontend-only application with no backend, no accounts and no tracking. All data ships with the app, dates are calculated in the browser for any year, and your favorites stay on your device.

Every special day carries a **recognition label** (how official it is), a **date rule** (how its date is worked out) and at least one **source link**, so you can see how reliable each entry is.

## Features

### Discover
- **Home:** today's special days, a Day Spotlight, upcoming days, a live month preview, featured celebrations and your countdowns.
- **Explore:** search by name, topic, country or month. Filter by category, recognition level, country and month. Sort by best match, soonest or A–Z. Filters are stored in the URL, so a search can be bookmarked or shared.
- **Categories:** nine categories (Animals, Technology, Science, Environment, Food & Drink, Health, Culture & Heritage, Relationships, Society & Rights) plus a guide to the recognition levels.
- **Surprise me:** jumps to a random special day.

### Calendar
- **Month view** with category-coloured events, a side panel for the selected day, and full keyboard control (arrow keys, Page Up/Down, Home/End).
- **Year at a Glance:** a 12-month heat-map showing how many special days fall on each date.
- Jump to any date, filter by category, and deep-link to any view, for example `/calendar?date=2026-12-10` or `/calendar?view=year&year=2027`.

### Personalise
- **Favorites** with live countdowns ("12 days to go").
- **Personal collections:** group days your own way, rename them and delete them.
- **Light, Dark and System themes**, applied before first paint so there is no flash.
- Everything is saved in your browser's `localStorage`.

### Export & share
- Download any day, month, search result, favorite list or collection as a standards-compliant **`.ics`** file (RFC 5545, all-day events).
- **Add to Google Calendar** in one click.
- **Share** an event link (Web Share API, with a copy-to-clipboard fallback).

### Quality
- Responsive layout for phone, tablet and desktop, with a floating tab bar on mobile.
- Accessible by design: semantic landmarks, skip link, focus trap in dialogs, ARIA grid for the calendar, visible focus states, and reduced-motion support.
- Route-level code splitting for fast first load.

## Data and accuracy

The dataset in `src/data/events.ts` contains **130+ special days**. Each entry is labelled with one of these recognition levels:

| Level | Meaning |
|---|---|
| **UN International Day** | Proclaimed by the UN General Assembly or a UN specialised agency (UNESCO, WHO, FAO…) |
| **International Observance** | Run by another international body, for example the Council of Europe or ICOM |
| **National Holiday** | A public holiday in one or more countries |
| **Cultural / Religious** | A cultural, traditional or religious celebration |
| **Awareness Day** | A campaign led by NGOs, foundations or industry groups |
| **Unofficial / Fun Day** | A grassroots day with no formal recognition |
| **One-time Event** | A dated event such as an eclipse |

### How dates are calculated

Dates are **computed**, not hard-coded to one year:

| Rule | Example |
|---|---|
| Fixed date | World Environment Day: June 5 |
| Nth weekday | Mother's Day: second Sunday of May. US Thanksgiving: fourth Thursday of November |
| Easter-based | Mothering Sunday: Easter − 21 days (Gregorian computus) |
| Day of year | Programmers' Day: the 256th day of the year |
| Lunar table | Eid, Ramadan, Lunar New Year, Diwali: published dates per year |
| One-time | Total solar eclipses |

> **Please note:** public-holiday dates can be moved by governments, and Islamic dates depend on moon sighting and can differ by a day between countries. These are marked as estimates in the app. Always confirm with an official announcement before planning around a holiday.

## Tech stack

| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 3, with design tokens as CSS variables |
| Routing | React Router 6 |
| Icons | Lucide |
| Dates | Custom engine in `src/lib/dates.ts` (no date library) |
| Tests | Vitest |
| Persistence | `localStorage` |

The UI primitives (button, dialog, toast and so on) are small, hand-written components in the style of shadcn/ui. The project has few dependencies on purpose.

## Getting started

**Requirements:** [Node.js](https://nodejs.org/) 18 or newer (20 or 22 recommended).

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server → http://localhost:5173
npm run dev
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Type-check, then create the production build in `dist/` |
| `npm run preview` | Serve the production build locally (http://localhost:4173) |
| `npm test` | Run the unit tests |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |

## Project structure

```
omnicalendar/
├─ public/                 Static assets (favicon, _redirects)
├─ src/
│  ├─ types/               Domain types: SpecialDay, DateRule, Occurrence…
│  ├─ data/
│  │  ├─ events.ts         ← the dataset (add new days here)
│  │  ├─ categories.ts     Category and recognition metadata
│  │  └─ countries.ts      Country names and flags
│  ├─ lib/
│  │  ├─ dates.ts          Date engine (rules → concrete dates)
│  │  ├─ ics.ts            iCalendar export
│  │  ├─ search.ts         Search scoring
│  │  └─ dates.test.ts     Unit tests
│  ├─ context/             App state: theme, favorites, collections, toasts, "today"
│  ├─ hooks/               useSurprise, useDocumentTitle
│  ├─ components/
│  │  ├─ ui/               Button, Dialog, Toaster, EmptyState…
│  │  ├─ layout/           Header, mobile nav, footer, theme menu
│  │  ├─ events/           Cards, badges, favorite/collection/share actions
│  │  └─ calendar/         MonthGrid, YearGlance
│  └─ pages/               Home, Calendar, Explore, Categories, Event, Favorites, About
├─ index.html
├─ vercel.json             SPA rewrite for Vercel
└─ vite.config.ts
```

## Adding a special day

All events live in `src/data/events.ts`. Add an entry like this:

```ts
ev({
  id: "world-bee-day",                 // unique URL slug → /event/world-bee-day
  name: "World Bee Day",
  rule: fixed(5, 20),                  // see the date rules below
  category: "animals",
  recognition: "un",
  countries: ["GLOBAL"],               // optional; defaults to ["GLOBAL"]
  summary: "One sentence shown on cards.",
  background: "A longer, accurate description.",
  establishedBy: "UN General Assembly (2017)",
  sources: [UN("bee-day"), WIKI("World Bee Day")],
  tags: ["bees", "pollinators"],
}),
```

**Date rule helpers**

```ts
fixed(6, 5)                  // every June 5
nth(5, SUN, 2)               // second Sunday of May  (nth(7, FRI, -1) = last Friday of July)
easter(-2)                   // Good Friday: 2 days before Easter Sunday
table({ 2027: "03-09" }, true)  // lunar dates per year; `true` = estimated
once("2027-08-02")           // a single dated event
```

**Ground rules for contributors**
1. Only add a day if both its **date** and its **recognition level** can be backed by a source.
2. Prefer the organiser's own page (un.org, who.int, unesco.org…) as the first source.
3. Add only years with published dates to lunar `table` rules, and mark moon-sighting dates as estimated.
4. Run `npm test`. It checks that IDs are unique, every event has a source, and every event resolves to a date.

## Deployment

`npm run build` produces a static site in `dist/`. You can host it anywhere that serves static files.

> **Important:** the app uses client-side routing (`/event/pi-day`). Your host must serve `index.html` for unknown paths, otherwise refreshing a page gives a 404.

| Host | How |
|---|---|
| **Netlify** | Drag and drop the `dist/` folder, or connect a repo (build: `npm run build`, publish: `dist`). `public/_redirects` is already included. |
| **Vercel** | Import the project. `vercel.json` is already included. |
| **GitHub Pages** | Build with your repo name as the base path: `npm run build -- --base=/your-repo/`. Then copy `dist/index.html` to `dist/404.html` so deep links work, and publish `dist/`. |
| **Any static host** | Upload the contents of `dist/` and add an "all routes → index.html" rewrite. |

## Known limitations

- **Lunar dates need yearly updates.** Ramadan, Eid al-Fitr, Eid al-Adha and Islamic New Year are listed for 2025–2027. Lunar New Year and Diwali go to 2028.
- **Orthodox Easter** is not modelled yet. Easter-based dates use the Western calendar.
- **Observed holidays can differ** from the official day. For example, Oman announces its National Day holiday dates each year.
- **Favorites and collections** are stored per browser and do not sync across devices.
- **Fonts** (Inter, Plus Jakarta Sans) load from Google Fonts. Offline, the app falls back to system fonts.

## Roadmap

- [ ] Load public holidays from an API (the `SpecialDay` shape is already API-friendly)
- [ ] Orthodox Easter and Hebrew calendar rules
- [ ] Subscribable `.ics` feed and reminders (installable PWA)
- [ ] Locale and week-start settings, plus Arabic / RTL support
- [ ] Import and export of favorites and collections as JSON
- [ ] Country-based "my holidays" view

## Acknowledgements

Special-day information is gathered from the [United Nations list of International Days](https://www.un.org/en/observances/list-days-weeks), [WHO campaigns](https://www.who.int/campaigns), [UNESCO](https://www.unesco.org/), [FAO](https://www.fao.org/), the organisers of each observance, and [Wikipedia](https://www.wikipedia.org/). Each event page lists its own sources.

## License

No license has been chosen yet. Add a `LICENSE` file (for example MIT) before sharing the code publicly.
