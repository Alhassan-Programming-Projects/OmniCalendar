import { Link } from "react-router-dom";
import type { Occurrence } from "@/types";
import { diffInDays, formatShort, toISODate } from "@/lib/dates";
import { useApp } from "@/context/AppContext";
import { RecognitionBadge, ScopeBadge } from "@/components/events/Badges";
import { FavoriteButton } from "@/components/events/FavoriteButton";
import { cn } from "@/lib/utils";

/** Countdown text: "Today", "Tomorrow", "In 12 days", or "Ongoing · until 21 Nov" for running events. */
export function countdownLabel(occ: Occurrence, today: Date): { text: string; tone: "now" | "soon" | "later" } {
  const n = diffInDays(today, occ.date);
  if (n < 0 && diffInDays(today, occ.endDate) >= 0) return { text: `Ongoing · until ${formatShort(occ.endDate)}`, tone: "now" };
  if (n === 0) return { text: "Today", tone: "now" };
  if (n === 1) return { text: "Tomorrow", tone: "soon" };
  if (n === -1) return { text: "Yesterday", tone: "later" };
  if (n < 0) return { text: `${-n} days ago`, tone: "later" };
  return { text: `In ${n} days`, tone: n <= 7 ? "soon" : "later" };
}

/** Compact list of upcoming days with a clear date tile and countdown. */
export function UpcomingList({ items, empty }: { items: Occurrence[]; empty?: React.ReactNode }) {
  const { today } = useApp();
  if (!items.length) return <>{empty}</>;
  return (
    <ol className="card divide-y divide-border/50 p-2">
      {items.map((o) => {
        const e = o.event;
        const cd = countdownLabel(o, today);
        return (
          <li key={e.id + o.date.getTime()} className="group relative flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-fg/[.045]">
            <time dateTime={toISODate(o.date)}
              className="flex w-12 shrink-0 flex-col items-center overflow-hidden rounded-xl border border-border/70 bg-surface text-center leading-none shadow-control">
              <span className="w-full bg-primary-soft py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                {o.date.toLocaleDateString(undefined, { month: "short" })}
              </span>
              <span className="pt-1 font-display text-lg font-extrabold tabular-nums">{o.date.getDate()}</span>
              <span className="pb-1 text-[10px] text-muted">{o.date.toLocaleDateString(undefined, { weekday: "short" })}</span>
            </time>
            <div className="min-w-0 flex-1">
              <Link to={`/event/${e.id}`} className="block truncate font-medium transition-colors group-hover:text-primary after:absolute after:inset-0 after:content-[''] focus-visible:ring-0">
                {e.name}
              </Link>
              <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className={cn("chip px-2 py-0.5 text-[11px] font-semibold",
                  cd.tone === "now" ? "bg-primary text-primary-fg" : cd.tone === "soon" ? "bg-primary-soft text-primary" : "bg-surface-2 text-muted")}>
                  {cd.text}
                </span>
                <ScopeBadge countries={e.countries} max={2} />
                {o.estimated && <span className="text-[11px] text-muted" title="Date depends on moon sighting">est.</span>}
              </div>
            </div>
            <RecognitionBadge id={e.recognition} className="relative hidden shrink-0 sm:inline-flex" />
            <FavoriteButton id={e.id} className="relative shrink-0" />
          </li>
        );
      })}
    </ol>
  );
}
