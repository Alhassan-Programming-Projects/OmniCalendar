import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import type { Collection, ThemePreference } from "@/types";
import { storage } from "@/lib/utils";
import { startOfDay } from "@/lib/dates";
import { flushSync } from "react-dom";
import { prefersReducedMotion } from "@/lib/motion";

const KEYS = {
  theme: "omnicalendar:theme",
  filters: "omnicalendar:filters",
  favorites: "omnicalendar:favorites",
  collections: "omnicalendar:collections",
};

interface Toast { id: number; message: string; leaving?: boolean }

interface AppState {
  today: Date;
  theme: ThemePreference;
  /** Light/dark appearance actually in effect (Liquid Glass follows the system). */
  resolvedTheme: "light" | "dark";
  /** True when the Liquid Glass material is active. */
  glass: boolean;
  setTheme: (t: ThemePreference) => void;
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  collections: Collection[];
  createCollection: (name: string, initialEventId?: string) => Collection;
  renameCollection: (id: string, name: string) => void;
  deleteCollection: (id: string) => void;
  toggleInCollection: (collectionId: string, eventId: string) => void;
  toasts: Toast[];
  notify: (message: string) => void;
}

/** Last discovery filters used in Explore/Calendar/Home (query string), kept for this browser session. */
interface FilterMemory {
  filterQuery: string;
  setFilterQuery: (q: string) => void;
}

const Ctx = createContext<AppState | null>(null);
// Separate context so remembering filters re-renders only the few components that read it.
const FilterCtx = createContext<FilterMemory | null>(null);

function systemDark() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function AppProvider({ children }: { children: ReactNode }) {
  // ---- today (rolls over at midnight) ----
  const [today, setToday] = useState(() => startOfDay(new Date()));
  useEffect(() => {
    const now = new Date();
    const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime() + 500;
    const t = setTimeout(() => setToday(startOfDay(new Date())), msToMidnight);
    return () => clearTimeout(t);
  }, [today]);

  // ---- theme ----
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    try {
      const t = localStorage.getItem(KEYS.theme);
      return t === "light" || t === "dark" || t === "glass" ? t : "system";
    } catch {
      return "system";
    }
  });
  const [sysDark, setSysDark] = useState(systemDark);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const on = (e: MediaQueryListEvent) => setSysDark(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const glass = theme === "glass";
  const resolvedTheme: "light" | "dark" = theme === "light" || theme === "dark" ? theme : sysDark ? "dark" : "light";
  // Layout effect: runs synchronously in the commit, so the theme class is in place before
  // the view-transition snapshot is taken (and before paint, so no flash).
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.classList.toggle("theme-glass", glass);
    const color = glass ? (resolvedTheme === "dark" ? "#0a0d18" : "#e9eef8") : resolvedTheme === "dark" ? "#0b0e15" : "#f6f7fa";
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", color));
  }, [resolvedTheme, glass]);
  const setTheme = useCallback((t: ThemePreference) => {
    // Cross-fade the whole page between themes (≈220ms). The new theme is committed synchronously
    // inside the transition, so the UI is never waiting on the animation.
    const commit = () => flushSync(() => setThemeState(t));
    const root = document.documentElement;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (prefersReducedMotion()) commit();
    else if (doc.startViewTransition) doc.startViewTransition(commit);
    else {
      root.classList.add("theme-switching");
      commit();
      window.setTimeout(() => root.classList.remove("theme-switching"), 280);
    }
    // Stored as a raw string so the pre-paint script in index.html can read it.
    try { localStorage.setItem(KEYS.theme, t); } catch { /* ignore */ }
  }, []);

  // ---- discovery filters (session) ----
  const [filterQuery, setFilterQueryState] = useState<string>(() => {
    try { return sessionStorage.getItem(KEYS.filters) ?? ""; } catch { return ""; }
  });
  const setFilterQuery = useCallback((q: string) => {
    setFilterQueryState((prev) => (prev === q ? prev : q));
    try { if (q) sessionStorage.setItem(KEYS.filters, q); else sessionStorage.removeItem(KEYS.filters); } catch { /* ignore */ }
  }, []);

  // ---- toasts ----
  const [toasts, setToasts] = useState<Toast[]>([]);
  const notify = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, message }]);
    // Flag first so the toast can play its 200ms exit, then remove it.
    setTimeout(() => setToasts((t) => t.map((x) => (x.id === id ? { ...x, leaving: true } : x))), 2600);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  // ---- favorites ----
  const [favorites, setFavorites] = useState<string[]>(() => storage.get<string[]>(KEYS.favorites, []));
  useEffect(() => {
    storage.set(KEYS.favorites, favorites);
  }, [favorites]);
  const favSet = useMemo(() => new Set(favorites), [favorites]);
  const isFavorite = useCallback((id: string) => favSet.has(id), [favSet]);
  const toggleFavorite = useCallback((id: string) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }, []);

  // ---- collections ----
  const [collections, setCollections] = useState<Collection[]>(() => storage.get<Collection[]>(KEYS.collections, []));
  useEffect(() => {
    storage.set(KEYS.collections, collections);
  }, [collections]);
  const createCollection = useCallback((name: string, initialEventId?: string) => {
    const c: Collection = {
      id: `c_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim() || "Untitled collection",
      eventIds: initialEventId ? [initialEventId] : [],
      createdAt: Date.now(),
    };
    setCollections((cs) => [...cs, c]);
    return c;
  }, []);
  const renameCollection = useCallback((id: string, name: string) => {
    setCollections((cs) => cs.map((c) => (c.id === id ? { ...c, name: name.trim() || c.name } : c)));
  }, []);
  const deleteCollection = useCallback((id: string) => setCollections((cs) => cs.filter((c) => c.id !== id)), []);
  const toggleInCollection = useCallback((collectionId: string, eventId: string) => {
    setCollections((cs) =>
      cs.map((c) =>
        c.id !== collectionId ? c : {
          ...c,
          eventIds: c.eventIds.includes(eventId) ? c.eventIds.filter((x) => x !== eventId) : [...c.eventIds, eventId],
        },
      ),
    );
  }, []);

  const value = useMemo<AppState>(
    () => ({
      today, theme, resolvedTheme, glass, setTheme, favorites, isFavorite, toggleFavorite,
      collections, createCollection, renameCollection, deleteCollection, toggleInCollection, toasts, notify,
    }),
    [today, theme, resolvedTheme, glass, setTheme, favorites, isFavorite, toggleFavorite, collections, createCollection,
      renameCollection, deleteCollection, toggleInCollection, toasts, notify],
  );
  const filterMemory = useMemo(() => ({ filterQuery, setFilterQuery }), [filterQuery, setFilterQuery]);
  return (
    <Ctx.Provider value={value}>
      <FilterCtx.Provider value={filterMemory}>{children}</FilterCtx.Provider>
    </Ctx.Provider>
  );
}

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside <AppProvider>");
  return v;
}

/** The session's remembered discovery filters (see FilterMemory). */
export function useFilterMemory(): FilterMemory {
  const v = useContext(FilterCtx);
  if (!v) throw new Error("useFilterMemory must be used inside <AppProvider>");
  return v;
}
