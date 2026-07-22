# michael-siemer.com Rebuild & Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Google Sites site with a custom 4-page static site on GitHub Pages, move DNS to Cloudflare with zero Proton Mail downtime, then transfer the domain registration from WordPress.com to Cloudflare.

**Architecture:** Plain HTML/CSS committed to `michaelsiemer/website` on GitHub, served by GitHub Pages. DNS moves first (nameserver switch to Cloudflare with all Proton records pre-created), registrar transfer happens last and independently.

**Tech Stack:** HTML5, CSS3, Google Fonts (Newsreader + Inter), GitHub Pages, `gh` CLI, Cloudflare (free plan + Registrar), `dig`/`curl` for verification.

## Global Constraints

- No build step. Plain `.html`/`.css` files at repo root only.
- All inter-page links relative (`href="working-papers.html"`) — must work under `michaelsiemer.github.io/website/` before the custom domain exists.
- Palette (exact): paper `#faf7f2`, paper-dark `#f3eee3`, ink `#1c1813`, body text `#4c4437`, muted `#6d6455`, faint `#a3947c`, bronze `#8a5a2b`, rule `#e2dacb`, rule-light `#ece5d8`.
- Type: Newsreader (serif, headings/body), Inter (labels/metadata), loaded from Google Fonts with `display=swap`.
- Every mail-related DNS record at Cloudflare MUST be DNS-only (grey cloud, unproxied).
- Never cancel, delete, or downgrade anything at WordPress.com until the registrar transfer has fully completed (Task 9).
- Site content is verbatim from the current site (inventoried in this plan). No new content.
- Commits: imperative subject line, body explains why; stage specific files, never `git add -A`.
- Homepage photo: omitted (user has not supplied one). Do not add a placeholder image.

## Content Inventory (extracted from live site 2026-07-22 — single source of truth)

Profile links: Google Scholar `https://scholar.google.com/citations?user=JgLyFUYAAAAJ` · NBER `https://www.nber.org/authors_papers/msiemer` · SSRN `https://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=686616` · Fed `https://www.federalreserve.gov/econresdata/michael-siemer.htm` · Fraud info `https://www.federalreserve.gov/consumerscommunities/fraud-scams.htm`
CV PDF: Google Drive id `1CBhQLNL5oS4vCyYpz-bwB31CLWLffpxy`. Papers/publications: full lists with links appear inline in Tasks 2–3 HTML.

---

### Task 1: Scaffold, stylesheet, homepage

**Files:**
- Create: `style.css`, `index.html`, `.nojekyll`, `worklog.md`

**Interfaces:**
- Produces: `style.css` class names consumed by all pages: `.wrap`, `.nav`, `.nav-inner`, `.brand`, `.active`, `.hero`, `.role`, `.bio`, `.profile-links`, `.section-label`, `.paper`, `.meta`, `.paper-links`, `.pubs-strip`, `.pub`, `.pub-venue`, `.page-title`, `footer`, `.copyright`. Shared nav/footer markup defined here is copied verbatim into every page (only the `class="active"` link changes).

- [ ] **Step 1: Create `style.css`**

