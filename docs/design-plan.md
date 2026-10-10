# Host Editify — Design Plan & Architectural Specification

**Creative Concept:** "The Edit Timeline" — A cinematic, precision-engineered editing interface where raw footage transforms into finished authority content in 21 hours.  
**Platform:** Next.js 15 App Router · TypeScript · Tailwind CSS v4 · GSAP + Lenis + Motion.

---

## 1. Design System & Tokens

### 1.1 Color Tokens
| Token | Hex Value | Semantic Purpose |
|---|---|---|
| `bg` | `#0A0A0F` | True dark cinematic canvas, near-black film theater backdrop |
| `surface` | `#14141C` | Cards, timeline clips, modal dialogs, alternating section blocks |
| `surface-hover` | `#1D1D28` | Hover state for interactive surfaces and bento items |
| `surface-glass` | `rgba(20, 20, 28, 0.75)` | Floating navigation, sticky bars, frosted glass panels |
| `text` | `#FFFFFF` | Primary headlines, key metrics, active tab labels |
| `text-muted` | `#A0A0B0` | Body paragraphs, sub-lines, inactive states, secondary labels |
| `text-dim` | `#666678` | Timecodes, border tracks, structural metadata |
| `cyan` | `#1EC8FF` | Technical highlights, scrub playhead node, micro-accents |
| `blue` | `#3B6BFF` | Gradient start, active step links, interactive states |
| `purple` | `#A24BFF` | Brand core, card borders, Cal.com primary theme |
| `pink` | `#FF3D8B` | Scarcity badges, urgency highlights, "free" accents |
| `orange` | `#FF8A1E` | Gradient end, "21 hours" highlight, warm CTA glow |
| `border-subtle`| `rgba(255, 255, 255, 0.08)` | Standard card boundary, dividing lines |
| `border-accent`| `rgba(162, 75, 255, 0.35)` | Purple glow card boundary |

### 1.2 Signature Gradients
* **Brand Gradient (Buttons & Accents):** `linear-gradient(90deg, #3B6BFF 0%, #A24BFF 35%, #FF3D8B 70%, #FF8A1E 100%)`
* **Brand Gradient Hover Shift:** `linear-gradient(90deg, #1EC8FF 0%, #3B6BFF 30%, #A24BFF 65%, #FF3D8B 100%)`
* **Glow Aura:** `radial-gradient(ellipse at center, rgba(162, 75, 255, 0.18) 0%, rgba(59, 107, 255, 0.08) 45%, transparent 75%)`
* **Timeline Track Gradient:** `linear-gradient(180deg, #1EC8FF 0%, #A24BFF 50%, #FF8A1E 100%)`

### 1.3 Typography System
* **Display Font:** `Clash Display` (Variable Sans, Fontshare, self-hosted woff2) / Fallback: `Montserrat 800`
  * Applied to: Main headings (H1, H2, H3), big numbers (8–15 hrs), plan titles.
  * Characteristics: Confident geometric structure, sharp modern terminals, editorial authority.
* **Body Font:** `Satoshi` (Fontshare, self-hosted woff2) / Fallback: `Inter`
  * Applied to: Body copy, form fields, FAQs, list items, comparison descriptions.
  * Characteristics: Ultra-clean neutral readability on deep dark surfaces at 16–18px.
* **Technical / Timecode Font:** `JetBrains Mono`
  * Applied to: Timeline markers (`00:00:00`, `00:21:00`), fine print timestamps, timecode chips.

#### Type Scale (1.25 Modular Ratio)
| Level | Desktop | Mobile | Line Height | Weight | Letter Spacing |
|---|---|---|---|---|---|
| **H1 (Hero)** | `76px` / `4.75rem` | `40px` / `2.5rem` | `1.05` | Bold (700) | `-0.03em` |
| **H2 (Sections)** | `44px` / `2.75rem` | `28px` / `1.75rem` | `1.15` | Semibold (600) | `-0.02em` |
| **H3 (Sub-heads)**| `28px` / `1.75rem` | `22px` / `1.375rem`| `1.25` | Medium (500) | `-0.01em` |
| **Body Large** | `20px` / `1.25rem` | `18px` / `1.125rem`| `1.5` | Regular (400) | `0` |
| **Body Base** | `16px` / `1.0rem` | `15px` / `0.9375rem`| `1.6` | Regular (400) | `0` |
| **Timecode / Meta** | `13px` / `0.8125rem`| `12px` / `0.75rem` | `1.4` | Medium (500) | `+0.05em` |

