import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp, useFilterMemory } from "@/context/AppContext";
import { applyFilters, filtersToQuery, parseFilters, type DiscoveryFilters } from "@/lib/filters";

/**
 * Discovery filters for the current page, read from and written to the URL (so every filtered
 * view is shareable). The latest filters are also remembered for the session, which lets the
 * Calendar ⇄ Explore navigation keep the same selection.
 */
export function useDiscoveryFilters() {
  const [params, setParams] = useSearchParams();
  const { today } = useApp();
  const { setFilterQuery } = useFilterMemory();
  const filters = useMemo(() => parseFilters(params, today), [params, today]);
  const query = filtersToQuery(filters);

  useEffect(() => { setFilterQuery(query); }, [query, setFilterQuery]);

  /**
   * Controls hand back a full filter object built from the filters they rendered with. Only the
   * fields they actually changed are applied, on top of the *current* URL — so two quick changes
   * in a row (before the first has re-rendered) never overwrite each other.
   */
  const setFilters = useCallback(
    (f: DiscoveryFilters, extra: Record<string, string | null> = {}) => {
      const base = new URLSearchParams(typeof window !== "undefined" ? window.location.search : params);
      const merged: DiscoveryFilters = { ...parseFilters(base, today) };
      for (const k of Object.keys(f) as (keyof DiscoveryFilters)[]) {
        if (JSON.stringify(f[k]) !== JSON.stringify(filters[k])) (merged as unknown as Record<string, unknown>)[k] = f[k];
      }
      const next = applyFilters(base, merged);
      for (const [k, v] of Object.entries(extra)) (v === null ? next.delete(k) : next.set(k, v));
      setParams(next, { replace: true });
    },
    [params, filters, today, setParams],
  );

  return { filters, setFilters, query, params, setParams };
}
