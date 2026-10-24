import type { CategoryId, DateRule, Recognition, Source, SpecialDay, ObservedHoliday } from "@/types";

/*
 * Shared building blocks for the event dataset (events.ts and the regional modules).
 * Contributor rules: see the header of events.ts.
 */

export const fixed = (month: number, day: number): DateRule => ({ type: "fixed", month, day });
/** weekday: 0=Sun … 6=Sat; n=-1 means last. */
export const nth = (month: number, weekday: number, n: number): DateRule => ({ type: "nth-weekday", month, weekday, n });
export const easter = (offset: number): DateRule => ({ type: "easter", offset });
export const table = (dates: Record<number, string>, estimated = false): DateRule => ({ type: "table", dates, estimated });
export const once = (date: string): DateRule => ({ type: "once", date });

export const UN = (slug: string, label = "United Nations"): Source => ({ label, url: `https://www.un.org/en/observances/${slug}` });
export const UN_LIST: Source = { label: "UN list of International Days", url: "https://www.un.org/en/observances/list-days-weeks" };
export const WHO = (slug: string): Source => ({ label: "World Health Organization", url: `https://www.who.int/campaigns/${slug}` });
export const WIKI = (title: string): Source => ({ label: "Wikipedia", url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}` });
export const SRC = (label: string, url: string): Source => ({ label, url });

export const GLOBAL = ["GLOBAL"];
export const SUN = 0, MON = 1, TUE = 2, WED = 3, THU = 4, FRI = 5, SAT = 6;

export interface Def {
  id: string;
  name: string;
  rule: DateRule;
  category: CategoryId;
  recognition: Recognition;
  summary: string;
  background: string;
  sources: Source[];
  countries?: string[];
  durationDays?: number;
  establishedBy?: string;
  note?: string;
  tags?: string[];
  observed?: ObservedHoliday[];
}

export const ev = (d: Def): SpecialDay => ({ countries: GLOBAL, ...d });


/** Islamic-calendar date (Umm al-Qura estimate). `confirmed`: officially announced "MM-DD" per Gregorian year. */
export const hijri = (month: number, day: number, confirmed?: Record<number, string>): DateRule => ({ type: "hijri", month, day, confirmed });
/** Offset from Orthodox Easter Sunday. */
export const orthodoxEaster = (offset: number): DateRule => ({ type: "orthodox-easter", offset });
