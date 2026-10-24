# OmniCalendar — *Every Day Has a Story*

A frontend-only web app for discovering special days: UN international days, national holidays, cultural and religious celebrations, awareness days and fun unofficial days. Every day in the dataset has a recognition label, a date rule and at least one source.

## Quick start

Requires **Node.js 18+** (20 or 22 recommended).

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # date-engine + .ics unit tests (Vitest)
npm run build      # type-check + production build → dist/
npm run preview    # serve the production build locally
```

## Features

| Area | What it does |
|---|---|
| **Home** | Today's special days, Day Spotlight, upcoming list, live month preview, your countdowns, featured days, categories |
| **Calendar** | Month view (keyboard: arrows, PageUp/PageDown, Home/End), Year at a Glance heat-map, jump-to-date, category filter, per-day and per-month `.ics` export. Deep-linkable: `/calendar?date=2026-12-10`, `/calendar?view=year&year=2027` |
| **Explore** | Search by name, topic, country or month name; filter by category, recognition, country, month; sort by relevance, date or A–Z; export results. Filters live in the URL, so they can be shared |
| **Categories** | 9 categories plus a recognition-level legend |
| **Event details** | Background, date rule, next date + countdown, future dates, where it's observed, sources, related days |
| **Favorites & Collections** | Saved in `localStorage`; countdowns, rename/delete collections, export any of them as `.ics` |
| **Export & share** | RFC 5545 `.ics` download, “Add to Google Calendar”, Web Share API (falls back to copying the link) |
| **Theme** | Light, Dark or System, applied before first paint (no flash) |
| **Surprise me** | Opens a random special day |

## Project structure

```
src/
  types/            Domain types (SpecialDay, DateRule, Occurrence…)
  data/
    events.ts       The dataset — 139 special days
    categories.ts   Category + recognition metadata (labels, icons, colours)
    countries.ts    Country names and flags
  lib/
    dates.ts        Date engine: fixed, nth-weekday, Easter-based, day-of-year, lunar tables, one-time
    ics.ts          iCalendar export
    search.ts       Search scoring
    dates.test.ts   Unit tests
  context/          App state: theme, favorites, collections, toasts, "today" (rolls over at midnight)
  components/
    ui/             Button, Dialog, Toaster, EmptyState, SectionHeader
    layout/         Header, mobile tab bar, footer, theme menu
    events/         Cards, rows, badges, favorite/collection/share actions, countdown
    calendar/       MonthGrid, YearGlance, day index
  pages/            Route-level pages (lazy-loaded)
```

**Stack:** React 18 + TypeScript + Vite 6, Tailwind CSS 3 (design tokens as CSS variables in `src/index.css`), React Router 6, Lucide icons. UI primitives are small, hand-written, shadcn-style components, so there are no extra UI dependencies. Date maths is done in `lib/dates.ts` with no external library, so the rules stay easy to test.

## Adding a special day

Add an entry to `src/data/events.ts`:

```ts
ev({
  id: "world-bee-day",                  // URL slug, must be unique
  name: "World Bee Day",
  rule: fixed(5, 20),                   // or nth(5, SUN, 2), easter(-2), table({...}, true), once("2027-08-02")
  category: "animals",
  recognition: "un",                    // un | international | national | cultural | awareness | unofficial | event
  countries: ["GLOBAL"],                // optional, defaults to GLOBAL
  summary: "One sentence for cards.",
  background: "Longer, sourced history.",
  sources: [UN_LIST, WIKI("World Bee Day")],
  tags: ["bees"],
}),
```

Rules of the dataset: only add days whose date **and** recognition level you can source. Put lunar dates in a `table` rule and only list years with published dates; mark moon-sighting dates `estimated`. `npm test` checks that every event resolves to a date and has a source.

## Deployment

The output of `npm run build` is a static site. Because the app uses client-side routing, the host must send unknown paths to `index.html`. `public/_redirects` (Netlify) and `vercel.json` (Vercel) are included. For a sub-path deploy (e.g. GitHub Pages), build with `vite build --base=/your-repo/`.

## Known limitations

- **Lunar dates** (Ramadan, Eid al-Fitr, Eid al-Adha, Islamic New Year) are listed for 2025–2027 only; Lunar New Year and Diwali through 2028. They need updating each year, and Islamic dates may differ by a day between countries.
- **Public holidays can move**: for example, Oman's observed National Day holiday is announced each year.
- Easter-based dates use the Western computus; Orthodox Easter is not modelled yet.
- Some UN pages move over time. Days whose UN page could not be confirmed link to the UN's official list of international days instead.
- Favorites and collections live in one browser and are not synced.
- The Google Fonts stylesheet (Inter, Plus Jakarta Sans) needs internet access; offline, the app falls back to system fonts.

## Future ideas

- Pull public holidays from an API (e.g. Nager.Date) through the existing `SpecialDay` shape
- Orthodox Easter and Hebrew-calendar rules
- Subscribable `.ics` feed URL and reminders/notifications (PWA)
- Locale and week-start settings; Arabic / RTL translation
- Import/export of favorites and collections as JSON
