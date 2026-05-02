# AGENTS.md

Guia para agentes de IA e desenvolvedores que vão mexer neste repositório. Leia antes de editar.

---

## 1. Visão geral

Portfólio de comissões de **RuzOwl** — ilustrador furry digital. Página única (SPA) com hero, galeria SFW/NSFW, tabela de preços e links sociais. Foco em estética artesanal: paleta rosa/roxo/dourado, tipografia serifada (Fraunces), micro-animações suaves.

Não é um projeto Node.js convencional. Não tem `package.json`, nem build step. Tudo é servido como arquivos estáticos.

---

## 2. Estrutura

```
ruzowl-portfolio/
├── index.html          ← entrada única; contém TODO o CSS global
├── app.jsx             ← componentes de página (Nav, Hero, Gallery, Prices, Socials, App)
├── components.jsx      ← primitives reutilizáveis (Icon, Button, StatusPill, Badge, Sparkles, useReveal)
├── tweaks-panel.jsx    ← painel flutuante de tweaks em tempo real (useTweaks hook + UI)
├── start.bat           ← servidor local (Python http.server na porta 8080)
├── assets/
│   ├── ruz.png         ← avatar/favicon
│   ├── logo.png
│   ├── gallery/        ← 8 peças SFW
│   └── gallery-nsfw/   ← 8 peças NSFW
└── AGENTS.md           ← este arquivo
```

---

## 3. Stack técnica

- **React 18.3.1** via UMD CDN (com SRI integrity)
- **Babel Standalone 7.29.0** transpila JSX no navegador
- **Sem bundler, sem npm, sem TypeScript**
- Fontes: Google Fonts (Fraunces, Inter, JetBrains Mono)

Ordem de carregamento dos scripts (em `index.html`):
1. `tweaks-panel.jsx` — define `useTweaks` e `TweaksPanel`
2. `components.jsx` — define `Icon`, `Button`, etc., e expõe via `Object.assign(window, ...)`
3. `app.jsx` — usa tudo acima e monta em `#root`

Globais expostos por `components.jsx`: `Icon, Button, StatusPill, Badge, Sparkles, useReveal, ArtPlaceholder`.
Globais expostos por `tweaks-panel.jsx`: `useTweaks, TweaksPanel, TweakSection, TweakToggle, TweakRadio, TweakSlider, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton`.

---

## 4. Como rodar localmente

```bat
start.bat
```

Abre `http://localhost:8080` no navegador automaticamente. Requer Python no PATH (ou `npx` como fallback).

Alternativa manual: `python -m http.server 8080` na raiz do projeto. **Não abra `index.html` direto via `file://`** — o navegador bloqueia o carregamento de scripts JSX por CORS.

---

## 5. Sistema de design

Toda a paleta vive como **CSS custom properties** em `:root` dentro do `<style>` em [index.html](index.html). Quatro estados de tema combinam dois atributos no `<html>`:

| `data-theme` | `data-mode` | Resultado                               |
|--------------|-------------|------------------------------------------|
| `light`      | `sfw`       | Padrão: rosa pastel + roxo + dourado     |
| `dark`       | `sfw`       | Aubergine escuro, roxo/dourado brilham   |
| `light`      | `nsfw`      | Rosa-blush, crimson `#a8324a` substitui o roxo |
| `dark`       | `nsfw`      | Wine-black `#1f1216`, crimson neon       |

**Regras importantes:**
- Não use cores hardcoded em JSX. Sempre `var(--purple)`, `var(--gold)`, `var(--charcoal)`, etc. Cores hardcoded quebram os 4 temas.
- A NSFW redefinição é **completa** (surfaces, text, accents, shadows, nav-bg, hero-blob), não só accents. Mantenha essa cobertura ao adicionar novas variáveis.
- Para gradientes que precisam mudar com o tema, defina a gradient inteira como variável (ex.: `--hero-blob`) em vez de tentar interpolar `rgba(var(--purple), 0.1)` (não funciona com hex).
- Tokens de espaçamento: `--s-1` (4px) → `--s-10` (128px). Use eles em vez de números crus.
- Raios: `--r-sm/md/lg/xl/pill`. Sombras: `--shadow-sm/md/lg`, mais `--shadow-glow-gold` e `--shadow-glow-purple`.
- Easings: `--ease-out` (suave) e `--ease-squish` (bouncy). Durações: `--d-1` (120ms) → `--d-4` (600ms).

---

## 6. Componentes principais