```css
:root {
  --paper: #faf7f2;
  --paper-dark: #f3eee3;
  --ink: #1c1813;
  --body-text: #4c4437;
  --muted: #6d6455;
  --faint: #a3947c;
  --bronze: #8a5a2b;
  --rule: #e2dacb;
  --rule-light: #ece5d8;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  background: var(--paper);
  color: var(--ink);
  font-family: 'Newsreader', Georgia, serif;
  font-size: 17px;
  line-height: 1.6;
}

.wrap { max-width: 920px; margin: 0 auto; padding-left: 24px; padding-right: 24px; }

a { color: var(--bronze); }

/* ---------- Nav ---------- */
.nav {
  position: sticky; top: 0; z-index: 10;
  background: rgba(250, 247, 242, 0.93);
  backdrop-filter: blur(4px);
  border-bottom: 1px solid var(--rule);
}
.nav-inner {
  display: flex; justify-content: space-between; align-items: baseline;
  flex-wrap: wrap; gap: 8px 16px;
  padding-top: 22px; padding-bottom: 16px;
}
.brand { font-size: 18px; font-weight: 500; color: var(--ink); text-decoration: none; }
.nav nav a {
  font-family: 'Inter', sans-serif;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--faint); text-decoration: none;
  margin-left: 26px;
}
.nav nav a:first-child { margin-left: 0; }
.nav nav a:hover { color: var(--bronze); }
.nav nav a.active { color: var(--ink); }

/* ---------- Hero (homepage) ---------- */
.hero { padding-top: 64px; padding-bottom: 40px; }
.hero h1 { font-size: 44px; font-weight: 500; line-height: 1.08; letter-spacing: -0.015em; }
.role { font-size: 17px; font-style: italic; color: var(--bronze); margin-top: 14px; }
.bio { font-size: 17px; line-height: 1.7; color: var(--body-text); margin-top: 22px; max-width: 560px; }
.profile-links { margin-top: 28px; }
.profile-links a {
  font-family: 'Inter', sans-serif;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--bronze); text-decoration: none;
}
.profile-links a:hover { text-decoration: underline; }
.profile-links .sep { color: var(--faint); margin: 0 12px; }

/* ---------- Section labels & paper rows ---------- */
.section-label {
  font-family: 'Inter', sans-serif;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--bronze);
  border-bottom: 1px solid var(--rule);
  padding-bottom: 10px;
}
.paper { padding: 22px 0; border-bottom: 1px solid var(--rule-light); }
.paper:last-of-type { border-bottom: none; }
.paper h3 { font-size: 20px; font-weight: 500; line-height: 1.3; }
.paper h3 a { color: var(--ink); text-decoration: none; }
.paper h3 a:hover { color: var(--bronze); }
.meta {
  font-family: 'Inter', sans-serif;
  font-size: 13px; color: var(--muted); margin-top: 6px;
}
.paper-links { margin-top: 8px; }
.paper-links a {
  font-family: 'Inter', sans-serif;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--bronze); text-decoration: none; margin-right: 18px;
}
.paper-links a:hover { text-decoration: underline; }
.more-link {
  display: inline-block; margin-top: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 12px; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--bronze); text-decoration: none;
}
.more-link:hover { text-decoration: underline; }

/* ---------- Publications strip (homepage) ---------- */
.pubs-strip { background: var(--paper-dark); padding: 36px 0 40px; margin-top: 24px; }
.pub { font-size: 17px; line-height: 1.5; margin-top: 14px; }
.pub:first-of-type { margin-top: 18px; }
.pub a { color: var(--ink); text-decoration: none; }
.pub a:hover { color: var(--bronze); }
.pub-venue { font-family: 'Inter', sans-serif; font-size: 13px; color: var(--muted); }

/* ---------- Subpage headers ---------- */
.page-title { padding-top: 56px; padding-bottom: 8px; }
.page-title h1 { font-size: 34px; font-weight: 500; letter-spacing: -0.01em; }
main .wrap > .section-label { margin-top: 36px; }

/* ---------- Footer ---------- */
footer { border-top: 1px solid var(--rule); margin-top: 56px; padding: 28px 0 40px; }
footer p {
  font-family: 'Inter', sans-serif;
  font-size: 11px; line-height: 1.6; color: #8b8271; max-width: 640px;
}
footer a { color: #8b8271; }
.copyright { color: var(--faint); margin-top: 10px; }

/* ---------- CV embed ---------- */
.cv-frame { width: 100%; height: 75vh; border: 1px solid var(--rule); margin-top: 24px; background: #fff; }

/* ---------- Responsive ---------- */
@media (max-width: 700px) {
  .hero { padding-top: 40px; }
  .hero h1 { font-size: 34px; }
  .nav-inner { flex-direction: column; align-items: flex-start; }
  .nav nav a { margin-left: 0; margin-right: 20px; }
  .profile-links .sep { margin: 0 8px; }
}
```

- [ ] **Step 2: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Michael Siemer — Economist, Federal Reserve Board</title>
<meta name="description" content="Michael Siemer is a Principal Economist at the Federal Reserve Board. Research in macroeconomics, financial economics, and monetary economics.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>

<header class="nav">
  <div class="wrap nav-inner">
    <a class="brand" href="index.html">Michael Siemer</a>
    <nav>
      <a class="active" href="index.html">Home</a>
      <a href="working-papers.html">Working Papers</a>
      <a href="publications.html">Publications</a>
      <a href="cv.html">CV</a>
    </nav>
  </div>
</header>

