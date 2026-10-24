import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { CATEGORY_MAP } from "@/data/categories";
import { EVENTS } from "@/data/events";
import { useApp } from "@/context/AppContext";
import { MONTH_NAMES, nextOccurrence } from "@/lib/dates";
import { CategoryIcon } from "@/components/events/Badges";
import { EventCard } from "@/components/events/EventCard";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import type { CategoryId, Occurrence } from "@/types";
import NotFoundPage from "./NotFoundPage";
import { cn } from "@/lib/utils";

export default function CategoryPage() {
  const { id } = useParams();
  const cat = CATEGORY_MAP[id as CategoryId];
  const { today } = useApp();
  useDocumentTitle(cat?.label);
  const groups = useMemo(() => {
    if (!cat) return [];
    const occ = EVENTS.filter((e) => e.category === cat.id).map((e) => nextOccurrence(e, today)).filter((o): o is Occurrence => !!o)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    const map = new Map<string, Occurrence[]>();
    for (const o of occ) {
      const k = `${MONTH_NAMES[o.date.getMonth()]} ${o.date.getFullYear()}`;
      map.set(k, [...(map.get(k) ?? []), o]);
    }
    return [...map.entries()];
  }, [cat, today]);
  if (!cat) return <NotFoundPage />;

  return (
    <div>
      <div className={cn("bg-gradient-to-b", cat.tile)}>
        <div className="container-page py-10">
          <Link to="/categories" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-fg"><ChevronLeft className="size-4" aria-hidden /> All categories</Link>
          <div className="mt-4 flex items-center gap-4">
            <CategoryIcon id={cat.id} size="lg" />
            <div>
              <h1 className="text-3xl font-extrabold sm:text-4xl">{cat.label}</h1>
              <p className="mt-1 text-muted">{cat.description}</p>
            </div>
          </div>
          <Link to={`/calendar?category=${cat.id}&view=year`} className="mt-5 inline-block text-sm font-semibold text-primary hover:underline">See {cat.label.toLowerCase()} days on the year calendar →</Link>
        </div>
      </div>
      <div className="container-page space-y-10 py-8">
        {groups.map(([label, list]) => (
          <section key={label} aria-label={label}>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">{label}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((o) => <EventCard key={o.event.id} occ={o} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
