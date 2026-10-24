/**
 * Core domain types for OmniCalendar.
 * The data model is intentionally API-friendly: every event is plain JSON,
 * and dates are described by rules that are resolved per year at runtime.
 */

export type CategoryId =
  | "animals"
  | "technology"
  | "science"
  | "environment"
  | "food"
  | "health"
  | "culture"
  | "relationships"
  | "society";

/**
 * How "official" a day is. Kept separate from category on purpose:
 * a technology day can be a UN observance or a purely unofficial one.
 */
export type Recognition =
  | "un" // Proclaimed by the UN General Assembly or a UN specialised agency
  | "international" // Coordinated by another international body (e.g. Council of Europe, IFAW, ICOM)
  | "national" // Public / national holiday in one or more countries
  | "observance" // Official or nationally recognised day that is NOT a public holiday
  | "cultural" // Cultural or religious celebration
  | "awareness" // Awareness campaign run by NGOs or industry
  | "unofficial" // Fun / grassroots day with no formal recognition
  | "event"; // One-time or astronomical event (not an observance)

/** Month is 1–12; weekday is 0 (Sunday) – 6 (Saturday). */
export type DateRule =
  | { type: "fixed"; month: number; day: number }
  /** n = 1..5 for "nth", -1 for "last". */
  | { type: "nth-weekday"; month: number; weekday: number; n: number }
  /** Offset in days from Western (Gregorian) Easter Sunday. */
  | { type: "easter"; offset: number }
  /** The Nth day of the year (e.g. Programmers' Day = 256). */
  | { type: "day-of-year"; day: number }
  /**
   * Lunar / lunisolar observances with a published table of dates.
   * Keys are years, values are "MM-DD". Years outside the table are not shown.
   */
  | { type: "table"; dates: Record<number, string>; estimated?: boolean }
  /** A single dated occurrence. */
  | { type: "once"; date: string }
  /**
   * Islamic (Hijri) calendar date, e.g. 1 Shawwal for Eid al-Fitr. Month 1–12 (Muharram = 1).
   * Resolved with the Umm al-Qura calendar and flagged as an estimate, because the day an
   * observance falls on is set by moon sighting and can differ by a day between countries.
   * `confirmed` holds officially announced dates ("MM-DD" per Gregorian year) that replace the estimate.
   */
  | { type: "hijri"; month: number; day: number; confirmed?: Record<number, string> }
  /** Offset in days from Orthodox (Julian-calendar) Easter Sunday, e.g. Sham el-Nessim = +1. */
  | { type: "orthodox-easter"; offset: number };

export interface Source {
  label: string;
  url: string;
}

/**
 * An officially announced public-holiday period for one country and year. Used where the day off
 * differs from the occasion itself (holidays moved to a weekday, multi-day Eid breaks, local moon sighting).
 */
export interface ObservedHoliday {
  /** ISO 3166-1 alpha-2 code. */
  country: string;
  /** First day off, YYYY-MM-DD. */
  start: string;
  /** Last day off (inclusive), YYYY-MM-DD; omit for a single day. */
  end?: string;
  note?: string;
  source: Source;
}

export interface SpecialDay {
  /** URL-safe, stable identifier. */
  id: string;
  name: string;
  rule: DateRule;
  /** Number of days the observance lasts (default 1). */
  durationDays?: number;
  category: CategoryId;
  recognition: Recognition;
  /** ISO 3166-1 alpha-2 codes, or ["GLOBAL"]. */
  countries: string[];
  /** One-line hook used on cards. */
  summary: string;
  /** Longer description / background. */
  background: string;
  /** Who established it (and when), when reliably known. */
  establishedBy?: string;
  /** Free text note such as "Dates depend on moon sighting". */
  note?: string;
  tags?: string[];
  sources: Source[];
  /** Officially announced holiday dates per country/year, when they differ from or extend the occasion. */
  observed?: ObservedHoliday[];
}

/** A special day resolved to a concrete calendar date. */
export interface Occurrence {
  event: SpecialDay;
  /** Local date at 00:00. */
  date: Date;
  /** Inclusive last day (same as date for single-day events). */
  endDate: Date;
  estimated: boolean;
}

/** "glass" is the Liquid Glass material; it follows the system light/dark appearance. */
export type ThemePreference = "light" | "dark" | "system" | "glass";

export interface Collection {
  id: string;
  name: string;
  eventIds: string[];
  createdAt: number;
}
