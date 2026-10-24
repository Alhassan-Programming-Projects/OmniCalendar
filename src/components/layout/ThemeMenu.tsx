import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check, Droplet, Monitor, Moon, Sun } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { ThemePreference } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useChangeKey, usePresence } from "@/lib/motion";

const OPTIONS: { id: ThemePreference; label: string; hint?: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "glass", label: "Liquid Glass", hint: "Translucent · follows system light/dark", icon: Droplet },
  { id: "system", label: "System", hint: "Match device setting", icon: Monitor },
];
const LABELS: Record<ThemePreference, string> = { light: "Light", dark: "Dark", glass: "Liquid Glass", system: "System" };

export function ThemeMenu() {
  const { theme, resolvedTheme, glass, setTheme } = useApp();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);
  // Focus the current option synchronously as the menu opens, so an arrow key pressed straight away
  // already moves within the menu (a deferred focus let early keys land on the trigger button).
  useLayoutEffect(() => {
    if (open) items.current[OPTIONS.findIndex((o) => o.id === theme)]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const menu = usePresence(open);
  const changed = useChangeKey(theme);
  const Icon = glass ? Droplet : resolvedTheme === "dark" ? Moon : Sun;
  return (
    <div className="relative" ref={root}>
      <Button variant="ghost" size="icon" aria-haspopup="menu" aria-expanded={open} aria-label={`Theme: ${LABELS[theme]}`} title={`Theme: ${LABELS[theme]}`} onClick={() => setOpen((o) => !o)}>
        {/* Icon swaps with a quick pop so the change of theme is confirmed at the control itself. */}
        <Icon key={changed} className={changed ? "animate-pop" : undefined} />
      </Button>
      {menu.mounted && (
        <div
          role="menu"
          aria-label="Theme"
          data-state={menu.state}
          className="glass motion-menu absolute right-0 top-12 z-50 w-60 origin-top-right rounded-2xl p-1.5"
          onKeyDown={(e) => {
            const idx = items.current.findIndex((el) => el === document.activeElement);
            if (e.key === "ArrowDown") { e.preventDefault(); items.current[(idx + 1) % OPTIONS.length]?.focus(); }
            if (e.key === "ArrowUp") { e.preventDefault(); items.current[(idx - 1 + OPTIONS.length) % OPTIONS.length]?.focus(); }
          }}
        >
          <div className="meta-label px-3 pb-1.5 pt-1.5" aria-hidden>Appearance</div>
          {OPTIONS.map((o, i) => (
            <Fragment key={o.id}>
            {o.id === "system" && <div role="separator" className="mx-2 my-1 h-px bg-border/70" />}
            <button
              ref={(el) => { items.current[i] = el; }}
              role="menuitemradio"
              aria-checked={theme === o.id}
              onClick={() => { setTheme(o.id); setOpen(false); }}
              className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-fg/[.06] focus-visible:bg-fg/[.06] focus-visible:ring-0", theme === o.id && "font-semibold text-primary")}
            >
              <o.icon className="size-4" aria-hidden />
              <span className="flex-1 text-left">
                {o.label}
                {o.hint && <span className="block text-[11px] font-normal leading-tight text-muted">{o.hint}</span>}
              </span>
              {theme === o.id && <Check className="size-4" aria-hidden />}
            </button>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
