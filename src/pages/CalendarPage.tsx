import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CalendarCheck, CalendarDays, ChevronLeft, ChevronRight, Download, Grid3x3 } from "lucide-react";
import { EVENTS } from "@/data/events";
import { CATEGORIES } from "@/data/categories";
import { useApp } from "@/context/AppContext";
import { formatLong, makeDate, MONTH_NAMES, occurrencesOn, parseISODate, sameDay, toISODate } from "@/lib/dates";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { YearGlance } from "@/components/calendar/YearGlance";
import { useDayIndex } from "@/components/calendar/useDayIndex";
import { EventRow } from "@/components/events/EventCard";
import { Button } from "@/components/ui/Button";
import { downloadICS } from "@/lib/ics";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cn } from "@/lib/utils";
import type { CategoryId } from "@/types";

export default function CalendarPage() {
  useDocumentTitle("Calendar");
  const { today, notify } = useApp();
  const [params, setParams] = useSearchParams();
  const view = params.get("view") === "year" ? "year" : "month";
  const selected = parseISODate(params.get("date") ?? "") ?? today;
  const yearParam = Number(params.get("year"));
  const year = view === "year" && yearParam >= 1900 && yearParam <= 2200 ? yearParam : selected.getFullYear();
  const month = selected.getMonth() + 1;
  const cat = (params.get("category") ?? "") as CategoryId | "";

  const events = useMemo(() => (cat ? EVENTS.filter((e) => e.category === cat) : EVENTS), [cat]);
  const index = useDayIndex(events, year);
  const dayList = useMemo(() => occurrencesOn(events, selected), [events, selected]);
  const ongoing = useMemo(() => occurrencesOn(events, makeDate(year, month, 15)).filter((o) => (o.event.durationDays ?? 1) > 7), [events, year, month]);
  const monthList = useMemo(() => {
    const seen = new Set<string>();
    const out = [];
    for (const [k, list] of index) {
      if (!k.startsWith(`${year}-${String(month).padStart(2, "0")}`)) continue;
      for (const o of list) if (!seen.has(o.event.id)) { seen.add(o.event.id); out.push(o); }
    }
    return out.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [index, year, month]);

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) v === null ? next.delete(k) : next.set(k, v);
    setParams(next, { replace: true });
  };
  const select = (d: Date) => update({ date: toISODate(d), year: null });
  const shiftMonth = (n: number) => select(new Date(selected.getFullYear(), selected.getMonth() + n, 1));

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-3xl font-extrabold sm:text-4xl">
          {view === "month" ? `${MONTH_NAMES[month - 1]} ${year}` : `${year} at a Glance`}
        </h1>
        <div className="flex rounded-full border border-border bg-surface p-1" role="group" aria-label="Calendar view">
          {(["month", "year"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => update({ view: v === "month" ? null : "year", year: null })}
              className={cn("inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors", view === v ? "bg-primary text-primary-fg" : "text-muted hover:text-fg")}
            >
              {v === "month" ? <CalendarDays className="size-4" aria-hidden /> : <Grid3x3 className="size-4" aria-hidden />}
              {v === "month" ? "Month" : "Year"}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Button variant="outline" size="icon" aria-label={view === "month" ? "Previous month" : "Previous year"}
          onClick={() => (view === "month" ? shiftMonth(-1) : update({ year: String(year - 1) }))}><ChevronLeft /></Button>
        <Button variant="outline" size="icon" aria-label={view === "month" ? "Next month" : "Next year"}
          onClick={() => (view === "month" ? shiftMonth(1) : update({ year: String(year + 1) }))}><ChevronRight /></Button>
        <Button variant="outline" onClick={() => update({ date: null, year: null })} disabled={sameDay(selected, today) && year === today.getFullYear()}>
          <CalendarCheck /> Today
        </Button>
        <label className="sr-only" htmlFor="jump">Jump to date</label>
        <input
          id="jump" type="date" value={toISODate(selected)}
          onChange={(e) => { const d = parseISODate(e.target.value); if (d) select(d); }}
          className="h-10 rounded-full border border-border bg-surface px-4 text-sm"
        />
        <label className="sr-only" htmlFor="cal-cat">Filter by category</label>
        <select id="cal-cat" value={cat} onChange={(e) => update({ category: e.target.value || null })}
          className="h-10 rounded-full border border-border bg-surface px-4 text-sm sm:ml-auto">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>

      {view === "month" ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px] [&>*]:min-w-0">
          <div>
            {ongoing.length > 0 && (
              <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl bg-surface-2/70 px-4 py-2.5 text-sm">
                <span className="font-semibold text-muted">Running this month:</span>
                {ongoing.map((o) => (
                  <Link key={o.event.id} to={`/event/${o.event.id}`} className="chip bg-primary-soft text-primary hover:underline">{o.event.name}</Link>
                ))}
              </div>
            )}
            <MonthGrid year={year} month={month} selected={selected} today={today} index={index} onSelect={select} onNavigate={select} />
            <p className="mt-3 hidden text-xs text-muted sm:block">Tip: use arrow keys to move between days, Page Up / Page Down to change month.</p>
          </div>
          <aside className="space-y-6" aria-label="Selected day">
            <div className="card p-4">
              <div className="flex items-center justify-between gap-2 px-2 pb-2">
                <h2 className="text-base font-bold">{formatLong(selected)}</h2>
                {dayList.length > 0 && (
                  <Button variant="ghost" size="icon-sm" aria-label="Download this day's events as .ics" title="Export day (.ics)"
                    onClick={() => { downloadICS(dayList, `omnicalendar-${toISODate(selected)}`); notify("Calendar file downloaded"); }}>
                    <Download />
                  </Button>
                )}
              </div>
              {dayList.length ? dayList.map((o) => <EventRow key={o.event.id} occ={o} showDate={false} compact />) : (
                <p className="px-2 py-3 text-sm text-muted">No special days in the dataset for this date.</p>
              )}
            </div>
            <div className="card p-4">
              <div className="flex items-center justify-between gap-2 px-2 pb-2">
                <h2 className="text-base font-bold">All in {MONTH_NAMES[month - 1]}</h2>
                {monthList.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => { downloadICS(monthList, `omnicalendar-${year}-${String(month).padStart(2, "0")}`); notify("Calendar file downloaded"); }}>
                    <Download /> .ics
                  </Button>
                )}
              </div>
              <div className="max-h-[420px] overflow-y-auto">
                {monthList.length ? monthList.map((o) => <EventRow key={o.event.id} occ={o} compact />) : <p className="px-2 py-3 text-sm text-muted">Nothing this month for this filter.</p>}
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <YearGlance year={year} today={today} index={index} onPick={(d) => update({ view: null, year: null, date: toISODate(d) })} />
      )}
    </div>
  );
}
