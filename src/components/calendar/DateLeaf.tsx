import { cn } from "@/lib/utils";

/**
 * A tear-off calendar page — OmniCalendar's signature mark. Echoes the logo:
 * a coloured binding strip with the month, a large day numeral and the weekday.
 */
export function DateLeaf({ date, className, size = "md" }: { date: Date; className?: string; size?: "sm" | "md" }) {
  const month = date.toLocaleDateString(undefined, { month: "short" });
  const weekday = date.toLocaleDateString(undefined, { weekday: "long" });
  return (
    <div
      className={cn(
        "card flex shrink-0 flex-col overflow-hidden text-center",
        size === "md" ? "w-28" : "w-20",
        className,
      )}
      aria-hidden
    >
      <div className={cn("bg-primary font-semibold uppercase tracking-[0.14em] text-primary-fg", size === "md" ? "py-1.5 text-xs" : "py-1 text-[10px]")}>
        {month}
      </div>
      <div className={cn("font-display font-extrabold tabular-nums leading-none", size === "md" ? "pt-3 text-5xl" : "pt-2 text-3xl")}>
        {date.getDate()}
      </div>
      <div className={cn("truncate px-2 font-medium text-muted", size === "md" ? "pb-3 pt-1.5 text-xs" : "pb-2 pt-1 text-[10px]")}>{weekday}</div>
    </div>
  );
}
