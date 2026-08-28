# Wumtech — Website (Phase 1)

A static website for Wumtech's AI Visibility funnel: homepage, AI Visibility page,
free Score tool, $49 90-Day Plan offer, About, Contact, Privacy and Terms.

Plain HTML/CSS/JS — **no build step, no framework, no server required.**
That means it can be deployed to literally any static web host.

## What's in here

```
index.html          Homepage
ai-visibility.html   AI Visibility method + FAQ
score.html           Free AI Visibility Score tool (in-browser demo)
90-day-plan.html     $49 offer / checkout page
about.html           About / founder
contact.html         Contact form
privacy.html         Placeholder privacy policy
terms.html           Placeholder terms of service
assets/style.css     All styling (design tokens at the top)
assets/script.js     Nav toggle, score demo, form handling
```

## Deploy it — pick any option

### Option A: Netlify (drag and drop, easiest)
1. Go to https://app.netlify.com/drop
2. Drag the whole `wumtech` folder onto the page.
3. Done — you get a live URL immediately. Add a custom domain in Site settings → Domain management.

### Option B: Vercel
1. `npm i -g vercel` (one-time)
2. From inside this folder, run `vercel` and follow the prompts (choose "no framework" / static).

### Option C: GitHub Pages
1. Create a new GitHub repo and push this folder's contents to it.
2. Repo Settings → Pages → Deploy from branch → `main` / root.
3. Your site publishes at `https://<username>.github.io/<repo>/`. Add a custom domain in the same settings screen.

### Option D: Any traditional web host (GoDaddy, Bluehost, cPanel, etc.)
1. Connect via FTP/SFTP or the host's File Manager.
2. Upload everything in this folder into your `public_html` (or equivalent) root.
3. Make sure `index.html` sits at the root — most hosts serve it automatically.

### Option E: Cloudflare Pages, Firebase Hosting, S3 + CloudFront
All of these accept a folder of static files the same way — upload this folder as-is.

## Pointing your domain (wumtechconsult.com)

Wherever you deploy, the host will give you either:
- **Name servers** to set at your domain registrar, or
- **A/CNAME records** to add in your registrar's DNS settings.

Follow your chosen host's domain-connection instructions; the process above doesn't change.

## Connecting real functionality (this ships as a working demo)

**Update (integration with the live diagnostic app):** `score.html`, `index.html`'s embedded
free-score form, and `90-day-plan.html` now hand off to the real Wumtech AI Visibility
Diagnostic app instead of running a fake demo. Each has a small inline script near the bottom
of the file that reads `WUMTECH_APP_URL` (currently set to `https://diagnostic.wumtechconsult.com`)
and redirects there with the entered details as query parameters. **If you ever move the app to
a different subdomain, update that one constant in all three files** — search for
`WUMTECH_APP_URL` across the project.

The contact form below is still demo-only and not yet connected to anything.

### 1. The Free AI Visibility Score (`score.html`, `index.html`)
Now redirects to the real app instead of running a fake demo. The old client-side score
simulator has been removed from `assets/script.js` entirely (it's no longer just dead code —
it's gone).

### 2. The $49 checkout (`90-day-plan.html`)
~~The email field currently just shows a placeholder message.~~ — now redirects to the app,
where the real Stripe Checkout flow lives. The email collected here isn't used by the app yet
(the app collects its own business profile before checkout) — it's passed through as a query
parameter in case you want to wire up email capture on the app side later.

### 3. Contact form (`contact.html`) and lead capture
Both currently show a "thanks, this doesn't send anywhere yet" message. Easiest
fixes, no backend required:
- **Netlify Forms** — add `netlify` and `data-netlify="true"` attributes to the
  `<form>` tags if hosting on Netlify; submissions appear in your Netlify dashboard.
- **Formspree** (https://formspree.io) — works on any host; point the form's
  `action` to your Formspree endpoint.
- Then remove or adjust the `data-demo-form` submit handler in `assets/script.js`
  so it doesn't intercept the real submission.

## Editing content

Everything is plain HTML — open any `.html` file in a text editor and edit the
copy directly. Shared design tokens (colors, fonts, spacing) live at the top of
`assets/style.css` under `:root`, so a palette or type change there updates the
whole site.

## Roadmap (per the original blueprint)

This build covers **Phase 1 — Sell**: get the free score → $49 plan funnel live.

**Phase 2 — Expand**: add `/ai-solutions`, `/data-analytics`, `/higher-education`,
`/products`, `/resources` pages using the same header/footer/section patterns
already established in the pages here.

**Phase 3 — Scale**: client dashboard, AI visibility monitoring, competitor
tracking, subscriptions, digital-product marketplace — these need a real backend
and are a natural follow-up once Phase 1 is validated.
