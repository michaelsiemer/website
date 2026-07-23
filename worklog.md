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
- Next: user tests email round-trip, then Phase 3 registrar transfer to Cloudflare.
- Email round-trip test passed both directions (2026-07-23). Phase 2 fully verified.
