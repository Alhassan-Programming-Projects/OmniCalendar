import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Download, FilterX, Search, SearchX, SlidersHorizontal } from "lucide-react";
import { EVENTS } from "@/data/events";
import { CATEGORIES, RECOGNITIONS } from "@/data/categories";
import { useApp } from "@/context/AppContext";
import { activeFilterCount, EMPTY_FILTERS, filterChips, filtersToQuery, searchOccurrences, type DiscoveryFilters } from "@/lib/filters";
import { EventCard } from "@/components/events/EventCard";
import { Button, buttonClasses } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActiveFilters, DateRangeFilter, QuickRegions, RegionSelect, ScopeToggle } from "@/components/discovery/FilterControls";
import { useChangeKey, usePresence } from "@/lib/motion";
import { EmptyState } from "@/components/ui/EmptyState";
import { downloadICS } from "@/lib/ics";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useDiscoveryFilters } from "@/hooks/useDiscoveryFilters";
import { cn, pluralize } from "@/lib/utils";

type Sort = "date" | "relevance" | "az";
/** Cards rendered per page; more load as the list scrolls into view (keeps filtering instant). */
const PAGE = 24;

export default function ExplorePage() {
  useDocumentTitle("Explore");
  const { today, notify } = useApp();
  const { filters, setFilters, params } = useDiscoveryFilters();
  const q = filters.q;
  const sort: Sort = params.get("sort") === "az" ? "az" : params.get("sort") === "date" ? "date" : q ? "relevance" : "date";
  const [showFilters, setShowFilters] = useState(false);
  const [draft, setDraft] = useState(q);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => { setDraft(q); }, [q]);
  useEffect(() => { input.current?.focus(); }, []);

  const update = (f: DiscoveryFilters, extra: Record<string, string | null> = {}) => setFilters(f, extra);
  // Debounced search → URL.
  useEffect(() => {
    if (draft.trim() === q) return;
    const t = setTimeout(() => update({ ...filters, q: draft.trim() }), 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const results = useMemo(() => searchOccurrences(EVENTS, filters, today, sort), [filters, today, sort]);

  const toggle = <K extends "cats" | "recs">(key: K, v: DiscoveryFilters[K][number]) => {
    const arr = filters[key] as string[];
    update({ ...filters, [key]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] });
  };

  const activeCount = activeFilterCount(filters);
  const filterKey = [filters.cats.join(), filters.recs.join(), filters.region, filters.withIntl, filters.scope, filters.from, filters.to, sort].join("|");
  const countPulse = useChangeKey(results.length);
  const [limit, setLimit] = useState(PAGE);
  useEffect(() => { setLimit(PAGE); }, [filterKey, q]);
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || limit >= results.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) setLimit((l) => l + PAGE); }, { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [limit, results.length]);
  const drawer = usePresence(showFilters);
  const calendarHref = `/calendar?${filtersToQuery({ ...filters, from: "", to: "" }, { date: filters.from })}`;

  return (
    <div>
      <PageHeader eyebrow="Explore" title="Explore special days" description="Search by name, topic, country or keyword — in English or Arabic — then narrow down with filters.">
        <div className="mt-6 flex max-w-3xl gap-2">
          <form role="search" className="relative flex-1" onSubmit={(e) => { e.preventDefault(); update({ ...filters, q: draft.trim() }); }}>
            <label htmlFor="explore-q" className="sr-only">Search</label>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
            <input
              id="explore-q" ref={input} value={draft} onChange={(e) => setDraft(e.target.value)} type="search"
              placeholder="Try “Eid”, “Oman”, “cybersecurity”, “UAE”, “عيد”…"
              className="field field-pill h-12 pl-12 text-base shadow-lift"
            />
          </form>
          <Button variant={activeCount ? "secondary" : "outline"} size="lg" className="h-12 lg:hidden" aria-label={activeCount ? `Filters, ${activeCount} active` : "Filters"} aria-expanded={showFilters} aria-controls="filters" onClick={() => setShowFilters((s) => !s)}>
            <SlidersHorizontal /> <span className="hidden sm:inline">Filters</span>{activeCount > 0 && <span className="rounded-full bg-primary px-1.5 text-xs text-primary-fg">{activeCount}</span>}
          </Button>
        </div>
        <QuickRegions className="mt-3" filters={filters} onChange={update} />
      </PageHeader>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[280px_1fr]">
        <aside id="filters" aria-label="Filters" data-state={drawer.state}
          className={cn("card origin-top space-y-6 self-start p-5 lg:sticky lg:top-24 lg:block", drawer.mounted ? "block" : "hidden", drawer.state === "open" ? "max-lg:animate-menu-in" : "max-lg:animate-menu-out")}>
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal className="size-4 text-primary" aria-hidden /> Filters</span>
            {activeCount > 0 && <span className="chip bg-primary-soft text-primary">{activeCount} active</span>}
          </div>
          <FilterGroup title="Country or region" htmlFor="f-country">
            <RegionSelect id="f-country" filters={filters} onChange={update} />
          </FilterGroup>
          <FilterGroup title="Date" htmlFor="f-range">
            <DateRangeFilter id="f-range" filters={filters} onChange={update} today={today} />
          </FilterGroup>
          <FilterGroup title="Scope">
            <ScopeToggle short filters={filters} onChange={update} />
          </FilterGroup>
          <FilterGroup title="Recognition">
            <div className="flex flex-wrap gap-1.5">
              {RECOGNITIONS.map((r) => (
                <ToggleChip key={r.id} on={filters.recs.includes(r.id)} onClick={() => toggle("recs", r.id)} title={r.description}>{r.short}</ToggleChip>
              ))}
            </div>
          </FilterGroup>
          <FilterGroup title="Category">
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <ToggleChip key={c.id} on={filters.cats.includes(c.id)} onClick={() => toggle("cats", c.id)}>
                  <c.icon className="size-3.5" aria-hidden /> {c.label}
                </ToggleChip>
              ))}
            </div>
          </FilterGroup>
          {activeCount > 0 && (
            <Button variant="outline" className="w-full" onClick={() => update({ ...EMPTY_FILTERS, q })}><FilterX /> Clear filters</Button>
          )}
        </aside>

        <section aria-label="Results">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <p className="mr-auto text-sm text-muted" aria-live="polite">
              <strong key={countPulse} className={cn("inline-block text-fg", countPulse > 0 && "animate-pop")}>{pluralize(results.length, "special day")}</strong>
              {q && <> matching “{q}”</>}
              {!filters.from && !filters.to && <span className="hidden sm:inline"> · next date shown</span>}
            </p>
            <label htmlFor="sort" className="sr-only">Sort</label>
            <select id="sort" value={sort} onChange={(e) => update(filters, { sort: e.target.value === (q ? "relevance" : "date") ? null : e.target.value })} className="field field-pill h-9 w-auto">
              {q && <option value="relevance">Best match</option>}
              <option value="date">Soonest first</option>
              <option value="az">A – Z</option>
            </select>
            <Link to={calendarHref} className={buttonClasses("outline", "sm")}><CalendarDays /> Calendar view</Link>
            {results.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => { downloadICS(results, "omnicalendar-selection"); notify(`Exported ${pluralize(results.length, "event")}`); }}>
                <Download /> <span className="hidden sm:inline">Export</span> .ics
              </Button>
            )}
          </div>
          <ActiveFilters className="mb-4" filters={filters} onChange={update} today={today} includeQuery={false} onClear={() => update({ ...EMPTY_FILTERS, q })} />
          {results.length ? (
            <>
              <div key={filterKey} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.slice(0, limit).map((o, i) => <EventCard key={o.event.id + o.date.getTime()} occ={o} style={{ animationDelay: `${Math.min(i % PAGE, 8) * 20}ms` }} />)}
              </div>
              {limit < results.length && (
                <div ref={sentinel} className="mt-6 flex justify-center">
                  <Button variant="outline" onClick={() => setLimit((l) => l + PAGE)}>Show more ({results.length - limit} remaining)</Button>
                </div>
              )}
            </>
          ) : (
            <NoResults filters={filters} today={today} onChange={update} />
          )}
        </section>
      </div>
    </div>
  );
}

