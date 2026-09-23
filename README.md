# LEAF Software and Production Website

The official website for **LEAF Software and Production Co., Ltd.** — a clean,
modern, **bilingual (Thai + English)** static site built with **Astro** and
**Tailwind CSS**. It compiles to plain HTML/CSS and deploys anywhere, including
Thai **cPanel shared hosting**.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Astro 5](https://astro.build) (static output, built-in i18n) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) with brand design tokens |
| Language | TypeScript |
| Fonts | Self-hosted via `@fontsource` — IBM Plex Sans / IBM Plex Sans Thai / Space Grotesk (no external requests) |
| Forms | Google Apps Script endpoint → Google Sheet + email notification (no backend to host) |
| SEO | Sitemap, hreflang, Open Graph, JSON-LD Organization schema |

The whole site ships **almost no JavaScript**, so pages are fast and score
highly on performance.

---

## Project structure

```
src/
├── config.ts              # Company facts, contact info, nav, service list, form key
├── i18n/
│   ├── ui.ts              # ALL page copy, in English (en) + Thai (th)
│   └── utils.ts           # Language detection + path helpers
├── layouts/BaseLayout.astro   # <head>, SEO, header, footer
├── components/
│   ├── Header.astro / Footer.astro / LanguageSwitcher.astro
│   ├── Button.astro / Section.astro / ServiceCard.astro / Icon.astro / Logo.astro
│   └── sections/          # Page bodies: HomeBody, ServicesBody, AboutBody, ContactBody
├── pages/
│   ├── index.astro services.astro about.astro contact.astro 404.astro   (Thai, at /)
│   └── en/…               # English mirror, served at /en/
└── styles/global.css      # Design tokens (colors, fonts, spacing, shadows)
public/                    # Logos, favicons, og-image, robots.txt, .htaccess, manifest
```

---

## Editing content

- **Text (both languages):** edit `src/i18n/ui.ts`. Every string exists under
  `en` and `th` — keep them in sync.
- **Company details** (email, phone, address, service list): edit `src/config.ts`.
- **Colors / fonts / spacing:** edit the design tokens at the top of
  `src/styles/global.css`.
- **Logo & favicons:** replace the files in `public/`
  (`logo-lockup.svg`, `logo-mark.png`, `favicon-*.png`, `og-image.png`).

### Adding a page later (e.g. Portfolio or Blog)

1. Add the route to `ROUTES` and (optionally) `NAV_ITEMS` in `src/config.ts`.
2. Add its copy to `src/i18n/ui.ts`.
3. Create `src/pages/<name>.astro` (Thai) and `src/pages/en/<name>.astro`.

---

## Contact form setup

Enquiries are handled by a **Google Apps Script web app** (`scripts/contact-form.gs`):
it appends one row per enquiry to a Google Sheet and emails the team. There is
no server to host — the Sheet is the record and the script is the backend.

Until `CONTACT_ENDPOINT` is set, the form does not pretend to send: it shows the
enquiry for the visitor to copy and email in.

### One-time setup (about 10 minutes)

Do this while signed in as **watcharapong5550@gmail.com** — the script sends
mail as whoever deploys it.

1. Create a Google Sheet (any name, e.g. "leafsp.com enquiries").
2. In that Sheet: **Extensions → Apps Script**. Delete the sample code, paste
   the whole of `scripts/contact-form.gs`, and save.
3. **Deploy → New deployment → Web app** with:
   - *Execute as:* **Me** (`watcharapong5550@gmail.com`)
   - *Who has access:* **Anyone**
4. Approve the permissions prompt (it asks for the Sheet and for sending mail),
   then copy the **Web app URL** — it ends in `/exec`.
5. Paste it into `src/config.ts`:
   ```ts
   export const CONTACT_ENDPOINT = 'https://script.google.com/macros/s/…/exec';
   ```
6. Rebuild (`npm run build`) and re-upload.

Notifications go to `leaf.sandp@gmail.com` (`NOTIFY_TO` at the top of the
script). The enquirer's address is set as **Reply-To**, so replying in Gmail
answers the customer.

### Afterwards

- **Changing the script** needs a redeploy to take effect: **Deploy → Manage
  deployments → edit → Version: New version**. The URL stays the same.
- The Sheet's `Status`, `Owner` and `Notes` columns are left empty on purpose —
  fill them in to track leads.
- The endpoint URL is public, so it can receive junk. The form's hidden
  honeypot field and the script's validation catch the obvious cases; add
  [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) if real
  spam starts arriving.
- Consumer Gmail allows roughly 100 script-sent emails per day.

---

## Deploying to Thai cPanel hosting

1. **Build:** run `npm run build`. This creates a `dist/` folder.
2. **Upload:** in cPanel → **File Manager**, open `public_html`. Upload
   **the contents of `dist/`** (not the folder itself) — so `index.html` sits
   directly in `public_html`. The included `.htaccess` (clean URLs, HTTPS
   redirect, caching, gzip, security headers) uploads with it.
   *Tip:* zip `dist/`, upload the zip, then "Extract" in File Manager.
3. **Point the domain:** in your domain registrar, set the nameservers or DNS
   `A` record for **leafsp.com** to your hosting provider (they'll give you the
   exact values). Add both `leafsp.com` and `www.leafsp.com`.
4. **Enable HTTPS:** in cPanel → **SSL/TLS Status**, run **AutoSSL** (free
   Let's Encrypt). Once the padlock is active, the `.htaccess` HTTPS redirect
   takes effect.

**Future updates:** rebuild and re-upload the `dist/` contents. That's it.

### Deploying elsewhere (portable)

The same `dist/` output works on any static host with **zero code changes**:

- **Netlify / Cloudflare Pages / Vercel:** connect the repo; build command
  `npm run build`, publish directory `dist`. Auto-deploys on every push.
- **VPS / Thai cloud (ByteArk, CloudHM):** serve `dist/` with Nginx/Apache.

---

## Authors

- [@Watcharapong Wanna](https://github.com/jaytakuz)
- [@Sittisak Sutthi](https://github.com/itsheroz)

---

© LEAF Software and Production Co., Ltd.
