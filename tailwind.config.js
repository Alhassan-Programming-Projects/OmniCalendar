/** @type {import('tailwindcss').Config} */
// All colours, shadows and radii resolve to CSS variables defined in src/index.css,
// so the light and dark themes can be tuned independently without touching components.
// Surfaces carry an opacity multiplier (--surface-alpha etc., default 1) that the Liquid Glass
// theme lowers, turning every panel translucent from one place.
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        band: "rgb(var(--band) / calc(<alpha-value> * var(--band-alpha, 1)))",
        surface: "rgb(var(--surface) / calc(<alpha-value> * var(--surface-alpha, 1)))",
        "surface-2": "rgb(var(--surface-2) / calc(<alpha-value> * var(--surface-2-alpha, 1)))",
        "surface-3": "rgb(var(--surface-3) / calc(<alpha-value> * var(--surface-3-alpha, 1)))",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: {
          DEFAULT: "rgb(var(--border) / <alpha-value>)",
          strong: "rgb(var(--border-strong) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          fg: "rgb(var(--primary-fg) / <alpha-value>)",
          soft: "rgb(var(--primary-soft) / <alpha-value>)",
        },
        accent: "rgb(var(--accent) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
      },
      // Radius scale: md = controls, xl = tiles/inputs, 2xl = cards, 3xl = feature panels.
      borderRadius: { md: "0.625rem", xl: "0.875rem", "2xl": "1.25rem", "3xl": "1.75rem" },
      boxShadow: {
        card: "var(--shadow-card)",
        lift: "var(--shadow-lift)",
        float: "var(--shadow-float)",
        control: "var(--shadow-control)",
      },
      // Motion: short, ease-out, no overshoot beyond a single soft "pop" for confirmations.
      // Enter ≤ 260ms, exit ≤ 120ms, so nothing ever waits on an animation.
      transitionTimingFunction: {
        out: "cubic-bezier(.2,.7,.2,1)",
        "in-out": "cubic-bezier(.4,0,.2,1)",
      },
      keyframes: {
        "fade-up": { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "none" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-out": { from: { opacity: "1" }, to: { opacity: "0" } },
        "page-in": { from: { opacity: "0", transform: "translateY(4px)" }, to: { opacity: "1", transform: "none" } },
        "menu-in": { from: { opacity: "0", transform: "translateY(-4px) scale(.97)" }, to: { opacity: "1", transform: "none" } },
        "menu-out": { from: { opacity: "1", transform: "none" }, to: { opacity: "0", transform: "translateY(-2px) scale(.98)" } },
        "dialog-in": { from: { opacity: "0", transform: "translateY(8px) scale(.98)" }, to: { opacity: "1", transform: "none" } },
        "dialog-out": { from: { opacity: "1", transform: "none" }, to: { opacity: "0", transform: "translateY(4px) scale(.98)" } },
        "sheet-in": { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "none" } },
        "sheet-out": { from: { opacity: "1", transform: "none" }, to: { opacity: "0", transform: "translateY(16px)" } },
        "toast-out": { from: { opacity: "1", transform: "none" }, to: { opacity: "0", transform: "translateY(6px) scale(.98)" } },
        "slide-next": { from: { opacity: ".35", transform: "translateX(14px)" }, to: { opacity: "1", transform: "none" } },
        "slide-prev": { from: { opacity: ".35", transform: "translateX(-14px)" }, to: { opacity: "1", transform: "none" } },
        pop: { "0%": { transform: "scale(.86)" }, "60%": { transform: "scale(1.06)" }, "100%": { transform: "scale(1)" } },
        heart: { "0%": { transform: "scale(1)" }, "35%": { transform: "scale(1.28)" }, "100%": { transform: "scale(1.1)" } },
        burst: { from: { opacity: ".45", transform: "scale(.55)" }, to: { opacity: "0", transform: "scale(1.5)" } },
      },
      animation: {
        "fade-up": "fade-up .32s cubic-bezier(.2,.7,.2,1) both",
        "fade-in": "fade-in .18s ease-out both",
        "fade-out": "fade-out .12s ease-in both",
        "page-in": "page-in .22s cubic-bezier(.2,.7,.2,1) both",
        "menu-in": "menu-in .16s cubic-bezier(.2,.7,.2,1) both",
        "menu-out": "menu-out .12s ease-in both",
        "dialog-in": "dialog-in .2s cubic-bezier(.2,.7,.2,1) both",
        "dialog-out": "dialog-out .12s ease-in both",
        "sheet-in": "sheet-in .24s cubic-bezier(.2,.7,.2,1) both",
        "sheet-out": "sheet-out .12s ease-in both",
        "toast-out": "toast-out .2s ease-in both",
        "slide-next": "slide-next .22s cubic-bezier(.2,.7,.2,1) both",
        "slide-prev": "slide-prev .22s cubic-bezier(.2,.7,.2,1) both",
        pop: "pop .22s cubic-bezier(.2,.7,.2,1) both",
        heart: "heart .26s cubic-bezier(.2,.7,.2,1) both",
        burst: "burst .3s cubic-bezier(.2,.7,.2,1) both",
      },
    },
  },
  plugins: [],
};
