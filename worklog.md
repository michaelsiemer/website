# worklog — michael-siemer.com

## 2026-07-22
- Approved Editorial Serif design via visual mockups; spec + plan committed.
- Built site scaffold: style.css, index.html.
- Next: working-papers, publications, cv pages.

## 2026-07-23 (deploy)
- Site live at https://michaelsiemer.github.io/website/ (all 4 pages verified).
- Next: DNS inventory → Cloudflare zone → nameserver switch.

## 2026-07-23 (DNS cutover)
- Cloudflare zone built (15 records, all DNS-only); caught auto-import setting DKIM CNAMEs to Proxied and corrected them.
- Nameservers switched WordPress -> kayden/monika.ns.cloudflare.com; propagated.
- Verified post-cutover: MX, SPF, DMARC, 3x DKIM all identical to pre-migration inventory.
- CNAME file added; GitHub Pages cert approved, HTTPS enforced. All 4 pages + CV PDF return 200 on michael-siemer.com; www and http 301 to canonical https apex.
- Email round-trip test passed both directions. Phase 2 fully verified.

## 2026-07-23 (content edits)
- Added click-to-expand abstracts on paper titles (native `<details>`, no JS); hint sits on its own line under each title. Abstracts verbatim from source — published versions for journal articles, FEDS/RePEc/paper PDF for working papers.
- Papers without a public abstract left as plain titles: Bank Health and Local Economic Outcomes; Chicago Fed Letter.
- Fixed inherited bad link: Firm Entry and Employment Dynamics pointed to FEDS 2013-85 (a different paper) on the old site; now FEDS 2014-56.
- Working Papers page reordered — Work in Progress now first. Added "Forecasting the Past: What AI Macroeconomic Forecasts Measure" (with Cristina Fuentes-Albero & Manuel González-Astudillo, coming soon) and "The Cost of Speed in AI Adoption" (sole-authored, coming soon). Dropped the Gourio "Missing Generation of Firms" entry.
- Section labels enlarged 11px → 13px. Nav/footer/copyright text darkened to var(--muted) for WCAG AA contrast (was 2.8:1).

## 2026-07-23 (registrar transfer initiated)
- Transfer to Cloudflare Registrar submitted; registry shows `pendingTransfer` as of 11:23 UTC. Cost $10.46, adds one year (new expiry ~2027-09-09).
- WordPress approval link was dead — harmless; ICANN auto-completes after ~5 days (~2026-07-28).
- Files changed to date: index.html, working-papers.html, publications.html, cv.html, style.css, CNAME, assets/cv.pdf, docs/dns-inventory.txt, docs/superpowers/{specs,plans}/.
- WordPress auto-renew turned OFF (2026-07-23) to avoid double-paying. RISK: registration expires 2026-09-09 with no fallback renewal. If the transfer fails, must re-enable WordPress renewal or retry the transfer before that date — a lapse takes down both the site and Proton email.
- Next steps (after transfer completes ~07-28):
  1. Verify registrar via `whois michael-siemer.com` → expect "Cloudflare, Inc." (load-bearing now that auto-renew is off)
  2. Enable auto-renew in Cloudflare Domain Registration.
  3. Cancel WordPress.com plan (NOT before step 1 confirms).
  4. Unpublish old Google Site (sites.google.com/view/michael-siemer) to avoid a stale duplicate in search results.
- Open items: no abstracts yet for Bank Health and Local Economic Outcomes or the two new work-in-progress papers; no photo on homepage.

## 2026-07-23 (SEO, discoverability, analytics)
- Homepage: added About section (career, BTFP work + Board award, education, referee/seminar activity); tightened hero bio; restored portrait from full-res original (assets/originals/portrait-full.JPG). BTFP wording softened to avoid implying a formal title; matched in both CV .tex variants and site PDF.
- Contact: obfuscated web@michael-siemer.com (email.js) in hero + footer.
- SEO bundle: Open Graph + Twitter cards (branded 1200x630 assets/og-image.jpg), MS monogram favicon (SVG + PNG + apple-touch), JSON-LD Person schema, sitemap.xml, robots.txt, canonical links. All assets verified 200 on live domain.
- CV page: leads with View/Download buttons; inline PDF embed now desktop-only (hidden <760px) since mobile renders it blank.
- Cloudflare Web Analytics: manual JS-snippet mode (token e61af9ff...), not automatic edge injection (site is DNS-only). Verified beacon fires: beacon.min.js 200 + /cdn-cgi/rum 204 on live site.
- Mobile audit: responsive across all pages; the CV embed was the only weak spot, now fixed.

## 2026-07-23 (CV refresh + AI positioning + Cloudflare review)
- CV (both .tex variants in Dropbox/CV + site assets/cv.pdf): dated July 2026; added the two 2026 AI papers to Current Research (Forecasting the Past — with Fuentes-Albero & González-Astudillo; The Cost of Speed in AI Adoption); removed the Gourio "Aggregate Implication of Decline in Firm Entry" line (per user); fixed Uncertainty and International Capital Flows date 2018 → 2015 (matches site). Additions tipped it to a 1-line orphan page 5; reclaimed with \addtolength{\textheight}{0.5in} → back to 4 pages.
- CAVEAT: CV footer page count is HARDCODED "of 4" — the `res` class disables aux files so lastpage can't auto-count. Any future edit that changes page count needs the "4" bumped by hand. CV .tex source lives in Dropbox/CV, NOT in this repo (not version-controlled here).
- Homepage hero bio now names AI: "...and, in current work, what AI means for economic forecasting and adoption."
- Cloudflare review — decisions:
  - Do NOT proxy (stay DNS-only): GitHub Pages already gives HTTPS + CDN; proxying adds redirect-loop risk and duplicates it; analytics already works via manual beacon.
  - DNSSEC currently OFF — enable AFTER registrar transfer completes (safe one-click once Cloudflare is both registrar + DNS; risky mid-transfer).
  - Enable 2FA on Cloudflare + GitHub accounts (domain/DNS/mail routing all behind the CF login now).
  - WAF/caching/bot rules are inert on DNS-only — leave them.
- Open content items: no abstracts yet for Bank Health / the two AI papers (no public draft).

## Post-transfer checklist (after ~2026-07-28, once whois shows Cloudflare)
1. `whois michael-siemer.com` → confirm "Cloudflare, Inc." (load-bearing: WordPress auto-renew is OFF).
2. Enable auto-renew + confirm registrar lock + WHOIS privacy in Cloudflare.
3. Enable DNSSEC (DNS → Settings).
4. Cancel WordPress.com plan (NOT before step 1).
5. Unpublish old Google Site (sites.google.com/view/michael-siemer).
6. Enable 2FA on Cloudflare + GitHub if not already.
