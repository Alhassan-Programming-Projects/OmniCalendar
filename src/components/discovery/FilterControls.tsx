import { useMemo } from "react";
import { X } from "lucide-react";
import { EVENTS } from "@/data/events";
import { ARAB_LEAGUE, COUNTRIES, REGIONS } from "@/data/countries";
import { detectPreset, filterChips, presetRange, RANGE_PRESETS, type DiscoveryFilters, type Scope } from "@/lib/filters";
import { cn } from "@/lib/utils";

/* Shared discovery controls. Every control is a thin view over DiscoveryFilters: it receives the
   current filters and calls onChange with a new object — the page writes that to the URL. */

type Props = { filters: DiscoveryFilters; onChange: (f: DiscoveryFilters) => void };

/** Countries that actually have events, split into Arab states and the rest. */
function useCountryGroups() {
  return useMemo(() => {
    const used = new Set(EVENTS.flatMap((e) => e.countries));
    const all = Object.values(COUNTRIES).filter((c) => c.code !== "GLOBAL" && used.has(c.code));
    const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);
    return {
      arab: all.filter((c) => ARAB_LEAGUE.includes(c.code) && c.code !== "OM").sort(byName),
      other: all.filter((c) => !ARAB_LEAGUE.includes(c.code)).sort(byName),
    };
  }, []);
}

/** Country / region selector — Oman, the Arab world and the Gulf are listed first. */
export function RegionSelect({ filters, onChange, id, className, showIntlToggle = true }: Props & { id: string; className?: string; showIntlToggle?: boolean }) {
  const groups = useCountryGroups();
  return (
    <div className={cn("space-y-2", className)}>
      <select id={id} value={filters.region} className="field"
        onChange={(e) => onChange({ ...filters, region: e.target.value, withIntl: e.target.value ? filters.withIntl : false })}>
        <option value="">All countries & worldwide</option>
        <optgroup label="Featured">
          <option value="OM">{COUNTRIES.OM.flag} Oman</option>
          <option value="ARAB" title="All 22 Arab League countries">{REGIONS.ARAB.flag} Arab world</option>
          <option value="GCC">{REGIONS.GCC.flag} Gulf (GCC)</option>
        </optgroup>
        <optgroup label="Arab countries">
          {groups.arab.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
        </optgroup>
        <optgroup label="Other countries">
          {groups.other.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
        </optgroup>
      </select>
      {showIntlToggle && filters.region && (
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-[rgb(var(--primary))]" checked={filters.withIntl}
            onChange={(e) => onChange({ ...filters, withIntl: e.target.checked })} />
          Also show worldwide days
        </label>
      )}
    </div>
  );
}

/** One-tap shortcuts that make Oman and the Arab world easy to find. */
export function QuickRegions({ filters, onChange, className }: Props & { className?: string }) {
  const items = [
    { code: "OM", label: `${COUNTRIES.OM.flag} Oman` },
    { code: "ARAB", label: `${REGIONS.ARAB.flag} Arab world` },
    { code: "GCC", label: `${REGIONS.GCC.flag} Gulf` },
  ];
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)} role="group" aria-label="Quick region">
      {items.map((it) => (
        <button key={it.code} type="button" className="chip-toggle" aria-pressed={filters.region === it.code}
          onClick={() => onChange({ ...filters, region: filters.region === it.code ? "" : it.code, withIntl: filters.region === it.code ? false : filters.withIntl })}>
          {it.label}
        </button>
      ))}
    </div>
  );
}

/** International vs country-specific. */
export function ScopeToggle({ filters, onChange, className, short = false }: Props & { className?: string; short?: boolean }) {
  const opts: { id: Scope; label: string; title: string }[] = [
    { id: "", label: "All", title: "International days and country-specific occasions" },
    { id: "intl", label: short ? "🌍 Worldwide" : "🌍 International", title: "International days, observed worldwide" },
    { id: "local", label: short ? "📍 Local" : "📍 Country-specific", title: "Country-specific occasions: national holidays and local days" },
  ];
  return (
    <div className={cn("segmented flex w-full", className)} role="group" aria-label="International or country-specific">
      {opts.map((o) => (
        <button key={o.id || "all"} type="button" title={o.title} aria-pressed={filters.scope === o.id}
          aria-label={o.title}
          className="segmented-item flex-1 justify-center whitespace-nowrap px-2 text-xs sm:text-sm" onClick={() => onChange({ ...filters, scope: o.id })}>
          <span aria-hidden>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/** Date range: quick presets plus a custom from/to. */
export function DateRangeFilter({ filters, onChange, today, id }: Props & { today: Date; id: string }) {
  const preset = detectPreset(filters, today);
  return (
    <div className="space-y-2">
      <select id={id} className="field" value={preset}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "") onChange({ ...filters, from: "", to: "" });
          else if (v === "custom") onChange({ ...filters, ...presetRange("30d", today) });
          else onChange({ ...filters, ...presetRange(v, today) });
        }}>
        <option value="">Any date (next occurrence)</option>
        {RANGE_PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        <option value="custom">Custom range…</option>
      </select>
      {preset === "custom" && (
        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-muted">From
            <input type="date" className="field mt-1 px-2" value={filters.from} max={filters.to || undefined}
              onChange={(e) => onChange({ ...filters, from: e.target.value })} />
          </label>
          <label className="text-xs text-muted">To
            <input type="date" className="field mt-1 px-2" value={filters.to} min={filters.from || undefined}
              onChange={(e) => onChange({ ...filters, to: e.target.value })} />
          </label>
        </div>
      )}
    </div>
  );
}

/** Removable chips for every active filter, plus "Clear all". */
export function ActiveFilters({ filters, onChange, today, includeQuery = true, className, onClear }: Props & {
  today: Date; includeQuery?: boolean; className?: string; onClear?: () => void;
}) {
  const chips = filterChips(filters, today, { includeQuery });
  if (!chips.length) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)} aria-label="Active filters">
      {chips.map((c) => (
        <button key={c.key} type="button" onClick={() => onChange(c.without)} aria-label={`Remove filter: ${c.label}`}
          className="pressable chip border border-primary/25 bg-primary-soft py-1 pl-2.5 pr-1.5 text-primary hover:bg-primary/15">
          {c.label}
          <X className="size-3.5" aria-hidden />
        </button>
      ))}
      {chips.length > 1 && (
        <button type="button" className="pressable chip px-2 font-semibold text-muted hover:text-fg"
          onClick={() => (onClear ? onClear() : onChange({ ...filters, q: includeQuery ? "" : filters.q, cats: [], recs: [], region: "", withIntl: false, scope: "", from: "", to: "" }))}>
          Clear all
        </button>
      )}
    </div>
  );
}
