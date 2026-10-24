import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
        <Icon className="size-7" aria-hidden />
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      {children && <div className="mt-2 max-w-sm text-sm text-muted">{children}</div>}
    </div>
  );
}