### 1.4 Shape, Radius, and Elevation Hierarchy
* **Full Screen / Section Base:** `0px` radius, subtle SVG film noise (`opacity: 0.035`).
* **9:16 Phone Mockup Frames:** `36px` corner radius, `3px` dark titanium border with ambient drop shadow.
* **Primary Bento & Feature Cards:** `20px` radius, `1px` subtle border (`border-subtle`), `surface` fill.
* **Dialog Lightbox & Form Container:** `24px` radius, glass backdrop-blur (`16px`).
* **Interactive Inputs & Selects:** `12px` radius, `1px` border, `#14141C` fill.
* **Pill Badges & Buttons:** `9999px` (Fully rounded), soft multi-colored glow on hover.

---

## 2. ASCII Wireframes & Section Layouts

### 2.1 Desktop Layout (With The Left-Edge Playhead Timeline)
```
[LEFT TIMELINE PLAYHEAD]  [MAIN CONTENT AREA (Max-width 1240px)]
      │
 00:00:00 ───●  TOP BAR: Only 5 new clients/month · [X] spots left
      │         NAVBAR: [HOST EDITIFY] ──── [Work] [Process] [FAQ] ─── [Book Free Audit ▸]
      │
      │         HERO SECTION:
      │         ┌─────────────────────────────────┬────────────────────────┐
      │         │ (For real estate, coaches, GCC) │ ┌────────────────────┐ │
 00:01:15 ───●  │ You film it.                    │ │ 9:16 PHONE FRAME   │ │
      │         │ We edit it.                     │ │ [RAW -> EDIT SHOW] │ │
      │         │ Ready in [21 hours].            │ │ Captions + B-Roll  │ │
      │         │                                 │ │ Autoplay / Scrub   │ │
      │         │ Dedicated short-form team...    │ └────────────────────┘ │
      │         │ [ Book My Free Content Audit ]  │   (Glow aura behind)   │
      │         │ 30-min Meet · Free first edit   │                        │
      │         │ ⚡ 21h · ✓ 2 rev · 🔒 NDA · 📁 Own │                        │
      │         └─────────────────────────────────┴────────────────────────┘
      │
 00:02:40 ───●  CLIENT LOGO MARQUEE: Brands we edit for: [Bluhawk] [AI Buddies] [DPM]...
      │
      │         PAIN SECTION: "Your best content is sitting in your camera roll"
 00:04:10 ───●  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
      │         │ 💬 Quote 1│ │ 💬 Quote 2│ │ 💬 Quote 3│ │ 💬 Quote 4│ │ 💬 Quote 5│
      │         └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘
      │         "You're not lazy. You're running a business."
      │
      │         COST OF INACTION:
 00:06:30 ───●  ┌────────────────────────┬─────────────────────────────────────┐
      │         │ 8–15 hrs/week lost     │ ✕ Inconsistent posting              │
      │         │ (Dynamic Count-Up)     │ ✕ Competitor becomes "the name"     │
      │         │                        │ ✕ Lost inquiries in Dubai           │
      │         └────────────────────────┴─────────────────────────────────────┘
      │
      │         SOLUTION & NICHE TABS:
 00:08:00 ───●  Tabs: [Real Estate] [Personal Brand / Coach] [E-commerce]
      │         5 Outcome Cards: Hours Back · Post Daily · Look Premium · Authority · Scale
      │
      │         HOW IT WORKS (PINNED HORIZONTAL TIMELINE):
 00:10:45 ───●  [Step 1: Book Audit] ────► [Step 2: Drop in Drive] ────► [Step 3: 21h Delivery]
      │
      │         PORTFOLIO ("WATCH THE WORK"):
 00:13:20 ───●  Filter: [All] [Real Estate] [Personal Brand] [E-Commerce] [AI & UGC] [Ads]
      │         Grid of 9:16 VideoCards (Hover video preview + custom "Play" cursor)
      │
      │         BEFORE / AFTER:
 00:16:00 ───●  [Synced Dual Player with Draggable Center Handle: Raw (Left) | Edit (Right)]
      │
      │         WHAT YOU GET + BONUSES + PLANS:
 00:18:15 ───●  ┌──────────────────────────────┬───────────────────────────────┐
      │         │ Deliverables Breakdown       │ Free Bonuses Box (Hook Bank...)│
      │         ├──────────────────────────────┴───────────────────────────────┤
      │         │ [Growth: 15 Short]   [Authority: 25 Short + 4 Long ★Featured]│
      │         │ "Pricing shared on your audit call"                          │
      │         │ "What we don't do: No weddings, no corporate films, no shoots"│
      │         └──────────────────────────────────────────────────────────────┘
      │
      │         PROMISES (RISK REVERSAL):
 00:19:40 ───●  [1. First Video Free] [2. 21h or Free] [3. You Own Files] [4. 5 Clients Max]
      │
      │         PROOF:
 00:20:10 ───●  [Real Stat: 2.5% Ad CTR] · Verified Testimonials (Rudra, Dr. Kokila, Shivanshu)
      │
      │         COMPARISON TABLE:
 00:20:40 ───●  Columns: Feature | Self | Freelancers | In-House Dubai | Host Editify
      │
      │         FOUNDER:
 00:20:55 ───●  [Dhanraj Singh Photo with Gradient Ring] · 4 Years · 100+ Businesses
      │
      │         FAQ ACCORDION:
 00:21:00 ───●  12 Questions (AI vs Human, CapCut, Remote to Dubai, 21h definition, etc.)
      │
      │         FINAL CTA & QUALIFICATION FUNNEL:
 00:21:00 ───●  "Your next 30 videos are already in your camera roll."
 (FINISH)       ┌──────────────────────────────┬───────────────────────────────┐
                │ Call expectations & value    │ 3-Step Qualification Form     │
                │ Qualified -> Cal.com Inline  │ Unqualified -> Sample Edit    │
                └──────────────────────────────┴───────────────────────────────┘
                FOOTER: Dubai hours · India production · Privacy · Terms · ©
```

