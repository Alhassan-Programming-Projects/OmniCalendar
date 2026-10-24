import type { Occurrence } from "@/types";
import { diffInDays } from "@/lib/dates";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

/** Big-number countdown; shows "Today!" or "Happening now" when active. */
export function Countdown({ occ, className }: { occ: Occurrence; className?: string }) {
  const { today } = useApp();
  const n = diffInDays(today, occ.date);
  const active = n <= 0 && diffInDays(today, occ.endDate) >= 0;
  return (
    <div className={cn("flex items-baseline gap-1.5", className)} aria-label={active ? "Happening today" : `${n} days to go`}>
      {active ? (
        <span className="font-display text-2xl font-extrabold text-primary">{n === 0 ? "Today!" : "Happening now"}</span>
      ) : (
        <>
          <span className="font-display text-3xl font-extrabold tabular-nums">{n}</span>
          <span className="text-sm text-muted">{n === 1 ? "day to go" : "days to go"}</span>
        </>
      )}
    </div>
  );
}
