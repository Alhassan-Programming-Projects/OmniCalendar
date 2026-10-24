import { Heart } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { EVENT_MAP } from "@/data/events";

export function FavoriteButton({ id, className, withLabel = false }: { id: string; className?: string; withLabel?: boolean }) {
  const { isFavorite, toggleFavorite, notify } = useApp();
  const on = isFavorite(id);
  const name = EVENT_MAP[id]?.name ?? "event";
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(id);
        notify(on ? `Removed “${name}” from favorites` : `Saved “${name}” to favorites`);
      }}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition-all duration-150 active:scale-90",
        withLabel ? "h-10 border border-border bg-surface px-4 text-sm font-medium hover:bg-surface-2" : "size-9 hover:bg-surface-2",
        on && "text-rose-600 dark:text-rose-400",
        className,
      )}
    >
      <Heart className={cn("size-[18px] transition-transform", on && "scale-110 fill-current")} aria-hidden />
      {withLabel && (on ? "Saved" : "Save")}
    </button>
  );
}
