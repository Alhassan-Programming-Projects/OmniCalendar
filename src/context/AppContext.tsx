import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Collection, ThemePreference } from "@/types";
import { storage } from "@/lib/utils";
import { startOfDay } from "@/lib/dates";

const KEYS = {
  theme: "omnicalendar:theme",
  favorites: "omnicalendar:favorites",
  collections: "omnicalendar:collections",
};

interface Toast { id: number; message: string }

interface AppState {
  today: Date;
  theme: ThemePreference;
  resolvedTheme: "light" | "dark";
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

const Ctx = createContext<AppState | null>(null);

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
      return t === "light" || t === "dark" ? t : "system";
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
  const resolvedTheme = theme === "system" ? (sysDark ? "dark" : "light") : theme;
  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", resolvedTheme === "dark" ? "#111214" : "#f8f9fb");
  }, [resolvedTheme]);
  const setTheme = useCallback((t: ThemePreference) => {
    setThemeState(t);
    // Stored as a raw string so the pre-paint script in index.html can read it.
    try { localStorage.setItem(KEYS.theme, t); } catch { /* ignore */ }
  }, []);

  // ---- toasts ----
  const [toasts, setToasts] = useState<Toast[]>([]);
  const notify = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, message }]);
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
      today, theme, resolvedTheme, setTheme, favorites, isFavorite, toggleFavorite,
      collections, createCollection, renameCollection, deleteCollection, toggleInCollection, toasts, notify,
    }),
    [today, theme, resolvedTheme, setTheme, favorites, isFavorite, toggleFavorite, collections, createCollection,
      renameCollection, deleteCollection, toggleInCollection, toasts, notify],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside <AppProvider>");
  return v;
}