### 2.2 Mobile Responsive Wireframe (<768px)
```
┌──────────────────────────────────────┐
│ Only 5 new clients/mo · [X] left   ✕│ (Top bar dismissible)
├──────────────────────────────────────┤
│ [HOST EDITIFY]       [Book Audit ▸]  │ (Compact header)
├──────────────────────────────────────┤
│ (For real estate & coaches in Dubai) │
│ You film it.                         │
│ We edit it.                          │
│ Ready in [21 hours].                 │
│                                      │
│ [ Book My Free Content Audit → ]     │ (CTA right under headline)
│ 30-min Meet · Free first edit        │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ 9:16 PHONE SHOWREEL              │ │
│ │ Raw footage transforms to edit   │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ⚡ 21h delivery  ✓ 2 revisions      │
│ 🔒 NDA files     📁 You own files    │
├──────────────────────────────────────┤
│ Brands we edit for:                  │
│ [Marquee auto-scrolling logos]       │
├──────────────────────────────────────┤
│ WhatsApp Pain Bubbles (Staggered)    │
│ 💬 "I filmed it 3 weeks ago..."      │
│ 💬 "CapCut is so confusing..."       │
├──────────────────────────────────────┤
│ 8–15 hrs/week lost (Count-up)        │
│ In 6 months: Inconsistent, missed... │
├──────────────────────────────────────┤
│ Niche Tabs (Swipeable / Stacked)     │
│ 5 Outcome Cards                      │
├──────────────────────────────────────┤
│ 3-Step Timeline (Vertical Cards)     │
│ (1) Audit -> (2) Drive -> (3) 21h    │
├──────────────────────────────────────┤
│ Portfolio (Touch-to-preview 9:16)    │
├──────────────────────────────────────┤
│ Before/After Split (Touch Slider)    │
├──────────────────────────────────────┤
│ Deliverables + Growth/Authority Cards│
├──────────────────────────────────────┤
│ 4 Promises (2x2 Grid)                │
├──────────────────────────────────────┤
│ Proof & Testimonials                 │
├──────────────────────────────────────┤
│ Mobile Comparison (Selectable vs)    │
├──────────────────────────────────────┤
│ Founder Dhanraj Singh Story          │
├──────────────────────────────────────┤
│ FAQ Accordion                        │
├──────────────────────────────────────┤
│ 3-Step Form -> Cal.com / WhatsApp    │
├──────────────────────────────────────┤
│ Footer & Legal                       │
└──────────────────────────────────────┘
[ STICKY BOTTOM BAR: Book Free Audit ⚡ ] (Hides when booking form is visible)
[ FLOATING WHATSAPP 💬 ]
```