<main>
  <section class="hero wrap">
    <h1>Michael Siemer</h1>
    <p class="role">Principal Economist, Federal Reserve Board</p>
    <p class="bio">I work in the Financial Stability Assessment section at the Federal Reserve Board. My research spans macroeconomics, financial economics, and monetary economics — with a focus on bank health, firm dynamics, and how financial conditions shape the real economy.</p>
    <p class="profile-links">
      <a href="https://scholar.google.com/citations?user=JgLyFUYAAAAJ">Google Scholar ↗</a><span class="sep">·</span><a href="https://www.nber.org/authors_papers/msiemer">NBER ↗</a><span class="sep">·</span><a href="https://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=686616">SSRN ↗</a><span class="sep">·</span><a href="https://www.federalreserve.gov/econresdata/michael-siemer.htm">Federal Reserve ↗</a>
    </p>
  </section>

  <section class="wrap">
    <div class="section-label">Recent Work</div>
    <div class="paper">
      <h3><a href="https://drive.google.com/file/d/13Lrn2PX5jbQwu_QXCNtB0nyXAhFwm4zO/view?usp=share_link">Debt Flexibility</a></h3>
      <p class="meta">with Rhys Bidder, Nicolas Crouzet &amp; Margaret M. Jacobson · November 2025</p>
      <p class="paper-links"><a href="https://drive.google.com/file/d/13Lrn2PX5jbQwu_QXCNtB0nyXAhFwm4zO/view?usp=share_link">PDF ↗</a></p>
    </div>
    <div class="paper">
      <h3><a href="https://www.federalreserve.gov/econres/feds/the-federal-reserves-response-to-the-2023-banking-turmoil-the-bank-term-funding-program.htm">The Federal Reserve's Response to the 2023 Banking Turmoil: the Bank Term Funding Program</a></h3>
      <p class="meta">with David M. Arseneau, Antonis Kotidis &amp; Elizabeth Klee · November 2025</p>
      <p class="paper-links"><a href="https://www.federalreserve.gov/econres/feds/the-federal-reserves-response-to-the-2023-banking-turmoil-the-bank-term-funding-program.htm">FEDS Working Paper ↗</a></p>
    </div>
    <div class="paper">
      <h3>Bank Health and Local Economic Outcomes</h3>
      <p class="meta">with Simon Gilchrist &amp; Egon Zakrajsek · October 2023 · new version forthcoming</p>
    </div>
    <a class="more-link" href="working-papers.html">All working papers →</a>
  </section>

  <section class="pubs-strip">
    <div class="wrap">
      <div class="section-label" style="border-bottom-color:#e0d7c4;">Selected Publications</div>
      <p class="pub"><a href="https://www.mitpressjournals.org/doi/abs/10.1162/rest_a_00733">Employment Effects of Financial Constraints During the Great Recession</a> <span class="pub-venue">· Review of Economics and Statistics, 2019</span></p>
      <p class="pub"><a href="https://link.springer.com/article/10.1057/s41308-019-00091-3">The Great Recession and a Missing Generation of Exporters</a> <span class="pub-venue">· IMF Economic Review, 2019</span></p>
      <p class="pub"><a href="https://www.nber.org/papers/w17277">International Risk Cycles</a> <span class="pub-venue">· Journal of International Economics, 2013</span></p>
      <a class="more-link" href="publications.html">All publications →</a>
    </div>
  </section>
</main>

<footer>
  <div class="wrap">
    <p>The views expressed here are my own and do not necessarily represent the views of the Federal Reserve Board of Governors, the Federal Reserve System, or the Federal Open Market Committee. The Federal Reserve will never contact the public via unsolicited phone calls or emails asking for money or any other type of personal information. <a href="https://www.federalreserve.gov/consumerscommunities/fraud-scams.htm">Learn more ↗</a></p>
    <p class="copyright">© 2026 Michael Siemer</p>
  </div>
</footer>

</body>
</html>
```

- [ ] **Step 3: Create `.nojekyll` (empty file) and `worklog.md`**

`.nojekyll` is empty. `worklog.md`:

```markdown
# worklog — michael-siemer.com

## 2026-07-22
- Approved Editorial Serif design via visual mockups; spec + plan committed.
- Built site scaffold: style.css, index.html.
- Next: working-papers, publications, cv pages.
```

- [ ] **Step 4: Verify homepage renders**

Run: `open index.html` (macOS opens default browser)
Check: warm paper background, serif name at 44px, bronze italic role line, 4 profile links, 3 Recent Work rows, darker Selected Publications strip, footer disclaimer. Resize window below 700px: nav stacks, no horizontal scroll.

Run: `grep -c 'class="paper"' index.html`
Expected: `3`

- [ ] **Step 5: Commit**

```bash
git add style.css index.html .nojekyll worklog.md
git commit -m "Build homepage with Editorial Serif design

