// app.jsx — RuzOwl commission portfolio
// Single-page flow: nav → hero → gallery → prices → socials

const { useState, useEffect, useRef } = React;

/* ─────────────────────────────────────────────────────────────
   CONTENT — sourced from repo data + spec
   ───────────────────────────────────────────────────────────── */
const ARTIST = {
  name: "RuzOwl",
  handle: "@ruzowl_red",
  email: "contact@ruzowl.art",
  tagline: "Cozy, character-first illustration & furry commissions.",
  intro: "I'm Ruz! — a furry digital illustrator creating cute and expressive anthropomorphic characters.\nI specialize in commissions.",
  fursonaPalette: [
    { name: "Pink", hex: "#eedddf" },
    { name: "Light pink", hex: "#fceff0" },
    { name: "Charcoal", hex: "#3e3f41" },
    { name: "Purple", hex: "#8f2ba3" },
    { name: "Gold", hex: "#f0bf59" },
    { name: "Gray", hex: "#7a7a7a" },
  ],
  funFacts: ["Brazilian", "Furry artist", "Retro gaming", "Says \"fuzzy pickles\""],
};

const TIERS = [
  {
    id: "icon", name: "Icon", price: 45, currency: "R$",
    blurb: "Social-media-ready avatar. Headshot with full rendering.",
    bullets: ["Full shading", "Headshot Portrait"],
    tone: "neutral",
  },
  {
    id: "halfbody", name: "Half body", price: 50, currency: "R$",
    blurb: "Half body render of your character, full shading, ",
    bullets: ["Full shading", "Half body portrait", "Simple or Detailed background"],
    tone: "purple",
    featured: true,
  },
  {
    id: "fullbody", name: "Full body", price: 70, currency: "R$",
    blurb: "Full render of your character from head to toe.",
    bullets: ["Full shading", "Full body portrait", "Simple or Detailed background"],
    tone: "gold",
  },
];

const SOCIALS = [
  { name: "Twitter / X", handle: "@RuzOwl_Red", url: "https://x.com/ruzowl07", icon: "Twitter" },
  { name: "Telegram", handle: "@RuzOwl", url: "https://t.me/Ruzowl", icon: "Telegram" },
  { name: "Bluesky", handle: "@zokiozhi.bsky.social", url: "https://bsky.app/profile/zokiozhi.bsky.social", icon: "Bluesky" },
  { name: "Discord", handle: "ruzowl06", url: "https://discordapp.com/users/1091136554711388180", icon: "Discord" },
];

const GALLERY_SFW = [
  { src: "assets/gallery/bird.png", label: "Owl study" },
  { src: "assets/gallery/agente.png", label: "Agente" },
  { src: "assets/gallery/laco.png", label: "Ruz · laço" },
  { src: "assets/gallery/photo1.jpg", label: "Magic show" },
  { src: "assets/gallery/illusts.png", label: "Ruz · sticker bust" },
  { src: "assets/gallery/aggzoki.png", label: "Aggzoki" },
  { src: "assets/gallery/illust35.png", label: "Bunny pose" },
  { src: "assets/gallery/photo2.jpg", label: "Tuxedo agent" },
];

const GALLERY_NSFW = [
  { src: "assets/gallery-nsfw/01.jpg", label: "Ruz Owl Ref" },
  { src: "assets/gallery-nsfw/02.png", label: "Zoki + Primia" },
  { src: "assets/gallery-nsfw/03.png", label: "Zoki x Primia" },
  { src: "assets/gallery-nsfw/04.png", label: "Spicy pose" },
  { src: "assets/gallery-nsfw/05.jpg", label: "Nyune x Ruz" },
  { src: "assets/gallery-nsfw/06.jpg", label: "Soft NSFW" },
  { src: "assets/gallery-nsfw/07.jpg", label: "Green Dragon" },
  { src: "assets/gallery-nsfw/08.jpg", label: "Commission" },
];

/* ─────────────────────────────────────────────────────────────
   NAV
   ───────────────────────────────────────────────────────────── */
