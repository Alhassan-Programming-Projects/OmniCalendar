import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function SectionHeader({ title, subtitle, to, linkLabel = "See all", action, id }: {
  title: string; subtitle?: string; to?: string; linkLabel?: string; action?: ReactNode; id?: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id={id} className="section-title">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
      {to && (
        <Link to={to} className="group inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold text-primary hover:bg-primary-soft">
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}