Approved via visual mockup; content migrated verbatim from Google Sites."
```

---

### Task 2: Working Papers page

**Files:**
- Create: `working-papers.html`

**Interfaces:**
- Consumes: `style.css` classes and shared nav/footer markup from Task 1 (`.active` moves to the Working Papers link).

- [ ] **Step 1: Create `working-papers.html`**

Head, nav, and footer are identical to `index.html` except: `<title>Working Papers — Michael Siemer</title>`, no `<meta name="description">` change needed (copy allowed), and in the nav `class="active"` sits on the Working Papers link. Full file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Working Papers — Michael Siemer</title>
<meta name="description" content="Working papers by Michael Siemer, Principal Economist at the Federal Reserve Board.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>

<header class="nav">
  <div class="wrap nav-inner">
    <a class="brand" href="index.html">Michael Siemer</a>
    <nav>
      <a href="index.html">Home</a>
      <a class="active" href="working-papers.html">Working Papers</a>
      <a href="publications.html">Publications</a>
      <a href="cv.html">CV</a>
    </nav>
  </div>
</header>

<main>
  <div class="page-title wrap"><h1>Working Papers</h1></div>

  <div class="wrap">
    <div class="section-label">Current</div>
    <div class="paper">
      <h3><a href="https://drive.google.com/file/d/13Lrn2PX5jbQwu_QXCNtB0nyXAhFwm4zO/view?usp=share_link">Debt Flexibility</a></h3>
      <p class="meta">with Rhys Bidder, Nicolas Crouzet &amp; Margaret M. Jacobson · November 2025</p>
      <p class="paper-links"><a href="https://drive.google.com/file/d/13Lrn2PX5jbQwu_QXCNtB0nyXAhFwm4zO/view?usp=share_link">PDF ↗</a></p>
    </div>
    <div class="paper">
      <h3><a href="https://www.federalreserve.gov/econres/feds/the-federal-reserves-response-to-the-2023-banking-turmoil-the-bank-term-funding-program.htm">The Federal Reserve's Response to the 2023 Banking Turmoil: the Bank Term Funding Program</a></h3>
      <p class="meta">with David M. Arseneau, Antonis Kotidis &amp; Elizabeth Klee · November 2025</p>
      <p class="paper-links"><a href="https://www.federalreserve.gov/econres/feds/the-federal-reserves-response-to-the-2023-banking-turmoil-the-bank-term-funding-program.htm">FEDS Working Paper ↗</a></p>
    </div>
    <div class="paper">
      <h3><a href="https://www.federalreserve.gov/econres/feds/the-2023-banking-turmoil-and-the-bank-term-funding-program.htm">The 2023 Banking Turmoil and the Bank Term Funding Program</a></h3>
      <p class="meta">with David Glancy, Felicia Ionescu, Elizabeth Klee, Antonis Kotidis &amp; Andrei Zlate · June 2024</p>
      <p class="paper-links"><a href="https://www.federalreserve.gov/econres/feds/the-2023-banking-turmoil-and-the-bank-term-funding-program.htm">FEDS Working Paper ↗</a></p>
    </div>
    <div class="paper">
      <h3>Bank Health and Local Economic Outcomes</h3>
      <p class="meta">with Simon Gilchrist &amp; Egon Zakrajsek · October 2023 · new version forthcoming</p>
    </div>

    <div class="section-label">Older Working Papers</div>
    <div class="paper">
      <h3><a href="https://www.federalreserve.gov/econres/feds/considerations-regarding-inflation-ranges.htm">Considerations Regarding Inflation Ranges</a></h3>
      <p class="meta">with Hess Chung, Brian M. Doyle &amp; James Hebden · August 2020</p>
      <p class="paper-links"><a href="https://www.federalreserve.gov/econres/feds/considerations-regarding-inflation-ranges.htm">FEDS Working Paper ↗</a></p>
    </div>
    <div class="paper">
      <h3><a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2626635">Uncertainty and International Capital Flows</a></h3>
      <p class="meta">with François Gourio &amp; Adrien Verdelhan · December 2015</p>
      <p class="paper-links"><a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2626635">SSRN ↗</a></p>
    </div>
    <div class="paper">
      <h3><a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1977867">Learning, Rare Disasters, and Asset Prices</a></h3>
      <p class="meta">with Yang K. Lu · January 2016 · first version September 2011</p>
      <p class="paper-links"><a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1977867">SSRN ↗</a></p>
    </div>
    <div class="paper">
      <h3><a href="https://www.federalreserve.gov/pubs/feds/2013/201385/201385pap.pdf">Firm Entry and Employment Dynamics in the Great Recession</a></h3>
      <p class="meta">February 2016 · first version March 2012 · media coverage: WSJ.com; cited in a speech by Chair Janet Yellen</p>
      <p class="paper-links"><a href="https://www.federalreserve.gov/pubs/feds/2013/201385/201385pap.pdf">PDF ↗</a></p>
    </div>

    <div class="section-label">Work in Progress</div>
    <div class="paper">
      <h3>A Missing Generation of Firms? Aggregate Effects of the Decline in New Business Formation</h3>
      <p class="meta">with François Gourio</p>
    </div>
  </div>
</main>

<footer>
  <div class="wrap">
    <p>The views expressed here are my own and do not necessarily represent the views of the Federal Reserve Board of Governors, the Federal Reserve System, or the Federal Open Market Committee. The Federal Reserve will never contact the public via unsolicited phone calls or emails asking for money or any other type of personal information. <a href="https://www.federalreserve.gov/consumerscommunities/fraud-scams.htm">Learn more ↗</a></p>
    <p class="copyright">© 2026 Michael Siemer</p>
  </div>
</footer>

</body>
</html>
```

