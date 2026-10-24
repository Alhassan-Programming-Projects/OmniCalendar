import { createElement, useEffect, useRef, useState, type ElementType, type HTMLAttributes, type ReactNode } from "react";

/**
 * Motion helpers. All timing lives in CSS (see the motion tokens in index.css);
 * these hooks only decide *when* a state applies. Durations here must match the
 * exit keyframes so elements unmount right as their exit animation ends.
 */

export const EXIT_MS = 120;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Keep an element mounted long enough to play its exit animation.
 * Returns `mounted` (render it?) and `state` for a `data-state` attribute.
 */
export function usePresence(open: boolean, exitMs = EXIT_MS) {
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) { setMounted(true); return; }
    if (prefersReducedMotion()) { setMounted(false); return; }
    const t = setTimeout(() => setMounted(false), exitMs);
    return () => clearTimeout(t);
  }, [open, exitMs]);
  // State flips in the same render as `open`, so the exit starts on the very next frame.
  return { mounted: mounted || open, state: open ? "open" : "closed" } as const;
}

/**
 * Returns a key that changes whenever `value` changes — but not on first render —
 * so feedback animations (badge pop, heart pulse) play only in response to user actions.
 */
export function useChangeKey(value: unknown) {
  const first = useRef(true);
  const [key, setKey] = useState(0);
  const prev = useRef(value);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (prev.current !== value) { prev.current = value; setKey((k) => k + 1); }
  }, [value]);
  return key;
}

/** Remember the previous value of something (e.g. the last shown month, to pick a slide direction). */
export function usePrevious<T>(value: T) {
  const ref = useRef<T>(value);
  const prev = ref.current;
  useEffect(() => { ref.current = value; }, [value]);
  return prev;
}

/**
 * Fades a section in the first time it scrolls into view. Content is visible by default:
 * the hidden starting state only exists in CSS behind `prefers-reduced-motion: no-preference`
 * and `[data-reveal="pending"]`, so no-JS, print and reduced-motion users always see it.
 */
export function Reveal({ as = "div", children, ...rest }: { as?: ElementType; children: ReactNode } & HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"pending" | "shown">(() =>
    typeof IntersectionObserver === "undefined" || prefersReducedMotion() ? "shown" : "pending",
  );
  useEffect(() => {
    if (state === "shown" || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) { setState("shown"); io.disconnect(); }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [state]);
  return createElement(as, { ...rest, ref, "data-reveal": state }, children);
}

/**
 * Enter-animation class for content keyed by `key`: slides forward/back when `order` increases/decreases
 * (e.g. month index), otherwise fades. Decided once per key change, so follow-up renders with the same
 * key keep the class until the element re-keys — the animation is never cut short.
 */
export function useKeyedTransition(key: string, order: number): string {
  const ref = useRef({ key, order, cls: "" });
  if (ref.current.key !== key) {
    const prev = ref.current;
    const cls = order === prev.order ? "animate-fade-in" : order > prev.order ? "animate-slide-next" : "animate-slide-prev";
    ref.current = { key, order, cls };
  }
  return ref.current.cls;
}
