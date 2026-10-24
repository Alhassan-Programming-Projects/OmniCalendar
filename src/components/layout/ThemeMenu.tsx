import { useEffect, useRef, useState } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { ThemePreference } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const OPTIONS: { id: ThemePreference; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

export function ThemeMenu() {
  const { theme, resolvedTheme, setTheme } = useApp();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    const i = OPTIONS.findIndex((o) => o.id === theme);
    setTimeout(() => items.current[i]?.focus(), 0);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open, theme]);

  const Icon = resolvedTheme === "dark" ? Moon : Sun;
  return (
    <div className="relative" ref={root}>
      <Button variant="ghost" size="icon" aria-haspopup="menu" aria-expanded={open} aria-label={`Theme: ${theme}`} onClick={() => setOpen((o) => !o)}>
        <Icon />
      </Button>
      {open && (
        <div
          role="menu"
          aria-label="Theme"
          className="glass absolute right-0 top-12 z-50 w-44 animate-fade-up rounded-2xl p-1.5"
          onKeyDown={(e) => {
            const idx = items.current.findIndex((el) => el === document.activeElement);
            if (e.key === "ArrowDown") { e.preventDefault(); items.current[(idx + 1) % OPTIONS.length]?.focus(); }
            if (e.key === "ArrowUp") { e.preventDefault(); items.current[(idx - 1 + OPTIONS.length) % OPTIONS.length]?.focus(); }
          }}
        >
          {OPTIONS.map((o, i) => (
            <button
              key={o.id}
              ref={(el) => { items.current[i] = el; }}
              role="menuitemradio"
              aria-checked={theme === o.id}
              onClick={() => { setTheme(o.id); setOpen(false); }}
              className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:ring-0", theme === o.id && "font-semibold text-primary")}
            >
              <o.icon className="size-4" aria-hidden />
              <span className="flex-1 text-left">{o.label}</span>
              {theme === o.id && <Check className="size-4" aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
