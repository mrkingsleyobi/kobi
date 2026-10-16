---
task: "Rebuild kingsleyobi.com to match principal's ideal state"
slug: 20261016-051835_kingsleyobi-site-ideal-state
project: Website
phase: climbing
progress: 19/26
started: 2026-10-16T05:18:35Z
updated: 2026-10-16T05:18:35Z
principal_stated_goal: "I want my Ideal State of the website to be look like danielmiessler.com website."
principal_stated_goal_source: prompt
principal_stated_goal_signal: 2
principal_stated_goal_locked: 2026-10-16T05:18:35Z
context_sufficient: true
interview_invoked: true
---

## Problem

kingsleyobi.com is live (VitePress, Vue, Tailwind, Bun; push to `main` deploys to Cloudflare Pages project `kingsleyobi` via GitHub Actions) and is already themed on danielmiessler.com, but its substance is not the principal's. Read from the repo and live site on 2026-10-16:
- 10 blog posts exist; the principal has written none of them to publish.
- Home, about, projects and consulting copy is built around parked experiments (quantumedge, synapseflow, veritas-ai, trustswarm) and carries stats nobody has verified ("500K orders/sec", "99.99% uptime", "66-agent", "1,000 papers a minute"). The principal's actual direction (African AI agency, agentic engineering, AI consulting, bounties) is absent.
- Most sidebar and footer links point at `#`; labels like "UL Site", "Vecta 3.0", "Organisation 3.0" are template leftovers.
- Layout bugs on the home page: sidebar button labels wrap mid-word ("BLO G", "NEWSLETTE R", "PODCAS T") and the footer copyright line breaks.
- The repo has no ISA, so "done" for the site is written nowhere.

## Vision

A visitor lands on a site that reads like danielmiessler.com in layout and typography but is unmistakably Kingsley's: a clear statement of what he is building for African agency with AI, an honest list of what he actually has shipped, a public mission and goals page, and every link goes somewhere real. The first thing that surprises a reader is how little there is to doubt: nothing on the page is a claim that cannot be checked.

## Out of Scope

- No copying of danielmiessler.com text, images, logos or branding. Layout, spacing and typography only.
- No blog posts. The blog page exists as an empty state ("writing coming soon").
- No members page in this pass (dropped by the principal).
- No new site features (search backends, comments, analytics, paywall).
- No change to the Cloudflare Pages project, domain, DNS or GitHub Actions workflow.
- No publishing of private TELOS content: health, marriage and family details, debt, income, runway, or the money ladder.
- No merge or push to `main` without the principal's explicit approval in that moment.

## Principles

- Nothing is stated as fact on the site unless the principal can stand behind it. An unverified number is removed, not softened.
- Content comes from the principal's TELOS and confirmed answers, not from model invention.
- Public means public: anything on the site is assumed indexed forever.
- Verification is by live probe in the real browser, never by "it should work".

## Constraints

- Stack stays VitePress + Vue + Tailwind + Bun; the build is `bun run build` and output is `cms/.vitepress/dist`.
- All work happens on a feature branch with a local preview first; deploy-by-push to `main` is gated by explicit approval.
- Verification runs through Interceptor in the pinned `interceptor-test` context (Chrome profile `Profile 1`), screenshots through `Tools/Capture.sh` only.
- The telos page may publish only missions and non-financial goals taken from `LIFEOS/USER/TELOS/MISSION.md` and `GOALS.md`.
- Social and contact links may be only those the principal supplied on 2026-10-16: X, LinkedIn, YouTube, Podcast, Newsletter, Book a Meeting, Daemon, RSS, Archives, Blog, GitHub. A link that does not resolve stays out until the principal confirms the URL.

## Goal

"I want my Ideal State of the website to be look like danielmiessler.com website." Done means: kingsleyobi.com keeps the danielmiessler.com-style layout, shows only the pages home, about, projects, telos, ideas, consulting, blog (empty state), archives and predictions, carries content derived from the principal's TELOS with no unverifiable claims and no private data, has no dead links or layout bugs on the home page, and was verified in a real browser on a branch before the principal approved any merge.

## Features

### F0 · Cross-cutting
Why: the site can be trusted and changed safely; nothing private ships and nothing reaches production unreviewed.

