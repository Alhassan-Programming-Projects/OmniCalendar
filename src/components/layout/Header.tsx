import { useState, type FormEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, Compass, Heart, Home, LayoutGrid, Search, Shuffle } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeMenu } from "./ThemeMenu";
import { Button } from "@/components/ui/Button";
import { useSurprise } from "@/hooks/useSurprise";
import { useApp, useFilterMemory } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { useChangeKey } from "@/lib/motion";
import { filtersToQuery, parseFilters } from "@/lib/filters";

/** Calendar and Explore links carry the session's filters, so switching views keeps the selection. */
export function navTarget(to: string, filterQuery: string) {
  return filterQuery && (to === "/calendar" || to === "/explore") ? `${to}?${filterQuery}` : to;
}

export const NAV = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/categories", label: "Categories", icon: LayoutGrid },
  { to: "/favorites", label: "Favorites", icon: Heart },
];

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const surprise = useSurprise();
  const { favorites, today } = useApp();
  const { filterQuery } = useFilterMemory();
  const favPulse = useChangeKey(favorites.length);
  const [q, setQ] = useState("");
  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    // Keep the session's filters (region, categories…) so results stay consistent with the calendar.
    const query = filtersToQuery({ ...parseFilters(new URLSearchParams(filterQuery), today), q: q.trim() });
    navigate(`/explore${query ? `?${query}` : ""}`);
  };
  const showHeaderSearch = location.pathname !== "/" && location.pathname !== "/explore";

  return (
    <header className="app-bar sticky top-0 z-40 border-b border-border/60 bg-bg/75 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-bg/65">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-fg">
        Skip to content
      </a>
      <div className="app-bar-inner container-page flex h-16 items-center gap-3">
        <Logo />
        <nav aria-label="Main" className="ml-4 hidden items-center gap-0.5 lg:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={navTarget(n.to, filterQuery)}
              end={n.end}
              className={({ isActive }) =>
                cn("pressable relative rounded-full px-3.5 py-2 text-sm font-medium", isActive ? "bg-primary-soft font-semibold text-primary" : "text-muted hover:bg-fg/[.06] hover:text-fg")
              }
            >
              {n.label}
              {n.to === "/favorites" && favorites.length > 0 && (
                <span key={favPulse} className={cn("ml-1.5 inline-block rounded-full bg-primary px-1.5 py-px text-[10px] font-bold text-primary-fg", favPulse > 0 && "animate-pop")}>{favorites.length}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          {showHeaderSearch && (
            <form role="search" onSubmit={onSearch} className="relative mr-1 hidden md:block">
              <label htmlFor="header-search" className="sr-only">Search special days</label>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <input
                id="header-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search special days"
                className="field field-pill w-56 bg-surface-2/80 pl-9 shadow-none transition-all focus:w-72 focus:bg-surface"
              />
            </form>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search" onClick={() => navigate("/explore")}>
            <Search />
          </Button>
          <Button variant="secondary" size="md" onClick={surprise} className="hidden sm:inline-flex" title="Discover a random special day">
            <Shuffle /> Surprise me
          </Button>
          <Button variant="ghost" size="icon" onClick={surprise} className="sm:hidden" aria-label="Surprise me — open a random special day">
            <Shuffle />
          </Button>
          <ThemeMenu />
        </div>
      </div>
    </header>
  );
}

/** Floating glass tab bar for small screens. */
export function MobileNav() {
  const { favorites } = useApp();
  const { filterQuery } = useFilterMemory();
  const favPulse = useChangeKey(favorites.length);
  return (
    <nav aria-label="Main" className="glass fixed inset-x-3 bottom-3 z-40 rounded-3xl px-1.5 py-1.5 lg:hidden" style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}>
      <ul className="grid grid-cols-5">
        {NAV.map((n) => (
          <li key={n.to}>
            <NavLink
              to={navTarget(n.to, filterQuery)}
              end={n.end}
              className={({ isActive }) =>
                cn("pressable relative flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[11px] font-medium", isActive ? "bg-primary-soft text-primary" : "text-muted")
              }
            >
              <n.icon className="size-5" aria-hidden />
              {n.label}
              {n.to === "/favorites" && favorites.length > 0 && (
                <span key={favPulse} className={cn("absolute right-[18%] top-0.5 min-w-4 rounded-full bg-primary px-1 text-center text-[9px] font-bold leading-4 text-primary-fg", favPulse > 0 && "animate-pop")}>{favorites.length}</span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
