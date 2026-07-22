# michael-siemer.com — Site Rebuild & Migration Design

Date: 2026-07-22
Status: Approved design, pending spec review

## Goal

Replace the Google Sites site at www.michael-siemer.com with a custom static site in this repo, hosted on GitHub Pages. Move the domain from WordPress.com to Cloudflare Registrar. Preserve Proton Mail on the domain with zero mail downtime. Discontinue all WordPress services afterward.

## Current state

- `michael-siemer.com` (apex) → WordPress.com placeholder page (192.0.78.x)
- `www.michael-siemer.com` → CNAME `ghs.googlehosted.com` → live Google Sites site
- Nameservers: ns1–3.wordpress.com (domain registered at WordPress.com)
- Proton Mail runs on the domain via DNS records (MX/SPF/DKIM/DMARC) held at WordPress DNS
- Site content: Home, Working Papers (9 papers), Publications (5), CV

## Decisions made

| Decision | Choice |
|---|---|
| Registrar + DNS | Cloudflare (at-cost, free DNS) |
| Hosting | GitHub Pages (deploy on push) |
| Site tech | Plain HTML/CSS, no build step |
| Design | "Editorial Serif" — approved via mockup |
| Content | Migrate as-is from current Google Sites |

## Site design (approved mockup)

**Aesthetic:** warm paper background (#faf7f2), dark ink text (#1c1813), bronze accent (#8a5a2b), hairline rules (#e2dacb). Serif display/body: Newsreader (Google Fonts, self-hosted or font-display swap). UI labels/metadata: Inter, small-caps-style uppercase with letter-spacing.

**Pages (4):**

1. **Home** (`index.html`)
   - Sticky nav: name left; Home / Working Papers / Publications / CV right
   - Hero: large serif name, italic bronze title ("Principal Economist, Federal Reserve Board"), short bio, profile links (Google Scholar, NBER, SSRN, Federal Reserve)
   - Optional photo slot (right of hero) — include only if user supplies a photo
   - Recent Work: 3 newest working papers as rows (title, coauthors + date, PDF link)
   - Selected Publications strip on darker paper tone (#f3eee3): ReStat 2019, IMF ER 2019, JIE 2013
   - Footer: Fed views disclaimer + fraud notice, copyright
2. **Working Papers** (`working-papers.html`) — all 9 papers in three groups matching current site: current (4), older (4), work in progress (1). Each row: title, coauthors, date/status, links (PDF/FEDS/SSRN). Preserve media-coverage notes (WSJ, Yellen speech for "Firm Entry and Employment Dynamics").
3. **Publications** (`publications.html`) — 5 entries: title, coauthors, journal, year, volume/pages, link.
4. **CV** (`cv.html`) — page linking to/embedding CV PDF (scrape from current site; if the PDF is not retrievable, user supplies it).

Shared: one `style.css`, no JS required (nav is simple links). Responsive: single column under ~700px, photo drops below bio.

## Architecture

- Repo: this directory, pushed to GitHub (public repo, e.g. `michaelsiemer/website` or `michaelsiemer.github.io`)
- GitHub Pages serves from `main` branch root. No build step — HTML/CSS committed directly.
- Custom domain: `michael-siemer.com` apex + `www` redirect (GitHub Pages handles www↔apex redirect once CNAME file + DNS set).
- Cloudflare DNS: apex A → 185.199.108.153 / .109. / .110. / .111.153; `www` CNAME → `michaelsiemer.github.io`. Mail records DNS-only (unproxied).

## Migration sequence (order matters — email must not break)

1. **Build site first.** Deploy to GitHub Pages, verify at `michaelsiemer.github.io` while old site stays live.
2. **Inventory current DNS at WordPress.** Capture every record — especially Proton: MX (mail.protonmail.ch, mailsec.protonmail.ch), SPF TXT, DKIM CNAMEs (protonmail._domainkey ×3), DMARC TXT, and the protonmail verification TXT.
3. **Add domain to Cloudflare (free plan).** Recreate all Proton records exactly. Add GitHub Pages records (step 1's targets). Cloudflare's import scan helps but verify against the inventory manually.
4. **Switch nameservers at WordPress.com → Cloudflare.** Mail keeps working because records already exist at Cloudflare. Site cutover happens simultaneously (DNS now points www + apex at GitHub Pages).
5. **Verify:** site loads on both apex and www with HTTPS; `dig MX` shows Proton; send + receive a test email; Proton dashboard shows all records green.
6. **Transfer registration to Cloudflare Registrar.** Requires: domain unlocked at WordPress, auth/EPP code, ~1 year renewal fee at cost. Note: transfers are blocked within 60 days of registration or a prior transfer — if blocked, wait it out; DNS/hosting already migrated so nothing user-visible depends on the transfer date.
7. **After transfer completes:** cancel WordPress.com plan. Do NOT cancel/delete the domain at WordPress before transfer completes. Retire the Google Sites site.

## Risks & mitigations

- **Mail downtime** — mitigated by creating all Proton records at Cloudflare before the NS switch (step 3 before 4).
- **DKIM CNAMEs proxied by mistake** — Cloudflare defaults some records to proxied; all mail records must be set to DNS-only. Verification step catches this.
- **60-day transfer lock** — doesn't block the site/mail migration (NS switch is independent of registrar transfer).
- **CV PDF unreachable via scraping** — user supplies the file.
- **HTTPS cert delay on GitHub Pages** — cert issuance can take up to ~1 hour after DNS points; old site stays reachable via Google Sites URL meanwhile.

## Manual steps required from user

- Create/log into Cloudflare account; add domain (I can guide or drive via browser)
- At WordPress.com: unlock domain + obtain EPP/auth code (account login required)
- GitHub: repo creation/push (via `gh` CLI if authenticated)
- Supply photo (optional) and CV PDF (if not scrapeable)
- Test email send/receive at verification step

## Testing

- Local: open pages in browser, check all links resolve, responsive at 375px/768px/1280px
- Post-deploy: apex + www load with valid HTTPS; every paper link clicked once; `dig` checks for MX/SPF/DKIM/DMARC; round-trip email test
- Lighthouse pass for accessibility/perf (target ≥95 accessibility)

## Out of scope

- Blog, analytics, contact forms, CMS
- Changing content (migrate as-is; content updates are a follow-up)
