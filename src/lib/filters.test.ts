import { describe, expect, it } from "vitest";
import { EVENTS, EVENT_MAP } from "@/data/events";
import {
  applyFilters, detectPreset, EMPTY_FILTERS, filterChips, filterEvents, filtersToQuery, matchesEvent, parseFilters,
  presetRange, searchOccurrences,
} from "./filters";
import { scoreEvent } from "./search";
import { formatHijri, makeDate, occurrencesInRange, toISODate } from "./dates";

const TODAY = makeDate(2026, 10, 25);
const P = (s: string) => parseFilters(new URLSearchParams(s), TODAY);
const ids = (list: { event: { id: string } }[]) => list.map((o) => o.event.id);

describe("URL ⇄ filters", () => {
  it("round-trips every filter key", () => {
    const q = "q=eid&cat=culture,health&rec=national&country=OM&intl=1&scope=local&from=2026-11-01&to=2026-11-30";
    const f = P(q);
    expect(f).toEqual({ q: "eid", cats: ["culture", "health"], recs: ["national"], region: "OM", withIntl: true, scope: "local", from: "2026-11-01", to: "2026-11-30" });
    expect(P(filtersToQuery(f))).toEqual(f);
  });
  it("ignores unknown values and swaps a reversed range", () => {
    const f = P("cat=nope,science&rec=fake&scope=weird&from=2026-12-31&to=2026-01-01");
    expect(f.cats).toEqual(["science"]);
    expect(f.recs).toEqual([]);
    expect(f.scope).toBe("");
    expect([f.from, f.to]).toEqual(["2026-01-01", "2026-12-31"]);
  });
  it("reads legacy ?category= and ?month= links", () => {
    expect(P("category=animals").cats).toEqual(["animals"]);
    expect([P("month=12").from, P("month=12").to]).toEqual(["2026-12-01", "2026-12-31"]);
    expect([P("month=3").from, P("month=3").to]).toEqual(["2027-03-01", "2027-03-31"]); // already past → next year
    expect(P("country=GLOBAL")).toMatchObject({ region: "", scope: "intl" });
  });
  it("applyFilters keeps page keys and drops legacy ones", () => {
    const next = applyFilters(new URLSearchParams("date=2026-11-20&view=year&category=animals&month=3"), { ...EMPTY_FILTERS, region: "OM" });
    expect(next.toString()).toBe("date=2026-11-20&view=year&country=OM");
  });
  it("intl only travels with a region", () => {
    expect(filtersToQuery({ ...EMPTY_FILTERS, withIntl: true })).toBe("");
  });
});

describe("matching", () => {
  const f = EMPTY_FILTERS;
  it("country filter keeps that country's occasions", () => {
    expect(matchesEvent(EVENT_MAP["oman-national-day"], { ...f, region: "OM" })).toBe(true);
    expect(matchesEvent(EVENT_MAP["uae-national-day"], { ...f, region: "OM" })).toBe(false);
    expect(matchesEvent(EVENT_MAP["world-environment-day"], { ...f, region: "OM" })).toBe(false);
  });
  it("intl=1 adds worldwide days to a country", () => {
    expect(matchesEvent(EVENT_MAP["world-environment-day"], { ...f, region: "OM", withIntl: true })).toBe(true);
    expect(matchesEvent(EVENT_MAP["uae-national-day"], { ...f, region: "OM", withIntl: true })).toBe(false);
  });
  it("regions match any member state", () => {
    expect(matchesEvent(EVENT_MAP["uae-national-day"], { ...f, region: "GCC" })).toBe(true);
    expect(matchesEvent(EVENT_MAP["morocco-independence-day"], { ...f, region: "GCC" })).toBe(false);
    expect(matchesEvent(EVENT_MAP["morocco-independence-day"], { ...f, region: "ARAB" })).toBe(true);
  });
  it("scope separates international days from country-specific occasions", () => {
    expect(matchesEvent(EVENT_MAP["world-environment-day"], { ...f, scope: "intl" })).toBe(true);
    expect(matchesEvent(EVENT_MAP["oman-national-day"], { ...f, scope: "intl" })).toBe(false);
    expect(matchesEvent(EVENT_MAP["oman-national-day"], { ...f, scope: "local" })).toBe(true);
    expect(matchesEvent(EVENT_MAP["eid-al-fitr"], { ...f, scope: "local" })).toBe(false); // listed worldwide too
  });
  it("filterEvents returns the same array when nothing is set (keeps calendar caches warm)", () => {
    expect(filterEvents(EVENTS, f)).toBe(EVENTS);
  });
});

