import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AlertTriangle, CalendarClock, ChevronLeft, ExternalLink, Globe2, Landmark, Repeat, Shuffle } from "lucide-react";
import { EVENTS, EVENT_MAP } from "@/data/events";
import { CATEGORY_MAP } from "@/data/categories";
import { countryLabel } from "@/data/countries";
import { useApp } from "@/context/AppContext";
import { describeRule, formatRange, nextOccurrence, occurrenceInYear } from "@/lib/dates";
import { CategoryChip, CategoryIcon, RecognitionBadge } from "@/components/events/Badges";
import { Countdown } from "@/components/events/Countdown";
import { EventActions } from "@/components/events/EventActions";
import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/Button";
import { useSurprise } from "@/hooks/useSurprise";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import NotFoundPage from "./NotFoundPage";
import { cn } from "@/lib/utils";
import type { Occurrence } from "@/types";

export default function EventPage() {
  const { id = "" } = useParams();
  const [params] = useSearchParams();
  const e = EVENT_MAP[id];
  const { today } = useApp();
  const surprise = useSurprise();
  useDocumentTitle(e?.name);

  const occ = useMemo(() => (e ? nextOccurrence(e, today) : null), [e, today]);
  const lastOcc = useMemo(() => {
    if (!e || occ) return null;
    for (let y = today.getFullYear(); y >= today.getFullYear() - 5; y--) { const o = occurrenceInYear(e, y); if (o) return o; }
    return null;
  }, [e, occ, today]);
  const future = useMemo(() => {
    if (!e || !occ) return [];
    return [1, 2, 3].map((n) => occurrenceInYear(e, occ.date.getFullYear() + n)).filter((o): o is Occurrence => !!o);
  }, [e, occ]);
  const related = useMemo(() => {
    if (!e) return [];
    const tags = new Set(e.tags ?? []);
    return EVENTS.filter((x) => x.id !== e.id)
      .map((x) => ({ x, s: (x.category === e.category ? 2 : 0) + (x.tags ?? []).filter((t) => tags.has(t)).length * 3 }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6)
      .map((r) => nextOccurrence(r.x, today))
      .filter((o): o is Occurrence => !!o)
      .slice(0, 3);
  }, [e, today]);

  if (!e) return <NotFoundPage />;
  const cat = CATEGORY_MAP[e.category];
  const shown = occ ?? lastOcc;

  return (
    <article>
      <header className={cn("relative overflow-hidden bg-gradient-to-b", cat.tile)}>
        <div className="container-page py-8 sm:py-12">
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/explore" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-fg"><ChevronLeft className="size-4" aria-hidden /> Explore</Link>
            {params.get("surprise") && (
              <Button variant="secondary" size="sm" className="ml-auto" onClick={surprise}><Shuffle /> Another surprise</Button>
            )}
          </div>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <CategoryIcon id={e.category} size="lg" />
                <div className="flex flex-wrap gap-2">
                  <RecognitionBadge id={e.recognition} long />
                  <Link to={`/categories/${e.category}`}><CategoryChip id={e.category} /></Link>
                </div>
              </div>
              <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-5xl">{e.name}</h1>
              <p className="mt-3 text-lg text-fg/80">{e.summary}</p>
            </div>
            {occ && (
              <div className="card shrink-0 p-5 md:min-w-64">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted">{occ.date <= today ? "Happening" : "Next on"}</div>
                <div className="mt-1 font-semibold">{formatRange(occ)}</div>
                <Countdown occ={occ} className="mt-3" />
              </div>
            )}
          </div>
          <div className="mt-8"><EventActions occ={shown} /></div>
        </div>
      </header>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section aria-labelledby="bg-h">
            <h2 id="bg-h" className="section-title">Background</h2>
            <p className="mt-3 text-base leading-relaxed text-fg/85">{e.background}</p>
          </section>

          {(e.note || shown?.estimated) && (
            <div className="flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-100" role="note">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <p>{e.note ?? "This date is an estimate."}</p>
            </div>
          )}

          {!occ && (
            <p className="rounded-2xl bg-surface-2 p-4 text-sm text-muted">
              {e.rule.type === "once"
                ? `This one-time event took place on ${lastOcc ? formatRange(lastOcc) : "a past date"}.`
                : "We don't have a confirmed upcoming date for this observance yet."}
            </p>
          )}

          <section aria-labelledby="src-h">
            <h2 id="src-h" className="section-title">Sources</h2>
            <p className="mt-1 text-sm text-muted">Where the date and recognition information comes from.</p>
            <ul className="mt-4 space-y-2">
              {e.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-surface-2">
                    <ExternalLink className="size-4 shrink-0 text-primary" aria-hidden />
                    <span className="font-medium">{s.label}</span>
                    <span className="ml-auto hidden truncate text-xs text-muted sm:block">{new URL(s.url).hostname.replace(/^www\./, "")}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-4" aria-label="Details">
          <dl className="card divide-y divide-border/60 text-sm">
            <Detail icon={Repeat} label="Date rule">{describeRule(e.rule)}{e.durationDays && e.durationDays > 1 ? ` · ${e.durationDays} days` : ""}</Detail>
            {e.establishedBy && <Detail icon={Landmark} label="Established by">{e.establishedBy}</Detail>}
            <Detail icon={Globe2} label="Where">
              <ul className="space-y-0.5">{e.countries.map((c) => <li key={c}>{countryLabel(c)}</li>)}</ul>
            </Detail>
            {future.length > 0 && (
              <Detail icon={CalendarClock} label="Future dates">
                <ul className="space-y-0.5">{future.map((o) => <li key={o.date.getTime()}>{formatRange(o)}{o.estimated && " (est.)"}</li>)}</ul>
              </Detail>
            )}
          </dl>
          {e.tags && (
            <div className="flex flex-wrap gap-1.5">
              {e.tags.map((t) => <Link key={t} to={`/explore?q=${encodeURIComponent(t)}`} className="chip bg-surface-2 text-muted hover:text-fg">#{t}</Link>)}
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="container-page" aria-labelledby="rel-h">
          <h2 id="rel-h" className="section-title mb-5">Related special days</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((o) => <EventCard key={o.event.id} occ={o} />)}
          </div>
        </section>
      )}
    </article>
  );
}

function Detail({ icon: Icon, label, children }: { icon: typeof Repeat; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
        <dd className="mt-0.5">{children}</dd>
      </div>
    </div>
  );
}
