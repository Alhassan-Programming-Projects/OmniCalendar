import { describe, expect, it } from "vitest";
import {
  diffInDays, easterSunday, nextOccurrence, nthWeekdayOfMonth, occurrenceInYear, occurrencesForYear,
  occurrencesOn, parseISODate, resolveRule, toISODate, upcoming,
} from "./dates";
import { EVENTS, EVENT_MAP } from "@/data/events";
import { buildICS } from "./ics";

const iso = (d: Date | null | undefined) => (d ? toISODate(d) : null);

describe("easterSunday", () => {
  it.each([
    [2024, "2024-03-31"], [2025, "2025-04-20"], [2026, "2026-04-05"], [2027, "2027-03-28"],
    [2028, "2028-04-16"], [2019, "2019-04-21"], [2000, "2000-04-23"], [2038, "2038-04-25"], [2285, "2285-03-22"],
  ])("Easter %i is %s", (y, expected) => expect(iso(easterSunday(y))).toBe(expected));
});

describe("nthWeekdayOfMonth", () => {
  it("second Sunday of May (US Mother's Day)", () => {
    expect(iso(nthWeekdayOfMonth(2025, 5, 0, 2))).toBe("2025-05-11");
    expect(iso(nthWeekdayOfMonth(2026, 5, 0, 2))).toBe("2026-05-10");
    expect(iso(nthWeekdayOfMonth(2027, 5, 0, 2))).toBe("2027-05-09");
  });
  it("fourth Thursday of November (US Thanksgiving)", () => {
    expect(iso(nthWeekdayOfMonth(2024, 11, 4, 4))).toBe("2024-11-28");
    expect(iso(nthWeekdayOfMonth(2025, 11, 4, 4))).toBe("2025-11-27");
    expect(iso(nthWeekdayOfMonth(2026, 11, 4, 4))).toBe("2026-11-26");
  });
  it("last Friday of July (SysAdmin Day)", () => {
    expect(iso(nthWeekdayOfMonth(2025, 7, 5, -1))).toBe("2025-07-25");
    expect(iso(nthWeekdayOfMonth(2026, 7, 5, -1))).toBe("2026-07-31");
  });
  it("returns null for a non-existent 5th weekday", () => {
    expect(nthWeekdayOfMonth(2026, 2, 1, 5)).toBeNull();
  });
});

describe("resolveRule", () => {
  it("Leap Day only in leap years", () => {
    expect(resolveRule({ type: "fixed", month: 2, day: 29 }, 2026)).toBeNull();
    expect(iso(resolveRule({ type: "fixed", month: 2, day: 29 }, 2028)?.date)).toBe("2028-02-29");
    expect(resolveRule({ type: "fixed", month: 2, day: 29 }, 2100)).toBeNull();
  });
  it("Programmers' Day = 256th day", () => {
    expect(iso(resolveRule({ type: "day-of-year", day: 256 }, 2026)?.date)).toBe("2026-09-13");
    expect(iso(resolveRule({ type: "day-of-year", day: 256 }, 2028)?.date)).toBe("2028-09-12");
  });
  it("Mothering Sunday = Easter − 21", () => {
    expect(iso(occurrenceInYear(EVENT_MAP["mothering-sunday"], 2025)?.date)).toBe("2025-03-30");
    expect(iso(occurrenceInYear(EVENT_MAP["mothering-sunday"], 2026)?.date)).toBe("2026-03-15");
  });
  it("table rules only resolve listed years and flag estimates", () => {
    const eid = EVENT_MAP["eid-al-fitr"];
    expect(occurrenceInYear(eid, 2026)?.estimated).toBe(true);
    expect(occurrenceInYear(eid, 2035)).toBeNull();
    expect(occurrenceInYear(EVENT_MAP["chinese-new-year"], 2026)?.estimated).toBe(false);
  });
  it("one-time events only occur in their year", () => {
    const e = EVENT_MAP["total-solar-eclipse-2027"];
    expect(iso(occurrenceInYear(e, 2027)?.date)).toBe("2027-08-02");
    expect(occurrenceInYear(e, 2028)).toBeNull();
  });
});

describe("occurrences", () => {
  it("multi-day events cover every day in their range", () => {
    const today = occurrencesOn(EVENTS, new Date(2026, 9, 24)).map((o) => o.event.id);
    expect(today).toContain("united-nations-day");
    expect(today).toContain("cybersecurity-awareness-month");
    expect(occurrencesOn(EVENTS, new Date(2026, 10, 1)).map((o) => o.event.id)).not.toContain("cybersecurity-awareness-month");
  });
  it("nextOccurrence rolls into next year", () => {
    expect(iso(nextOccurrence(EVENT_MAP["valentines-day"], new Date(2026, 9, 24))?.date)).toBe("2027-02-14");
    expect(iso(nextOccurrence(EVENT_MAP["leap-day"], new Date(2026, 9, 24))?.date)).toBe("2028-02-29");
  });
  it("upcoming excludes today and is ordered", () => {
    const list = upcoming(EVENTS, new Date(2026, 9, 24), 30);
    expect(list.every((o) => o.date > new Date(2026, 9, 24))).toBe(true);
    expect(list[0].event.id).toBe("world-pasta-day");
  });
  it("every event resolves in at least one year 2025–2028", () => {
    for (const e of EVENTS) {
      const any = [2025, 2026, 2027, 2028].some((y) => occurrenceInYear(e, y));
      expect(any, e.id).toBe(true);
    }
  });
  it("dataset ids are unique and every event has a source", () => {
    const ids = EVENTS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of EVENTS) expect(e.sources.length, e.id).toBeGreaterThan(0);
  });
  it("year list is sorted", () => {
    const list = occurrencesForYear(EVENTS, 2026);
    for (let i = 1; i < list.length; i++) expect(list[i].date >= list[i - 1].date).toBe(true);
  });
});

describe("helpers", () => {
  it("diffInDays is DST-safe", () => {
    expect(diffInDays(new Date(2026, 2, 1), new Date(2026, 3, 1))).toBe(31);
  });
  it("parseISODate rejects invalid dates", () => {
    expect(parseISODate("2026-02-30")).toBeNull();
    expect(iso(parseISODate("2026-10-24"))).toBe("2026-10-24");
  });
});

describe("ICS export", () => {
  it("produces a valid all-day VEVENT with an exclusive end date", () => {
    const occ = occurrenceInYear(EVENT_MAP["day-of-the-dead"], 2026)!;
    const ics = buildICS([occ], "https://example.com");
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("DTSTART;VALUE=DATE:20261101");
    expect(ics).toContain("DTEND;VALUE=DATE:20261103");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics.split("\r\n").every((l) => l.length <= 75)).toBe(true);
  });
});
