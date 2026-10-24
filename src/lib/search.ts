import type { CategoryId, Recognition, SpecialDay } from "@/types";
import { CATEGORY_MAP } from "@/data/categories";
import { COUNTRIES } from "@/data/countries";

export function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

const indexCache = new WeakMap<SpecialDay, { name: string; body: string }>();

function indexOf(e: SpecialDay) {
  let idx = indexCache.get(e);
  if (!idx) {
    idx = {
      name: normalize(e.name),
      body: normalize(
        [e.summary, ...(e.tags ?? []), CATEGORY_MAP[e.category].label, ...e.countries.map((c) => COUNTRIES[c]?.name ?? c)].join(" "),
      ),
    };
    indexCache.set(e, idx);
  }
  return idx;
}

/** Score an event against a query; 0 = no match. Every query token must match somewhere. */
export function scoreEvent(e: SpecialDay, query: string, extra = ""): number {
  const q = normalize(query);
  if (!q) return 1;
  const { name, body } = indexOf(e);
  extra = normalize(extra);
  let score = 0;
  if (name === q) score += 100;
  else if (name.startsWith(q)) score += 60;
  else if (name.includes(q)) score += 40;
  for (const t of q.split(" ")) {
    if (name.split(" ").some((w) => w.startsWith(t))) score += 10;
    else if (body.includes(t) || extra.includes(t)) score += 4;
    else return 0;
  }
  return score;
}

export interface Filters {
  q: string;
  categories: CategoryId[];
  recognitions: Recognition[];
  country: string; // "" = any
  month: number; // 0 = any, 1..12
}

export const EMPTY_FILTERS: Filters = { q: "", categories: [], recognitions: [], country: "", month: 0 };
