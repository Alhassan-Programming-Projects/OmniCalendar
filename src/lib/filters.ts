import type { CategoryId, Occurrence, Recognition, SpecialDay } from "@/types";
import { CATEGORY_MAP, RECOGNITION_MAP } from "@/data/categories";
import { REGIONS, regionLabel, regionMembers } from "@/data/countries";
import { addDays, endOfMonth, makeDate, MONTH_NAMES, nextOccurrence, occurrencesInRange, parseISODate, startOfDay, toISODate } from "@/lib/dates";
import { scoreEvent } from "@/lib/search";

/*
 * One filter model shared by Explore, Calendar and Home. The URL is the source of truth, so every
 * filtered view is shareable; the same keys are read everywhere:
 *
 *   q        free-text search
 *   cat      categories (comma list)          rec    recognition levels (comma list)
 *   country  country code or region (ARAB, GCC)
 *   intl     "1" → with a country/region, also include worldwide days
 *   scope    "intl" = worldwide days only, "local" = country-specific occasions only
 *   from/to  inclusive date range, YYYY-MM-DD (Explore list)
 *
 * Legacy keys still work: `category` (old calendar links) and `month` (old Explore links).
 */

export type Scope = "" | "intl" | "local";

export interface DiscoveryFilters {
  q: string;
  cats: CategoryId[];
  recs: Recognition[];
  region: string;
  withIntl: boolean;
  scope: Scope;
  from: string;
  to: string;
}

export const EMPTY_FILTERS: DiscoveryFilters = { q: "", cats: [], recs: [], region: "", withIntl: false, scope: "", from: "", to: "" };

/** URL keys owned by the filter model (everything else — date, view, sort… — belongs to the page). */
export const FILTER_KEYS = ["q", "cat", "rec", "country", "intl", "scope", "from", "to", "category", "month"] as const;

const list = (v: string | null) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);

export function parseFilters(params: URLSearchParams, today = startOfDay(new Date())): DiscoveryFilters {
  const cats = list(params.get("cat")).filter((c): c is CategoryId => c in CATEGORY_MAP);
  const legacyCat = params.get("category");
  if (legacyCat && legacyCat in CATEGORY_MAP && !cats.includes(legacyCat as CategoryId)) cats.push(legacyCat as CategoryId);
  const scope = params.get("scope");
  let from = parseISODate(params.get("from") ?? "") ? params.get("from")! : "";
  let to = parseISODate(params.get("to") ?? "") ? params.get("to")! : "";
  // Legacy ?month=N → the next time that month comes around.
  const month = Number(params.get("month"));
  if (!from && !to && month >= 1 && month <= 12) {
    const y = month < today.getMonth() + 1 ? today.getFullYear() + 1 : today.getFullYear();
    from = toISODate(makeDate(y, month, 1));
    to = toISODate(endOfMonth(y, month));
  }
  if (from && to && to < from) [from, to] = [to, from];
  const region = (params.get("country") ?? "").toUpperCase();
  return {
    q: (params.get("q") ?? "").trim(),
    cats,
    recs: list(params.get("rec")).filter((r): r is Recognition => r in RECOGNITION_MAP),
    region: region === "GLOBAL" ? "" : region,
    withIntl: params.get("intl") === "1",
    scope: scope === "intl" || scope === "local" ? scope : region === "GLOBAL" ? "intl" : "",
    from,
    to,
  };
}

/** Filter keys → URL entries (empty values omitted). */
export function filterEntries(f: DiscoveryFilters): [string, string][] {
  const out: [string, string][] = [];
  if (f.q) out.push(["q", f.q]);
  if (f.cats.length) out.push(["cat", f.cats.join(",")]);
  if (f.recs.length) out.push(["rec", f.recs.join(",")]);
  if (f.region) out.push(["country", f.region]);
  if (f.region && f.withIntl) out.push(["intl", "1"]);
  if (f.scope) out.push(["scope", f.scope]);
  if (f.from) out.push(["from", f.from]);
  if (f.to) out.push(["to", f.to]);
  return out;
}

