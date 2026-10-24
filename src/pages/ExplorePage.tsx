import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, FilterX, Search, SearchX, SlidersHorizontal } from "lucide-react";
import { EVENTS } from "@/data/events";
import { CATEGORIES, RECOGNITIONS } from "@/data/categories";
import { COUNTRIES } from "@/data/countries";
import { useApp } from "@/context/AppContext";
import { MONTH_NAMES, nextOccurrence } from "@/lib/dates";
import { scoreEvent } from "@/lib/search";
import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { downloadICS } from "@/lib/ics";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cn, pluralize } from "@/lib/utils";
import type { CategoryId, Occurrence, Recognition } from "@/types";

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

export default function ExplorePage() {
  useDocumentTitle("Explore");
  const { today, notify } = useApp();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const cats = list(params.get("cat")) as CategoryId[];
  const recs = list(params.get("rec")) as Recognition[];
  const country = params.get("country") ?? "";
  const month = Number(params.get("month")) || 0;
  const sort = params.get("sort") === "az" ? "az" : q ? "relevance" : "date";
  const [showFilters, setShowFilters] = useState(false);
  const [draft, setDraft] = useState(q);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(q);
  }, [q]);
  useEffect(() => { input.current?.focus(); }, []);

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) (v === null || v === "") ? next.delete(k) : next.set(k, v);
    setParams(next, { replace: true });
  };
  // Debounced search → URL.
  useEffect(() => {
    if (draft === q) return;
    const t = setTimeout(() => update({ q: draft.trim() || null }), 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const toggle = (key: "cat" | "rec", arr: string[], v: string) =>
    update({ [key]: (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]).join(",") || null });

  const countryOptions = useMemo(() => {
    const used = new Set(EVENTS.flatMap((e) => e.countries));
    return Object.values(COUNTRIES).filter((c) => used.has(c.code)).sort((a, b) => (a.code === "GLOBAL" ? -1 : b.code === "GLOBAL" ? 1 : a.name.localeCompare(b.name)));
  }, []);

  const results = useMemo(() => {
    const out: { occ: Occurrence; score: number }[] = [];
    for (const e of EVENTS) {
      if (cats.length && !cats.includes(e.category)) continue;
      if (recs.length && !recs.includes(e.recognition)) continue;
      if (country && !e.countries.includes(country)) continue;
      const occ = nextOccurrence(e, today);
      if (!occ) continue;
      if (month && occ.date.getMonth() + 1 !== month) continue;
      const score = scoreEvent(e, q, `${MONTH_NAMES[occ.date.getMonth()]} ${occ.date.getDate()} ${occ.date.getFullYear()}`);
      if (!score) continue;
      out.push({ occ, score });
    }
    if (sort === "az") out.sort((a, b) => a.occ.event.name.localeCompare(b.occ.event.name));
    else if (sort === "relevance") out.sort((a, b) => b.score - a.score || a.occ.date.getTime() - b.occ.date.getTime());
    else out.sort((a, b) => a.occ.date.getTime() - b.occ.date.getTime());
    return out.map((r) => r.occ);
  }, [cats, recs, country, month, q, sort, today]);

  const activeCount = cats.length + recs.length + (country ? 1 : 0) + (month ? 1 : 0);

  return (
    <div className="container-page py-8 sm:py-10">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Explore special days</h1>
      <p className="mt-2 text-muted">Search by name, topic or country, then narrow down with filters.</p>

      <div className="mt-6 flex gap-2">
        <form role="search" className="relative flex-1" onSubmit={(e) => { e.preventDefault(); update({ q: draft.trim() || null }); }}>
          <label htmlFor="explore-q" className="sr-only">Search</label>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id="explore-q" ref={input} value={draft} onChange={(e) => setDraft(e.target.value)} type="search"
            placeholder="Try “bees”, “privacy”, “Japan”, “Eid”…"
            className="h-12 w-full rounded-full border border-border bg-surface pl-12 pr-4 text-base shadow-card outline-none focus:border-primary"
          />
        </form>
        <Button variant={activeCount ? "secondary" : "outline"} size="lg" className="h-12 lg:hidden" aria-expanded={showFilters} aria-controls="filters" onClick={() => setShowFilters((s) => !s)}>
          <SlidersHorizontal /> <span className="hidden sm:inline">Filters</span>{activeCount > 0 && <span className="rounded-full bg-primary px-1.5 text-xs text-primary-fg">{activeCount}</span>}
        </Button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside id="filters" aria-label="Filters" className={cn("space-y-6 lg:block", showFilters ? "block" : "hidden")}>
          <FilterGroup title="Category">
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <ToggleChip key={c.id} on={cats.includes(c.id)} onClick={() => toggle("cat", cats, c.id)}>
                  <c.icon className="size-3.5" aria-hidden /> {c.label}
                </ToggleChip>
              ))}
            </div>
          </FilterGroup>
          <FilterGroup title="Recognition">
            <div className="flex flex-wrap gap-1.5">
              {RECOGNITIONS.map((r) => (
                <ToggleChip key={r.id} on={recs.includes(r.id)} onClick={() => toggle("rec", recs, r.id)} title={r.description}>{r.short}</ToggleChip>
              ))}
            </div>
          </FilterGroup>
          <FilterGroup title="Country" htmlFor="f-country">
            <select id="f-country" value={country} onChange={(e) => update({ country: e.target.value || null })} className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm">
              <option value="">Any country</option>
              {countryOptions.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
            </select>
          </FilterGroup>
          <FilterGroup title="Month" htmlFor="f-month">
            <select id="f-month" value={month} onChange={(e) => update({ month: e.target.value === "0" ? null : e.target.value })} className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm">
              <option value={0}>Any month</option>
              {MONTH_NAMES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </FilterGroup>
          {activeCount > 0 && (
            <Button variant="ghost" onClick={() => update({ cat: null, rec: null, country: null, month: null })}><FilterX /> Clear filters</Button>
          )}
        </aside>

        <section aria-label="Results">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <p className="mr-auto text-sm text-muted" aria-live="polite"><strong className="text-fg">{pluralize(results.length, "special day")}</strong>{q && <> matching “{q}”</>}</p>
            <label htmlFor="sort" className="sr-only">Sort</label>
            <select id="sort" value={sort} onChange={(e) => update({ sort: e.target.value === "relevance" || (e.target.value === "date" && !q) ? null : e.target.value })} className="h-9 rounded-full border border-border bg-surface px-3 text-sm">
              {q && <option value="relevance">Best match</option>}
              <option value="date">Soonest first</option>
              <option value="az">A – Z</option>
            </select>
            {results.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => { downloadICS(results, "omnicalendar-selection"); notify(`Exported ${pluralize(results.length, "event")}`); }}>
                <Download /> Export .ics
              </Button>
            )}
          </div>
          {results.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((o, i) => <EventCard key={o.event.id} occ={o} style={{ animationDelay: `${Math.min(i, 12) * 25}ms` }} />)}
            </div>
          ) : (
            <EmptyState icon={SearchX} title="No special days found">
              Try a different word, or <button className="font-semibold text-primary underline-offset-2 hover:underline" onClick={() => setParams(new URLSearchParams(), { replace: true })}>reset everything</button>.
            </EmptyState>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterGroup({ title, children, htmlFor }: { title: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <fieldset>
      {htmlFor ? (
        <label htmlFor={htmlFor} className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted">{title}</label>
      ) : (
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{title}</legend>
      )}
      {children}
    </fieldset>
  );
}

function ToggleChip({ on, onClick, children, title }: { on: boolean; onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} title={title}
      className={cn("chip border py-1.5 transition-colors", on ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface text-fg hover:bg-surface-2")}>
      {children}
    </button>
  );
}
