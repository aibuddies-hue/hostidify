# Security and performance audit — 15 October 2026

Marketing copy and section order are unchanged. Tested against the production Next.js build in Chrome, with the existing local public configuration. No real CRM leads were sent.

## Dependency findings

- Next.js 15.5.26 → 15.5.27: fixes the two reported cache-poisoning advisories.
- Sharp (both direct and nested copies) → 0.35.5: covers all reported libvips/libheif/librsvg alerts.
- PostCSS (including Next's nested dependency) → 8.5.30; source-map-js → 1.2.2.
- Overrides and lockfile enforce patched transitive versions. Node >=20.9 is required; Hostinger dashboard reports Node 22.x.
- `npm audit --omit=dev`: **0 known vulnerabilities**.
- Full `npm audit`: **5 high dependency entries from one remaining development-only braces advisory** (braces → micromatch → fast-glob → Next ESLint plugin/config). Published braces latest is 3.0.3, which is still affected; upgrading Next's lint config also retains that chain. No forced downgrade or suppression applied. Do not feed untrusted patterns into tooling; recheck when upstream publishes a patch. This does not ship in the browser or production runtime dependency set, but a scanner that includes build tools may still flag it.

References: [Next advisory](https://github.com/advisories/GHSA-4jqv-mc3x-m676), [Sharp advisory](https://github.com/advisories/GHSA-wq5f-xc86-pv6w), [remaining braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

## Performance

| Local production Lighthouse | Before | After |
| --- | ---: | ---: |
| Mobile performance | 86 | 96 |
| Desktop performance | 100 | 100 |
| Mobile accessibility | 97 | 100 |
| Desktop accessibility | 97 | 100 |
| Mobile LCP | 3.8 s | 2.9 s |
| Mobile total blocking time | 30 ms | 10 ms |
| Mobile transfer | 779 KiB | 556 KiB |
| Layout shift, both viewports | 0 | 0 |

After: both viewports score 100 in best practices and SEO. The baseline desktop run had network-change errors in several image requests; its non-performance scores should not be treated as a reliable comparison. Scores are lab snapshots, not field guarantees. The user's Hostinger 73/79 scores use a different network/server environment and are not directly comparable to these local results. See metrics.json and HTML reports.

Changes: deferred the form/calendar bundle until first use; removed unused GSAP/Lenis and the continuous scroll animation loop; retained native smooth anchors/reduced motion; replaced a blurred decorative hero raster with CSS gradients; reserved carousel controls and fixed header height; responsive optimized portfolio/review images; caching and standard WebP delivery. Preserved first-visit attribution despite lazy-loading the form.

Nine videos: 76.0 MiB → 50.9 MiB (33.1% reduction) (see exact byte totals in video-savings.json), H.264/AAC with fast-start, preserved duration and audio, max 720px width. All decoded successfully. Videos still download only after play. Six image assets: approximately 2.15 MiB → 0.46 MiB. HD logo source PNGs remain in the repo; displayed assets are sized for actual use.

## Application protection

- Block cross-site browser lead requests; require JSON; cap streamed and declared request bodies at 16 KiB.
- Bound fields and event IDs; derive qualification server-side.
- Best-effort rate limit: 8 attempts/client/10 minutes and 300 total/minute; bounded in-memory state. Requires the hosting proxy to overwrite client IP headers. Multi-instance/strong abuse protection still needs a shared/edge limiter; this is not a DDoS defense.
- Private recovery files (0600), ignored from Git/build tracing; no contact details or credentials in routine logs; CAPI token moved from URL to Authorization header.
- Production without a lead webhook returns 503 instead of falsely reporting success. **The local environment has N8N_LEAD_WEBHOOK_URL empty; verify this secret is configured on Hostinger.** Browser form-flow tests intercepted submission; real CRM/Meta delivery was not tested.
- Disabled arbitrary remote image proxying; all current images are local.
- Added nosniff, anti-framing, referrer/permissions policies, and a limited CSP for base/object/frame/form protection. This is deliberately not a strict script CSP because Next hydration and Cal/Meta integrations require a separate nonce integration.
- Fixed the lint command and existing lint errors; added request-security regression tests.

## Validation and deployment

Production build, lint, TypeScript, security unit tests, API rejection/header checks, all nine video decode/duration checks passed. Browser checks at 320/390/768/1440px cover overflow, filters, keyboard tabs, lazy video requests, playback, review zoom, FAQ, form steps, focus return and modal scroll lock. No browser runtime errors or local failed resources in the functional runs.

The original Desktop workspace had iCloud-evicted files whose reads timed out. Work was built and tested in a clean clone of the exact remote HEAD, then synchronized back after checking affected source files against that HEAD. Git cloud objects were preserved in ignored .inbox and replaced only when the clean clone contained the exact same object ID.

Git push triggers Hostinger auto-deployment (confirmed in its dashboard). A fresh production scan must run after deployment; old scan results do not clear on a Git push alone. At audit time Hostinger reported **Installing SSL certificate** and HTTPS requests failed their TLS handshake while HTTP served the page. This is a hosting certificate operation, not a source-code dependency fix; do not bypass certificate checks. Verify SSL completion and HTTPS redirects in Hostinger before treating live security as complete.
