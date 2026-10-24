import { CATEGORY_MAP, RECOGNITION_MAP } from "@/data/categories";
import type { CategoryId, Recognition } from "@/types";
import { cn } from "@/lib/utils";
import { BadgeCheck, Globe2 } from "lucide-react";
import { COUNTRIES } from "@/data/countries";

export function CategoryIcon({ id, className, size = "md" }: { id: CategoryId; className?: string; size?: "sm" | "md" | "lg" }) {
  const c = CATEGORY_MAP[id];
  const Icon = c.icon;
  const box = size === "sm" ? "size-8 rounded-lg" : size === "lg" ? "size-14 rounded-2xl" : "size-10 rounded-xl";
  const icon = size === "sm" ? "size-4" : size === "lg" ? "size-7" : "size-5";
  return (
    <span className={cn("grid shrink-0 place-items-center", c.chip, box, className)} aria-hidden>
      <Icon className={icon} />
    </span>
  );
}

export function CategoryChip({ id, className }: { id: CategoryId; className?: string }) {
  const c = CATEGORY_MAP[id];
  const Icon = c.icon;
  return (
    <span className={cn("chip", c.chip, className)}>
      <Icon className="size-3.5" aria-hidden />
      {c.label}
    </span>
  );
}

export function RecognitionBadge({ id, long = false, className }: { id: Recognition; long?: boolean; className?: string }) {
  const r = RECOGNITION_MAP[id];
  return (
    <span className={cn("chip border", r.badge, className)} title={r.description}>
      {(id === "un" || id === "national") && <BadgeCheck className="size-3.5" aria-hidden />}
      {long ? r.label : r.short}
    </span>
  );
}

/**
 * Where a day applies: "🌍 Worldwide" for international days, otherwise the country flags.
 * Lets people tell international events from country-specific occasions at a glance.
 */
export function ScopeBadge({ countries, className, max = 3 }: { countries: string[]; className?: string; max?: number }) {
  const intl = countries.includes("GLOBAL");
  const local = countries.filter((c) => c !== "GLOBAL");
  const names = local.map((c) => COUNTRIES[c]?.name ?? c);
  if (intl) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs text-muted", className)} title={local.length ? `Worldwide — also a holiday or occasion in ${names.join(", ")}` : "International / worldwide"}>
        <Globe2 className="size-3.5" aria-hidden /> Worldwide
      </span>
    );
  }
  const shown = local.slice(0, max);
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs text-muted", className)} title={names.join(", ")}>
      <span aria-hidden className="tracking-tight">{shown.map((c) => COUNTRIES[c]?.flag ?? "").join("")}</span>
      <span className="truncate">{local.length === 1 ? names[0] : local.length > max ? `+${local.length - max} more` : names.length === 2 ? names.join(" & ") : `${local.length} countries`}</span>
      <span className="sr-only">{names.join(", ")}</span>
    </span>
  );
}
