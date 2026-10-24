import type { SpecialDay } from "@/types";
import { CATEGORY_MAP, RECOGNITION_MAP } from "@/data/categories";
import { ARAB_LEAGUE, COUNTRIES, COUNTRY_ALIASES, GCC } from "@/data/countries";
import { HIJRI_MONTHS } from "@/lib/dates";

/**
 * Search normalisation: lower-case, strip Latin accents and Arabic diacritics, unify Arabic letter
 * variants (أ/إ/آ → ا, ى → ي, ة → ه), keep Latin, digits and Arabic letters.
 */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ً-ٰٟـ]/g, "")
    .replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/[^a-z0-9\sء-ي]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const MAGHREB = ["MA", "DZ", "TN", "LY", "MR"];

/** Query words mapped to the terms they should also match (Arabic → English, and common synonyms). */
const SYNONYMS: Record<string, string[]> = Object.fromEntries(
  Object.entries({
    // Arabic keywords
    "عيد": ["eid"], "رمضان": ["ramadan"], "الفطر": ["fitr"], "الاضحي": ["adha"], "وطني": ["national"], "الوطني": ["national"],
    "اليوم": ["day"], "المولد": ["mawlid"], "النبوي": ["prophet"], "الهجريه": ["hijri"], "هجري": ["hijri"], "الاسراء": ["isra"],
    "المعراج": ["miraj"], "عرفه": ["arafah"], "عاشوراء": ["ashura"], "الام": ["mother"], "المعلم": ["teachers"], "المراه": ["women"],
    "الشباب": ["youth"], "البيئه": ["environment"], "العلم": ["flag"], "الاستقلال": ["independence"], "قرنقشوه": ["qaranqasho"],
    "قرقيعان": ["gargeean"], "خريف": ["khareef"], "مسقط": ["muscat"], "الكتاب": ["book"], "عطله": ["holiday"], "اجازه": ["holiday"],
    // English synonyms
    holidays: ["holiday"], "day-off": ["holiday"], vacation: ["holiday"], islam: ["islamic"], muslim: ["islamic"],
    gulf: ["gcc"], khaleej: ["gcc"], arabian: ["arab"], mideast: ["middle"], cyber: ["cybersecurity", "security"],
    infosec: ["cybersecurity"], ai: ["artificial", "technology"], space: ["astronomy", "moon", "asteroid"],
    kids: ["children"], child: ["children"], mom: ["mother"], mum: ["mother"], dad: ["father"],
  }).map(([k, v]) => [normalize(k), v]),
);

interface Index { name: string; nameWords: string[]; keywords: string; text: string }
const indexCache = new WeakMap<SpecialDay, Index>();

function indexOf(e: SpecialDay): Index {
  let idx = indexCache.get(e);
  if (idx) return idx;
  const rec = RECOGNITION_MAP[e.recognition];
  const keywords = [
    ...(e.tags ?? []),
    CATEGORY_MAP[e.category].label, e.category,
    rec.label, rec.short, e.recognition === "national" ? "public holiday day off" : "",
    ...e.countries.flatMap((c) => [COUNTRIES[c]?.name ?? c, c, COUNTRY_ALIASES[c] ?? ""]),
    e.countries.some((c) => ARAB_LEAGUE.includes(c)) ? "arab world arabic arabia middle east" : "",
    e.countries.some((c) => GCC.includes(c)) ? "gcc gulf" : "",
    e.countries.some((c) => MAGHREB.includes(c)) ? "maghreb north africa" : "",
    e.rule.type === "hijri" ? `islamic hijri lunar ${HIJRI_MONTHS[e.rule.month - 1]}` : "",
    e.rule.type === "orthodox-easter" ? "orthodox coptic christian easter" : "",
  ].join(" ");
  const name = normalize(e.name);
  idx = {
    name,
    nameWords: name.split(" "),
    keywords: ` ${normalize(keywords)}`,
    text: normalize([e.summary, e.background, e.establishedBy ?? "", e.note ?? ""].join(" ")),
  };
  indexCache.set(e, idx);
  return idx;
}

/** How well one query word matches: name word > keyword (word start) > description (anywhere). */
function tokenScore(idx: Index, t: string, extra: string): number {
  if (idx.nameWords.some((w) => w.startsWith(t))) return 10;
  if (idx.keywords.includes(` ${t}`)) return 6;
  if (t.length >= 3 && idx.text.includes(t)) return 3;
  if (extra.includes(t)) return 3;
  return 0;
}

/**
 * Score an event against a free-text query; 0 = no match. Every query word must match somewhere
 * (name, keywords — tags, category, recognition, countries, regions — or the description).
 * `extra` adds context such as the formatted date ("October 31 2026").
 */
export function scoreEvent(e: SpecialDay, query: string, extra = ""): number {
  const q = normalize(query);
  if (!q) return 1;
  const idx = indexOf(e);
  const ex = normalize(extra);
  let score = 0;
  if (idx.name === q) score += 100;
  else if (idx.name.startsWith(q)) score += 60;
  else if (idx.name.includes(q)) score += 40;
  for (const t of q.split(" ")) {
    let best = tokenScore(idx, t, ex);
    for (const alt of SYNONYMS[t] ?? []) best = Math.max(best, tokenScore(idx, normalize(alt), ex) - 1);
    if (!best) return 0;
    score += best;
  }
  return score;
}
