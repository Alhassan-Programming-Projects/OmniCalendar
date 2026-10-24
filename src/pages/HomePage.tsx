import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CalendarDays, Heart, Search, Shuffle, Sparkles } from "lucide-react";
import { EVENTS, EVENT_MAP, FEATURED_IDS } from "@/data/events";
import { CATEGORIES, CATEGORY_MAP } from "@/data/categories";
import { useApp } from "@/context/AppContext";
import { formatLong, MONTH_NAMES, nextOccurrence, occurrencesOn, sameDay, upcoming } from "@/lib/dates";
import { hashString } from "@/lib/utils";
import { EventCard, EventRow } from "@/components/events/EventCard";
import { CategoryChip, CategoryIcon, RecognitionBadge } from "@/components/events/Badges";
import { Countdown } from "@/components/events/Countdown";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button, buttonClasses } from "@/components/ui/Button";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { useDayIndex } from "@/components/calendar/useDayIndex";
import { useSurprise } from "@/hooks/useSurprise";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import type { Occurrence } from "@/types";

export default function HomePage() {
  useDocumentTitle();
  const { today, favorites } = useApp();
  const navigate = useNavigate();
  const surprise = useSurprise();
  const [q, setQ] = useState("");

  const todays = useMemo(() => occurrencesOn(EVENTS, today), [today]);
  const next = useMemo(() => upcoming(EVENTS, today, 45).slice(0, 8), [today]);
  const featured = useMemo(
    () => FEATURED_IDS.map((id) => nextOccurrence(EVENT_MAP[id], today)).filter((o): o is Occurrence => !!o)
      .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [today],
  );
  const spotlight = useMemo(() => {
    // Prefer single-day observances happening today; rotate deterministically per date.
    const pool = todays.filter((o) => sameDay(o.date, o.endDate));
    const list = pool.length ? pool : todays.length ? todays : next.slice(0, 1);
    return list.length ? list[hashString(today.toDateString()) % list.length] : null;
  }, [todays, next, today]);
  const countdowns = useMemo(() => {
    const ids = favorites.length ? favorites : [];
    return ids.map((id) => EVENT_MAP[id] && nextOccurrence(EVENT_MAP[id], today))
      .filter((o): o is Occurrence => !!o)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 4);
  }, [favorites, today]);

  const index = useDayIndex(EVENTS, today.getFullYear());
  const [selected, setSelected] = useState(today);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/explore${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
  };

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div className="absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
        </div>
        <div className="container-page flex flex-col items-center pb-12 pt-12 text-center sm:pt-20">
          <p className="chip bg-surface/80 text-muted shadow-card ring-1 ring-border/70">
            <CalendarDays className="size-3.5 text-primary" aria-hidden />
            <time dateTime={today.toISOString()}>{formatLong(today)}</time>
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            Every day has a <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">story.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted sm:text-lg">
            Discover international observances, national holidays, awareness days and fun celebrations from around the world.
          </p>
          <form role="search" onSubmit={onSearch} className="mt-8 w-full max-w-2xl">
            <label htmlFor="hero-search" className="sr-only">Search special days</label>
            <div className="group relative">
              <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
              <input
                id="hero-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search “cat”, “cybersecurity”, “Oman”, “December”…"
                className="h-14 w-full rounded-full border border-border bg-surface pl-14 pr-32 text-base shadow-lift outline-none transition-shadow hover:shadow-float focus:border-primary"
              />
              <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">Search</Button>
            </div>
          </form>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {CATEGORIES.slice(0, 6).map((c) => (
              <Link key={c.id} to={`/categories/${c.id}`} className="transition-transform hover:-translate-y-0.5">
                <CategoryChip id={c.id} className="px-3 py-1.5 text-sm" />
              </Link>
            ))}
            <Button variant="ghost" size="sm" onClick={surprise}><Shuffle /> Surprise me</Button>
          </div>
        </div>
      </section>

      <div className="container-page space-y-16">
        {/* ---------- Today ---------- */}
        <section aria-labelledby="today-h">
          <SectionHeader id="today-h" title="Today's special days" subtitle={todays.length ? `${todays.length} ${todays.length === 1 ? "observance" : "observances"} on ${MONTH_NAMES[today.getMonth()]} ${today.getDate()}` : "A quiet day — here's what's coming up next."} to={`/calendar?date=${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`} linkLabel="Open in calendar" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(todays.length ? todays : next.slice(0, 3)).map((o, i) => (
              <EventCard key={o.event.id} occ={o} style={{ animationDelay: `${i * 40}ms` }} />
            ))}
          </div>
        </section>

        {/* ---------- Spotlight ---------- */}
        {spotlight && <Spotlight occ={spotlight} isToday={todays.includes(spotlight)} />}

        {/* ---------- Upcoming + calendar preview ---------- */}
        <section className="grid gap-8 lg:grid-cols-[1fr_1.1fr] [&>*]:min-w-0" aria-label="Upcoming and calendar preview">
          <div>
            <SectionHeader title="Coming up" subtitle="The next special days on the calendar." to="/explore?sort=date" />
            <div className="card divide-y divide-border/50 p-2">
              {next.map((o) => <EventRow key={o.event.id + o.date.getTime()} occ={o} />)}
            </div>
          </div>
          <div>
            <SectionHeader title={`${MONTH_NAMES[today.getMonth()]} at a glance`} subtitle="Tap a date to see what's on." to="/calendar" linkLabel="Full calendar" />
            <MonthGrid
              year={today.getFullYear()} month={today.getMonth() + 1} selected={selected} today={today} index={index}
              onSelect={(d) => { setSelected(d); }}
              onNavigate={(d) => navigate(`/calendar?date=${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`)}
            />
            <DayPeek date={selected} list={occurrencesOn(EVENTS, selected)} />
          </div>
        </section>

        {/* ---------- Countdowns ---------- */}
        <section aria-labelledby="cd-h">
          <SectionHeader id="cd-h" title="Your countdowns" subtitle="Days remaining until the special days you've saved." to={countdowns.length ? "/favorites" : undefined} linkLabel="Manage favorites" />
          {countdowns.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {countdowns.map((o) => (
                <Link key={o.event.id} to={`/event/${o.event.id}`} className="card flex flex-col gap-3 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift">
                  <div className="flex items-center gap-3">
                    <CategoryIcon id={o.event.category} size="sm" />
                    <span className="line-clamp-2 text-sm font-semibold">{o.event.name}</span>
                  </div>
                  <Countdown occ={o} />
                  <span className="text-xs text-muted">{formatLong(o.date)}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
              <span className="grid size-12 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-400/15 dark:text-rose-300"><Heart className="size-6" aria-hidden /></span>
              <p className="flex-1 text-sm text-muted">Tap the heart on any special day to save it. Your saved days get a live countdown here and are kept in this browser.</p>
              <Link to="/explore" className={buttonClasses("secondary")}>Find days to save <ArrowRight /></Link>
            </div>
          )}
        </section>

        {/* ---------- Featured ---------- */}
        <section aria-labelledby="feat-h">
          <SectionHeader id="feat-h" title="Featured celebrations" subtitle="A hand-picked mix from across the year." to="/explore" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((o, i) => <EventCard key={o.event.id} occ={o} style={{ animationDelay: `${i * 40}ms` }} />)}
          </div>
        </section>

        {/* ---------- Categories ---------- */}
        <section aria-labelledby="cat-h">
          <SectionHeader id="cat-h" title="Browse by category" to="/categories" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map((c) => (
              <Link key={c.id} to={`/categories/${c.id}`} className="card group flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-lift">
                <CategoryIcon id={c.id} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{c.label}</div>
                  <div className="text-xs text-muted">{EVENTS.filter((e) => e.category === c.id).length} days</div>
                </div>
              </Link>
            ))}
            <Link to="/calendar?view=year" className="card group flex items-center gap-3 bg-primary-soft/50 p-4 transition-all hover:-translate-y-0.5 hover:shadow-lift">
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-fg"><Sparkles className="size-5" aria-hidden /></span>
              <div className="text-sm font-semibold">Year at a Glance</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function Spotlight({ occ, isToday }: { occ: Occurrence; isToday: boolean }) {
  const e = occ.event;
  const cat = CATEGORY_MAP[e.category];
  return (
    <section aria-labelledby="spot-h" className="card relative overflow-hidden p-6 sm:p-10">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${cat.tile}`} aria-hidden />
      <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="chip bg-surface/80 text-primary ring-1 ring-border/60">
            <Sparkles className="size-3.5" aria-hidden /> Day Spotlight · {isToday ? "Today" : formatLong(occ.date)}
          </p>
          <h2 id="spot-h" className="mt-4 text-3xl font-extrabold sm:text-4xl">{e.name}</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-fg/80">{e.background}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <RecognitionBadge id={e.recognition} long />
            <CategoryChip id={e.category} />
          </div>
        </div>
        <div className="flex flex-col items-start gap-4 md:items-end">
          {!isToday && <Countdown occ={occ} />}
          <Link to={`/event/${e.id}`} className={buttonClasses("primary", "lg")}>Read the story <ArrowRight /></Link>
        </div>
      </div>
    </section>
  );
}

function DayPeek({ date, list }: { date: Date; list: Occurrence[] }) {
  return (
    <div className="mt-3 rounded-2xl bg-surface-2/70 p-3" aria-live="polite">
      <div className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted">{formatLong(date)}</div>
      {list.length ? list.map((o) => <EventRow key={o.event.id} occ={o} showDate={false} />) : <p className="px-2 py-2 text-sm text-muted">No special days in the dataset for this date.</p>}
    </div>
  );
}
