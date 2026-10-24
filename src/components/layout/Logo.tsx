import { Link } from "react-router-dom";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-full" aria-label="OmniCalendar home">
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" aria-hidden>
        <rect x="3" y="6" width="34" height="31" rx="9" className="fill-primary" />
        <rect x="3" y="6" width="34" height="10" rx="5" className="fill-primary" opacity=".55" />
        <circle cx="14" cy="26" r="3.5" fill="#fbbc04" />
        <circle cx="26" cy="26" r="3.5" fill="#fff" opacity=".95" />
        <rect x="11" y="2" width="4" height="9" rx="2" className="fill-fg" opacity=".75" />
        <rect x="25" y="2" width="4" height="9" rx="2" className="fill-fg" opacity=".75" />
      </svg>
      {!compact && (
        <span className="font-display text-lg font-extrabold tracking-tight">
          Omni<span className="text-primary">Calendar</span>
        </span>
      )}
    </Link>
  );
}
