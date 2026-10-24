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

/**
 * Orthodox Easter Sunday as a Gregorian date: Meeus' Julian computus, then the Julian→Gregorian
 * offset (13 days for 1900–2099, 14 for 2100–2199).
 */
export function orthodoxEasterSunday(year: number): Date {
  const a = year % 4, b = year % 7, c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;
  const offset = Math.floor(year / 100) - Math.floor(year / 400) - 2;
  return addDays(makeDate(year, month, day), offset);
}

// ---------- Hijri (Umm al-Qura) ----------
export const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Ula", "Jumada al-Akhirah",
  "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qadah", "Dhu al-Hijjah",
];

let hijriFormatter: Intl.DateTimeFormat | null | undefined;
function getHijriFormatter(): Intl.DateTimeFormat | null {
  if (hijriFormatter !== undefined) return hijriFormatter;
  hijriFormatter = null;
  for (const cal of ["islamic-umalqura", "islamic"]) {
    try {
      const f = new Intl.DateTimeFormat(`en-u-ca-${cal}`, { day: "numeric", month: "numeric", year: "numeric", timeZone: "UTC" });
      if (f.resolvedOptions().calendar === cal) { hijriFormatter = f; break; }
    } catch { /* calendar not supported */ }
  }
  return hijriFormatter;
}

/** Per Gregorian year: "month-day" (Hijri) → every Gregorian date in that year carrying it. */
const hijriYearCache = new Map<number, Map<string, Date[]>>();
function hijriIndex(year: number): Map<string, Date[]> {
  let idx = hijriYearCache.get(year);
  if (idx) return idx;
  idx = new Map();
  const f = getHijriFormatter();
  if (f) {
    for (let d = makeDate(year, 1, 1); d.getFullYear() === year; d = addDays(d, 1)) {
      const parts = f.formatToParts(new Date(Date.UTC(year, d.getMonth(), d.getDate(), 12)));
      const m = Number(parts.find((p) => p.type === "month")?.value);
      const day = Number(parts.find((p) => p.type === "day")?.value);
      const k = `${m}-${day}`;
      const list = idx.get(k);
      if (list) list.push(d); else idx.set(k, [d]);
    }
  }
  hijriYearCache.set(year, idx);
  return idx;
}

/** Gregorian dates in `year` that fall on the given Hijri month/day (0, 1 or occasionally 2). */
export function hijriToGregorian(year: number, month: number, day: number): Date[] {
  return hijriIndex(year).get(`${month}-${day}`) ?? [];
}

type Resolved = { date: Date; estimated: boolean };

/**
 * All dates a rule produces in a Gregorian year. Usually 0 or 1; a Hijri date can occur twice
 * in one Gregorian year because the Islamic year is ~11 days shorter.
 */
export function resolveRuleAll(rule: DateRule, year: number): Resolved[] {
  if (rule.type === "hijri") {
    const computed: Resolved[] = hijriToGregorian(year, rule.month, rule.day).map((date) => ({ date, estimated: true }));
    const c = rule.confirmed?.[year];
    if (!c) return computed;
    const [m, d] = c.split("-").map(Number);
    const confirmed = makeDate(year, m, d);
    // The announced date replaces the estimate it corresponds to (within a few days).
    const rest = computed.filter((r) => Math.abs(diffInDays(r.date, confirmed)) > 3);
    return [...rest, { date: confirmed, estimated: false }].sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  const r = resolveRule(rule, year);
  return r ? [r] : [];
}

/** Resolve a rule to a date in the given year, or null when it doesn't occur that year. */
export function resolveRule(rule: DateRule, year: number): Resolved | null {
  switch (rule.type) {
    case "hijri":
      return resolveRuleAll(rule, year)[0] ?? null;
    case "orthodox-easter":
      return { date: addDays(orthodoxEasterSunday(year), rule.offset), estimated: false };
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

/** Every occurrence of an event that starts in the given year (usually one). */
export function occurrencesInYear(event: SpecialDay, year: number): Occurrence[] {
  const duration = Math.max(1, event.durationDays ?? 1);
  return resolveRuleAll(event.rule, year).map((r) => ({ event, date: r.date, endDate: addDays(r.date, duration - 1), estimated: r.estimated }));
}

/** First occurrence of an event in the given year. */
export function occurrenceInYear(event: SpecialDay, year: number): Occurrence | null {
  return occurrencesInYear(event, year)[0] ?? null;
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
    .flatMap((e) => occurrencesInYear(e, year))
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
    for (const o of occurrencesInYear(event, y)) if (o.endDate >= f) return o;
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
    case "hijri":
      return `${rule.day} ${HIJRI_MONTHS[rule.month - 1]} (Islamic calendar) — dates are estimates until officially announced`;
    case "orthodox-easter":
      if (rule.offset === 0) return "Orthodox Easter Sunday (movable)";
      return `${Math.abs(rule.offset)} day${Math.abs(rule.offset) === 1 ? "" : "s"} ${rule.offset < 0 ? "before" : "after"} Orthodox Easter Sunday (movable)`;
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

/** Hijri (Umm al-Qura) date of a Gregorian day, e.g. "12 Rabi al-Awwal 1448 AH". Null if unsupported. */
export function formatHijri(d: Date): string | null {
  const f = getHijriFormatter();
  if (!f) return null;
  const parts = f.formatToParts(new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 12)));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const m = get("month"), day = get("day"), y = get("year");
  if (!m || !day) return null;
  return `${day} ${HIJRI_MONTHS[m - 1]}${y ? ` ${y} AH` : ""}`;
}

/** Every occurrence overlapping [from, to] (inclusive), sorted by date then name. */
export function occurrencesInRange(events: SpecialDay[], from: Date, to: Date): Occurrence[] {
  const f = startOfDay(from), t = startOfDay(to);
  const out: Occurrence[] = [];
  for (let y = f.getFullYear() - 1; y <= t.getFullYear(); y++) {
    for (const o of occurrencesForYear(events, y)) if (o.endDate >= f && o.date <= t) out.push(o);
  }
  return out.sort((a, b) => a.date.getTime() - b.date.getTime() || a.event.name.localeCompare(b.event.name));
}

/** Last day of a month (month 1–12). */
export function endOfMonth(year: number, month: number): Date {
  return makeDate(year, month, daysInMonth(year, month));
}