function Nav({ status, dark, onToggleDark, nsfw, onToggleNsfw }) {
  const [scrolled, setScrolled] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const items = [
    { href: "#gallery", label: "Gallery" },
    { href: "#prices", label: "Prices" },
  ];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: scrolled ? "var(--nav-bg)" : "transparent",
      backdropFilter: scrolled ? "saturate(140%) blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid var(--nav-border)" : "1px solid transparent",
      transition: "all var(--d-3) var(--ease-out)",
    }}>
      <div className="container" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 0", gap: 16,
      }}>
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="assets/ruz.png" alt="" width={34} height={34} style={{ borderRadius: 10, objectFit: "cover" }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20, letterSpacing: "-0.02em" }}>
            RuzOwl
          </span>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, justifyContent: "center" }}>
          <nav className="nav-links" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <a href="#gallery" style={{
              padding: "8px 14px", fontSize: 14, fontWeight: 500,
              borderRadius: "var(--r-pill)", color: "var(--charcoal)",
              transition: "background var(--d-2) var(--ease-out)",
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(62,63,65,0.06)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >Gallery</a>
          </nav>

          <button
            onClick={onToggleNsfw}
            style={{
              padding: "4px 6px",
              background: nsfw ? "var(--purple)" : "var(--surface)",
              color: nsfw ? "#fff" : "var(--gray)",
              border: "1px solid " + (nsfw ? "var(--purple)" : "rgba(62,63,65,0.12)"),
              borderRadius: "var(--r-pill)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: nsfw ? "var(--shadow-glow-purple)" : "var(--shadow-sm)",
              transition: "all var(--d-2) var(--ease-squish)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <div style={{
              width: 24, height: 24, borderRadius: "50%",
              background: nsfw ? "#fff" : "var(--purple-tint)",
              color: nsfw ? "var(--purple)" : "var(--purple)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10,
              transition: "all var(--d-2) var(--ease-out)",
              transform: nsfw ? "translateX(28px)" : "translateX(0)",
            }}>
              {nsfw ? "!" : "18"}
            </div>
            <span style={{
              padding: "0 8px",
              order: nsfw ? -1 : 1,
              transition: "all var(--d-2) var(--ease-out)",
              opacity: 0.8
            }}>
              {nsfw ? "NSFW" : "SFW"}
            </span>
          </button>

          <nav className="nav-links" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <a href="#prices" style={{
              padding: "8px 14px", fontSize: 14, fontWeight: 500,
              borderRadius: "var(--r-pill)", color: "var(--charcoal)",
              transition: "background var(--d-2) var(--ease-out)",
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(62,63,65,0.06)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >Prices</a>
          </nav>
        </div>

        <div className="nav-cta" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <StatusPill status={status} />
          <button
            type="button"
            onClick={onToggleDark}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "Light mode" : "Dark mode"}
            style={{
              width: 38, height: 38,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              background: "var(--surface)",
              color: "var(--charcoal)",
              border: "1px solid rgba(62,63,65,0.08)",
              borderRadius: "var(--r-pill)",
              boxShadow: "var(--shadow-sm)",
              transition: "transform var(--d-2) var(--ease-squish), background var(--d-2) var(--ease-out), color var(--d-2) var(--ease-out)",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "rotate(-12deg) scale(1.06)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "rotate(0deg) scale(1)"; }}
          >
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              transition: "transform var(--d-3) var(--ease-squish), opacity var(--d-2) var(--ease-out)",
              transform: dark ? "rotate(0deg) scale(1)" : "rotate(180deg) scale(0.6)",
              opacity: dark ? 1 : 0,
              position: "absolute",
              color: "var(--gold)",
            }}>
              <Icon.Sun width={18} height={18} />
            </span>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              transition: "transform var(--d-3) var(--ease-squish), opacity var(--d-2) var(--ease-out)",
              transform: !dark ? "rotate(0deg) scale(1)" : "rotate(-180deg) scale(0.6)",
              opacity: !dark ? 1 : 0,
              position: "absolute",
              color: "var(--purple)",
            }}>
              <Icon.Moon width={18} height={18} />
            </span>
          </button>
          <Button kind="primary" size="sm" href="#prices" icon={<Icon.Arrow width={14} height={14} />}>Comissions</Button>
        </div>
      </div>
      <style>{`
        @media (max-width: 820px) {
          .nav-links { display: none !important; }
          .nav-cta > :first-child { display: none; }
        }
      `}</style>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO
   ───────────────────────────────────────────────────────────── */
function Hero({ tweaks }) {
  return (
    <section id="top" style={{ position: "relative", paddingBottom: "var(--s-9)" }}>
      {/* soft decorative blob behind hero */}
      <div aria-hidden style={{
        position: "absolute", inset: "auto 0 0 0", height: 480, top: 60,
        background: "radial-gradient(60% 60% at 30% 40%, rgba(143,43,163,0.10) 0%, rgba(143,43,163,0) 60%), radial-gradient(50% 60% at 80% 30%, rgba(240,191,89,0.18) 0%, rgba(240,191,89,0) 60%)",
        pointerEvents: "none",
      }} />
      <div className="container" style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1.15fr 0.85fr",
        gap: "var(--s-7)",
        alignItems: "center",
        paddingTop: "var(--s-8)",
      }}>
        <div className="reveal in" style={{ minWidth: 0 }}>
          <Badge tone="purple" icon={<Icon.Spark width={12} height={12} />}>
            RuzOwl · digital illustrator
          </Badge>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(44px, 7vw, 84px)",
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            fontWeight: 500,
            margin: "16px 0 12px",
            color: "var(--charcoal)",
            textWrap: "pretty",
          }}>
            Hi, I'm{" "}
            <span style={{ fontStyle: "italic", color: "var(--purple)", fontWeight: 600 }}>Ruz</span>
            <span style={{ color: "var(--gold-deep)" }}>.</span>
            <br />
            I draw{" "}
            <span style={{
              background: "linear-gradient(180deg, transparent 60%, var(--gold-tint) 60%)",
              padding: "0 4px",
            }}>fluffy animals</span>.
          </h1>
          <p style={{
            fontSize: 18, lineHeight: 1.55, color: "var(--gray)",
            maxWidth: 540, margin: "0 0 var(--s-6)",
            whiteSpace: "pre-wrap",
          }}>
            {ARTIST.intro}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <Button kind="primary" size="lg" href="#prices" icon={<Icon.Arrow width={16} height={16} />}>View prices</Button>
            <Button kind="ghost" size="lg" href="#gallery" icon={<Icon.Image width={16} height={16} />}>See gallery</Button>
          </div>
        </div>

        {/* Avatar card */}
        <div className="reveal in" style={{ position: "relative", justifySelf: "center" }}>
          <div style={{
            position: "relative",
            width: "min(380px, 80vw)",
            aspectRatio: "1/1",
            background: "var(--charcoal)",
            borderRadius: "var(--r-xl)",
            padding: 18,
            boxShadow: "var(--shadow-lg), 0 0 0 8px rgba(255,255,255,0.6)",
            transform: tweaks.tilt ? "rotate(-2.5deg)" : "none",
            transition: "transform var(--d-3) var(--ease-out)",
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "rotate(0deg) translateY(-4px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = tweaks.tilt ? "rotate(-2.5deg)" : "none"}
          >
            <div style={{
              width: "100%", height: "100%",
              background: "linear-gradient(180deg, var(--pink-soft) 0%, var(--pink) 100%)",
              borderRadius: "var(--r-lg)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden",
            }}>
              <Sparkles enabled={tweaks.showSparkles} count={10} />
              <img src="assets/ruz.png" alt="RuzOwl fursona" style={{
                width: "92%", height: "92%", objectFit: "contain",
                animation: "float-y 5s ease-in-out infinite",
                filter: "drop-shadow(0 16px 28px rgba(62,63,65,0.22))",
              }} />
              {/* corner sticker */}
              <div style={{
                position: "absolute", bottom: 14, left: 14,
                background: "var(--surface)", padding: "6px 12px",
                borderRadius: 999, fontSize: 12, fontWeight: 600,
                color: "var(--charcoal)",
                boxShadow: "var(--shadow-sm)",
                display: "inline-flex", gap: 6, alignItems: "center",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "#7aa05c" }} />
                Hoot-hoot!
              </div>
            </div>
            {/* gold tag — links to pricesheet */}
            <a href="#prices" style={{
              position: "absolute", top: -14, right: -14,
              background: "linear-gradient(180deg, #f5cd72, #e9b346)",
              color: "#3e2c0a", padding: "8px 14px",
              borderRadius: 999, fontSize: 12, fontWeight: 700, letterSpacing: "0.04em",
              boxShadow: "var(--shadow-glow-gold)",
              transform: "rotate(8deg)",
              textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 6,
              transition: "transform var(--d-2) var(--ease-squish)",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "rotate(8deg) scale(1.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "rotate(8deg)"; }}
            >
              ✦ See prices
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          section#top > div.container { grid-template-columns: 1fr !important; gap: var(--s-6) !important; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION HEADER
   ───────────────────────────────────────────────────────────── */
function SectionHeader({ kicker, title, sub, align = "left" }) {
  return (
    <div className="reveal" style={{ textAlign: align, maxWidth: align === "center" ? 620 : "none", marginInline: align === "center" ? "auto" : 0, marginBottom: "var(--s-7)" }}>
      {kicker && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--purple)",
          letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12,
        }}>
          <span style={{ width: 18, height: 1, background: "var(--purple)", display: "inline-block" }} />
          {kicker}
        </div>
      )}
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 500,
        fontSize: "clamp(32px, 4.4vw, 52px)", letterSpacing: "-0.02em",
        lineHeight: 1.05, margin: 0, color: "var(--charcoal)",
        textWrap: "balance",
      }}>{title}</h2>
      {sub && <p style={{ marginTop: 14, fontSize: 17, color: "var(--gray)", maxWidth: 560 }}>{sub}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   GALLERY — masonry-ish using grid spans
   ───────────────────────────────────────────────────────────── */
function Gallery({ nsfw }) {
  const order = nsfw ? GALLERY_NSFW : GALLERY_SFW;

  return (
    <section id="gallery" style={{ padding: "var(--s-9) 0", background: "var(--cream)", position: "relative", overflow: "hidden" }}>
      {/* big background numeral — editorial flourish */}
      <div aria-hidden style={{
        position: "absolute", top: 32, right: -20,
        fontFamily: "var(--font-display)", fontWeight: 400,
        fontSize: "clamp(180px, 24vw, 360px)",
        lineHeight: 0.8, color: "var(--charcoal)",
        opacity: 0.05, fontStyle: "italic", letterSpacing: "-0.05em",
        pointerEvents: "none",
      }}>{order.length}</div>

      <div className="container" style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: "var(--s-6)" }}>
          <SectionHeader kicker="Gallery" title="Recent works" sub={`${order.length} pieces at the moment · click any to full view`} />
          <a href="https://x.com/ruzowl07" target="_blank" rel="noreferrer" style={{
            fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--gray)",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 12px", borderRadius: "var(--r-pill)",
            border: "1px dashed rgba(62,63,65,0.18)",
            transition: "color var(--d-2) var(--ease-out), border-color var(--d-2) var(--ease-out)",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--purple)"; e.currentTarget.style.borderColor = "var(--purple)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--gray)"; e.currentTarget.style.borderColor = "rgba(62,63,65,0.18)"; }}
          >
            full archive on twitter →
          </a>
        </div>

        <div className="gallery-masonry">
          {order.map((g, i) => (
            <a key={i} href={g.src} target="_blank" rel="noreferrer" className="reveal g-item" style={{
              ["--reveal-delay"]: `${i * 50}ms`,
            }}>
              <div className="g-frame">
                <img src={g.src} alt={g.label} loading="lazy" />
                <div className="g-overlay">
                  <span className="g-label">{g.label}</span>
                  <span className="g-num">/{String(i + 1).padStart(2, "0")}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .gallery-masonry {
          column-count: 3;
          column-gap: var(--s-3);
          column-fill: balance;
        }
        @media (max-width: 900px) { .gallery-masonry { column-count: 2; } }
        @media (max-width: 540px) { .gallery-masonry { column-count: 1; } }

        .g-item {
          display: block;
          break-inside: avoid;
          -webkit-column-break-inside: avoid;
          page-break-inside: avoid;
          margin: 0 0 var(--s-3) 0;
          text-decoration: none;
          cursor: zoom-in;
        }
        .g-frame {
          position: relative;
          overflow: hidden;
          border-radius: var(--r-lg);
          background: var(--pink-soft);
          box-shadow: var(--shadow-sm);
          transition: transform var(--d-3) var(--ease-squish), box-shadow var(--d-3) var(--ease-out);
        }
        .g-item:hover .g-frame {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .g-frame img {
          width: 100%;
          height: auto;
          display: block;
        }
        .g-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(62,63,65,0) 55%, rgba(62,63,65,0.7) 100%);
          opacity: 0;
          transition: opacity var(--d-3) var(--ease-out);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 16px 18px;
          gap: 12px;
        }
        .g-item:hover .g-overlay { opacity: 1; }
        .g-label {
          color: var(--pink-soft);
          font-family: var(--font-display);
          font-style: italic;
          font-size: 18px;
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        .g-num {
          color: var(--gold);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRICES
   ───────────────────────────────────────────────────────────── */
function PriceCard({ tier, idx, shimmer }) {
  const ref = useRef(null);
  const tones = {
    neutral: { bar: "var(--charcoal)", chip: { bg: "rgba(62,63,65,0.06)", color: "var(--charcoal)" } },
    purple: { bar: "var(--purple)", chip: { bg: "var(--purple-tint)", color: "var(--purple)" } },
    gold: { bar: "var(--gold-deep)", chip: { bg: "var(--gold-tint)", color: "#6b4d12" } },
  }[tier.tone];

  return (
    <article ref={ref} className="reveal" style={{
      position: "relative",
      background: "var(--surface)",
      borderRadius: "var(--r-xl)",
      padding: "28px 28px 26px",
      boxShadow: tier.featured ? "var(--shadow-glow-purple), var(--shadow-md)" : "var(--shadow-sm)",
      border: "1px solid rgba(62,63,65,0.06)",
      overflow: "hidden",
      transition: "transform var(--d-3) var(--ease-squish), box-shadow var(--d-3) var(--ease-out)",
      ["--reveal-delay"]: `${idx * 80}ms`,
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        if (shimmer) {
          const sh = e.currentTarget.querySelector(".shimmer");
          if (sh) { sh.style.animation = "none"; sh.offsetHeight; sh.style.animation = "shimmer-sweep 1.1s var(--ease-out) forwards"; }
        }
      }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ position: "absolute", inset: "0 0 auto 0", height: 4, background: tones.bar }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <Badge tone={tier.tone}>{tier.name}</Badge>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--gray)" }}>·{idx + 1}/3</span>
      </div>

      <h3 style={{
        fontFamily: "var(--font-display)", fontWeight: 500,
        fontSize: 28, letterSpacing: "-0.02em", margin: "12px 0 8px",
        color: "var(--charcoal)",
      }}>{tier.name}</h3>

      <p style={{ fontSize: 14.5, color: "var(--gray)", margin: "0 0 22px", lineHeight: 1.55 }}>
        {tier.blurb}
      </p>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 22, position: "relative" }}>
        <span style={{
          fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 56,
          letterSpacing: "-0.03em", color: "var(--charcoal)", lineHeight: 1,
        }}>
          <span style={{ fontSize: 22, color: "var(--gray)", marginRight: 4 }}>{tier.currency}</span>
          {tier.price}
        </span>
        <span style={{ fontSize: 13, color: "var(--gray)", marginLeft: 6 }}>· {tier.delivery}</span>
        {/* gold shimmer overlay */}
        <div className="shimmer" aria-hidden style={{
          position: "absolute", inset: -6,
          background: "linear-gradient(110deg, transparent 30%, rgba(240,191,89,0.45) 50%, transparent 70%)",
          transform: "translateX(-120%) skewX(-18deg)",
          pointerEvents: "none",
        }} />
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "grid", gap: 10 }}>
        {tier.bullets.map((b) => (
          <li key={b} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14.5 }}>
            <span style={{
              flexShrink: 0, width: 18, height: 18, borderRadius: 999,
              background: tones.chip.bg, color: tones.chip.color,
              display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 1,
            }}><Icon.Check width={11} height={11} /></span>
            <span style={{ color: "var(--charcoal-soft)" }}>{b}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function Prices({ tweaks }) {
  return (
    <section id="prices" style={{ padding: "var(--s-9) 0", background: "var(--bg)" }}>
      <div className="container">
        <SectionHeader
          kicker="Pricing"
          title="Comission Prices"
          sub="Prices in BRL (Brazil) or USD (International). The numerical value remains the same for both currencies."
          align="center"
        />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "var(--s-5)",
          alignItems: "stretch",
        }} className="price-grid">
          {TIERS.map((t, i) => <PriceCard key={t.id} tier={t} idx={i} shimmer={tweaks.shimmerOnHover} />)}
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .price-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SOCIALS
   ───────────────────────────────────────────────────────────── */
function Socials() {
  return (
    <section id="socials" style={{ padding: "var(--s-9) 0", background: "var(--cream)" }}>
      <div className="container">
        <SectionHeader kicker="Socials" title="Where to find me" sub="The home of my WIPs and funny art + a lot of 🦉 things." align="center" />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "var(--s-4)",
        }} className="socials-grid">
          {SOCIALS.map((s, i) => {
            const I = Icon[s.icon];
            return (
              <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="reveal" style={{
                display: "flex", alignItems: "center", gap: 16,
                background: "var(--surface)",
                borderRadius: "var(--r-lg)",
                padding: "20px 22px",
                boxShadow: "var(--shadow-sm)",
                border: "1px solid rgba(62,63,65,0.06)",
                transition: "transform var(--d-2) var(--ease-squish), box-shadow var(--d-2) var(--ease-out)",
                ["--reveal-delay"]: `${i * 60}ms`,
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
              >
                <div style={{
                  width: 52, height: 52, flexShrink: 0,
                  borderRadius: "var(--r-md)",
                  background: i % 2 === 0 ? "var(--purple-tint)" : "var(--gold-tint)",
                  color: i % 2 === 0 ? "var(--purple)" : "#6b4d12",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <I width={24} height={24} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 19, color: "var(--charcoal)", letterSpacing: "-0.01em" }}>{s.name}</div>
                  <div style={{ fontSize: 13, color: "var(--gray)" }}>
                    <span style={{ fontFamily: "var(--font-mono)" }}>{s.handle}</span> · {s.note}
                  </div>
                </div>
                <Icon.Arrow width={16} height={16} />
              </a>
            );
          })}
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .socials-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   APP
   ───────────────────────────────────────────────────────────── */
function App() {
  const [tweaks, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  useReveal();
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tweaks.dark ? "dark" : "light");
  }, [tweaks.dark]);
  useEffect(() => {
    document.documentElement.setAttribute("data-mode", tweaks.nsfw ? "nsfw" : "sfw");
  }, [tweaks.nsfw]);

  return (
    <>
      <Nav
        status={tweaks.status}
        dark={tweaks.dark}
        onToggleDark={() => setTweak("dark", !tweaks.dark)}
        nsfw={tweaks.nsfw}
        onToggleNsfw={() => setTweak("nsfw", !tweaks.nsfw)}
      />
      <Hero tweaks={tweaks} />
      <Gallery nsfw={tweaks.nsfw} />
      <Prices tweaks={tweaks} />
      <Socials />

      <TweaksPanel>
        <TweakSection label="Brand" />
        <TweakRadio
          label="Status pill"
          value={tweaks.status}
          options={["open", "limited", "closed"]}
          onChange={(v) => setTweak("status", v)}
        />
        <TweakSection label="Personality" />
        <TweakToggle
          label="Floating sparkles around avatar"
          value={tweaks.showSparkles}
          onChange={(v) => setTweak("showSparkles", v)}
        />
        <TweakToggle
          label="Gold shimmer on price hover"
          value={tweaks.shimmerOnHover}
          onChange={(v) => setTweak("shimmerOnHover", v)}
        />
        <TweakToggle
          label="Tilt avatar card"
          value={tweaks.tilt}
          onChange={(v) => setTweak("tilt", v)}
        />
        <TweakSection label="Theme" />
        <TweakToggle
          label="Dark mode"
          value={tweaks.dark}
          onChange={(v) => setTweak("dark", v)}
        />
        <TweakToggle
          label="NSFW mode"
          value={tweaks.nsfw}
          onChange={(v) => setTweak("nsfw", v)}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
