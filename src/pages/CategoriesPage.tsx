import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, RECOGNITIONS } from "@/data/categories";
import { EVENTS } from "@/data/events";
import { useApp } from "@/context/AppContext";
import { formatShort, nextOccurrence, relativeLabel } from "@/lib/dates";
import { CategoryIcon, RecognitionBadge } from "@/components/events/Badges";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cn } from "@/lib/utils";
import type { Occurrence } from "@/types";

export default function CategoriesPage() {
  useDocumentTitle("Categories");
  const { today } = useApp();
  return (
    <div className="container-page py-8 sm:py-10">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Categories</h1>
      <p className="mt-2 text-muted">Every special day belongs to one category and has a recognition level.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c, i) => {
          const items = EVENTS.filter((e) => e.category === c.id);
          const next = items.map((e) => nextOccurrence(e, today)).filter((o): o is Occurrence => !!o).sort((a, b) => a.date.getTime() - b.date.getTime())[0];
          return (
            <Link key={c.id} to={`/categories/${c.id}`} style={{ animationDelay: `${i * 30}ms` }}
              className="card group relative flex animate-fade-up flex-col overflow-hidden p-6 transition-all hover:-translate-y-0.5 hover:shadow-lift">
              <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80", c.tile)} aria-hidden />
              <div className="relative flex items-center justify-between">
                <CategoryIcon id={c.id} size="lg" />
                <span className="text-sm font-semibold text-muted">{items.length} days</span>
              </div>
              <h2 className="relative mt-5 text-xl font-bold">{c.label}</h2>
              <p className="relative mt-1 text-sm text-muted">{c.description}</p>
              {next && (
                <p className="relative mt-5 flex items-center gap-1.5 border-t border-border/60 pt-4 text-sm">
                  <span className="text-muted">Next:</span>
                  <span className="truncate font-medium">{next.event.name}</span>
                  <span className="ml-auto shrink-0 text-xs text-muted">{formatShort(next.date)} · {relativeLabel(next.date, today)}</span>
                </p>
              )}
              <ArrowRight className="absolute right-6 top-24 size-5 text-muted opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" aria-hidden />
            </Link>
          );
        })}
      </div>

      <section className="mt-16" aria-labelledby="rec-h">
        <h2 id="rec-h" className="section-title">Recognition levels</h2>
        <p className="mt-1 text-sm text-muted">How official is a day? OmniCalendar labels each one so you know.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RECOGNITIONS.map((r) => (
            <Link key={r.id} to={`/explore?rec=${r.id}`} className="card p-5 transition-all hover:shadow-lift">
              <RecognitionBadge id={r.id} long />
              <p className="mt-3 text-sm text-muted">{r.description}</p>
              <p className="mt-2 text-xs font-semibold text-primary">{EVENTS.filter((e) => e.recognition === r.id).length} days →</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
