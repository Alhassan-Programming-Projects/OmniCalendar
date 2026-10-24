import { useMemo } from "react";
import type { Occurrence, SpecialDay } from "@/types";
import { addDays, occurrencesForYear, toISODate } from "@/lib/dates";

/**
 * Map of YYYY-MM-DD → occurrences for a whole year.
 * Short multi-day events (≤ 7 days) are expanded onto every day; long ones
 * (e.g. a month-long campaign) are only placed on their first day to keep the grid readable.
 */
export function useDayIndex(events: SpecialDay[], year: number) {
  return useMemo(() => {
    const map = new Map<string, Occurrence[]>();
    const pool = [...occurrencesForYear(events, year - 1), ...occurrencesForYear(events, year)];
    for (const o of pool) {
      const last = (o.event.durationDays ?? 1) > 7 ? o.date : o.endDate;
      for (let d = o.date; d <= last; d = addDays(d, 1)) {
        if (d.getFullYear() !== year) continue;
        const k = toISODate(d);
        const list = map.get(k);
        if (list) list.push(o);
        else map.set(k, [o]);
      }
    }
    return map;
  }, [events, year]);
}

/** Long-running occurrences (> 7 days) active on a given date. */
export function longRunningOn(list: Occurrence[], d: Date) {
  return list.filter((o) => (o.event.durationDays ?? 1) > 7 && o.date <= d && o.endDate >= d);
}