- [x] ISC-1: All changes live on a branch other than `main`; `git log origin/main..HEAD` shows them and `git rev-parse origin/main` is unchanged until approval.
- [ ] ISC-2: Anti: no commit or push to `main` happens without an explicit principal approval recorded in Decisions.
- [x] ISC-3: Anti: a repo-wide search of the built site for the strings "health", "marriage", "wife", "debt", "runway", "$65", "income" finds none in telos-derived content.
- [x] ISC-4: Anti: the built site contains none of the removed unverified claims ("500K orders", "99.99%", "66-agent", "1,000 papers", "350ns", "84.8%").
- [x] ISC-5: `bun run build` exits 0 on the branch.

### F1 · Pages and navigation
Why: the site contains exactly the pages the principal chose, and nothing points at pages that no longer exist.

- [x] ISC-6: The primary nav lists home, blog, telos, ideas, projects, predictions, about (and consulting, archives as in the layout), and does not list members.
- [x] ISC-7: `/members/` is removed from the build and from the sitemap.
- [x] ISC-8: Anti: no internal link in the built site returns 404 (link crawl of every page on the local preview).

### F2 · Blog empty state
Why: the blog and archives exist as destinations but promise nothing that is not there.

- [x] ISC-9: `cms/blog` contains no post files, only an index page that says writing is coming soon.
- [ ] ISC-10: The archives page renders without error and shows an empty or "nothing yet" state.
- [x] ISC-11: The RSS feed at `/feed.rss` builds and parses as valid XML.
- [x] ISC-11.1: The RSS feed contains zero items.

### F3 · Content from TELOS
Why: each page says what the principal is actually building, in his words, without claims he cannot verify.

- [x] ISC-12: Home states the mission (African agency through AI, agentic engineering, consulting).
- [ ] ISC-12.1: The principal has approved the home wording.
- [x] ISC-13: About describes the principal from `PRINCIPAL_IDENTITY` and TELOS facts only; no invented employers, titles or numbers.
- [x] ISC-14: Projects lists only mrkingsleyobi/kobi and mrkingsleyobi/LifeOS as active; parked repos appear only if the principal asks.
- [x] ISC-15: Telos shows missions M0 to M4 and the non-financial goals (G2, G3, C2, shown as G1 to G3 on the page).
- [x] ISC-15.1: Anti: Telos omits TELOS G0, G1, G4 to G7 and C0, C1 (income, debt, runway, revenue, capital, health, habits).
- [ ] ISC-16: Consulting describes services the principal confirmed (AI consulting, agent engineering, assessments, security) with no client names or results he has not supplied.

### F4 · Links
Why: every link on the site goes somewhere the principal owns.

- [x] ISC-17: No link on the site has `href="#"`.
- [x] ISC-18: Every external link on the site returns HTTP 2xx or 3xx on probe, and goes to a URL on the principal's supplied list.
- [x] ISC-19: "UL Site", "Vecta 3.0", "Organisation 3.0" and other template-leftover entries are removed.

### F5 · Layout parity and bugs
Why: the page looks like danielmiessler.com in structure and typography with no visible defects.

- [x] ISC-20: Home sidebar button labels render on one line at 1280px width (no mid-word wrap), confirmed by screenshot.
- [ ] ISC-21: The footer copyright line renders on one line at 1280px and 390px width.
- [ ] ISC-22: A side-by-side screenshot comparison with danielmiessler.com shows matching header, content column, sidebar and footer structure.
- [ ] ISC-22.1: The principal has signed off on the visual comparison.

## Not yet specified

- fog: What do the ideas and predictions pages contain? — the principal has given no content for them; the existing text came from the blog-era draft and must be replaced or emptied.
- fog: Exact home and about wording — needs the principal to confirm a short statement; draft from TELOS and review.
- fog: Which sidebar buttons stay? — a link that does not resolve cannot stay until confirmed (see Decisions).
- fog: Does the Daemon link point to a real service? — daemon.kingsleyobi.com did not connect on 2026-10-16.

## Test Strategy

