
const { useState, useEffect, useRef } = React;


const ADMIN_PASSWORD = "corujinha";
const AUTH_STORAGE_KEY = "ruzowl_admin_authed";
const LANG_STORAGE_KEY = "ruzowl_lang";


const GITHUB_REPO = "UnusualHatter/ruzowl-portfolio";
const GITHUB_BRANCH = "main";
const COMMISSIONS_FILE = "data/commissions.json";
const PAT_STORAGE_KEY = "ruzowl_gh_pat";
// Only the commission fields below are published to the shared JSON file.
const PUBLISHED_KEYS = ["status", "slotsCurrent", "slotsMax", "iconPrice", "halfbodyPrice", "fullbodyPrice"];

async function loadRemoteCommissions() {
  try {
    const r = await fetch(`${COMMISSIONS_FILE}?t=${Date.now()}`, { cache: "no-store" });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

async function publishToGitHub(values, pat) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${COMMISSIONS_FILE}`;
  const headers = {
    "Authorization": `Bearer ${pat}`,
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // GitHub Contents API updates require the current file SHA.
  let sha;
  const getRes = await fetch(`${url}?ref=${GITHUB_BRANCH}&t=${Date.now()}`, { headers, cache: "no-store" });
  if (getRes.ok) {
    sha = (await getRes.json()).sha;
  } else if (getRes.status !== 404) {
    throw new Error(`Read failed (HTTP ${getRes.status})`);
  }
  const json = JSON.stringify(values, null, 2) + "\n";
  // GitHub expects the file body as base64-encoded text.
  const content = btoa(unescape(encodeURIComponent(json)));
  const body = {
    message: `chore(commissions): status=${values.status} slots=${values.slotsCurrent ?? "?"}/${values.slotsMax ?? "?"}`,
    content,
    branch: GITHUB_BRANCH,
  };
  if (sha) body.sha = sha;
  const putRes = await fetch(url, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!putRes.ok) {
    const txt = await putRes.text().catch(() => "");
    throw new Error(`HTTP ${putRes.status} ${txt.slice(0, 160)}`);
  }
}


const TEXT = {
  en: {
    nav: {
      gallery: "Gallery",
      prices: "Prices",
      commissions: "Comissions",
      switchSfw: "Switch to SFW mode",
      switchNsfw: "Switch to NSFW mode",
      switchDark: "Switch to dark mode",
      switchLight: "Switch to light mode",
      switchLang: "Switch to Portuguese",
    },
    hero: {
      badge: "RuzOwl · digital illustrator",
      h1Hi: "Hi, I'm",
      h1Mid: "I draw",
      h1Fluffy: "fluffy animals",
      intro: "I'm Ruz! — a furry digital illustrator creating cute and expressive anthropomorphic characters.\nI specialize in commissions.",
      btnPrices: "View prices",
      btnGallery: "See gallery",
      seePrices: "See prices",
      sticker: "Hoot-hoot!",
    },
    gallery: {
      kicker: "Gallery",
      title: "Recent works",
      sub: (n) => `${n} pieces at the moment · click any to full view`,
      archive: "full archive on twitter →",
      modalClose: "Close",
      modalPrev: "Previous",
      modalNext: "Next",
    },
    prices: {
      kicker: "Pricing",
      title: "Comission Prices",
      sub: "Prices in BRL (Brazil) or USD (International). The numerical value remains the same for both currencies.",
      tiers: {
        icon: { name: "Icon", blurb: "Social-media-ready avatar. Headshot with full rendering.", bullets: ["Full shading", "Headshot Portrait"] },
        halfbody: { name: "Half body", blurb: "Half body render of your character, full shading.", bullets: ["Full shading", "Half body portrait", "Simple or Detailed background"] },
        fullbody: { name: "Full body", blurb: "Full render of your character from head to toe.", bullets: ["Full shading", "Full body portrait", "Simple or Detailed background"] },
      },
    },
    socials: {
      kicker: "Socials",
      title: "Where to find me",
      sub: "The home of my WIPs and funny art + a lot of 🦉 things.",
    },
    status: {
      open: "Commissions Open",
      limited: "Limited Slots",
      ych: "YCH Slots Open",
      closed: "Commissions Closed",
      slotsSuffix: (cur, max) => `: ${cur}/${max}`,
    },
    admin: {
      sectionLogin: "Admin login",
      placeholder: "Password",
      loginBtn: "Login",
      logoutBtn: "Logout",
      errorMsg: "Incorrect password",
      sectionCommissions: "Commissions",
      sectionPrices: "Prices",
      labelStatus: "Status",
      statusOpen: "open",
      statusLimited: "lmtd slots",
      statusYch: "YCH slots",
      statusClosed: "Closed",
      labelSlotsCur: "Current slots",
      labelSlotsMax: "Max slots",
      labelIconPrice: "Icon price",
      labelHalfbodyPrice: "Half body price",
      labelFullbodyPrice: "Full body price",
      sectionPublish: "Publish to site",
      labelPat: "GitHub token",
      publishBtn: "Publish settings",
      publishBusy: "Publishing…",
      publishOk: "Published! Live in ~1 min.",
      publishNoToken: "Add a GitHub token first.",
      publishErr: "Publish failed",
      publishHint: "Token saved locally; never sent to visitors. Use a classic PAT with 'repo' scope, or a fine-grained PAT with 'Contents: Read and write' on this repo.",
    },
  },
  pt: {
    nav: {
      gallery: "Galeria",
      prices: "Preços",
      commissions: "Comissões",
      switchSfw: "Mudar para modo SFW",
      switchNsfw: "Mudar para modo NSFW",
      switchDark: "Mudar para modo escuro",
      switchLight: "Mudar para modo claro",
      switchLang: "Mudar para inglês",
    },
    hero: {
      badge: "RuzOwl · ilustrador digital",
      h1Hi: "Oi, eu sou o",
      h1Mid: "Eu desenho",
      h1Fluffy: "bichinhos fofos",
      intro: "Sou o Ruz! — um ilustrador digital furry criando personagens antropomórficos fofos e expressivos.\nMinha especialidade são comissões.",
      btnPrices: "Ver preços",
      btnGallery: "Ver galeria",
      seePrices: "Ver preços",
      sticker: "Hoot-hoot!",
    },
    gallery: {
      kicker: "Galeria",
      title: "Trabalhos recentes",
      sub: (n) => `${n} peças no momento · clique pra ver inteira`,
      archive: "arquivo completo no twitter →",
      modalClose: "Fechar",
      modalPrev: "Anterior",
      modalNext: "Próxima",
    },
    prices: {
      kicker: "Preços",
      title: "Preços de Comissões",
      sub: "Preços em BRL (Brasil) ou USD (Internacional). O valor numérico é o mesmo para ambas moedas.",
      tiers: {
        icon: { name: "Ícone", blurb: "Avatar pronto pra redes sociais. Headshot com renderização completa.", bullets: ["Sombreamento completo", "Retrato headshot"] },
        halfbody: { name: "Meio corpo", blurb: "Renderização de meio corpo do seu personagem, com sombreamento completo.", bullets: ["Sombreamento completo", "Retrato meio corpo", "Fundo simples ou detalhado"] },
        fullbody: { name: "Corpo inteiro", blurb: "Renderização completa do seu personagem da cabeça aos pés.", bullets: ["Sombreamento completo", "Retrato corpo inteiro", "Fundo simples ou detalhado"] },
      },
    },
    socials: {
      kicker: "Redes",
      title: "Onde me achar",
      sub: "O cantinho dos meus WIPs e arte engraçada + muita coisa de 🦉.",
    },
    status: {
      open: "Comissões abertas",
      limited: "Vagas limitadas",
      ych: "Vagas YCH abertas",
      closed: "Comissões fechadas",
      slotsSuffix: (cur, max) => `: ${cur}/${max}`,
    },
    admin: {
      sectionLogin: "Login admin",
      placeholder: "Senha",
      loginBtn: "Entrar",
      logoutBtn: "Sair",
      errorMsg: "Senha incorreta",
      sectionCommissions: "Comissões",
      sectionPrices: "Preços",
      labelStatus: "Status",
      statusOpen: "open",
      statusLimited: "lmtd slots",
      statusYch: "YCH slots",
      statusClosed: "Closed",
      labelSlotsCur: "Vagas atuais",
      labelSlotsMax: "Vagas máximas",
      labelIconPrice: "Preço do ícone",
      labelHalfbodyPrice: "Preço meio corpo",
      labelFullbodyPrice: "Preço corpo inteiro",
      sectionPublish: "Publicar no site",
      labelPat: "Token do GitHub",
      publishBtn: "Publicar configurações",
      publishBusy: "Publicando…",
      publishOk: "Publicado! No ar em ~1 min.",
      publishNoToken: "Adicione um token do GitHub primeiro.",
      publishErr: "Falha ao publicar",
      publishHint: "Token salvo localmente; nunca enviado a visitantes. Use um PAT clássico com escopo 'repo' ou um PAT refinado com 'Contents: Read and write' neste repo.",
    },
  },
};


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


function Nav({ status, slotsCurrent, slotsMax, dark, onToggleDark, nsfw, onToggleNsfw, lang, onToggleLang, t }) {
  const [scrolled, setScrolled] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const handleNsfwClick = () => {
    setPulseKey((k) => k + 1);
    setIsPulsing(true);
    onToggleNsfw();
    window.setTimeout(() => setIsPulsing(false), 620);
  };
  const statusLabel = (() => {
    const base = t.status[status] || "";
    if ((status === "limited" || status === "ych") && typeof slotsCurrent === "number" && typeof slotsMax === "number") {
      return base + t.status.slotsSuffix(slotsCurrent, slotsMax);
    }
    return base;
  })();
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
          <span className="nav-logo-text" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20, letterSpacing: "-0.02em" }}>
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
            >{t.nav.gallery}</a>
          </nav>

          <button
            className={"nav-nsfw-toggle" + (isPulsing ? " is-pulsing" : "")}
            onClick={handleNsfwClick}
            aria-label={nsfw ? t.nav.switchSfw : t.nav.switchNsfw}
            aria-pressed={nsfw}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "0 14px 0 7px",
              height: 38,
              background: nsfw ? "var(--purple)" : "var(--surface)",
              color: nsfw ? "#fff" : "var(--text-muted)",
              border: "1px solid " + (nsfw ? "var(--purple)" : "rgba(62,63,65,0.08)"),
              borderRadius: "var(--r-pill)",
              boxShadow: nsfw ? "var(--shadow-glow-purple)" : "var(--shadow-sm)",
              transition: "background var(--d-3) var(--ease-out), color var(--d-3) var(--ease-out), border-color var(--d-3) var(--ease-out), box-shadow var(--d-3) var(--ease-out), transform var(--d-2) var(--ease-squish)",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              position: "relative",
            }}
            onMouseEnter={(e) => { if (!isPulsing) e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={(e) => { if (!isPulsing) e.currentTarget.style.transform = "scale(1)"; }}
          >
            {pulseKey > 0 && <span key={pulseKey} aria-hidden className="nsfw-ripple" />}
            <span style={{
              width: 26, height: 26,
              borderRadius: "50%",
              background: nsfw ? "rgba(255,255,255,0.2)" : "var(--purple-tint)",
              color: nsfw ? "#fff" : "var(--purple)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontWeight: 700,
              flexShrink: 0,
              transition: "background var(--d-3) var(--ease-out), color var(--d-3) var(--ease-out)",
              position: "relative",
              zIndex: 1,
            }}>18</span>
            <span style={{
              transition: "opacity var(--d-2) var(--ease-out)",
              position: "relative",
              zIndex: 1,
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
            >{t.nav.prices}</a>
          </nav>
        </div>

        <div className="nav-cta" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="nav-status-pill"><StatusPill status={status} label={statusLabel} /></span>
          <button
            type="button"
            className="nav-lang-toggle"
            onClick={onToggleLang}
            aria-label={t.nav.switchLang}
            title={t.nav.switchLang}
            style={{
              minWidth: 38, height: 38, padding: "0 10px",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              background: "var(--surface)",
              color: "var(--charcoal)",
              border: "1px solid rgba(62,63,65,0.08)",
              borderRadius: "var(--r-pill)",
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              transition: "transform var(--d-2) var(--ease-squish), background var(--d-2) var(--ease-out), color var(--d-2) var(--ease-out)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            {lang === "en" ? "EN" : "PT"}
          </button>
          <button
            type="button"
            onClick={onToggleDark}
            aria-label={dark ? t.nav.switchLight : t.nav.switchDark}
            title={dark ? t.nav.switchLight : t.nav.switchDark}
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
          <Button kind="primary" size="sm" href="#prices" icon={<Icon.Arrow width={14} height={14} />}>{t.nav.commissions}</Button>
        </div>
      </div>
      <style>{`
        @media (max-width: 820px) {
          .nav-links { display: none !important; }
          .nav-logo-text { display: none !important; }
          .nav-status-pill { display: none !important; }
          .nav-cta { gap: 8px !important; }
        }
        @media (max-width: 480px) {
          .nav-nsfw-toggle { padding: 0 10px 0 5px !important; font-size: 10px !important; }
        }
      `}</style>
    </header>
  );
}


function Hero({ tweaks, t }) {
  return (
    <section id="top" style={{ position: "relative", paddingBottom: "var(--s-9)" }}>
      
      <div aria-hidden style={{
        position: "absolute", inset: "auto 0 0 0", height: 480, top: 60,
        background: "var(--hero-blob)",
        transition: "background var(--d-4) var(--ease-out)",
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
            {t.hero.badge}
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
            {t.hero.h1Hi}{" "}
            <span style={{ fontStyle: "italic", color: "var(--purple)", fontWeight: 600 }}>Ruz</span>
            <span style={{ color: "var(--gold-deep)" }}>.</span>
            <br />
            {t.hero.h1Mid}{" "}
            <span style={{
              background: "linear-gradient(180deg, transparent 60%, var(--gold-tint) 60%)",
              padding: "0 4px",
            }}>{t.hero.h1Fluffy}</span>.
          </h1>
          <p style={{
            fontSize: 18, lineHeight: 1.55, color: "var(--gray)",
            maxWidth: 540, margin: "0 0 var(--s-6)",
            whiteSpace: "pre-wrap",
          }}>
            {t.hero.intro}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <Button kind="primary" size="lg" href="#prices" icon={<Icon.Arrow width={16} height={16} />}>{t.hero.btnPrices}</Button>
            <Button kind="ghost" size="lg" href="#gallery" icon={<Icon.Image width={16} height={16} />}>{t.hero.btnGallery}</Button>
          </div>
        </div>

        
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
              
              <div style={{
                position: "absolute", bottom: 14, left: 14,
                background: "var(--surface)", padding: "6px 12px",
                borderRadius: 999, fontSize: 12, fontWeight: 600,
                color: "var(--charcoal)",
                boxShadow: "var(--shadow-sm)",
                display: "inline-flex", gap: 6, alignItems: "center",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "#7aa05c" }} />
                {t.hero.sticker}
              </div>
            </div>
            
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
              ✦ {t.hero.seePrices}
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


function GalleryModal({ items, index, onClose, onPrev, onNext, t }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  if (index == null || index < 0 || index >= items.length) return null;
  const item = items[index];
  const stop = (e) => e.stopPropagation();

  return (
    <div className="img-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label={item.label}>
      <button className="img-modal-close" onClick={(e) => { stop(e); onClose(); }} aria-label={t.gallery.modalClose}>✕</button>
      <button className="img-modal-nav prev" onClick={(e) => { stop(e); onPrev(); }} aria-label={t.gallery.modalPrev}>‹</button>
      <button className="img-modal-nav next" onClick={(e) => { stop(e); onNext(); }} aria-label={t.gallery.modalNext}>›</button>
      <figure className="img-modal-fig" onClick={stop}>
        <img src={item.src} alt={item.label} />
      </figure>
    </div>
  );
}


function Gallery({ nsfw, t }) {
  const order = nsfw ? GALLERY_NSFW : GALLERY_SFW;
  const [openIdx, setOpenIdx] = useState(null);
  // Reset the modal when switching modes so the active index stays valid.
  useEffect(() => { setOpenIdx(null); }, [nsfw]);

  const close = () => setOpenIdx(null);
  const prev = () => setOpenIdx((i) => (i == null ? null : (i - 1 + order.length) % order.length));
  const next = () => setOpenIdx((i) => (i == null ? null : (i + 1) % order.length));

  return (
    <section id="gallery" style={{ padding: "var(--s-9) 0", background: "var(--cream)", position: "relative", overflow: "hidden" }}>
      
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
          <SectionHeader kicker={t.gallery.kicker} title={t.gallery.title} sub={t.gallery.sub(order.length)} />
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
            {t.gallery.archive}
          </a>
        </div>

        <div className="gallery-masonry">
          {order.map((g, i) => (
            <button key={i} type="button" onClick={() => setOpenIdx(i)} className="reveal g-item" style={{
              ["--reveal-delay"]: `${i * 50}ms`,
            }} aria-label={g.label}>
              <div className="g-frame">
                <img src={g.src} alt={g.label} loading="lazy" />
                <div className="g-overlay">
                  <span className="g-num">/{String(i + 1).padStart(2, "0")}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {openIdx != null && (
        <GalleryModal items={order} index={openIdx} onClose={close} onPrev={prev} onNext={next} t={t} />
      )}

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
          width: 100%;
          break-inside: avoid;
          -webkit-column-break-inside: avoid;
          page-break-inside: avoid;
          margin: 0 0 var(--s-3) 0;
          padding: 0;
          border: 0;
          background: transparent;
          color: inherit;
          font: inherit;
          text-align: left;
          text-decoration: none;
          cursor: zoom-in;
        }
        .g-item:focus-visible {
          outline: 2px solid var(--purple);
          outline-offset: 4px;
          border-radius: var(--r-lg);
        }

        
        @keyframes img-modal-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes img-modal-zoom {
          from { transform: scale(0.94); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        .img-modal {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(20, 12, 14, 0.78);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          backdrop-filter: blur(14px) saturate(140%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4vh 4vw;
          animation: img-modal-in 220ms var(--ease-out);
          cursor: zoom-out;
        }
        .img-modal-fig {
          position: relative;
          margin: 0;
          max-width: 92vw;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          animation: img-modal-zoom 320ms var(--ease-squish);
          cursor: default;
        }
        .img-modal-fig img {
          display: block;
          max-width: 92vw;
          max-height: 84vh;
          object-fit: contain;
          border-radius: var(--r-lg);
          box-shadow: 0 24px 80px rgba(0,0,0,0.55);
        }
        .img-modal-close,
        .img-modal-nav {
          position: absolute;
          appearance: none;
          background: rgba(255,255,255,0.10);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 50%;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          transition: background var(--d-2) var(--ease-out), transform var(--d-2) var(--ease-squish);
        }
        .img-modal-close {
          top: 24px;
          right: 24px;
          width: 44px;
          height: 44px;
          font-size: 18px;
        }
        .img-modal-nav {
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          font-size: 28px;
          padding-bottom: 4px;
        }
        .img-modal-nav.prev { left: 24px; }
        .img-modal-nav.next { right: 24px; }
        .img-modal-close:hover { background: rgba(255,255,255,0.22); transform: scale(1.06); }
        .img-modal-nav:hover   { background: rgba(255,255,255,0.22); transform: translateY(-50%) scale(1.08); }
        @media (max-width: 640px) {
          .img-modal-close { top: 12px; right: 12px; width: 38px; height: 38px; font-size: 16px; }
          .img-modal-nav   { width: 40px; height: 40px; font-size: 22px; }
          .img-modal-nav.prev { left: 8px; }
          .img-modal-nav.next { right: 8px; }
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


function PriceCard({ tier, idx, shimmer, display, price }) {
  const ref = useRef(null);
  const name = display?.name ?? tier.name;
  const blurb = display?.blurb ?? tier.blurb;
  const bullets = display?.bullets ?? tier.bullets;
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
        <Badge tone={tier.tone}>{name}</Badge>
      </div>

      <h3 style={{
        fontFamily: "var(--font-display)", fontWeight: 500,
        fontSize: 28, letterSpacing: "-0.02em", margin: "12px 0 8px",
        color: "var(--charcoal)",
      }}>{name}</h3>

      <p style={{ fontSize: 14.5, color: "var(--gray)", margin: "0 0 22px", lineHeight: 1.55 }}>
        {blurb}
      </p>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 22, position: "relative" }}>
        <span style={{
          fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 56,
          letterSpacing: "-0.03em", color: "var(--charcoal)", lineHeight: 1,
        }}>
          <span style={{ fontSize: 22, color: "var(--gray)", marginRight: 4 }}>{tier.currency}</span>
          {price ?? tier.price}
        </span>
        <span style={{ fontSize: 13, color: "var(--gray)", marginLeft: 6 }}>· {tier.delivery}</span>
        
        <div className="shimmer" aria-hidden style={{
          position: "absolute", inset: -6,
          background: "linear-gradient(110deg, transparent 30%, rgba(240,191,89,0.45) 50%, transparent 70%)",
          transform: "translateX(-120%) skewX(-18deg)",
          pointerEvents: "none",
        }} />
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "grid", gap: 10 }}>
        {bullets.map((b) => (
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

function Prices({ tweaks, t }) {
  return (
    <section id="prices" style={{ padding: "var(--s-9) 0", background: "var(--bg)" }}>
      <div className="container">
        <SectionHeader
          kicker={t.prices.kicker}
          title={t.prices.title}
          sub={t.prices.sub}
          align="center"
        />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "var(--s-5)",
          alignItems: "stretch",
        }} className="price-grid">
          {TIERS.map((tier, i) => (
            <PriceCard
              key={tier.id}
              tier={tier}
              idx={i}
              shimmer={tweaks.shimmerOnHover}
              display={t.prices.tiers[tier.id]}
              price={
                tier.id === "icon" ? tweaks.iconPrice
                  : tier.id === "halfbody" ? tweaks.halfbodyPrice
                  : tweaks.fullbodyPrice
              }
            />
          ))}
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


function Socials({ t }) {
  return (
    <section id="socials" style={{ padding: "var(--s-9) 0", background: "var(--cream)" }}>
      <div className="container">
        <SectionHeader kicker={t.socials.kicker} title={t.socials.title} sub={t.socials.sub} align="center" />
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


function Footer() {
  const openAdmin = () => {
    window.postMessage({ type: "__activate_edit_mode" }, "*");
  };
  const year = new Date().getFullYear();
  return (
    <footer style={{
      padding: "var(--s-6) 0 var(--s-7)",
      background: "var(--cream)",
      borderTop: "1px solid var(--nav-border)",
      transition: "background-color var(--d-3) var(--ease-out), border-color var(--d-3) var(--ease-out)",
    }}>
      <div className="container" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.04em",
        color: "var(--text-muted)",
      }}>
        <span style={{ opacity: 0.65 }}>© {year} RuzOwl</span>
        <button
          type="button"
          onClick={openAdmin}
          aria-label="Open admin panel"
          style={{
            appearance: "none",
            border: 0,
            background: "transparent",
            font: "inherit",
            color: "var(--text-muted)",
            opacity: 0.42,
            cursor: "pointer",
            padding: "4px 10px",
            borderRadius: "var(--r-pill)",
            textTransform: "lowercase",
            letterSpacing: "0.10em",
            transition: "opacity var(--d-2) var(--ease-out), color var(--d-2) var(--ease-out), background var(--d-2) var(--ease-out)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.color = "var(--purple)";
            e.currentTarget.style.background = "var(--purple-tint)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.42";
            e.currentTarget.style.color = "var(--text-muted)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          admin
        </button>
      </div>
    </footer>
  );
}


function PublishToGitHub({ tweaks, t }) {
  const [pat, setPat] = useState(() => {
    try { return localStorage.getItem(PAT_STORAGE_KEY) || ""; } catch { return ""; }
  });
  const [busy, setBusy] = useState(false);
  // Local feedback keeps publish status visible without adding extra chrome.
  const [msg, setMsg] = useState(null);

  const savePat = (v) => {
    setPat(v);
    try {
      if (v) localStorage.setItem(PAT_STORAGE_KEY, v);
      else localStorage.removeItem(PAT_STORAGE_KEY);
    } catch {}
  };

  const publish = async () => {
    if (!pat) { setMsg({ kind: "err", text: t.admin.publishNoToken }); return; }
    setBusy(true);
    setMsg({ kind: "info", text: t.admin.publishBusy });
    const payload = {};
    PUBLISHED_KEYS.forEach((k) => { if (k in tweaks) payload[k] = tweaks[k]; });
    try {
      await publishToGitHub(payload, pat);
      setMsg({ kind: "ok", text: t.admin.publishOk });
    } catch (e) {
      let errText = e.message;
      if (e.message.includes("403")) {
        errText = "Token doesn't have write permission. Use a classic PAT with 'repo' scope, or grant 'Contents: Read and write' on a fine-grained PAT.";
      }
      setMsg({ kind: "err", text: `${t.admin.publishErr}: ${errText}` });
    } finally {
      setBusy(false);
    }
  };

  const msgColor = msg?.kind === "ok"
    ? "#3f8a26"
    : msg?.kind === "err"
      ? "#c4254a"
      : "rgba(41,38,27,0.6)";

  return (
    <>
      <TweakSection label={t.admin.sectionPublish} />
      <TweakRow label={t.admin.labelPat}>
        <input
          className="twk-field"
          type="password"
          value={pat}
          placeholder="github_pat_…"
          onChange={(e) => savePat(e.target.value)}
        />
      </TweakRow>
      <TweakButton
        label={busy ? t.admin.publishBusy : t.admin.publishBtn}
        onClick={publish}
      />
      <div style={{ fontSize: 10, color: "rgba(41,38,27,0.5)", lineHeight: 1.4, marginTop: -2 }}>
        {t.admin.publishHint}
      </div>
      {msg && (
        <div style={{ fontSize: 11, color: msgColor, lineHeight: 1.4, marginTop: -4, wordBreak: "break-word" }}>
          {msg.text}
        </div>
      )}
    </>
  );
}


function AdminLogin({ onLogin, t }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  // This is a convenience gate for the panel, not a security boundary.
  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setPw("");
    }
  };
  return (
    <>
      <div className="twk-sect">{t.admin.sectionLogin}</div>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input
          className="twk-field"
          type="password"
          value={pw}
          placeholder={t.admin.placeholder}
          autoFocus
          onChange={(e) => { setPw(e.target.value); setError(false); }}
        />
        {error && (
          <div style={{ fontSize: 11, color: "#c4254a", fontWeight: 500 }}>
            {t.admin.errorMsg}
          </div>
        )}
        <button type="submit" className="twk-btn">{t.admin.loginBtn}</button>
      </form>
    </>
  );
}


function App() {
  const [tweaks, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  // Visitor preferences stay local and do not get written into shared tweaks.
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem(LANG_STORAGE_KEY) || "en"; }
    catch { return "en"; }
  });
  // Admin auth persists locally so a refresh does not close the panel.
  const [authed, setAuthed] = useState(() => {
    try { return localStorage.getItem(AUTH_STORAGE_KEY) === "1"; }
    catch {
      try { return sessionStorage.getItem(AUTH_STORAGE_KEY) === "1"; }
      catch { return false; }
    }
  });

  const t = TEXT[lang] || TEXT.en;
  // Pull the latest published commission data on first load.
  useEffect(() => {
    loadRemoteCommissions().then((data) => {
      if (data) {
        Object.entries(data).forEach(([key, val]) => {
          if (key in tweaks) setTweak(key, val);
        });
      }
    }).catch(() => {
    });
  }, []);

  const setLanguage = (l) => {
    setLang(l);
    try { localStorage.setItem(LANG_STORAGE_KEY, l); } catch {}
  };
  const doLogin = () => {
    setAuthed(true);
    try { localStorage.setItem(AUTH_STORAGE_KEY, "1"); } catch {}
    try { sessionStorage.setItem(AUTH_STORAGE_KEY, "1"); } catch {}
  };
  const doLogout = () => {
    setAuthed(false);
    try { localStorage.removeItem(AUTH_STORAGE_KEY); } catch {}
    try { sessionStorage.removeItem(AUTH_STORAGE_KEY); } catch {}
  };

  useReveal();
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tweaks.dark ? "dark" : "light");
  }, [tweaks.dark]);
  useEffect(() => {
    document.documentElement.setAttribute("data-mode", tweaks.nsfw ? "nsfw" : "sfw");
  }, [tweaks.nsfw]);
  useEffect(() => {
    document.documentElement.setAttribute("lang", lang === "pt" ? "pt-BR" : "en");
  }, [lang]);

  return (
    <>
      <Nav
        status={tweaks.status}
        slotsCurrent={tweaks.slotsCurrent}
        slotsMax={tweaks.slotsMax}
        dark={tweaks.dark}
        onToggleDark={() => setTweak("dark", !tweaks.dark)}
        nsfw={tweaks.nsfw}
        onToggleNsfw={() => setTweak("nsfw", !tweaks.nsfw)}
        lang={lang}
        onToggleLang={() => setLanguage(lang === "en" ? "pt" : "en")}
        t={t}
      />
      <Hero tweaks={tweaks} t={t} />
      <Gallery nsfw={tweaks.nsfw} t={t} />
      <Prices tweaks={tweaks} t={t} />
      <Socials t={t} />
      <Footer />

      <TweaksPanel>
        {authed ? (
          <>
            <TweakSection label={t.admin.sectionCommissions} />
            <TweakRadio
              label={t.admin.labelStatus}
              value={tweaks.status}
              options={[
                { value: "open", label: t.admin.statusOpen },
                { value: "limited", label: t.admin.statusLimited },
                { value: "ych", label: t.admin.statusYch },
                { value: "closed", label: t.admin.statusClosed },
              ]}
              onChange={(v) => setTweak("status", v)}
            />
            {(tweaks.status === "limited" || tweaks.status === "ych") && (
              <>
                <TweakNumber
                  label={t.admin.labelSlotsCur}
                  value={tweaks.slotsCurrent}
                  min={0}
                  max={99}
                  onChange={(v) => setTweak("slotsCurrent", v)}
                />
                <TweakNumber
                  label={t.admin.labelSlotsMax}
                  value={tweaks.slotsMax}
                  min={1}
                  max={99}
                  onChange={(v) => setTweak("slotsMax", v)}
                />
              </>
            )}

            <TweakSection label={t.admin.sectionPrices} />
            <TweakNumber
              label={t.admin.labelIconPrice}
              value={tweaks.iconPrice}
              min={1}
              max={9999}
              unit=" BRL"
              onChange={(v) => setTweak("iconPrice", v)}
            />
            <TweakNumber
              label={t.admin.labelHalfbodyPrice}
              value={tweaks.halfbodyPrice}
              min={1}
              max={9999}
              unit=" BRL"
              onChange={(v) => setTweak("halfbodyPrice", v)}
            />
            <TweakNumber
              label={t.admin.labelFullbodyPrice}
              value={tweaks.fullbodyPrice}
              min={1}
              max={9999}
              unit=" BRL"
              onChange={(v) => setTweak("fullbodyPrice", v)}
            />

            <PublishToGitHub tweaks={tweaks} t={t} />

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

            <div style={{ marginTop: 6, paddingTop: 10, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
              <TweakButton label={t.admin.logoutBtn} secondary onClick={doLogout} />
            </div>
          </>
        ) : (
          <AdminLogin onLogin={doLogin} t={t} />
        )}
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
