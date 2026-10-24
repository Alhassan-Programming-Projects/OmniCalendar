import { useState, type FormEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, Compass, Heart, Home, LayoutGrid, Search, Shuffle } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeMenu } from "./ThemeMenu";
import { Button } from "@/components/ui/Button";
import { useSurprise } from "@/hooks/useSurprise";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

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
  const { favorites } = useApp();
  const [q, setQ] = useState("");
  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/explore${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
  };
  const showHeaderSearch = location.pathname !== "/" && location.pathname !== "/explore";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/80 backdrop-blur-xl">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-fg">
        Skip to content
      </a>
      <div className="container-page flex h-16 items-center gap-3">
        <Logo />
        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn("relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors", isActive ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-2 hover:text-fg")
              }
            >
              {n.label}
              {n.to === "/favorites" && favorites.length > 0 && (
                <span className="ml-1.5 rounded-full bg-primary px-1.5 py-px text-[10px] font-bold text-primary-fg">{favorites.length}</span>
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
                className="h-10 w-56 rounded-full border border-transparent bg-surface-2 pl-9 pr-3 text-sm outline-none transition-all focus:w-72 focus:border-primary focus:bg-surface"
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
  return (
    <nav aria-label="Main" className="glass fixed inset-x-3 bottom-3 z-40 rounded-3xl px-1.5 py-1.5 lg:hidden" style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}>
      <ul className="grid grid-cols-5">
        {NAV.map((n) => (
          <li key={n.to}>
            <NavLink
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn("relative flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[11px] font-medium transition-colors", isActive ? "bg-primary-soft text-primary" : "text-muted")
              }
            >
              <n.icon className="size-5" aria-hidden />
              {n.label}
              {n.to === "/favorites" && favorites.length > 0 && (
                <span className="absolute right-[18%] top-0.5 min-w-4 rounded-full bg-primary px-1 text-center text-[9px] font-bold leading-4 text-primary-fg">{favorites.length}</span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
