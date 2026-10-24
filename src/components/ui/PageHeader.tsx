import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared header band for inner pages: eyebrow, title, description and optional actions.
 * Sits on the `.page-hero` surface so every page opens with the same rhythm as the home hero.
 */
export function PageHeader({ eyebrow, title, description, actions, children, className, wash }: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Optional Tailwind gradient stops (e.g. a category tile) layered very softly behind the header. */
  wash?: string;
}) {
  return (
    <header className={cn("page-hero", className)}>
      {wash && <div className={cn("pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br opacity-60 dark:opacity-35", wash)} aria-hidden />}
      <div className="container-page pb-8 pt-8 sm:pb-10 sm:pt-12">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
          <div className="mr-auto min-w-0 max-w-3xl">
            {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
            <h1 className="page-title">{title}</h1>
            {description && <p className="lead mt-2">{description}</p>}
          </div>
          {actions}
        </div>
        {children}
      </div>
    </header>
  );
}
