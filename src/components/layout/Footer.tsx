import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { EVENTS } from "@/data/events";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-band pb-28 pt-12 lg:pb-12">
      <div className="container-page flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm text-muted">Every Day Has a Story. {EVENTS.length} special days, each with its recognition level and sources.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <Link to="/calendar?view=year" className="hover:text-fg">Year at a Glance</Link>
          <Link to="/explore" className="hover:text-fg">Explore</Link>
          <Link to="/categories" className="hover:text-fg">Categories</Link>
          <Link to="/about" className="hover:text-fg">About the data</Link>
        </nav>
      </div>
      <p className="container-page mt-10 border-t border-border/60 pt-6 text-xs text-muted">
        Dates for lunar observances are estimates and may vary by country. Always check official sources for public-holiday announcements.
      </p>
    </footer>
  );
}