### `Nav` ([app.jsx](app.jsx))
Sticky, ganha `backdrop-filter` quando `scrollY > 8`. Contém:
- Logo (texto escondido em mobile via `.nav-logo-text`)
- Links Gallery/Prices (escondidos em mobile via `.nav-links`)
- **Toggle SFW/NSFW** (`.nav-nsfw-toggle`) — pill custom com chip "18", anima pulse + ripple radial ao clicar
- **StatusPill** (envolvido em `.nav-status-pill` para esconder em mobile sem disputar com inline styles) — suporta `open`, `limited`, `ych` e `closed`; `limited`/`ych` mostram slots, `closed` fica vermelho e `ych` fica azul
- Toggle dark/light (botão circular 38px, ícone sun↔moon com rotação)
- Botão "Comissions" (CTA primário)

### `Hero`
Layout 2 colunas: texto à esquerda, avatar card à direita (com tilt opcional). Blob decorativo atrás usa `var(--hero-blob)`.

### `Gallery`
Masonry via CSS columns (3 → 2 → 1 conforme breakpoints). Lê `GALLERY_SFW` ou `GALLERY_NSFW` baseado em `tweaks.nsfw`. Hover mostra label + número.

### `Prices` / `PriceCard`
Grid de 3 cards. Card "halfbody" é featured (glow roxo). Shimmer dourado no hover do preço.

### `Socials`
Grid 2x2 → 1col em mobile.

### `TweaksPanel`
Painel flutuante draggable que começa **fechado** (só mostra botão "Admin" em `var(--purple)`). Clique no botão para abrir e acessar os controles. Listeners de mensagens de host (`__activate_edit_mode`, `__deactivate_edit_mode`) funcionam normalmente. Persiste valores via `postMessage` que o host grava de volta no bloco `EDITMODE-BEGIN ... EDITMODE-END` em [index.html](index.html).
- O login do admin é lembrado no navegador com `localStorage` + `sessionStorage`, então o estado authed sobrevive a reloads e à sessão do browser.
- **Controles de admin:** Status das comissões (open/limited/ych/closed), número de slots (só para limited/ych), preços (icon/halfbody/fullbody), personalidade (sparkles/shimmer/tilt), tema (dark/NSFW), e botão logout.

---

## 7. Conteúdo

Tudo definido como constantes no topo de [app.jsx](app.jsx):

- `ARTIST` — nome, handle, email, intro
- `TIERS` — 3 tiers de preço (Icon R$45, Half body R$50, Full body R$70)
- `SOCIALS` — Twitter/X, Telegram, Bluesky, Discord
- `GALLERY_SFW` / `GALLERY_NSFW` — 8 peças cada, com `src` + `label`
- `status` no topo usa `open`, `limited`, `ych` e `closed`; `limited` e `ych` exibem `slotsCurrent/slotsMax` no pill.

Para adicionar uma nova peça: solte o arquivo em `assets/gallery/` (ou `gallery-nsfw/`) e adicione a entry no array correspondente.

---

## 8. Responsividade

Breakpoints atuais (não use outros sem alinhar):
- `≤ 900px` — galeria vai de 3 → 2 colunas
- `≤ 880px` — preços empilham em 1 coluna
- `≤ 820px` — esconde nav-links, logo-text, status-pill; reduz gap do nav-cta
- `≤ 640px` — socials viram 1 coluna
- `≤ 540px` — galeria vai para 1 coluna
- `≤ 480px` — toggle NSFW fica mais compacto

Slots do admin:
- `Current slots` e `Max slots` só aparecem quando o status é `limited` ou `ych`.

---

## 9. Convenções de código

- **Estilos inline** são a norma neste projeto (não use CSS modules nem styled-components). Use `<style>` blocks dentro dos componentes para regras com seletores complexos ou media queries.
- **Cores** sempre via CSS vars (ver §5).
- **Não introduza** TypeScript, JSX build step, npm, bundler. Quebra a arquitetura.
- **Não adicione comentários** explicando *o que* o código faz — nomes claros bastam. Comente só *por quê* quando for não-óbvio.
- **Eventos hover** são feitos via `onMouseEnter`/`onMouseLeave` que mexem em `style.transform` direto. Mantenha esse padrão.
- **Animações** são keyframes globais em [index.html](index.html). Adicione novos keyframes lá, não inline.

---

## 10. Pontos de atenção / dívida técnica

- `Nav.items` array (linhas ~88-91 de [app.jsx](app.jsx)) está declarado mas não é usado.
- `Nav.openMobile` state declarado mas não usado (não há hambúrguer ainda).
- `ArtPlaceholder` em [components.jsx](components.jsx) não é usado em lugar nenhum.
- Em [app.jsx](app.jsx) `Socials`, o template renderiza `{s.note}` mas o objeto `SOCIALS` não tem campo `note` — sai `undefined` silencioso.
- `tier.delivery` é renderizado em `PriceCard` mas nenhum tier define esse campo.
- Palavra "Comissions" está com erro ortográfico (correto: "Commissions") em vários lugares — tratar como decisão do cliente até confirmação.
- Botões usando `transform` inline para hover podem conflitar com animações CSS — a `nav-nsfw-toggle` resolveu isso suprimindo o hover transform durante `isPulsing`. Replique esse padrão se for adicionar animações em outros botões hover-sensíveis.
- O pill de status no dark mode precisa manter contraste forte: `open`/`limited` têm glow, `ych` é azul e `closed` é vermelho em todos os temas.