---

## 3. Motion & Animation Specification

1. **Global Smooth Scroll (Lenis):**
   * Config: `duration: 1.2`, `easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`, `orientation: 'vertical'`.
   * Automatically disabled if `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.
2. **Left-Edge Timeline Playhead:**
   * Desktop only (`lg:block`), fixed at `left: 24px` or `left: calc((100vw - 1240px)/2 - 32px)`.
   * An SVG vertical track with a glowing scrubber head that tracks document scroll percentage via `gsap.to(scrubber, { scrollTrigger: { scrub: 0.2 } })`.
   * Active section timecode badge smoothly updates string from `00:00:00` to `00:21:00`.
3. **Hero Load Sequence:**
   * SplitText headline lines slide up through `overflow:hidden` mask (stagger `0.12s`, duration `0.8s`, ease `power3.out`).
   * Phone frame rises by `40px` with radial glow opacity fade-in.
   * Playhead knob blinks cyan and starts tracking scroll.
4. **Pain WhatsApp Chat Bubbles:**
   * In-view trigger via `IntersectionObserver`.
   * A simulated 3-dot typing bubble appears for `400ms`, then morphs/springs into the actual chat message with a slight organic rotation (`-1deg` to `1deg`).
5. **Cost Count-Up:**
   * "8" and "15" count up from 0 when entering viewport using GSAP counter object.
6. **How It Works Timeline Scrub:**
   * Desktop: Section pins for `200vh` scroll distance; a horizontal playhead advances across 3 step cards while steps highlight consecutively.
   * Mobile: Unpinned vertical layout with connecting neon line.
7. **Portfolio Hover Previews:**
   * Desktop: Mouse enter starts low-res video muted playback at 1x speed; mouse leave resets to poster.
   * Mobile: IntersectionObserver plays preview when card is centered in viewport.
8. **Dual Synced Before/After Slider:**
   * Draggable line handles mouse/touch pointer events with `clientX` interpolation (`0%` to `100%` clip-path).
9. **Magnetic Hover on Primary CTAs:**
   * Desktop only: button shifts up to `6px` towards cursor within a `30px` hit radius.

---

## 4. Component Architecture & File Structure

```
src/
├── app/
│   ├── (site)/
│   │   ├── page.tsx               # Main landing page assembling all 18 sections
│   │   └── layout.tsx             # Root layout with fonts, smooth scroll, tracking
│   ├── thank-you/
│   │   └── page.tsx               # Post-booking confirmation with Drive upload CTA
│   ├── privacy/
│   │   └── page.tsx               # Meta ads compliant privacy policy
│   ├── terms/
│   │   └── page.tsx               # Service terms & risk reversal conditions
│   ├── api/
│   │   └── lead/
│   │       └── route.ts           # Zod validation -> n8n webhook + Meta CAPI Lead event
│   ├── sitemap.ts                 # XML sitemap generator
│   └── robots.ts                  # Robots.txt generator
├── components/
│   ├── global/
│   │   ├── TopBar.tsx             # Dismissible 5-client capacity announcement
│   │   ├── Navbar.tsx             # Minimal glass sticky navigation
│   │   ├── TimelinePlayhead.tsx   # Signature left-edge timeline scrubber
│   │   ├── FloatingWhatsApp.tsx   # Pre-filled WhatsApp direct chat launcher
│   │   ├── StickyMobileCta.tsx    # Bottom sheet CTA for mobile users
│   │   └── SmoothScrollProvider.tsx # Lenis + GSAP ticker synchronization
│   ├── sections/
│   │   ├── HeroSection.tsx        # Headline, CTA, Phone showreel, trust strip
│   │   ├── LogoMarquee.tsx        # Infinite auto-scroll client brand logos
│   │   ├── PainSection.tsx        # WhatsApp chat bubble objection sequence
│   │   ├── CostSection.tsx        # 8-15 hrs count-up & consequences of delay
│   │   ├── SolutionSection.tsx    # 5 outcome cards & audience tabs (Real estate/Coaches/D2C)
│   │   ├── HowItWorksSection.tsx  # 3-step timeline scrub (Drive -> 21h -> Post)
│   │   ├── PortfolioSection.tsx   # Category filter + 9:16 VideoCard grid + Lightbox
│   │   ├── BeforeAfterSection.tsx # Draggable dual-player split slider
│   │   ├── WhatYouGetSection.tsx  # Deliverables bento, bonuses box, Growth/Authority plans
│   │   ├── PromisesSection.tsx    # 4 risk reversal promise cards
│   │   ├── ProofSection.tsx       # Verified stats, client video quotes
│   │   ├── ComparisonSection.tsx  # Us vs Self vs Freelancers vs In-House Dubai
│   │   ├── FounderSection.tsx     # Dhanraj Singh story and background
│   │   ├── FaqSection.tsx         # 12-item accordion with FAQPage Schema
│   │   ├── BookingSection.tsx     # 3-step qualification form + Cal.com embed
│   │   └── FooterSection.tsx      # Dubai hours note, social links, legal
│   └── ui/
│       ├── Button.tsx             # Gradient button with magnetic hover & glow
│       ├── PhoneFrame.tsx         # Realistic 9:16 smartphone enclosure
│       ├── VideoCard.tsx          # 9:16 card with hover preview and custom cursor
│       ├── VideoLightbox.tsx      # Fullscreen audio-enabled reel player
│       ├── BeforeAfterSlider.tsx  # Interactive split comparison
│       ├── Badge.tsx              # Scarcity and category pills
│       ├── TimecodeBadge.tsx      # JetBrains Mono digital timecode chip
│       └── Accordion.tsx          # Accessible Shadcn accordion wrapper
├── lib/
│   ├── site.config.ts             # Source of truth for business facts, hours, limits
│   ├── tracking.ts                # Meta Pixel + Meta CAPI helpers + UTM capture
│   └── utils.ts                   # Tailwind cn helper
└── styles/
    └── globals.css                # Tailwind v4 theme, custom keyframes, grain texture
