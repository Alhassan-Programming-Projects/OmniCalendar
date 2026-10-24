import type { DateRule, Occurrence, SpecialDay } from "@/types";

/** Build a local date (no time component). Month is 1–12. */
export function makeDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Whole calendar days from a to b (DST-safe). */
export function diffInDays(a: Date, b: Date): number {
  const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((ub - ua) / 86_400_000);
}

/** YYYY-MM-DD in local time. */
export function toISODate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function parseISODate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = makeDate(+m[1], +m[2], +m[3]);
  return toISODate(d) === s ? d : null;
}

/**
 * Western Easter Sunday — Anonymous Gregorian algorithm (Meeus/Jones/Butcher).
 */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return makeDate(year, month, day);
}

/** nth weekday of a month; n = -1 means the last one. Returns null if it doesn't exist. */
export function nthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date | null {
  if (n === -1) {
    const last = makeDate(year, month, daysInMonth(year, month));
    const back = (last.getDay() - weekday + 7) % 7;
    return addDays(last, -back);
  }
  const first = makeDate(year, month, 1);
  const forward = (weekday - first.getDay() + 7) % 7;
  const day = 1 + forward + (n - 1) * 7;
  if (day > daysInMonth(year, month)) return null;
  return makeDate(year, month, day);
}

/** Resolve a rule to a date in the given year, or null when it doesn't occur that year. */
export function resolveRule(rule: DateRule, year: number): { date: Date; estimated: boolean } | null {
  switch (rule.type) {
    case "fixed": {
      if (rule.month === 2 && rule.day === 29 && !isLeapYear(year)) return null;
      return { date: makeDate(year, rule.month, rule.day), estimated: false };
    }
    case "nth-weekday": {
      const d = nthWeekdayOfMonth(year, rule.month, rule.weekday, rule.n);
      return d ? { date: d, estimated: false } : null;
    }
    case "easter":
      return { date: addDays(easterSunday(year), rule.offset), estimated: false };
    case "day-of-year":
      return { date: addDays(makeDate(year, 1, 1), rule.day - 1), estimated: false };
    case "table": {
      const md = rule.dates[year];
      if (!md) return null;
      const [m, d] = md.split("-").map(Number);
      return { date: makeDate(year, m, d), estimated: !!rule.estimated };
    }
    case "once": {
      const d = parseISODate(rule.date);
      if (!d || d.getFullYear() !== year) return null;
      return { date: d, estimated: false };
    }
  }
}

export function occurrenceInYear(event: SpecialDay, year: number): Occurrence | null {
  const r = resolveRule(event.rule, year);
  if (!r) return null;
  const duration = Math.max(1, event.durationDays ?? 1);
  return { event, date: r.date, endDate: addDays(r.date, duration - 1), estimated: r.estimated };
}

/** All occurrences in a year, sorted by date then name. Cached per dataset+year. */
const yearCache = new WeakMap<SpecialDay[], Map<number, Occurrence[]>>();

export function occurrencesForYear(events: SpecialDay[], year: number): Occurrence[] {
  let byYear = yearCache.get(events);
  if (!byYear) {
    byYear = new Map();
    yearCache.set(events, byYear);
  }
  const hit = byYear.get(year);
  if (hit) return hit;
  const list = events
    .map((e) => occurrenceInYear(e, year))
    .filter((o): o is Occurrence => o !== null)
    .sort((a, b) => a.date.getTime() - b.date.getTime() || a.event.name.localeCompare(b.event.name));
  byYear.set(year, list);
  return list;
}

/** Occurrences active on a given day (multi-day events included). */
export function occurrencesOn(events: SpecialDay[], day: Date): Occurrence[] {
  const d = startOfDay(day);
  // Events spanning year boundaries: include previous year's long events.
  const pool = [...occurrencesForYear(events, d.getFullYear() - 1), ...occurrencesForYear(events, d.getFullYear())];
  return pool.filter((o) => o.date <= d && o.endDate >= d);
}

/** Next occurrence of an event on or after `from` (looks up to 5 years ahead). */
export function nextOccurrence(event: SpecialDay, from: Date): Occurrence | null {
  const f = startOfDay(from);
  for (let y = f.getFullYear() - 1; y <= f.getFullYear() + 5; y++) {
    const o = occurrenceInYear(event, y);
    if (o && o.endDate >= f) return o;
  }
  return null;
}

/** Upcoming occurrences strictly after `from`, within `days` days. */
export function upcoming(events: SpecialDay[], from: Date, days: number): Occurrence[] {
  const f = startOfDay(from);
  const end = addDays(f, days);
  const pool = [...occurrencesForYear(events, f.getFullYear()), ...occurrencesForYear(events, f.getFullYear() + 1)];
  return pool.filter((o) => o.date > f && o.date <= end);
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const ORD = ["", "first", "second", "third", "fourth", "fifth"];

export const MONTH_NAMES = MONTHS;
export const WEEKDAY_NAMES = WEEKDAYS;

/** Human-readable explanation of a rule, e.g. "Second Sunday of May". */
export function describeRule(rule: DateRule): string {
  switch (rule.type) {
    case "fixed":
      return `Every year on ${MONTHS[rule.month - 1]} ${rule.day}${rule.month === 2 && rule.day === 29 ? " (leap years only)" : ""}`;
    case "nth-weekday": {
      const which = rule.n === -1 ? "Last" : cap(ORD[rule.n]);
      return `${which} ${WEEKDAYS[rule.weekday]} of ${MONTHS[rule.month - 1]}`;
    }
    case "easter":
      if (rule.offset === 0) return "Easter Sunday (movable)";
      return `${Math.abs(rule.offset)} days ${rule.offset < 0 ? "before" : "after"} Easter Sunday (movable)`;
    case "day-of-year":
      return `The ${rule.day}th day of the year`;
    case "table":
      return rule.estimated ? "Follows a lunar calendar — dates are estimates" : "Follows a lunar calendar";
    case "once":
      return "One-time event";
  }
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatLong(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export function formatShort(d: Date): string {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatRange(o: Occurrence): string {
  if (sameDay(o.date, o.endDate)) return formatLong(o.date);
  const sameYear = o.date.getFullYear() === o.endDate.getFullYear();
  const start = o.date.toLocaleDateString(undefined, { month: "long", day: "numeric", ...(sameYear ? {} : { year: "numeric" }) });
  return `${start} – ${o.endDate.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`;
}

/** "Today", "Tomorrow", "In 12 days", "3 days ago". */
export function relativeLabel(d: Date, today: Date): string {
  const n = diffInDays(today, d);
  if (n === 0) return "Today";
  if (n === 1) return "Tomorrow";
  if (n === -1) return "Yesterday";
  return n > 0 ? `In ${n} days` : `${-n} days ago`;
}