/** "q=eid&country=OM" — for links that should carry the current filters. */
export function filtersToQuery(f: DiscoveryFilters, extra: Record<string, string> = {}): string {
  const p = new URLSearchParams(filterEntries(f));
  for (const [k, v] of Object.entries(extra)) if (v) p.set(k, v);
  return p.toString();
}

/** Replace the filter keys in `params` with `f`, keeping page-specific keys (date, view, sort…). */
export function applyFilters(params: URLSearchParams, f: DiscoveryFilters): URLSearchParams {
  const next = new URLSearchParams(params);
  for (const k of FILTER_KEYS) next.delete(k);
  for (const [k, v] of filterEntries(f)) next.set(k, v);
  return next;
}

export const isInternational = (e: SpecialDay) => e.countries.includes("GLOBAL");

/** Structural filters (everything except text and dates). */
export function matchesEvent(e: SpecialDay, f: DiscoveryFilters): boolean {
  if (f.cats.length && !f.cats.includes(e.category)) return false;
  if (f.recs.length && !f.recs.includes(e.recognition)) return false;
  if (f.scope === "intl" && !isInternational(e)) return false;
  if (f.scope === "local" && isInternational(e)) return false;
  if (f.region) {
    const members = regionMembers(f.region);
    const inRegion = e.countries.some((c) => members.includes(c));
    if (!inRegion && !(f.withIntl && isInternational(e))) return false;
  }
  return true;
}

/** Text + structural filters. Returns the search score (0 = excluded). */
export function scoreWithFilters(e: SpecialDay, f: DiscoveryFilters, occ?: Occurrence): number {
  if (!matchesEvent(e, f)) return 0;
  const when = occ ? `${MONTH_NAMES[occ.date.getMonth()]} ${occ.date.getDate()} ${occ.date.getFullYear()}` : "";
  return scoreEvent(e, f.q, when);
}

/** Events passing every filter except the date range — what the calendar draws. */
export function filterEvents(events: SpecialDay[], f: DiscoveryFilters): SpecialDay[] {
  if (!hasFilters({ ...f, from: "", to: "" })) return events;
  return events.filter((e) => scoreWithFilters(e, f) > 0);
}

export function hasFilters(f: DiscoveryFilters): boolean {
  return filterEntries(f).length > 0;
}

export function activeFilterCount(f: DiscoveryFilters): number {
  return f.cats.length + f.recs.length + (f.region ? 1 : 0) + (f.scope ? 1 : 0) + (f.from || f.to ? 1 : 0);
}

export interface ResultItem { occ: Occurrence; score: number }

/**
 * Explore results: with a date range, every occurrence inside it; otherwise each event's next
 * occurrence from today. Sorted by date, relevance or name.
 */
export function searchOccurrences(events: SpecialDay[], f: DiscoveryFilters, today: Date, sort: "date" | "relevance" | "az" = "date"): Occurrence[] {
  const out: ResultItem[] = [];
  const candidates = filterEvents(events, { ...f, q: "" });
  if (f.from || f.to) {
    const from = parseISODate(f.from) ?? today;
    const to = parseISODate(f.to) ?? addDays(from, 365);
    for (const occ of occurrencesInRange(candidates, from, to)) {
      const score = scoreWithFilters(occ.event, f, occ);
      if (score) out.push({ occ, score });
    }
  } else {
    for (const e of candidates) {
      const occ = nextOccurrence(e, today);
      if (!occ) continue;
      const score = scoreWithFilters(e, f, occ);
      if (score) out.push({ occ, score });
    }
  }
  if (sort === "az") out.sort((a, b) => a.occ.event.name.localeCompare(b.occ.event.name) || a.occ.date.getTime() - b.occ.date.getTime());
  else if (sort === "relevance") out.sort((a, b) => b.score - a.score || a.occ.date.getTime() - b.occ.date.getTime());
  else out.sort((a, b) => a.occ.date.getTime() - b.occ.date.getTime() || a.occ.event.name.localeCompare(b.occ.event.name));
  return out.map((r) => r.occ);
}