describe("search", () => {
  const find = (q: string) => EVENTS.filter((e) => scoreEvent(e, q) > 0).map((e) => e.id);
  it("matches names, descriptions, categories and countries", () => {
    expect(find("qaranqasho")).toContain("qaranqasho");
    expect(find("Salalah")).toContain("khareef-dhofar"); // description/tags
    expect(find("Animals")).toContain("world-bee-day"); // category
    expect(find("Bahrain")).toContain("bahrain-national-day"); // country name
  });
  it("understands abbreviations, demonyms, regions and Arabic", () => {
    expect(find("uae")).toContain("emirati-womens-day");
    expect(find("ksa")).toContain("saudi-founding-day");
    expect(find("omani")).toContain("oman-accession-day");
    expect(find("gulf")).toContain("qatar-national-day");
    expect(find("maghreb")).toContain("tunisia-independence-day");
    expect(find("عمان")).toContain("oman-national-day");
    expect(find("الإمارات")).toContain("uae-national-day");
    expect(find("الامارات")).toContain("uae-national-day"); // alef variant
    expect(find("عيد")).toEqual(expect.arrayContaining(["eid-al-fitr", "eid-al-adha"]));
  });
  it("'public holiday' ranks actual public holidays above description-only mentions", () => {
    const hits = EVENTS.map((e) => ({ e, s: scoreEvent(e, "public holiday oman") })).filter((h) => h.s > 0).sort((a, b) => b.s - a.s);
    const national = hits.filter((h) => h.e.recognition === "national");
    expect(national.length).toBeGreaterThanOrEqual(7);
    expect(national.every((h) => h.e.countries.includes("OM"))).toBe(true);
    expect(hits.slice(0, national.length).every((h) => h.e.recognition === "national")).toBe(true);
  });
  it("every word must match and names rank first", () => {
    expect(find("oman zzzz")).toEqual([]);
    const ranked = [...EVENTS].sort((a, b) => scoreEvent(b, "oman national day") - scoreEvent(a, "oman national day"));
    expect(ranked[0].id).toBe("oman-national-day");
  });
});

describe("date ranges & results", () => {
  it("occurrencesInRange includes multi-day events overlapping the range", () => {
    const list = ids(occurrencesInRange(EVENTS, makeDate(2026, 11, 21), makeDate(2026, 11, 21)));
    expect(list).toContain("oman-national-day"); // 20–21 Nov
    expect(list).toContain("amr-awareness-week"); // 18–24 Nov
  });
  it("searchOccurrences respects range + region and sorts by date", () => {
    const res = searchOccurrences(EVENTS, P("country=OM&from=2026-11-01&to=2026-12-31"), TODAY);
    expect(ids(res)).toEqual(["oman-national-day", "oman-armed-forces-day"]);
  });
  it("without a range each event appears once at its next date", () => {
    const res = searchOccurrences(EVENTS, P("country=OM"), TODAY);
    expect(new Set(ids(res)).size).toBe(res.length);
    expect(res.every((o) => o.endDate >= TODAY)).toBe(true);
  });
  it("presets resolve and are recognised", () => {
    const r = presetRange("7d", TODAY);
    expect(r).toEqual({ from: "2026-10-25", to: "2026-10-31" });
    expect(detectPreset({ ...EMPTY_FILTERS, ...r }, TODAY)).toBe("7d");
    expect(detectPreset({ ...EMPTY_FILTERS, from: "2026-10-26", to: "2026-10-27" }, TODAY)).toBe("custom");
    expect(presetRange("next-month", makeDate(2026, 12, 15))).toEqual({ from: "2027-01-01", to: "2027-01-31" });
  });
  it("filter chips remove exactly one filter each", () => {
    const f = P("q=eid&country=OM&intl=1&cat=culture&rec=national&from=2026-10-25&to=2026-10-31");
    const chips = filterChips(f, TODAY);
    expect(chips.map((c) => c.label)).toEqual(["“eid”", "🇴🇲 Oman + worldwide", "Next 7 days", "Culture & Heritage", "National Holiday"]);
    expect(chips[1].without).toMatchObject({ region: "", withIntl: false, q: "eid" });
  });
  it("formats Hijri dates", () => {
    expect(formatHijri(makeDate(2026, 8, 25))).toBe("12 Rabi al-Awwal 1448 AH");
    expect(toISODate(makeDate(2026, 8, 25))).toBe("2026-08-25");
  });
});
