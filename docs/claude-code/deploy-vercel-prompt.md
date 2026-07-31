# Claude Code prompt — Deploy leafsp.com to Vercel + connect the domain

Copy everything in the fenced block below and paste it as your message to
Claude Code, from inside the `leafsp` project folder.

---

```text
You are continuing work on the official website for LEAF Software and Production
Co., Ltd. (บริษัท ลีฟ ซอฟต์แวร์ แอนด์ โปรดักชัน จำกัด), a software & digital
production company in Chiang Mai, Thailand. The website already exists in this
repository. Your job now is to DEPLOY it — nothing else.

FIRST, read `CLAUDE.md` and `README.md` in the repo root for full context
(tech stack, structure, conventions, company facts).

Quick facts:
- Static site: Astro 5 + Tailwind CSS 4, bilingual (English at `/`, Thai at `/th/`).
- Fully static output in `dist/` — no server, no SSR, no database.
- Domain already purchased: leafsp.com (I'll tell you the registrar when you ask).
- `astro.config.mjs` already sets `site: 'https://leafsp.com'`.

════════════════════════════════════════════════════════════════════
GOLDEN RULES — follow strictly
════════════════════════════════════════════════════════════════════
1. DO NOT run `git commit` or `git push`, and DO NOT stage changes. When you
   finish, instead WRITE OUT a suggested commit message for me — a short subject
   line plus a longer description — and let me commit it myself. Never create a
   commit or push on my behalf.
2. Do NOT change the design, brand colors, logo, or page copy. This task is
   deployment only.
3. Keep the site fully static — do NOT add an SSR adapter (`@astrojs/vercel`)
   or any server runtime.
4. Whenever a step needs my login, my account, or a decision (registrar choice,
   which Vercel account/team), STOP and ask me instead of guessing.

════════════════════════════════════════════════════════════════════
WHAT TO DO
════════════════════════════════════════════════════════════════════
Phase 1 — Verify the build
- Run `npm install`, then `npm run build`; confirm it builds cleanly to `dist/`.
- Run `npm run preview` and confirm every page loads: `/`, `/services`,
  `/about`, `/contact`, and each `/th/...` equivalent.
- Report any problem before continuing.

Phase 2 — Deploy to Vercel
- Recommend the cleanest path and set it up. My preference order:
  (a) Git-based deploy (preferred): guide me through importing this repo at
      vercel.com → New Project. Tell me the EXACT settings to enter — framework
      preset (Astro), build command (`npm run build`), output directory
      (`dist`), install command (`npm install`). This gives auto-deploys and
      per-branch preview URLs.
  (b) CLI deploy (alternative): if I prefer, walk me through `npx vercel` then
      `npx vercel --prod`. I will handle the browser login step myself.
- This is a STATIC site, so NO Vercel adapter is required. Do not install one.
- If a small `vercel.json` would help (e.g. `www`→apex redirect or clean-URL
  behavior), propose it and explain what it does before creating it.
- Confirm the `*.vercel.app` URL works before touching the domain.

Phase 3 — Connect the domain leafsp.com
- Ask me which registrar I bought leafsp.com from, and confirm my default
  preference: serve on the apex `leafsp.com` with `www.leafsp.com` redirecting
  to it.
- In Vercel → Project → Settings → Domains, add `leafsp.com` and
  `www.leafsp.com`.
- Give me the EXACT DNS records Vercel shows for this project (usually an `A`
  record for the apex and a `CNAME` for `www`). Read them from the Vercel
  dashboard — do NOT hard-code IPs, since they can differ per project.
- Explain that Vercel issues HTTPS automatically once DNS resolves, and roughly
  how long propagation takes.
- Tell me exactly how to verify it's live and secure (padlock, both languages
  load, `www`→apex redirect works).

Phase 4 — Pre-launch checklist (remind me)
- Set `WEB3FORMS_ACCESS_KEY` in `src/config.ts` so the contact form delivers to
  leaf.sandp@gmail.com (see README). It's a public client key — safe to commit,
  no env var needed.
- Confirm `sitemap-index.xml`, `robots.txt`, and the Open Graph image all
  resolve on the live domain.

════════════════════════════════════════════════════════════════════
WHEN DONE
════════════════════════════════════════════════════════════════════
- Summarize what was set up and the exact steps left for me (DNS records to
  enter, form key).
- Provide a suggested commit message (subject + description) for any files you
  changed (e.g. a new `vercel.json`) — but DO NOT commit or push it.
```

---

## Notes for you (the owner)

- If you'd rather deploy to your **Thai cPanel hosting** instead of Vercel, tell
  Claude Code: *"Deploy to cPanel shared hosting following the steps in
  README.md instead of Vercel"* — the `.htaccess`, HTTPS, and DNS steps are
  already documented there.
- The **"do not commit/push"** rule is also written into `CLAUDE.md`, so it
  applies to every future Claude Code session in this repo, not just this one.
- Want this prompt in Thai? Ask and it can be translated.
