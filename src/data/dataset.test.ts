import { describe, expect, it } from "vitest";
import { EVENTS } from "./events";
import { CORE_EVENT_COUNT } from "./events";
import { COUNTRIES } from "./countries";
import { CATEGORY_MAP, RECOGNITION_MAP } from "./categories";
import { occurrenceInYear, occurrencesInYear, parseISODate, toISODate, hijriToGregorian, orthodoxEasterSunday } from "@/lib/dates";
import { normalize } from "@/lib/search";

/** Dataset integrity: every rule here protects search, calendar, filters and the event page. */
describe("dataset integrity", () => {
  it("ids are unique and URL-safe", () => {
    const ids = EVENTS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id, id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("names are unique (no duplicate observances)", () => {
    const seen = new Map<string, string>();
    for (const e of EVENTS) {
      const k = normalize(e.name);
      expect(seen.has(k), `${e.id} duplicates ${seen.get(k)}`).toBe(false);
      seen.set(k, e.id);
    }
  });

  it("no two events share both a date rule and a near-identical name", () => {
    const key = (e: (typeof EVENTS)[number]) => JSON.stringify(e.rule);
    const groups = new Map<string, string[]>();
    for (const e of EVENTS) groups.set(key(e), [...(groups.get(key(e)) ?? []), normalize(e.name)]);
    for (const names of groups.values()) {
      for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) {
        const a = new Set(names[i].split(" ").filter((w) => w.length > 3));
        const b = names[j].split(" ").filter((w) => w.length > 3);
        const overlap = b.filter((w) => a.has(w)).length / Math.max(1, Math.min(a.size, b.length));
        expect(overlap, `${names[i]} ~ ${names[j]}`).toBeLessThan(1);
      }
    }
  });

  it("every country, category and recognition code is known", () => {
    for (const e of EVENTS) {
      expect(CATEGORY_MAP[e.category], e.id).toBeDefined();
      expect(RECOGNITION_MAP[e.recognition], e.id).toBeDefined();
      expect(e.countries.length, e.id).toBeGreaterThan(0);
      for (const c of e.countries) expect(COUNTRIES[c], `${e.id}: ${c}`).toBeDefined();
    }
  });

  it("every event has at least one https source and a one-line summary", () => {
    for (const e of EVENTS) {
      expect(e.sources.length, e.id).toBeGreaterThan(0);
      for (const s of e.sources) expect(s.url, e.id).toMatch(/^https:\/\//);
      expect(e.summary.length, e.id).toBeLessThanOrEqual(170);
      expect(e.background.length, e.id).toBeGreaterThan(20);
    }
  });

  it("every event resolves in at least one year 2025–2028", () => {
    for (const e of EVENTS) expect([2025, 2026, 2027, 2028].some((y) => occurrenceInYear(e, y)), e.id).toBe(true);
  });

  it("announced holidays are valid dates for a listed country", () => {
    for (const e of EVENTS) for (const h of e.observed ?? []) {
      expect(parseISODate(h.start), `${e.id} ${h.start}`).not.toBeNull();
      if (h.end) expect(h.end >= h.start, `${e.id} ${h.end}`).toBe(true);
      expect(e.countries, `${e.id}: ${h.country}`).toContain(h.country);
      expect(h.source.url).toMatch(/^https:\/\//);
    }
  });

  it("Hijri rules are valid and confirmed dates sit within 3 days of the calculation", () => {
    for (const e of EVENTS) {
      if (e.rule.type !== "hijri") continue;
      const { month, day, confirmed } = e.rule;
      expect(month >= 1 && month <= 12 && day >= 1 && day <= 30, e.id).toBe(true);
      for (const [y, md] of Object.entries(confirmed ?? {})) {
        const est = hijriToGregorian(+y, month, day).map(toISODate);
        const diffs = est.map((d) => Math.abs((Date.parse(d) - Date.parse(`${y}-${md}`)) / 864e5));
        expect(Math.min(...diffs), `${e.id} ${y}`).toBeLessThanOrEqual(3);
      }
    }
  });

  it("keeps every original event (expansion only adds)", () => {
    expect(CORE_EVENT_COUNT).toBe(139);
  });
});

describe("Hijri and Orthodox rules", () => {
  it("Umm al-Qura dates match officially announced 2025–2026 dates", () => {
    expect(hijriToGregorian(2025, 9, 1).map(toISODate)).toEqual(["2025-03-01"]); // Ramadan 1446
    expect(hijriToGregorian(2025, 10, 1).map(toISODate)).toEqual(["2025-03-30"]); // Eid al-Fitr 1446 (Saudi/UAE)
    expect(hijriToGregorian(2026, 9, 1).map(toISODate)).toEqual(["2026-02-18"]); // Ramadan 1447
    expect(hijriToGregorian(2026, 12, 10).map(toISODate)).toEqual(["2026-05-27"]); // Eid al-Adha 1447
  });
  it("a Hijri date can occur twice in one Gregorian year", () => {
    const isra = EVENTS.find((e) => e.id === "isra-and-miraj")!;
    expect(occurrencesInYear(isra, 2027).map((o) => toISODate(o.date))).toEqual(["2027-01-05", "2027-12-25"]);
  });
  it("Orthodox Easter and Sham el-Nessim", () => {
    expect(toISODate(orthodoxEasterSunday(2025))).toBe("2025-04-20");
    expect(toISODate(orthodoxEasterSunday(2026))).toBe("2026-04-12");
    expect(toISODate(orthodoxEasterSunday(2027))).toBe("2027-05-02");
    const sham = EVENTS.find((e) => e.id === "sham-el-nessim")!;
    expect(toISODate(occurrenceInYear(sham, 2026)!.date)).toBe("2026-04-13");
  });
});
