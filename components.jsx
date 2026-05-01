// components.jsx — shared primitives for ZoKioZhi portfolio
// Buttons, cards, badges, sparkles, section frame, icons.

const { useEffect, useRef, useState } = React;

/* ─────────────────────────────────────────────────────────────
   ICONS — minimal, rounded line-set. 1.5px stroke @24px.
   ───────────────────────────────────────────────────────────── */
const iconBase = {
  width: 20, height: 20, viewBox: "0 0 24 24",
  fill: "none", stroke: "currentColor", strokeWidth: 1.7,
  strokeLinecap: "round", strokeLinejoin: "round",
};
const Icon = {
  Spark: (p) => (<svg {...iconBase} {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></svg>),
  Heart: (p) => (<svg {...iconBase} {...p}><path d="M20.8 8.6a5.4 5.4 0 0 0-9.3-3.7 5.4 5.4 0 0 0-9.3 3.7c0 6.4 9.3 11.4 9.3 11.4s9.3-5 9.3-11.4Z" /></svg>),
  Mail: (p) => (<svg {...iconBase} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>),
  Image: (p) => (<svg {...iconBase} {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m4 18 5-5 4 4 3-3 4 4" /></svg>),
  Check: (p) => (<svg {...iconBase} {...p}><path d="m5 12 5 5 9-11" /></svg>),
  X: (p) => (<svg {...iconBase} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>),
  Arrow: (p) => (<svg {...iconBase} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>),
  Twitter: (p) => (<svg {...iconBase} {...p}><path d="M22 5.8c-.7.3-1.5.5-2.4.6.9-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7C8.3 8.6 5.2 7 3.1 4.5 2 6.4 2.6 8.7 4.4 9.9c-.7 0-1.3-.2-1.9-.5 0 2 1.4 3.7 3.3 4.1-.6.2-1.2.2-1.9.1.5 1.6 2 2.8 3.8 2.8A8.2 8.2 0 0 1 2 18.1 11.6 11.6 0 0 0 8.3 20c7.5 0 11.6-6.2 11.6-11.6v-.5c.8-.6 1.5-1.3 2.1-2.1Z" /></svg>),
  Telegram: (p) => (<svg {...iconBase} {...p}><path d="M21.5 4 2.6 11.3c-.9.3-.9 1.5 0 1.8l4.5 1.4 1.7 5.4c.2.7 1.1.9 1.6.4l2.5-2.4 4.7 3.4c.6.4 1.4.1 1.5-.6L22 5.4c.1-.8-.7-1.4-1.5-1Zm-3.7 4.5L9.3 16l-.4 3-1.3-4.2 10.2-6.3Z" /></svg>),
  Discord: (p) => (<svg {...iconBase} {...p}><path d="M19 5.5A16 16 0 0 0 15 4l-.4.7a13 13 0 0 0-5.2 0L9 4a16 16 0 0 0-4 1.5C2.5 9 1.8 12.4 2 15.7a16 16 0 0 0 5 2.5l.6-.9c-1-.3-1.9-.8-2.6-1.4l.5-.4c2 1 4.2 1.5 6.5 1.5s4.5-.5 6.5-1.5l.5.4c-.7.6-1.6 1-2.6 1.4l.6.9a16 16 0 0 0 5-2.5c.3-3.6-.5-7-3-10.2Zm-9.4 8c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Zm4.8 0c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Z" /></svg>),
  Bluesky: (p) => (<svg {...iconBase} {...p}><path d="M6.5 4c2.5 1.4 4.4 4 5.5 6 1.1-2 3-4.6 5.5-6 1.5-.8 4.5-1.5 4.5 2 0 .7-.4 5.6-.6 6.4-.7 2.7-3.5 3.4-6 3 4.4.7 5.5 3.2 3.1 5.7-4.5 4.7-6.5-1.2-7-2.7-.5 1.5-2.5 7.4-7 2.7-2.4-2.5-1.3-5 3.1-5.7-2.5.4-5.3-.3-6-3-.2-.8-.6-5.7-.6-6.4 0-3.5 3-2.8 4.5-2Z" /></svg>),
  Clock: (p) => (<svg {...iconBase} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>),
  Shield: (p) => (<svg {...iconBase} {...p}><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3Z" /></svg>),
  ChevronDown: (p) => (<svg {...iconBase} {...p}><path d="m6 9 6 6 6-6" /></svg>),
  Sun: (p) => (<svg {...iconBase} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>),
  Moon: (p) => (<svg {...iconBase} {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>),
};

/* ─────────────────────────────────────────────────────────────
   BUTTON
   ───────────────────────────────────────────────────────────── */
function Button({ kind = "primary", size = "md", href, children, icon, onClick, type, ariaLabel, style: styleOverride, ...rest }) {
  const styles = {
    base: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      borderRadius: "var(--r-pill)",
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      letterSpacing: "-0.005em",
      border: "1px solid transparent",
      transition: "transform var(--d-2) var(--ease-squish), background var(--d-2) var(--ease-out), box-shadow var(--d-2) var(--ease-out), color var(--d-2) var(--ease-out)",
      whiteSpace: "nowrap",
      userSelect: "none",
    },
    sizes: {
      sm: { padding: "8px 16px", fontSize: 14 },
      md: { padding: "12px 22px", fontSize: 15 },
      lg: { padding: "16px 28px", fontSize: 16 },
    },
    kinds: {
      primary: {
        background: "var(--charcoal)",
        color: "var(--pink-soft)",
        boxShadow: "var(--shadow-md)",
      },
      gold: {
        background: "linear-gradient(180deg, #f5cd72 0%, #e9b346 100%)",
        color: "#3e2c0a",
        boxShadow: "var(--shadow-glow-gold)",
        borderColor: "rgba(212, 162, 61, 0.6)",
      },
      ghost: {
        background: "transparent",
        color: "var(--charcoal)",
        borderColor: "var(--charcoal)",
      },
      light: {
        background: "var(--surface)",
        color: "var(--charcoal)",
        boxShadow: "var(--shadow-sm)",
        borderColor: "rgba(62,63,65,0.08)",
      },
    },
  };

  const Comp = href ? "a" : "button";
  const handleHoverIn = (e) => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; };
  const handleHoverOut = (e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; };
  const handleDown = (e) => { e.currentTarget.style.transform = "translateY(0) scale(0.98)"; };
  const handleUp = (e) => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; };

  return (
    <Comp
      href={href}
      onClick={onClick}
      type={type}
      aria-label={ariaLabel}
      onMouseEnter={handleHoverIn}
      onMouseLeave={handleHoverOut}
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      style={{ ...styles.base, ...styles.sizes[size], ...styles.kinds[kind], ...(styleOverride || {}) }}
      {...rest}
    >
      {children}
      {icon && <span style={{ display: "inline-flex" }}>{icon}</span>}
    </Comp>
  );
}

/* ─────────────────────────────────────────────────────────────
   STATUS PILL — open / limited / closed
   ───────────────────────────────────────────────────────────── */
function StatusPill({ status, onDark = false }) {
  const cfg = {
    open: { dot: "#9bc474", label: "Commissions open", bg: onDark ? "rgba(155,196,116,0.18)" : "rgba(122,160,92,0.12)", color: onDark ? "#c8e0a4" : "#3f5a26" },
    limited: { dot: "var(--gold)", label: "Limited slots", bg: onDark ? "rgba(240,191,89,0.18)" : "var(--gold-tint)", color: onDark ? "var(--gold)" : "#6b4d12" },
    closed: { dot: "#c4c2c0", label: "Commissions closed", bg: onDark ? "rgba(252,239,240,0.12)" : "rgba(168,166,164,0.18)", color: onDark ? "rgba(252,239,240,0.85)" : "var(--charcoal)" },
  }[status] || {};
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "6px 12px 6px 10px",
      borderRadius: "var(--r-pill)",
      background: cfg.bg, color: cfg.color,
      fontSize: 13, fontWeight: 600, letterSpacing: "0.01em",
      border: onDark ? "1px solid rgba(252,239,240,0.12)" : "1px solid rgba(62,63,65,0.06)",
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: 999, background: cfg.dot,
        boxShadow: status === "open" ? "0 0 0 0 rgba(122,160,92,0.5)" : "none",
        animation: status === "open" ? "pill-pulse 2.4s ease-out infinite" : "none",
      }} />
      {cfg.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   BADGE — small purple/gold/neutral chip
   ───────────────────────────────────────────────────────────── */
function Badge({ tone = "neutral", children, icon }) {
  const tones = {
    neutral: { bg: "rgba(62,63,65,0.06)", color: "var(--charcoal)" },
    purple: { bg: "var(--purple-tint)", color: "var(--purple)" },
    gold: { bg: "var(--gold-tint)", color: "#6b4d12" },
    pink: { bg: "var(--pink)", color: "var(--charcoal)" },
  }[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px",
      fontSize: 12, fontWeight: 600, letterSpacing: "0.02em",
      borderRadius: "var(--r-pill)",
      ...tones,
    }}>
      {icon}{children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   SPARKLES — signature ambient animation around hero avatar
   ───────────────────────────────────────────────────────────── */
function Sparkles({ count = 8, enabled = true }) {
  if (!enabled) return null;
  const items = Array.from({ length: count }).map((_, i) => {
    const left = 10 + Math.random() * 80;
    const top = 10 + Math.random() * 80;
    const size = 6 + Math.random() * 8;
    const delay = -Math.random() * 4;
    const dx = (Math.random() - 0.5) * 28;
    const dy = -16 - Math.random() * 24;
    const tone = Math.random() > 0.5 ? "var(--gold)" : "var(--purple-soft)";
    return (
      <span key={i} style={{
        position: "absolute",
        left: `${left}%`, top: `${top}%`,
        width: size, height: size,
        color: tone,
        animation: `sparkle-drift 4s ${delay}s ease-out infinite`,
        ["--dx"]: `${dx}px`, ["--dy"]: `${dy}px`,
        pointerEvents: "none",
      }}>
        <svg viewBox="0 0 16 16" width={size} height={size}>
          <path d="M8 0c.6 3.6 3.4 6.4 7 7-3.6.6-6.4 3.4-7 7-.6-3.6-3.4-6.4-7-7 3.6-.6 6.4-3.4 7-7Z" fill="currentColor" />
        </svg>
      </span>
    );
  });
  return <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>{items}</div>;
}

/* ─────────────────────────────────────────────────────────────
   IntersectionObserver hook — adds .in to .reveal elements
   ───────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────────────────────
   PLACEHOLDER ART — soft striped gradient with mono caption.
   Used for gallery tiles since we don't have real images.
   ───────────────────────────────────────────────────────────── */
function ArtPlaceholder({ label, hue = 0, ratio = "1/1" }) {
  // Stay in palette: alternate pink / cream / purple-tint / gold-tint backgrounds.
  const palettes = [
    { bg: "linear-gradient(135deg, #fceff0 0%, #eedddf 100%)", stripe: "rgba(143,43,163,0.08)" },
    { bg: "linear-gradient(135deg, #f0e2f3 0%, #eedddf 100%)", stripe: "rgba(62,63,65,0.06)" },
    { bg: "linear-gradient(135deg, #faecc9 0%, #fceff0 100%)", stripe: "rgba(212,162,61,0.18)" },
    { bg: "linear-gradient(135deg, #eedddf 0%, #f7eeea 100%)", stripe: "rgba(143,43,163,0.08)" },
  ];
  const p = palettes[hue % palettes.length];
  return (
    <div style={{
      position: "relative",
      aspectRatio: ratio,
      width: "100%",
      borderRadius: "var(--r-lg)",
      background: p.bg,
      backgroundImage: `${p.bg}, repeating-linear-gradient(135deg, transparent 0 14px, ${p.stripe} 14px 15px)`,
      overflow: "hidden",
      display: "flex", alignItems: "flex-end",
    }}>
      <div style={{
        margin: 14, padding: "5px 10px",
        fontFamily: "var(--font-mono)", fontSize: 11,
        background: "rgba(255,255,255,0.7)", color: "var(--charcoal)",
        borderRadius: 999, letterSpacing: "0.02em",
        backdropFilter: "blur(4px)",
      }}>
        {label}
      </div>
    </div>
  );
}

Object.assign(window, {
  Icon, Button, StatusPill, Badge, Sparkles, useReveal, ArtPlaceholder,
});
