# CLAUDE.md — Project context for Claude Code

This file gives you (Claude Code) the standing context for this repository.
Read it fully before making changes. It applies to **every** task in this repo.

---

## ⛔ Golden rules (highest priority — never violate)

1. **NEVER run `git commit` or `git push`, and never stage changes for the
   user.** When your work is complete, instead **output a suggested commit
   message** — a concise subject line plus a longer description of what changed
   and why — and let the human run the commit themselves. Creating commits or
   pushing on the user's behalf is not allowed under any circumstances.
2. **Do not change brand colors, the design system, the logo, or page copy
   unless explicitly asked.** These were carefully derived from the company's
   identity. Design tokens live in `src/styles/global.css`.
3. **Keep the site fully static.** Do not add an SSR adapter, a database, or a
   server runtime unless the user explicitly requests it. The whole value of
   this project is that it deploys as plain HTML/CSS anywhere.
4. **Keep English and Thai content in sync.** Every string in `src/i18n/ui.ts`
   exists under both `en` and `th`. If you add or change one language, update
   the other.
5. If a step needs the user's account, login, secret, or an irreversible
   decision, **stop and ask** rather than guessing.

---

## What this project is

The official website for **LEAF Software and Production Co., Ltd.**
(บริษัท ลีฟ ซอฟต์แวร์ แอนด์ โปรดักชัน จำกัด) — a software & digital production
company based in Chiang Mai, Thailand. Domain: **leafsp.com**.

Design goals: clean, modern, uncluttered, unmistakably a software company at
first glance, concise, and user-friendly for potential clients. Bilingual
(Thai + English).

## Company facts (source of truth: `src/config.ts`)

- Registered (EN): LEAF Software and Production Co., Ltd.
- Registered (TH): บริษัท ลีฟ ซอฟต์แวร์ แอนด์ โปรดักชัน จำกัด
- Email: leaf.sandp@gmail.com · Phone: 087-726-2909
- Address: 222/92 Nawarat Village, Moo 3, Nong Kaeo Subdistrict, Hang Dong
  District, Chiang Mai 50230
- Six service pillars: Software Development · UX/UI Design · AI, Data & IoT ·
  QA, Testing & Security · Digital Media & Production · Consulting & Training

## Tech stack

- **Astro 5** (static output, built-in i18n) — English at `/`, Thai at `/th/`
- **Tailwind CSS 4** via `@tailwindcss/vite`; tokens in `src/styles/global.css`
- **TypeScript**
- **Fonts:** self-hosted via `@fontsource` (IBM Plex Sans / IBM Plex Sans Thai /
  Space Grotesk) — **no external font/CDN requests; keep it that way**
- **Contact form:** Web3Forms (no backend) with a `mailto:` fallback
- **SEO:** `@astrojs/sitemap`, hreflang, Open Graph, JSON-LD Organization

## Commands

```bash
npm install       # install deps
npm run dev       # dev server → http://localhost:4321
npm run build     # production build → dist/
npm run preview   # preview the built site
```

## Structure

```
src/
├── config.ts                 # company facts, contact, nav, service list, form key
├── i18n/ui.ts                # ALL copy (en + th)  ← edit text here
├── i18n/utils.ts             # language detection + path helpers
├── layouts/BaseLayout.astro  # <head>, SEO, hreflang, header, footer
├── components/               # Header, Footer, Button, Icon, Logo, ServiceCard, …
│   └── sections/             # HomeBody, ServicesBody, AboutBody, ContactBody
├── pages/*.astro             # English routes (/)
├── pages/th/*.astro          # Thai routes (/th/)
└── styles/global.css         # design tokens (colors, fonts, spacing, shadows)
public/                       # logos, favicons, og-image, robots.txt, .htaccess, manifest
```

## Conventions

- **Text** → `src/i18n/ui.ts` (bilingual). **Company details** → `src/config.ts`.
- **Colors/fonts/spacing** → tokens at the top of `src/styles/global.css`.
  Brand green scale + lime accent are sampled from the logo; all pairings meet
  WCAG AA. Preserve accessibility if you touch them.
- **Adding a page:** add to `ROUTES` (and optionally `NAV_ITEMS`) in
  `config.ts`, add copy to `ui.ts`, create `src/pages/<name>.astro` **and**
  `src/pages/th/<name>.astro`.
- Prefer editing the shared `sections/*Body.astro` components (they take a
  `lang` prop and power both languages) over duplicating markup.
- Verify with `npm run build` before declaring a task done.

## Deployment

- **Vercel (planned first):** static Astro, framework preset auto-detected,
  build `npm run build`, output `dist`. **No Vercel adapter needed** (static).
- **Thai cPanel hosting (portable alternative):** upload the contents of
  `dist/` to `public_html`; the included `public/.htaccess` handles HTTPS
  redirect, clean URLs, gzip, caching, and security headers. Full steps in
  `README.md`.
- **Contact form:** the `WEB3FORMS_ACCESS_KEY` in `src/config.ts` is a public
  client key (safe to commit, no env var needed). Until it's set, the form
  falls back to opening the visitor's email app.