---

## 11. O que NÃO fazer

- ❌ Adicionar `package.json` ou rodar `npm init`
- ❌ Trocar Babel CDN por um build step
- ❌ Mover CSS para arquivos externos sem alinhar — quebra o atomic deploy
- ❌ Usar cores hex hardcoded em componentes — sempre via CSS var
- ❌ Adicionar dependências não-React (jQuery, lodash, etc.)
- ❌ Modificar o bloco `EDITMODE-BEGIN ... EDITMODE-END` à mão sem entender o sistema de tweaks (o host reescreve esse bloco)
- ❌ Quebrar a paridade dos 4 temas (light/dark × sfw/nsfw) ao adicionar variáveis novas
- ❌ Commitar imagens da galeria sem otimizar (peso da página importa)

---

## 12. Tarefas comuns

**Adicionar uma peça à galeria:**
1. `assets/gallery/nome.png` (ou `gallery-nsfw/`)
2. Adicionar `{ src: "assets/gallery/nome.png", label: "Nome da peça" }` em `GALLERY_SFW` em [app.jsx](app.jsx)

**Mudar um preço:**
Editar o objeto correspondente em `TIERS` em [app.jsx](app.jsx).

**Adicionar uma nova rede social:**
1. Adicionar entry em `SOCIALS`
2. Se for um ícone novo, adicionar SVG em `Icon` em [components.jsx](components.jsx)

**Mudar o status de comissões:**
Pelo painel de tweaks (canto inferior direito) → "Status pill" → open/limited/ych/closed. Persistido no bloco `EDITMODE` em [index.html](index.html). `Current slots` e `Max slots` aparecem só em `limited` e `ych`.

**Trocar o avatar:**
Substitua `assets/ruz.png` (mantém o nome — é referenciado em vários lugares incluindo o favicon).

---

## 13. Referências rápidas

- Hero: [app.jsx:236](app.jsx#L236)
- Nav + toggle NSFW: [app.jsx:80](app.jsx#L80)
- Paleta NSFW (light): [index.html:138](index.html#L138)
- Paleta NSFW (dark): [index.html:184](index.html#L184)
- Tweaks defaults: [index.html:241](index.html#L241)
- Keyframes globais: [index.html:201](index.html#L201)

# last conversation:
I'll add a publish-to-GitHub flow so commission tweaks become globally visible. Let me first check the current admin panel structure:

Grep "TweaksPanel|setTweak\(|sectionCommissions|sectionPrices|labelIconPrice|TweakSection" (in c:\Users\mathe\Documents\GitHub\ruzowl-portfolio\app.jsx)
27 lines of output
Read c:\Users\mathe\Documents\GitHub\ruzowl-portfolio\app.jsx (lines 1245-1344)
Grep "iconPrice|halfbodyPrice|fullbodyPrice" (in c:\Users\mathe\Documents\GitHub\ruzowl-portfolio\index.html)
3 lines of output
Grep "tweaks\.iconPrice|tweaks\.halfbodyPrice|tweaks\.fullbodyPrice|tier\.price" (in c:\Users\mathe\Documents\GitHub\ruzowl-portfolio\app.jsx)
7 lines of output
Bash Check git remote URL for GitHub repo path
IN
git remote -v

OUT
origin	https://github.com/UnusualHatter/ruzowl-portfolio.git (fetch)
origin	https://github.com/UnusualHatter/ruzowl-portfolio.git (push)
Repo found: UnusualHatter/ruzowl-portfolio. Now creating the data file + wiring up the publish flow.

Write c:\Users\mathe\Documents\GitHub\ruzowl-portfolio\data\commissions.json
9 lines
{
  "status": "open",
  "slotsCurrent": 2,
  "slotsMax": 5,
  "iconPrice": 45,
  "halfbodyPrice": 50,
  "fullbodyPrice": 70
}
Now add constants + helpers near the top of app.jsx:

Edit c:\Users\mathe\Documents\GitHub\ruzowl-portfolio\app.jsx
Added 65 lines
Now add the publish UI strings to TEXT (en + pt):

Edit c:\Users\mathe\Documents\GitHub\ruzowl-portfolio\app.jsx
Added 8 lines
Edit c:\Users\mathe\Documents\GitHub\ruzowl-portfolio\app.jsx
Added 8 lines
Add the PublishToGitHub component right above AdminLogin:

Edit c:\Users\mathe\Documents\GitHub\ruzowl-portfolio\app.jsx
Added 71 lines
You've hit your limit · resets 4:30pm (America/Sao_Paulo)