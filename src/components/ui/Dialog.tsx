import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "./Button";
import { usePresence } from "@/lib/motion";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

/** Accessible modal: focus trap, Esc to close, scroll lock, focus restore. */
export function Dialog({ open, onClose, title, description, children }: DialogProps) {
  const panel = useRef<HTMLDivElement>(null);
  const presence = usePresence(open);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(panel.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? [])
        .filter((el) => !el.hasAttribute("disabled"));
    setTimeout(() => (focusables()[1] ?? focusables()[0])?.focus(), 10);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open, onClose]);

  if (!presence.mounted) return null;
  return createPortal(
    <div className={`fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 ${open ? "" : "pointer-events-none"}`}>
      <div data-state={presence.state} className="dialog-scrim motion-scrim absolute inset-0 bg-black/40 backdrop-blur-[2px] dark:bg-black/60" onClick={onClose} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        data-state={presence.state}
        className="dialog-panel motion-dialog relative w-full max-w-md origin-bottom rounded-t-3xl border border-border/80 bg-surface p-6 shadow-float sm:rounded-3xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="dialog-title" className="text-lg font-bold">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close dialog"><X /></Button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