- [ ] **Step 2: Verify**

Run: `grep -c 'class="paper"' working-papers.html`
Expected: `9`

Run: `open working-papers.html` — check three section labels (Current / Older Working Papers / Work in Progress), nav highlights Working Papers.

- [ ] **Step 3: Commit**

```bash
git add working-papers.html
git commit -m "Add working papers page

All 9 papers migrated verbatim in the current/older/in-progress grouping."
```

---

### Task 3: Publications page

**Files:**
- Create: `publications.html`

**Interfaces:**
- Consumes: `style.css` classes and shared nav/footer markup from Task 1 (`.active` on Publications).

- [ ] **Step 1: Create `publications.html`**

Same skeleton as Task 2; `<title>Publications — Michael Siemer</title>`; `class="active"` on the Publications nav link. `<main>` content:

```html
<main>
  <div class="page-title wrap"><h1>Publications</h1></div>

  <div class="wrap">
    <div class="section-label">Journal Articles</div>
    <div class="paper">
      <h3><a href="https://link.springer.com/article/10.1057/s41308-019-00091-3">The Great Recession and a Missing Generation of Exporters</a></h3>
      <p class="meta">with Bill Lincoln &amp; Andrew McCallum · IMF Economic Review, 2019, vol. 67, pp. 703–745</p>
      <p class="paper-links"><a href="https://link.springer.com/article/10.1057/s41308-019-00091-3">Journal ↗</a></p>
    </div>
    <div class="paper">
      <h3><a href="https://www.mitpressjournals.org/doi/abs/10.1162/rest_a_00733">Employment Effects of Financial Constraints During the Great Recession</a></h3>
      <p class="meta">Review of Economics and Statistics, March 2019, vol. 101(1), pp. 16–29</p>
      <p class="paper-links"><a href="https://www.mitpressjournals.org/doi/abs/10.1162/rest_a_00733">Journal ↗</a></p>
    </div>
    <div class="paper">
      <h3><a href="https://www.aeaweb.org/articles?id=10.1257/aer.p20161052">Firm Entry and Macroeconomic Dynamics: A State-level Analysis</a></h3>
      <p class="meta">with François Gourio &amp; Todd Messer · American Economic Review Papers &amp; Proceedings, 2016, vol. 106(5), pp. 214–18</p>
      <p class="paper-links"><a href="https://www.aeaweb.org/articles?id=10.1257/aer.p20161052">Journal ↗</a></p>
    </div>
    <div class="paper">
      <h3><a href="https://www.nber.org/papers/w17277">International Risk Cycles</a></h3>
      <p class="meta">with François Gourio &amp; Adrien Verdelhan · Journal of International Economics, March 2013, vol. 89, pp. 471–484 · NBER Working Paper #17277</p>
      <p class="paper-links"><a href="https://www.nber.org/papers/w17277">NBER ↗</a></p>
    </div>

    <div class="section-label">Other Publications</div>
    <div class="paper">
      <h3><a href="https://www.chicagofed.org/publications/chicago-fed-letter/2014/september-326">What is the economic impact of the slowdown in new business formation?</a></h3>
      <p class="meta">with François Gourio &amp; Todd Messer · Chicago Fed Letter, September 2014, No. 326</p>
      <p class="paper-links"><a href="https://www.chicagofed.org/publications/chicago-fed-letter/2014/september-326">Chicago Fed ↗</a></p>
    </div>
  </div>
</main>
```

