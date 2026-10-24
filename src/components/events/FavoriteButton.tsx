import { useState } from "react";
import { Heart } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { EVENT_MAP } from "@/data/events";

export function FavoriteButton({ id, className, withLabel = false }: { id: string; className?: string; withLabel?: boolean }) {
  const { isFavorite, toggleFavorite, notify } = useApp();
  const on = isFavorite(id);
  const name = EVENT_MAP[id]?.name ?? "event";
  // Counts saves made in this session, so the confirmation plays on click — not on every render of a saved heart.
  const [saves, setSaves] = useState(0);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(id);
        if (!on) setSaves((n) => n + 1);
        notify(on ? `Removed “${name}” from favorites` : `Saved “${name}” to favorites`);
      }}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full transition-all duration-150 active:scale-90",
        withLabel ? "h-10 border border-border bg-surface px-4 text-sm font-semibold shadow-control hover:border-border-strong hover:bg-surface-2" : "size-9 hover:bg-fg/[.06]",
        on && "text-rose-600 dark:text-rose-400",
        className,
      )}
    >
      {on && saves > 0 && (
        <span key={`b${saves}`} className={cn("pointer-events-none absolute rounded-full bg-current animate-burst", withLabel ? "left-3 size-6" : "size-7")} aria-hidden />
      )}
      <Heart key={on && saves > 0 ? saves : "h"} className={cn("size-[18px] transition-transform", on && "scale-110 fill-current", on && saves > 0 && "animate-heart")} aria-hidden />
      {withLabel && (on ? "Saved" : "Save")}
    </button>
  );
}