// ---------- Date range presets ----------
export interface RangePreset { id: string; label: string; range: (today: Date) => [Date, Date] }

export const RANGE_PRESETS: RangePreset[] = [
  { id: "today", label: "Today", range: (t) => [t, t] },
  { id: "7d", label: "Next 7 days", range: (t) => [t, addDays(t, 6)] },
  { id: "30d", label: "Next 30 days", range: (t) => [t, addDays(t, 29)] },
  { id: "month", label: "This month", range: (t) => [makeDate(t.getFullYear(), t.getMonth() + 1, 1), endOfMonth(t.getFullYear(), t.getMonth() + 1)] },
  { id: "next-month", label: "Next month", range: (t) => { const n = makeDate(t.getFullYear(), t.getMonth() + 2, 1); return [n, endOfMonth(n.getFullYear(), n.getMonth() + 1)]; } },
  { id: "90d", label: "Next 3 months", range: (t) => [t, addDays(t, 89)] },
  { id: "year", label: "This year", range: (t) => [makeDate(t.getFullYear(), 1, 1), makeDate(t.getFullYear(), 12, 31)] },
];

/** Which preset (if any) the current from/to matches; "custom" otherwise, "" when unset. */
export function detectPreset(f: DiscoveryFilters, today: Date): string {
  if (!f.from && !f.to) return "";
  for (const p of RANGE_PRESETS) {
    const [a, b] = p.range(today);
    if (toISODate(a) === f.from && toISODate(b) === f.to) return p.id;
  }
  return "custom";
}

export function presetRange(id: string, today: Date): { from: string; to: string } {
  const p = RANGE_PRESETS.find((x) => x.id === id);
  if (!p) return { from: "", to: "" };
  const [a, b] = p.range(today);
  return { from: toISODate(a), to: toISODate(b) };
}

function rangeLabel(f: DiscoveryFilters, today: Date): string {
  const preset = RANGE_PRESETS.find((p) => p.id === detectPreset(f, today));
  if (preset) return preset.label;
  const fmt = (s: string) => parseISODate(s)?.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) ?? s;
  if (f.from && f.to) return f.from === f.to ? fmt(f.from) : `${fmt(f.from)} – ${fmt(f.to)}`;
  return f.from ? `From ${fmt(f.from)}` : `Until ${fmt(f.to)}`;
}

// ---------- Active filter chips ----------
export interface FilterChip { key: string; label: string; without: DiscoveryFilters }

/** One removable chip per active filter, each carrying the filters without it. */
export function filterChips(f: DiscoveryFilters, today: Date, { includeQuery = true } = {}): FilterChip[] {
  const chips: FilterChip[] = [];
  if (includeQuery && f.q) chips.push({ key: "q", label: `“${f.q}”`, without: { ...f, q: "" } });
  if (f.region) chips.push({ key: "region", label: `${regionLabel(f.region)}${f.withIntl ? " + worldwide" : ""}`, without: { ...f, region: "", withIntl: false } });
  if (f.scope) chips.push({ key: "scope", label: f.scope === "intl" ? "🌍 International days" : "📍 Country-specific", without: { ...f, scope: "" } });
  if (f.from || f.to) chips.push({ key: "range", label: rangeLabel(f, today), without: { ...f, from: "", to: "" } });
  for (const c of f.cats) chips.push({ key: `cat-${c}`, label: CATEGORY_MAP[c].label, without: { ...f, cats: f.cats.filter((x) => x !== c) } });
  for (const r of f.recs) chips.push({ key: `rec-${r}`, label: RECOGNITION_MAP[r].short, without: { ...f, recs: f.recs.filter((x) => x !== r) } });
  return chips;
}

export const REGION_CODES = Object.keys(REGIONS);
