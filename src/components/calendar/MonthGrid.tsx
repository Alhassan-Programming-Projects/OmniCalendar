import { useEffect, useMemo, useRef, type KeyboardEvent } from "react";
import type { Occurrence } from "@/types";
import { CATEGORY_MAP } from "@/data/categories";
import { addDays, daysInMonth, makeDate, sameDay, toISODate, WEEKDAY_NAMES } from "@/lib/dates";
import { cn } from "@/lib/utils";

interface Props {
  year: number;
  month: number; // 1..12
  selected: Date;
  today: Date;
  index: Map<string, Occurrence[]>;
  onSelect: (d: Date) => void;
  /** Called when keyboard navigation leaves the visible month. */
  onNavigate: (d: Date) => void;
  weekStartsOn?: 0 | 1;
}

export function MonthGrid({ year, month, selected, today, index, onSelect, onNavigate, weekStartsOn = 1 }: Props) {
  const cells = useMemo(() => {
    const first = makeDate(year, month, 1);
    const lead = (first.getDay() - weekStartsOn + 7) % 7;
    const total = Math.ceil((lead + daysInMonth(year, month)) / 7) * 7;
    return Array.from({ length: total }, (_, i) => addDays(first, i - lead));
  }, [year, month, weekStartsOn]);

  const weekdays = useMemo(() => Array.from({ length: 7 }, (_, i) => WEEKDAY_NAMES[(i + weekStartsOn) % 7]), [weekStartsOn]);
  const gridRef = useRef<HTMLDivElement>(null);
  const focusPending = useRef(false);

  useEffect(() => {
    if (!focusPending.current) return;
    focusPending.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${toISODate(selected)}"]`)?.focus();
  }, [selected, year, month]);

  const move = (d: Date) => {
    focusPending.current = true;
    if (d.getMonth() + 1 !== month || d.getFullYear() !== year) onNavigate(d);
    else onSelect(d);
  };

  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in map) { e.preventDefault(); move(addDays(selected, map[e.key])); }
    else if (e.key === "PageUp") { e.preventDefault(); move(new Date(selected.getFullYear(), selected.getMonth() - 1, Math.min(selected.getDate(), daysInMonth(selected.getFullYear(), selected.getMonth())))); }
    else if (e.key === "PageDown") { e.preventDefault(); move(new Date(selected.getFullYear(), selected.getMonth() + 1, Math.min(selected.getDate(), daysInMonth(selected.getFullYear(), selected.getMonth() + 2)))); }
    else if (e.key === "Home") { e.preventDefault(); move(addDays(selected, -((selected.getDay() - weekStartsOn + 7) % 7))); }
    else if (e.key === "End") { e.preventDefault(); move(addDays(selected, 6 - ((selected.getDay() - weekStartsOn + 7) % 7))); }
  };

  return (
    <div className="card overflow-hidden" ref={gridRef}>
      <div role="grid" aria-label={makeDate(year, month, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" })} onKeyDown={onKey}>
        <div role="row" className="grid grid-cols-7 border-b border-border/70 bg-surface-2/60">
          {weekdays.map((w) => (
            <div role="columnheader" key={w} aria-label={w} className="py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted">
              <span className="sm:hidden">{w.slice(0, 1)}</span>
              <span className="hidden sm:inline">{w.slice(0, 3)}</span>
            </div>
          ))}
        </div>
        {Array.from({ length: cells.length / 7 }, (_, r) => (
          <div role="row" key={r} className="grid grid-cols-7">
            {cells.slice(r * 7, r * 7 + 7).map((d) => {
              const inMonth = d.getMonth() + 1 === month;
              const list = inMonth ? index.get(toISODate(d)) ?? [] : [];
              const isSel = sameDay(d, selected);
              const isToday = sameDay(d, today);
              return (
                <div role="gridcell" key={d.getTime()} aria-selected={isSel} className="border-b border-r border-border/50 [&:nth-child(7n)]:border-r-0">
                  <button
                    type="button"
                    data-date={toISODate(d)}
                    tabIndex={isSel ? 0 : -1}
                    disabled={!inMonth}
                    onClick={() => onSelect(d)}
                    aria-label={`${d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}${list.length ? `, ${list.length} special ${list.length === 1 ? "day" : "days"}` : ""}${isToday ? ", today" : ""}`}
                    className={cn(
                      "flex h-16 w-full flex-col items-start gap-1 p-1.5 text-left transition-colors sm:h-24 sm:p-2 lg:h-28",
                      inMonth ? "hover:bg-surface-2" : "cursor-default opacity-35",
                      isSel && "bg-primary-soft/70 hover:bg-primary-soft",
                      "focus-visible:ring-inset focus-visible:ring-offset-0",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-7 place-items-center rounded-full text-sm tabular-nums",
                        isToday && "bg-primary font-bold text-primary-fg",
                        !isToday && isSel && "font-bold text-primary",
                      )}
                    >
                      {d.getDate()}
                    </span>
                    {list.length > 0 && (
                      <>
                        <span className="flex flex-wrap gap-0.5 sm:hidden" aria-hidden>
                          {list.slice(0, 3).map((o) => <span key={o.event.id} className={cn("size-1.5 rounded-full", CATEGORY_MAP[o.event.category].dot)} />)}
                        </span>
                        <span className="hidden w-full flex-col gap-0.5 sm:flex" aria-hidden>
                          {list.slice(0, 2).map((o) => (
                            <span key={o.event.id} className={cn("truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-tight", CATEGORY_MAP[o.event.category].chip)}>
                              {o.event.name}
                            </span>
                          ))}
                          {list.length > 2 && <span className="px-1.5 text-[11px] font-medium text-muted">+{list.length - 2} more</span>}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
