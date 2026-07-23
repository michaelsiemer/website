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