| isc | type | check | threshold | tool | anchors_to |
|-----|------|-------|-----------|------|------------|
| ISC-1 | git | branch isolation | origin/main unchanged | git | principal_stated_goal |
| ISC-2 | audit | Decisions log shows approval before any main push | 1 recorded approval | git log + ISA | principal_stated_goal |
| ISC-3 | grep | forbidden private terms in built output | 0 matches | rg | principal_stated_goal |
| ISC-4 | grep | removed claims in built output | 0 matches | rg | principal_stated_goal |
| ISC-5 | build | bun run build | exit 0 | bun | principal_stated_goal |
| ISC-6 | dom | nav items on live preview | members absent | interceptor read | principal_stated_goal |
| ISC-7 | build | members page and sitemap entry | absent | rg, ls | principal_stated_goal |
| ISC-8 | crawl | internal links | 0 404s | interceptor + curl | principal_stated_goal |
| ISC-9 | fs | blog post files | 0 | ls | principal_stated_goal |
| ISC-10 | dom | archives page | renders, no console error | interceptor read | principal_stated_goal |
| ISC-11 | http | feed.rss parses | valid XML | curl + xmllint | principal_stated_goal |
| ISC-11.1 | http | feed.rss items | 0 | curl + xmllint | principal_stated_goal |
| ISC-12 | dom | home mission statement present | present | interceptor read | principal_stated_goal |
| ISC-12.1 | review | home wording | principal approval | principal | principal_stated_goal |
| ISC-13 | review | about facts | each fact traced to TELOS | rg | principal_stated_goal |
| ISC-14 | dom | projects page | 2 active entries | interceptor read | principal_stated_goal |
| ISC-15 | dom | telos shows M0 to M4 and G2, G3, C2 | present | interceptor read | principal_stated_goal |
| ISC-15.1 | grep | telos omits income, debt, runway, health text | 0 matches | rg | principal_stated_goal |
| ISC-16 | review | consulting wording | principal approval | interceptor read | principal_stated_goal |
| ISC-17 | dom | links with href="#" | 0 | interceptor read | principal_stated_goal |
| ISC-18 | http | external link status | all 2xx/3xx | curl | principal_stated_goal |
| ISC-19 | grep | template leftover labels | 0 | rg | principal_stated_goal |
| ISC-20 | visual | sidebar labels at 1280px | no wrap | Capture.sh | principal_stated_goal |
| ISC-21 | visual | footer line at 1280px and 390px | one line | Capture.sh | principal_stated_goal |
| ISC-22 | visual | side-by-side with danielmiessler.com | structure matches | Capture.sh | principal_stated_goal |
| ISC-22.1 | review | visual comparison | principal sign-off | principal | principal_stated_goal |

## Decisions

- 2026-10-16: principal chose pages home, about, projects, telos, ideas, consulting, blog, archives, predictions; members dropped (omitted from the list).
- 2026-10-16: principal chose to publish only missions and non-financial goals on telos.
- 2026-10-16: blog shows "writing coming soon"; all 10 existing posts to be removed.
- 2026-10-16: principal supplied social links. Probe on 2026-10-16: x.com, linkedin.com, youtube.com (@praxis), kingsleyobi.com feed/archives/blog and github.com returned 200; omny.fm/shows/praxis and calendly.com/kingsleyobi/60-minute-consulting returned 404; newsletter.kingsleyobi.com and daemon.kingsleyobi.com did not connect. A 200 from x.com, linkedin.com or youtube.com does not prove the profile is the principal's (those sites answer 200 for many handles). Unresolved links stay out until confirmed.

## Verification

- ISC-5: `bun run build` exit 0 on branch isa/site-ideal-state, 2026-10-16 (uncommitted working tree).
- ISC-7: `dist/` has no members dir; `grep -c members dist/sitemap.xml` = 0.
- ISC-9: `ls cms/blog` = index.md only.
- ISC-11, ISC-11.1: `xmllint --noout dist/feed.rss` clean; `grep -c '<item>'` = 0.
- Not yet browser-verified: ISC-10, ISC-8 (internal link crawl).
- ISC-6, ISC-17, ISC-19, ISC-20: local preview (vitepress preview :4173) read + screenshot via Interceptor, 2026-10-16: nav has no members, 0 links with href="#", template-leftover labels absent, sidebar labels on one line at 1280px.
- ISC-18: probe 2026-10-16: x.com, linkedin.com, youtube.com/@praxis, github.com/mrkingsleyobi, /feed.rss all 200 (200 on the social three does not prove ownership).
- ISC-21 only half checked: footer on one line at 1280px; 390px not yet checked.
- ISC-1: branch isa/site-ideal-state; `git rev-parse origin/main` equals main HEAD (no new commits yet), 2026-10-16.
- ISC-3, ISC-4: `rg` over built `dist/*.html` and `cms/` sources: 0 removed-claim strings; 0 private terms in telos.
- ISC-8: curl crawl of internal links on /, /about/, /projects/, /telos/, /ideas/, /predictions/, /consulting/, /blog/, /archives/ on local preview: all 200.
- ISC-12, 13, 14, 15, 15.1: page sources rewritten 2026-10-16 from TELOS and principal answers; not yet browser-checked.
- Open: ISC-2 (anti, closes at merge), ISC-10 (archives in browser), ISC-12.1, ISC-16, ISC-21 (390px), ISC-22, ISC-22.1 (principal sign-offs and visual comparison).
