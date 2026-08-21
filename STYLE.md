# PrepAI — Frontend Style Guide

Reference doc for designing new screens/components that feel native to the existing app. Extracted directly from the current implementation (`app/globals.css`, `components/ui/Brand.jsx`, and usage patterns across `components/*.jsx`) — not aspirational, this is what's actually in production.

Stack: **Next.js (App Router) + React + Tailwind CSS v4** (CSS-first `@theme` config, no `tailwind.config.js`) + `lucide-react` icons + JetBrains Mono.

---

## 1. Brand identity

- Name is always lowercase in the wordmark: `prep` (white) + `ai` (blue) + optional blinking `_` caret.
- Mascot: a friendly rounded robot — light-blue gradient body, white oval face panel, two black dot eyes, small curved smile, thin antenna with a ball tip. Exists in two forms:
  - **Full 3D mascot** (`public/robot-a.png`, `public/robot-b.png`) — used for hero art, empty states, loading screens. Rendered via the `Robot` component with a soft blue drop-shadow and a slow `bob` float.
  - **Flat icon mark** (`RobotMark` inside `components/ui/Brand.jsx`) — simplified 2D version of the mascot used for the navbar logo and favicon (`app/icon.svg`). No background box — just the icon floating on the dark background.
- Brand gradient (purple → blue), used across CTAs, glows, and chart bars:
  ```css
  linear-gradient(135deg, #8b5cf6, #5b9be8)
  ```
- Logo lockup = `RobotMark` (28px) + `prep` + `ai` (blue) + animated `_` caret. See `BrandMark` in `Brand.jsx`.

---

## 2. Color system

Defined in `app/globals.css` under `@theme` (Tailwind v4 CSS-first tokens) — these generate real utility classes: `text-purple`, `bg-good/15`, `border-bad/20`, etc.

| Token | Hex | Utility | Use |
|---|---|---|---|
| Purple | `#8b5cf6` | `purple` | Primary brand accent, active states, links |
| Purple light | `#a78bfa` | `purple-light` | Secondary accent, gradient stops |
| Purple lilac | `#c4b5fd` | `purple-lilac` | Text on purple-tinted backgrounds |
| Panel | `#0e0e14` | `panel` | Card backgrounds |
| Field | `#16161e` | `field` | Input backgrounds, inset chips, track bars |
| Good | `#34d399` | `good` | Success, positive scores, streak-active |
| Bad | `#f87171` | `bad` | Errors, destructive actions, low scores |

**Blue accent** (not in `@theme`, used inline as an arbitrary value — `text-[#5b9be8]`): `#5b9be8` (deep) / `#8ec5f0` (light). Used for the mascot/robot color, secondary metric (communication), and the "ai" wordmark.

**Base surface:**
- App background: `#08080c`, with two soft radial glows layered on top (`.prepai-bg` class) — one purple top-right, one blue bottom-left, very low opacity (`.22` / `.12`).
- Foreground text: `#f2f2f5`.

**Text gray ramp** (arbitrary values, no theme tokens — apply by eye based on hierarchy):

| Hex | Role |
|---|---|
| `#f2f2f5` | Primary text / headings |
| `#e6e6ec` | Secondary emphasis text |
| `#c4c4cf` | Body text on cards |
| `#9090a0` | Muted labels (badges) |
| `#8a8a97` | Subtext / descriptions |
| `#7a7a87` | Tertiary labels, tracked-out uppercase captions |
| `#6f6f7c` | Faint metadata (timestamps, counts) |
| `#5c5c68` | Very low-emphasis text |
| `#4f4f5c` | Placeholder text only |

**Status colors beyond the theme tokens** (inline hex, used consistently):
- Difficulty/role accent chips reuse purple/blue/green/red from the palette above rather than inventing new ones.
- Score coloring convention (see `DashboardView.jsx`): `score >= 80` → good, `score >= 60` → default text, else → bad.

**Borders:** always white at low opacity over dark surfaces — `border-white/[.05]` to `border-white/[.12]`, most commonly `.07` for cards and `.1` for inputs.

---

## 3. Typography

- Single typeface everywhere: **JetBrains Mono** (`next/font/google`, weights 400–800), applied as both `font-sans` and `font-mono` — i.e. the whole UI is monospace, including body copy. This is a deliberate "terminal/dev tool" aesthetic.
- Headings are `font-extrabold` with tight/negative tracking: `tracking-[-1px]` to `tracking-[-.5px]`.
- Body and UI copy is frequently **lowercase by design intent** ("welcome back", "your prep modules are calibrated and ready", "sign in to continue your prep journey") — casual, terminal-log voice. Don't default to Title Case for descriptive copy.
- Small uppercase labels (`text-[10px]` to `text-[11px]`, `tracking-[.4px]` to `tracking-[.8px]`, color `#7a7a87`) are used everywhere as section/stat captions: `"ACTIVE WORKSPACE"`, `"PROGRESS"`, `"THIS WEEK"`.
- Section labels sometimes use a code-comment motif via the `Label` component: `// quick actions`, `// recommended next` — purple, uppercase, small.
- Font sizes are fine-grained arbitrary values (`text-[13.5px]`, `text-[11.5px]`, `text-[19px]`, `text-[27px]`), not Tailwind's default scale — pick what reads right rather than snapping to `sm/base/lg`.

---

## 4. Layout, spacing & radius