- [ ] **Step 2: Verify**

Run: `grep -c 'class="paper"' publications.html`
Expected: `5`

Link check (all links on all pages so far return non-404; Google Drive links excepted — they block HEAD):

```bash
for u in $(grep -ohE 'href="https?://[^"]+"' *.html | sed 's/href="//;s/"//' | grep -v drive.google | sort -u); do
  code=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 15 -A "Mozilla/5.0" "$u")
  echo "$code $u"
done | sort
```

Expected: no `404` lines. (`403` from publisher sites that block bots is acceptable — verify those two by opening in a browser.)

- [ ] **Step 3: Commit**

```bash
git add publications.html
git commit -m "Add publications page

Five publications migrated verbatim; links verified non-404."
```

---

### Task 4: CV page + PDF asset

**Files:**
- Create: `cv.html`, `assets/cv.pdf`

**Interfaces:**
- Consumes: `style.css` classes and shared nav/footer markup from Task 1 (`.active` on CV).

- [ ] **Step 1: Download the CV PDF from the current site's Google Drive**

```bash
mkdir -p assets
curl -sL "https://drive.google.com/uc?export=download&id=1CBhQLNL5oS4vCyYpz-bwB31CLWLffpxy" -o assets/cv.pdf
file assets/cv.pdf
```

Expected: `assets/cv.pdf: PDF document ...`
If output says HTML instead: STOP — the Drive file is not publicly downloadable; ask the user to export the CV PDF and drop it at `assets/cv.pdf`, then continue.

- [ ] **Step 2: Create `cv.html`**

Same skeleton as Task 2; `<title>CV — Michael Siemer</title>`; `class="active"` on the CV nav link. `<main>` content:

```html
<main>
  <div class="page-title wrap"><h1>Curriculum Vitae</h1></div>
  <div class="wrap">
    <p class="paper-links" style="margin-top:6px;"><a href="assets/cv.pdf">Download CV (PDF) ↗</a></p>
    <object class="cv-frame" data="assets/cv.pdf" type="application/pdf">
      <p class="bio">Your browser cannot display the PDF inline. <a href="assets/cv.pdf">Download the CV</a> instead.</p>
    </object>
  </div>
</main>
```

- [ ] **Step 3: Verify**

Run: `open cv.html` — PDF renders inline in the frame, download link works.

- [ ] **Step 4: Commit**

```bash
git add cv.html assets/cv.pdf
git commit -m "Add CV page with embedded PDF

PDF pulled from the Google Drive file the old site embedded."
```

---

### Task 5: Deploy to GitHub Pages

**Files:**
- Modify: `worklog.md` (append entry)

**Interfaces:**
- Consumes: complete site from Tasks 1–4.
- Produces: live site at `https://michaelsiemer.github.io/website/` — the URL Tasks 7–8 point DNS at (`michaelsiemer.github.io`).

- [ ] **Step 1: Create GitHub repo and push**

```bash
gh repo create website --public --source=. --push
```

Expected: `✓ Created repository michaelsiemer/website ... ✓ Pushed commits`

- [ ] **Step 2: Enable GitHub Pages from main branch root**

```bash
gh api repos/michaelsiemer/website/pages -X POST -f 'source[branch]=main' -f 'source[path]=/'
```

Expected: JSON response with `"status": "building"` (HTTP 201). If 409 "already exists", Pages is already on — fine.

