import { Link } from "react-router-dom";
import type { Occurrence } from "@/types";
import { CATEGORY_MAP } from "@/data/categories";
import { formatShort, relativeLabel, sameDay } from "@/lib/dates";
import { useApp } from "@/context/AppContext";
import { CategoryIcon, RecognitionBadge } from "./Badges";
import { FavoriteButton } from "./FavoriteButton";
import { cn } from "@/lib/utils";

export function EventCard({ occ, className, style }: { occ: Occurrence; className?: string; style?: React.CSSProperties }) {
  const { today } = useApp();
  const e = occ.event;
  const cat = CATEGORY_MAP[e.category];
  const multi = !sameDay(occ.date, occ.endDate);
  return (
    <article
      style={style}
      className={cn(
        "card group relative flex animate-fade-up flex-col overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift",
        className,
      )}
    >
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b opacity-70", cat.tile)} aria-hidden />
      <div className="relative flex items-start justify-between gap-3">
        <CategoryIcon id={e.category} />
        <FavoriteButton id={e.id} className="-mr-2 -mt-1" />
      </div>
      <div className="relative mt-4 flex items-center gap-2 text-xs font-medium text-muted">
        <time dateTime={occ.date.toISOString()}>
          {formatShort(occ.date)}{multi && ` – ${formatShort(occ.endDate)}`}
        </time>
        <span aria-hidden>·</span>
        <span>{occ.date < today && occ.endDate >= today ? "Ongoing" : relativeLabel(occ.date, today)}</span>
        {occ.estimated && <span className="chip bg-surface-2 px-2 py-0.5 text-[10px]">est.</span>}
      </div>
      <h3 className="relative mt-1.5 text-base font-bold leading-snug">
        <Link to={`/event/${e.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:ring-0">
          {e.name}
        </Link>
      </h3>
      <p className="relative mt-1.5 line-clamp-2 text-sm text-muted">{e.summary}</p>
      <div className="relative mt-auto flex flex-wrap items-center gap-2 pt-4">
        <RecognitionBadge id={e.recognition} />
        <span className="text-xs text-muted">{cat.label}</span>
      </div>
    </article>
  );
}

/** Compact row used in lists, day panels and search results. */
export function EventRow({ occ, showDate = true, compact = false }: { occ: Occurrence; showDate?: boolean; compact?: boolean }) {
  const { today } = useApp();
  const e = occ.event;
  return (
    <div className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-2">
      <CategoryIcon id={e.category} size="sm" />
      <div className="min-w-0 flex-1">
        <Link to={`/event/${e.id}`} className="block truncate font-medium after:absolute after:inset-0 after:content-[''] focus-visible:ring-0">
          {e.name}
        </Link>
        <div className="flex items-center gap-1.5 truncate text-xs text-muted">
          {showDate && <span>{formatShort(occ.date)} · {occ.date < today && occ.endDate >= today ? "Ongoing" : relativeLabel(occ.date, today)}</span>}
          {!showDate && <span className="truncate">{e.summary}</span>}
        </div>
      </div>
      {!compact && <RecognitionBadge id={e.recognition} className="hidden sm:inline-flex" />}
      <FavoriteButton id={e.id} className="relative" />
    </div>
  );
}