- **Border radius scale:** controls/badges `9–11px` (`rounded-[9px]`, `rounded-[11px]`), buttons `12px` (`rounded-xl`), cards `14–16px` (`rounded-[14px]`, `rounded-2xl`), pills/avatars `rounded-full`.
- **Cards** (`Card` component in `Brand.jsx`): `bg-panel border border-white/[.07] rounded-2xl`, padding typically `p-5` to `p-6` for content cards, `p-[18px]` for tighter sidebar cards.
- Page content max-width is fluid/responsive (no fixed container), with generous horizontal padding at the shell level (`px-5 sm:px-8 lg:px-14 xl:px-20` on the navbar).
- Grids follow a content/sidebar split: `grid-cols-1 lg:grid-cols-[1fr_300px]` or similar asymmetric fractions (`.9fr_1.1fr`, `1.35fr_.65fr`) rather than even columns.
- Entrance animation: nearly every top-level view wraps in `<div className="animate-rise">` (fade + rise 14px, 0.6s ease).

---

## 5. Core components

**Buttons**
- Primary CTA: gradient fill, white text, soft colored shadow.
  ```jsx
  style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 10px 26px rgba(124,58,237,.36)" }}
  ```
  (Dashboard's "start interview" CTA uses a slightly different gradient stop: `#7c3aed → #6d28d9`.)
- Secondary/ghost button: `bg-panel border border-white/[.07]`, plain text, icon in a small `bg-field` chip on the left.
- Tab toggle (login/signup style): pill container `bg-field border border-white/[.06] rounded-xl p-[5px]`, active segment `bg-purple/18% + text #c4b5fd`, inactive `transparent + #7a7a87`.
- Disabled state: `disabled:opacity-50` to `disabled:opacity-70`, never a color change.
- Loading state inside a button: small spinning ring (`w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin`) + label swap (e.g. "Save & continue →" → "Evaluating…").

**Forms** (`fieldClass` / `labelClass` in `Brand.jsx`)
- Label: 10px uppercase, `#7a7a87`, `tracking-[.6px]`, `mb-2.5`.
- Input/select/textarea: `bg-field border border-white/[.1] rounded-[11px] px-3.5 py-3 text-[13.5px]`, no focus ring styling beyond the browser default (`outline-none` with no replacement — consider adding a visible focus state if accessibility matters for new work).
- Errors: `bg-bad/10 border border-bad/20 text-bad`, small rounded banner above the form, not inline per-field.

**Stat tiles** (dashboard cards): label + small icon-in-tinted-chip (top row) → big number (bottom) → muted subtext. Chip pattern: `w-6 h-6 rounded-lg` background = color at 14% opacity, inner `w-2 h-2 rounded-[3px]` solid dot in the same hue.

**Badges/pills:** `text-[9.5px] px-[7px] py-0.5 rounded-md`, background = brand color at ~16% opacity, text = the lighter tint of that color (e.g. purple bg `rgba(139,92,246,.16)` + text `#c4b5fd`).

**Progress bars:** `h-1.5 bg-field rounded-full overflow-hidden` track, gradient or solid fill, `transition-[width] duration-300` when driven by state.

**Navbar:** sticky, `rgba(8,8,12,.78)` background with `backdrop-filter: blur(12px)`, bottom border `border-white/[.07]`. Active nav item: `bg-purple/16% + text #c4b5fd + font-weight 600`. Inactive: transparent + `#8a8a97`.

---

## 6. Iconography

- Primary icon set: `lucide-react`, stroke icons, typically `w-4 h-4` inline / `w-3.5 h-3.5` for small inline icons.
- Custom brand SVGs (robot mark) are hand-authored inline `<svg>` in `Brand.jsx`, not from an icon library — keep this pattern for any future brand-specific glyphs (favicon, logo) rather than mixing in stock icon packs for brand marks.
- Icons inherit color via `currentColor` or are given an explicit hex fill matching the surrounding accent.

---

## 7. Motion

Defined once in `globals.css`, reused by name everywhere — don't invent new ad-hoc animations if one of these fits:

| Class | Effect | Typical use |
|---|---|---|
| `animate-rise` | fade + rise 14px, 0.6s | page/section entrance |
| `animate-floaty` | vertical float ±14px, 4s loop | large decorative elements |
| `animate-bob` | vertical bob ±6px, 3s loop | mascot idle motion |
| `animate-glowpulse` | opacity/scale pulse, 2.6s loop | glow blobs behind hero art |
| `animate-caret` | hard on/off blink, 1s steps | the `_` brand caret |
| `animate-dotp` | bounce + fade dot, 1.1s loop | "..." loading dots |
| `animate-toast` / `animate-toast-progress` | slide-in/out + shrinking bar, 3s | toast notifications |
| `.skeleton` | shimmer sweep | loading placeholders |

---

## 8. Voice & microcopy

- Lowercase, calm, slightly technical — reads like CLI/system output, not marketing copy: "loading ai simulator configuration node…", "calibrating voice signal pipeline…", "your prep modules are calibrated and ready."
- Section headers as code comments: `// quick actions`.
- Numbers and stats are terse: `92%`, `4 days`, no unnecessary words.

---

## 9. When designing something new

1. Reuse `Card`, `fieldClass`, `labelClass`, `Label`, `Robot`, `BrandMark` from `components/ui/Brand.jsx` before writing new markup.
2. Stay inside the existing palette — purple/blue as brand accents, green/red only for good/bad states, grays only from the ramp in §2. Don't introduce new hues.
3. Every interactive surface gets a `border-white/[.0x]` hairline, not a solid border color.
4. Prefer arbitrary Tailwind values (`text-[13px]`, `rounded-[11px]`) to match the existing fine-grained scale rather than snapping to default Tailwind sizes.
5. Copy is lowercase and terse unless it's a proper noun.