/** Empty state that explains which filters are responsible and offers one-click ways out. */
function NoResults({ filters, today, onChange }: { filters: DiscoveryFilters; today: Date; onChange: (f: DiscoveryFilters) => void }) {
  const suggestions = useMemo(() => filterChips(filters, today)
    .map((c) => ({ ...c, count: searchOccurrences(EVENTS, c.without, today).length }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3), [filters, today]);
  const everywhere = filters.q ? searchOccurrences(EVENTS, { ...EMPTY_FILTERS, q: filters.q }, today).length : 0;
  return (
    <EmptyState icon={SearchX} title="No special days match">
      <p>{filters.q ? <>Nothing matches “{filters.q}” with the current filters.</> : "No days fit this combination of filters."}</p>
      {(suggestions.length > 0 || everywhere > 0) && (
        <div className="mt-4 flex flex-col items-center gap-2">
          {suggestions.map((s) => (
            <Button key={s.key} size="sm" variant="outline" onClick={() => onChange(s.without)}>
              Remove {s.label} → {pluralize(s.count, "result")}
            </Button>
          ))}
          {filters.q && everywhere > 0 && suggestions.length === 0 && (
            <Button size="sm" variant="secondary" onClick={() => onChange({ ...EMPTY_FILTERS, q: filters.q })}>Search everywhere → {pluralize(everywhere, "result")}</Button>
          )}
        </div>
      )}
      <button className="mt-4 font-semibold text-primary underline-offset-2 hover:underline" onClick={() => onChange(EMPTY_FILTERS)}>Reset search and filters</button>
    </EmptyState>
  );
}

function FilterGroup({ title, children, htmlFor }: { title: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <fieldset>
      {htmlFor ? (
        <label htmlFor={htmlFor} className="meta-label mb-2 block">{title}</label>
      ) : (
        <legend className="meta-label mb-2">{title}</legend>
      )}
      {children}
    </fieldset>
  );
}

function ToggleChip({ on, onClick, children, title }: { on: boolean; onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} title={title} className="chip-toggle">
      {children}
    </button>
  );
}