- [ ] **Step 3: Verify live site (allow ~1–2 min for first build; retry until 200)**

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://michaelsiemer.github.io/website/
curl -s https://michaelsiemer.github.io/website/ | grep -o '<title>[^<]*</title>'
```

Expected: `200` and `<title>Michael Siemer — Economist, Federal Reserve Board</title>`
Click through all 4 pages in a browser at that URL; confirm CSS loads and internal links work under the `/website/` subpath.

- [ ] **Step 4: Lighthouse accessibility check (spec target ≥95)**

```bash
npx --yes lighthouse https://michaelsiemer.github.io/website/ --only-categories=accessibility,performance --quiet --chrome-flags="--headless" --output=json --output-path=/dev/stdout 2>/dev/null | python3 -c "import json,sys; d=json.load(sys.stdin); print({k: round(v['score']*100) for k,v in d['categories'].items()})"
```

Expected: accessibility ≥ 95. If below: fix flagged issues (usually contrast or missing landmarks) before proceeding.

- [ ] **Step 5: Append worklog entry and commit**

Append to `worklog.md`:

```markdown
## 2026-07-22 (deploy)
- Site live at https://michaelsiemer.github.io/website/ (all 4 pages verified).
- Next: DNS inventory → Cloudflare zone → nameserver switch.
```

```bash
git add worklog.md
git commit -m "Log GitHub Pages deployment"
git push
```

---

### Task 6: DNS inventory (protects Proton Mail)

**Files:**
- Create: `docs/dns-inventory.txt`

**Interfaces:**
- Produces: `docs/dns-inventory.txt` — the exact record values Task 7 recreates at Cloudflare.

- [ ] **Step 1: Capture every mail-relevant record from the live WordPress DNS**

```bash
{
  echo "== NS ==";    dig +short NS michael-siemer.com
  echo "== A (apex) =="; dig +short A michael-siemer.com
  echo "== WWW ==";   dig +short www.michael-siemer.com
  echo "== MX ==";    dig +short MX michael-siemer.com
  echo "== TXT (apex: SPF + verification) =="; dig +short TXT michael-siemer.com
  echo "== DMARC =="; dig +short TXT _dmarc.michael-siemer.com
  echo "== DKIM 1 =="; dig +short CNAME protonmail._domainkey.michael-siemer.com
  echo "== DKIM 2 =="; dig +short CNAME protonmail2._domainkey.michael-siemer.com
  echo "== DKIM 3 =="; dig +short CNAME protonmail3._domainkey.michael-siemer.com
} | tee docs/dns-inventory.txt
```

Expected shape (values MUST be recorded verbatim from actual output):
- MX: `10 mail.protonmail.ch.` and `20 mailsec.protonmail.ch.`
- TXT: one `v=spf1 include:_spf.protonmail.ch ~all`-style record and one `protonmail-verification=...`
- DKIM 1–3: CNAMEs ending in `.domains.proton.ch.`
- DMARC: a `v=DMARC1; ...` TXT

If MX or DKIM come back empty: STOP — re-run with `@ns1.wordpress.com` as resolver (`dig @ns1.wordpress.com +short MX michael-siemer.com`). If still empty, ask the user to screenshot the WordPress DNS panel before proceeding.

- [ ] **Step 2: Commit**

```bash
git add docs/dns-inventory.txt
git commit -m "Record pre-migration DNS inventory

Snapshot of WordPress-hosted records so Cloudflare can be verified against it."
git push
```

---

### Task 7: Cloudflare zone + records + custom domain prep

**USER GATE:** user must be logged into Cloudflare (create free account if needed). Agent guides or drives via browser with user present.

**Files:**
- Create: `CNAME` (repo root)

**Interfaces:**
- Consumes: `docs/dns-inventory.txt` (Task 6).
- Produces: Cloudflare zone ready for the Task 8 nameserver switch; notes the two assigned Cloudflare nameservers (e.g. `xxx.ns.cloudflare.com`).

- [ ] **Step 1 (user + agent): Add site to Cloudflare**

Cloudflare dashboard → Add a site → `michael-siemer.com` → Free plan. Cloudflare scans and imports existing records. Note the two assigned nameservers — record them in `worklog.md`.

- [ ] **Step 2 (user + agent): Reconcile records against `docs/dns-inventory.txt`**

Final record set at Cloudflare (everything DNS-only / grey cloud):

| Type | Name | Content | Note |
|---|---|---|---|
| A | `michael-siemer.com` | `185.199.108.153` | GitHub Pages |
| A | `michael-siemer.com` | `185.199.109.153` | GitHub Pages |
| A | `michael-siemer.com` | `185.199.110.153` | GitHub Pages |
| A | `michael-siemer.com` | `185.199.111.153` | GitHub Pages |
| CNAME | `www` | `michaelsiemer.github.io` | GitHub Pages |
| MX | `michael-siemer.com` | from inventory (Proton, both hosts, priorities 10/20) | mail |
| TXT | `michael-siemer.com` | SPF string from inventory | mail |
| TXT | `michael-siemer.com` | `protonmail-verification=...` from inventory | mail |
| TXT | `_dmarc` | DMARC string from inventory | mail |
| CNAME | `protonmail._domainkey` | from inventory | mail |
| CNAME | `protonmail2._domainkey` | from inventory | mail |
| CNAME | `protonmail3._domainkey` | from inventory | mail |

Delete imported records that point at WordPress hosting (old A `192.0.78.x`, `www` → `ghs.googlehosted.com`). Double-check every mail row shows the grey (DNS-only) cloud.

- [ ] **Step 3: Add `CNAME` file to repo (sets GitHub Pages custom domain)**

```bash
echo "michael-siemer.com" > CNAME
git add CNAME
git commit -m "Set custom domain for GitHub Pages"
git push
```

Verify: `gh api repos/michaelsiemer/website/pages --jq .cname` → `michael-siemer.com`

---

### Task 8: Nameserver switch + full verification

**USER GATE:** user performs the nameserver change in the WordPress.com dashboard.

**Files:**
- Modify: `worklog.md` (append entry)

**Interfaces:**
- Consumes: Cloudflare nameservers recorded in Task 7.

- [ ] **Step 1 (user): Switch nameservers at WordPress.com**

WordPress.com → Upgrades → Domains → michael-siemer.com → Name servers → "Use custom name servers" → enter the two Cloudflare nameservers from Task 7. Save.

- [ ] **Step 2: Wait for propagation, then verify DNS (retry over ~15–60 min)**

```bash
dig +short NS michael-siemer.com          # expect the 2 cloudflare NS
dig +short MX michael-siemer.com @1.1.1.1  # expect proton MX, unchanged
dig +short A michael-siemer.com @1.1.1.1   # expect the four 185.199.x.153 IPs
dig +short www.michael-siemer.com @1.1.1.1 # expect michaelsiemer.github.io + IPs
```

- [ ] **Step 3: Verify site + HTTPS (GitHub cert issuance can take up to ~1 h)**

```bash
curl -s -o /dev/null -w '%{http_code}\n' -L http://michael-siemer.com
curl -s https://michael-siemer.com | grep -o '<title>[^<]*</title>'
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://www.michael-siemer.com
```

Expected: `200`; correct `<title>`; www returns `301` redirecting to `https://michael-siemer.com/`.
Then enforce HTTPS:

