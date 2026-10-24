import { useMemo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarSearch, Download, List } from "lucide-react";
import type { Occurrence, Recognition, SpecialDay } from "@/types";
import { addDays, diffInDays, formatHijri, formatShort, occurrencesInRange, occurrencesOn, relativeLabel, sameDay, toISODate } from "@/lib/dates";
import { downloadICS } from "@/lib/ics";
import { useApp } from "@/context/AppContext";
import { CategoryIcon, RecognitionBadge, ScopeBadge } from "@/components/events/Badges";
import { FavoriteButton } from "@/components/events/FavoriteButton";
import { Button, buttonClasses } from "@/components/ui/Button";
import { cn, pluralize } from "@/lib/utils";

const GROUPS: { title: string; recs: Recognition[] }[] = [
  { title: "Public holidays", recs: ["national"] },
  { title: "National observances", recs: ["observance"] },
  { title: "International days", recs: ["un", "international"] },
  { title: "Cultural & religious", recs: ["cultural"] },
  { title: "Awareness & fun days", recs: ["awareness", "unofficial", "event"] },
];

/**
 * Everything happening on one date: Gregorian + Hijri date, how far away it is, every occasion
 * grouped by type (public holidays first), multi-day progress, and helpful next steps when empty.
 */
export function DayPanel({ date, events, allEvents, filtered, onClearFilters, onJump, listHref, className, headingLevel = 2 }: {
  date: Date;
  /** Events after the current filters. */
  events: SpecialDay[];
  /** The full dataset — used to say how many days the filters hide. */
  allEvents: SpecialDay[];
  filtered: boolean;
  onClearFilters?: () => void;
  onJump?: (d: Date) => void;
  /** Link to the same day/filters as a list in Explore. */
  listHref?: string;
  className?: string;
  headingLevel?: 2 | 3;
}) {
  const { today, notify } = useApp();
  const list = useMemo(() => occurrencesOn(events, date), [events, date]);
  const hidden = useMemo(() => (filtered ? occurrencesOn(allEvents, date).length - list.length : 0), [filtered, allEvents, date, list.length]);
  const next = useMemo(() => {
    if (list.length) return null;
    return occurrencesInRange(events, addDays(date, 1), addDays(date, 366)).find((o) => o.date > date) ?? null;
  }, [list.length, events, date]);
  const hijri = formatHijri(date);
  const holidays = list.filter((o) => o.event.recognition === "national").length;
  const H = headingLevel === 2 ? "h2" : "h3";
  const rel = relativeLabel(date, today);

  return (
    <div className={cn("card p-4", className)} aria-live="polite">
      <div className="mb-2 flex items-start justify-between gap-2 border-b border-border/60 px-1 pb-3">
        <div className="min-w-0">
          <div className="meta-label flex flex-wrap items-center gap-x-2">
            <span>Selected day</span>
            <span className={cn("normal-case tracking-normal", sameDay(date, today) ? "font-bold text-primary" : "font-medium")}>· {rel}</span>
          </div>
          <H className="mt-0.5 text-base font-bold">{date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</H>
          {hijri && <p className="text-xs text-muted" title="Umm al-Qura calendar; local dates can differ by a day">{hijri}</p>}
        </div>
        {list.length > 0 && (
          <Button variant="ghost" size="icon-sm" aria-label="Download this day's events as .ics" title="Export day (.ics)"
            onClick={() => { downloadICS(list, `omnicalendar-${toISODate(date)}`); notify("Calendar file downloaded"); }}>
            <Download />
          </Button>
        )}
      </div>

      <div key={date.getTime()} className="animate-fade-in">
        {list.length > 0 ? (
          <>
            <p className="px-1 pb-1 text-xs text-muted">
              {pluralize(list.length, "special day")}{holidays > 0 && <> · <strong className="font-semibold text-danger">{pluralize(holidays, "public holiday")}</strong></>}
              {hidden > 0 && <> · {hidden} hidden by filters</>}
            </p>
            {GROUPS.map((g) => {
              const items = list.filter((o) => g.recs.includes(o.event.recognition));
              if (!items.length) return null;
              return (
                <section key={g.title} className="mt-2">
                  <h4 className="meta-label px-1 py-1 text-[11px]">{g.title}</h4>
                  <ul>{items.map((o) => <DayRow key={o.event.id + o.date.getTime()} occ={o} day={date} />)}</ul>
                </section>
              );
            })}
          </>
        ) : (
          <EmptyDay>
            <p className="font-medium">No special days on this date{filtered ? " with your filters" : ""}.</p>
            {hidden > 0 && (
              <p className="mt-1 text-muted">{pluralize(hidden, "day")} {hidden === 1 ? "is" : "are"} hidden by your filters.</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {hidden > 0 && onClearFilters && <Button size="sm" variant="secondary" onClick={onClearFilters}>Show all days</Button>}
              {next && onJump && (
                <Button size="sm" variant="outline" onClick={() => onJump(next.date)}>
                  Next: {next.event.name.length > 28 ? `${next.event.name.slice(0, 27)}…` : next.event.name} · {formatShort(next.date)} <ArrowRight />
                </Button>
              )}
            </div>
          </EmptyDay>
        )}
      </div>
      {listHref && list.length > 0 && (
        <div className="mt-3 border-t border-border/60 px-1 pt-3">
          <Link to={listHref} className={buttonClasses("ghost", "sm", "-ml-2 text-primary")}><List /> Open as list</Link>
        </div>
      )}
    </div>
  );
}

function EmptyDay({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 px-1 py-3 text-sm">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-muted"><CalendarSearch className="size-4" aria-hidden /></span>
      <div>{children}</div>
    </div>
  );
}

function DayRow({ occ, day }: { occ: Occurrence; day: Date }) {
  const e = occ.event;
  const multi = !sameDay(occ.date, occ.endDate);
  const dayN = diffInDays(occ.date, day) + 1;
  const total = diffInDays(occ.date, occ.endDate) + 1;
  return (
    <li className="group relative flex items-start gap-3 rounded-xl px-1 py-2 transition-colors hover:bg-fg/[.045]">
      <CategoryIcon id={e.category} size="sm" className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <Link to={`/event/${e.id}`} className="block font-medium leading-snug transition-colors group-hover:text-primary after:absolute after:inset-0 after:content-[''] focus-visible:ring-0">
          {e.name}
        </Link>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <ScopeBadge countries={e.countries} />
          {multi && <span className="text-xs text-muted">Day {dayN} of {total}</span>}
          {occ.estimated && <span className="text-xs text-muted" title="Date depends on moon sighting">· estimated</span>}
        </div>
      </div>
      <RecognitionBadge id={e.recognition} className="relative hidden shrink-0 sm:inline-flex xl:hidden 2xl:inline-flex" />
      <FavoriteButton id={e.id} className="relative -mr-1 shrink-0" />
    </li>
  );
}