```

---

## 5. Asset Map (Slots & Destination Paths)

| Slot Name | Target File Path | Current Status / Fallback Strategy |
|---|---|---|
| Master Logo | `public/brand/logo.png` | Optimized from `_inbox/brand/WhatsApp Image 2026-09-17 at 10.47.08.jpeg` (PNG & Favicon) |
| Hero Showreel | `public/videos/showreel/hero-showreel.mp4` | Labelled interactive placeholder PhoneFrame; logged in `MISSING_ASSETS.md` |
| Client Logos | `public/logos/[brand].svg` | High-fidelity vector monochrome badges: Bluhawk, AI Buddies, DPM, Heart to Mind, Host Dhanraj |
| Real Estate Reels | `public/videos/portfolio/real-estate/*.mp4` | 3 VideoCards with category metadata and lightbox placeholder; logged in `MISSING_ASSETS.md` |
| Personal Brand Reels| `public/videos/portfolio/personal-brand/*.mp4`| 3 VideoCards with category metadata; logged in `MISSING_ASSETS.md` |
| E-Commerce Reels | `public/videos/portfolio/e-commerce/*.mp4` | 3 VideoCards with category metadata; logged in `MISSING_ASSETS.md` |
| AI Avatar / UGC | `public/videos/portfolio/ai-avatar-ugc/*.mp4`| 2 VideoCards with category metadata; logged in `MISSING_ASSETS.md` |
| Ads Reels | `public/videos/portfolio/ads/*.mp4` | 2 VideoCards with category metadata; logged in `MISSING_ASSETS.md` |
| Before/After Pairs | `public/videos/before-after/pair-[1..3]/` | Draggable comparison component with synced mock tracks; logged in `MISSING_ASSETS.md` |
| Founder Portrait | `public/founder/dhanraj-singh.jpg` | Stylized editorial silhouette portrait with gradient halo ring |
| Atmospheric Grain | `public/generated/grain.svg` | Lightweight SVG noise filter |
| Hero Light Field | `public/generated/hero-light-field.webp` | Cinematic 21:9 blue/purple/pink streak glow backdrop |
| Dubai Night Mood | `public/generated/dubai-night-mood.webp` | Cinematic teal/magenta low-opacity skyline bokeh for final CTA section |
| Open Graph Preview | `public/generated/og-image.png` | 1200×630 dark card with logo, headline, and "Ready in 21 hours" |