```bash
gh api repos/michaelsiemer/website/pages -X PUT -F https_enforced=true
```

- [ ] **Step 4 (user): Verify email end-to-end**

- Proton Mail → Settings → Domain names → michael-siemer.com: all checks (MX/SPF/DKIM/DMARC) green.
- Send an email FROM the domain address to an external account; reply back TO it. Both must arrive.

- [ ] **Step 5: Append worklog entry, commit, push**

```markdown
## <date>
- Nameservers switched to Cloudflare; site live on michael-siemer.com with HTTPS.
- Proton Mail verified green + round-trip test passed.
- Next: registrar transfer WordPress→Cloudflare.
```

```bash
git add worklog.md
git commit -m "Log DNS cutover and email verification"
git push
```

---

### Task 9: Registrar transfer + decommission WordPress

**USER GATE:** both registrar steps require user account access. Transfer takes up to 5–7 days unless approved early at WordPress.

- [ ] **Step 1 (user): Unlock domain at WordPress.com and get auth code**

WordPress.com → Upgrades → Domains → michael-siemer.com → Transfer away → disable transfer lock → request/copy the auth (EPP) code.
If WordPress blocks with a 60-day lock (recent registration/renewal/transfer): note the unlock date in `worklog.md` and pause this task — site and mail already run on Cloudflare DNS, nothing else is blocked.

- [ ] **Step 2 (user): Start transfer at Cloudflare**

Cloudflare dashboard → Domain Registration → Transfer Domains → select `michael-siemer.com` → paste auth code → pay at-cost .com fee (~$10–11, adds 1 year of registration).

- [ ] **Step 3 (user, optional speed-up): Approve transfer at WordPress.com**

WordPress.com may email a confirmation/approval link — approving it completes the transfer in minutes instead of days.

- [ ] **Step 4: Verify transfer complete**

```bash
whois michael-siemer.com | grep -i 'registrar:' | head -3
```

Expected: `Registrar: Cloudflare, Inc.`
Also confirm auto-renew is ON in Cloudflare → Domain Registration.

- [ ] **Step 5 (user): Decommission WordPress + Google Sites**

Only after Step 4 passes:
- WordPress.com: cancel any paid plan/subscription (the domain itself is now gone from their side).
- Google Sites: unpublish the old site (Sites editor → Publish menu → Unpublish).
- Proton: no action needed — mail config lives in Cloudflare DNS now.

- [ ] **Step 6: Final worklog entry + commit**

```markdown
## <date>
- Domain transferred to Cloudflare Registrar; auto-renew on.
- WordPress plan cancelled; Google Sites unpublished.
- Migration complete.
```

```bash
git add worklog.md
git commit -m "Log registrar transfer and decommissioning

Migration complete: site on GitHub Pages, DNS+registrar on Cloudflare, Proton Mail intact."
git push
```
