# CLAUDE.md — Feature Batch Checkpoint

> **For successor agents.** Read [AGENTS.md](AGENTS.md) first for project conventions; this file documents the recent feature batch (architecture decisions + reference) so changes can be extended or debugged later.

**Status:** ✅ DONE — all 5 tasks shipped + 2 follow-up fixes (status-pill dark glow, in-page admin entry)
**Last updated:** session 2026-05-02

---

## Follow-up fixes (post-batch)

### Status pill — open/limited dark-mode visibility
- **Problem:** open/limited states were invisible in dark themes because their colors were chosen inline via `onDark` ternary, but Nav never passed `onDark`. All four themes silently fell back to the light-mode color.
- **Fix:** Refactored to match the ych/closed pattern — every status now reads its color/border/glow from CSS variables (`--status-open-*`, `--status-limited-*`). Defined in `:root` (no glow, light theme) and `html[data-theme="dark"]` (with strong glow shadow + brighter dot). NSFW blocks inherit via cascade (no redefinition needed since status semantics don't shift between SFW/NSFW).
- **Files:** `components.jsx` (StatusPill cfg + inline style), `index.html` (added vars to two theme blocks).
- **`onDark` prop:** kept in signature but ignored — backwards-compat for any future consumer.
- **Glow values:** dark themes use `0 0 0 1px <color>/0.30, 0 0 22px <color>/0.28` so the pill has both a defined edge AND ambient glow, matching the ych/closed treatment.

### Admin panel visibility
- **Current behavior:** TweaksPanel starts **closed by default** — only the "Admin" button is visible in the bottom-right corner. Users must click it to open the panel.
- **Panel initialization:** Line 167 in `tweaks-panel.jsx` uses `React.useState(false)` so the panel is hidden on page load.
- **User flow:** Click "Admin" button → panel opens → if not logged in, shows login form with password field; if logged in (via localStorage/sessionStorage), shows full admin controls.
- **Auth state persistence:** LocalStorage + sessionStorage remember admin login across page reloads and browser sessions.
- **Files:** `tweaks-panel.jsx` (panel state initialization), `app.jsx` (auth-gated admin controls), `index.html` (TWEAK_DEFAULTS for editable commissions).
- **Design rationale:** Starting closed keeps the website clean and unobtrusive on first load, while keeping admin controls just one click away for the site owner.

---

## Feature batch — completion table

| # | Task | Status | Touches |
|---|------|--------|---------|
| 1 | Full image view (gallery modal) | ✅ done | `app.jsx` (new `GalleryModal`, `Gallery` rewrite) |
| 2 | Admin commissions control (slots) | ✅ done | `index.html` (TWEAK_DEFAULTS), `app.jsx` (admin panel), `components.jsx` (StatusPill `label` prop + status palette) |
| 3 | Admin password auth | ✅ done | `app.jsx` (AdminLogin, auth state, localStorage + sessionStorage, logout) |
| 4 | Removed "1/3", "2/3", "3/3" | ✅ done | `app.jsx` PriceCard |
| 5 | Language toggle PT-BR / EN | ✅ done | `app.jsx` (TEXT dict, lang state, prop thread, Nav language pill) |

---

## What was built — quick reference

### Gallery modal ([`GalleryModal`](app.jsx) + `Gallery`)
- State (`openIdx`) lives in **Gallery**, not App.
- Modal is **conditionally mounted** (`{openIdx != null && <GalleryModal/>}`) so global keyboard listeners only attach while open.
- Click on any masonry item (now a `<button>`, was `<a>`) opens modal at that index.
- **Close:** ESC key, click backdrop, or click ✕ (top-right).
- **Navigate:** ← / → keys, or ‹ / › chevron buttons (wraps around).
- **Scroll lock:** sets `body.style.overflow = "hidden"` while open, restores on unmount.
- **Backdrop:** `rgba(20,12,14,0.78)` + 14px backdrop-blur.
- **Animations:** backdrop fade-in (220ms) + figure scale-in (320ms ease-squish).
- **Reset on SFW/NSFW toggle:** `useEffect` in Gallery clears `openIdx` when `nsfw` flips so we never index into the wrong gallery.
- All modal CSS lives in the `<style>` block inside `Gallery` (under `.img-modal*`).

### Admin commissions control
- New tweaks in `index.html` `TWEAK_DEFAULTS`: `slotsCurrent: 2`, `slotsMax: 5`.
- `TweakNumber` controls in admin panel: "Current slots" (0-99), "Max slots" (1-99).
- Those two controls are conditionally rendered: only `limited` and `ych` expose slot counts.
- `StatusPill` in `components.jsx` accepts an optional `label` prop that overrides the default. Nav builds the label using `t.status.slotsSuffix(cur, max)` and passes it.
- Status palette: `open` and `limited` keep warm glows, `ych` is blue, `closed` is red.

### Admin auth
- Hardcoded password: `ADMIN_PASSWORD = "corujinha"` (top of [app.jsx](app.jsx)).
- LocalStorage key: `ruzowl_admin_authed = "1"` when authed, with `sessionStorage` as a fallback so the browser remembers the owner across reloads.
- `<TweaksPanel>` opens normally for everyone (host postMessage protocol untouched). Its **children** are auth-gated: `{authed ? <controls/> : <AdminLogin/>}`.
- `tweaks-panel.jsx` was **not modified** — the gating happens entirely in `app.jsx`.
- `AdminLogin` is styled with the existing `.twk-field` + `.twk-btn` + `.twk-sect` classes so it lives inside the panel without visual seams.
- Logout button: `<TweakButton secondary onClick={doLogout}>` at the bottom of the authenticated content.

### Language toggle
- `TEXT = { en: {...}, pt: {...} }` defined at top of [app.jsx](app.jsx). Each language has identical key structure (`nav`, `hero`, `gallery`, `prices`, `prices.tiers.{id}`, `socials`, `status`, `admin`).
- `status` copy includes `open`, `limited`, `ych`, and `closed`; `limited` and `ych` both append the slots suffix.
- `lang` state in App, persisted via `localStorage["ruzowl_lang"]`. Default `"en"`. Initial value read inside `useState(() => …)` so it doesn't flash on remount.
- `t = TEXT[lang] || TEXT.en` computed and passed as prop to **all** sections (Nav, Hero, Gallery, Prices, Socials).
- `TIERS` keeps language-neutral data (id, price, currency, tone, featured); display strings come from `t.prices.tiers[tier.id]`.
- Toggle button in Nav: 38px-tall pill matching dark-mode button aesthetic, shows current code ("EN" or "PT"). Click flips.
- `<html lang="…">` attribute updated via `useEffect` for accessibility.

### Price card "n/3" removed
- Single-line removal in `PriceCard` — the `<span>·{idx+1}/3</span>` element was deleted. Layout stays intact (the flex parent now wraps just the Badge).

---

## File-by-file change record

### `index.html`
- Added `"slotsCurrent": 2` and `"slotsMax": 5` to TWEAK_DEFAULTS inside `EDITMODE-BEGIN/END`.

### `components.jsx`
- `StatusPill` signature: added optional `label` prop. When provided, overrides the default per-status label string. Backwards-compatible: existing callers (none other than this app) work unchanged.

### `app.jsx`
- **Top constants:** `ADMIN_PASSWORD`, `AUTH_STORAGE_KEY`, `LANG_STORAGE_KEY`, `TEXT` dictionary.
- **`PriceCard`:** removed `·{idx+1}/3` span; accepts new `display` prop with translated `name`/`blurb`/`bullets` (falls back to `tier.*`).
- **`GalleryModal`:** new component. Keyboard nav, scroll lock, backdrop close, prev/next.
- **`Gallery`:** accepts `t`, holds `openIdx` state, anchor → button conversion, conditionally mounts modal, resets state on `nsfw` change. Modal CSS added to its `<style>` block.
- **`Nav`:** signature now `(status, slotsCurrent, slotsMax, dark, onToggleDark, nsfw, onToggleNsfw, lang, onToggleLang, t)`. Builds `statusLabel` from `t.status.*`. Adds language pill button between StatusPill and dark-mode button. Translated all literal strings. Removed unused `openMobile` state and `items` array.
- **`Hero`:** accepts `t`, replaced literals with `t.hero.*`.
- **`Prices`:** accepts `t`, passes `t.prices.tiers[tier.id]` as `display` prop to each `PriceCard`. Local `t` variable in map renamed to `tier` to avoid shadowing.
- **`Socials`:** accepts `t`.
- **`AdminLogin`:** new component above `App`. Form with password field, error message, login button.
- **`App`:** added `lang` + `authed` state with localStorage persistence; `setLanguage`/`doLogin`/`doLogout` helpers; passes `t` and slot props everywhere; auth-gates TweaksPanel children; admin panel reorganized with new "Commissions" section first (status + slots), then existing Personality/Theme sections, then Logout button at the bottom.

---

## Architectural decisions (why things are the way they are)

- **Auth lives in `app.jsx`, not `tweaks-panel.jsx`** — keeps the panel reusable across other prototypes per its inline doc comments.
- **Language is in localStorage, not in tweaks** — tweaks are admin-controlled (host writes them to disk); language is a per-visitor preference.
- **`TEXT` dict over i18n library** — no dependencies allowed; project is small enough that a flat dict beats a library.
- **`StatusPill` uses an override `label` prop** — keeps the component minimal. Consumer (Nav) builds the full string with translations.
- **Modal is `position: fixed`, no `createPortal`** — Gallery section has no transform ancestor so fixed escapes correctly.
- **Gallery reset on `nsfw` change** — without this, modal could index into the wrong gallery during a switch.
- **Conditional mount of modal** — avoids global keyboard listener attached when modal is closed.
- **Hardcoded password** — explicit per spec ("Do NOT overengineer"). It's a casual barrier, not security.

---

## Known pre-existing tech debt (not addressed in this batch)

- `tier.delivery` referenced in `PriceCard` (line ~928) but never defined in TIERS — renders "· undefined".
- `s.note` referenced in `Socials` (line ~1033) but SOCIALS objects don't have `note` — renders "· undefined".
- "Comissions" misspelled (correct: "Commissions") — kept consistent across both languages pending client confirmation.
- `ArtPlaceholder` in `components.jsx` is unused.

These were in [AGENTS.md](AGENTS.md) before this batch and remain. Don't fix without explicit ask — could be intentional.

---

## Constraints honored

- ✅ No npm, no bundlers, no TypeScript
- ✅ No new dependencies
- ✅ All colors via CSS variables
- ✅ 4-theme matrix preserved (light/dark × sfw/nsfw)
- ✅ `tweaks-panel.jsx` not modified structurally
- ✅ Inline styles + `<style>` blocks only
- ✅ Existing globals reused (`Button`, `Icon`, `useTweaks`, `TweakNumber`, etc.)
- ✅ Responsiveness intact (added new responsive rules where needed)
- ✅ Animations consistent with existing easings/durations

---

## Testing checklist (manual)

- [ ] **Modal:** click any gallery image → opens; ESC closes; click backdrop closes; ← → navigates with wrap; click ✕ closes.
- [ ] **NSFW switch with modal closed:** opening modal after switch shows correct gallery.
- [ ] **NSFW switch with modal open:** modal closes (state reset).
- [ ] **Language toggle:** click "EN" pill → flips to "PT", all visible strings translate, persists across reload.
- [ ] **Status pill:** set status to "limited" via admin panel → pill shows "Limited slots · 2/5 slots". Switch language → suffix translates ("vagas").
- [ ] **Status pill:** set status to "limited" or "ych" via admin panel → pill shows the translated base label plus `Current slots / Max slots`. `closed` should be red and `ych` should be blue. Switch language → suffix translates ("vagas").
- [ ] **Slot numbers:** drag the label of "Current slots" / "Max slots" to scrub; type number directly works, and the controls should only appear for `limited` and `ych`.
- [ ] **Auth:** open tweaks panel (host shortcut) → login form. Wrong password → error. `corujinha` → controls appear. Logout → back to login. Refresh → stays logged in.
- [ ] **n/3 indicator:** absent from all 3 price cards.
- [ ] **All 4 themes:** light/sfw, light/nsfw, dark/sfw, dark/nsfw still render correctly.
- [ ] **Mobile:** nav fits without overflow at 390px width (logo icon + NSFW pill + lang pill + dark btn + Comissions btn).

---

## How to extend

**Add a new translatable string:**
1. Add the key to both `TEXT.en.<section>` and `TEXT.pt.<section>` in [app.jsx](app.jsx).
2. Use it in the component as `t.<section>.<key>`.

**Add a new admin tweak:**
1. Add the default to `TWEAK_DEFAULTS` in [index.html](index.html) (inside `EDITMODE-BEGIN/END`).
2. Add a `<TweakNumber/Toggle/Select/...>` control inside the `authed` branch of `<TweaksPanel>` in App.
3. Read it via `tweaks.<key>` and thread to consumers.

**Change the admin password:**
Edit `ADMIN_PASSWORD` constant at the top of [app.jsx](app.jsx). Force re-login by removing `localStorage["ruzowl_admin_authed"]` and `sessionStorage["ruzowl_admin_authed"]` (or the user just clicks Logout).

**Translate the modal-close icon:**
Already done — pass `aria-label={t.gallery.modalClose}` etc.

---

## Resume instructions for successor agents

This batch is complete. If picking up future work:
1. Read [AGENTS.md](AGENTS.md) for project conventions.
2. Read this file for what's already in place — don't duplicate.
3. The "Known pre-existing tech debt" section lists obvious next candidates if cleanup is wanted (with the caveat that those are intentional unless explicitly asked).
