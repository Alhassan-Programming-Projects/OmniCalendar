import { CATEGORY_MAP, RECOGNITION_MAP } from "@/data/categories";
import type { CategoryId, Recognition } from "@/types";
import { cn } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";

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
