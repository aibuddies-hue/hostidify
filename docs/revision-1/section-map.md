# Host Editify — Landing Page Section Map (Audit: Revision Round 1)

This document maps every section and persistent layout component currently rendering on the landing page in visual order, along with its component file path and purpose.

---

## Persistent Global Chrome (Layout Layer)

| Order | Element Name | Component File Path | Description / Role |
| :--- | :--- | :--- | :--- |
| **G-01** | `TopBar` | `src/components/global/TopBar.tsx` | Top banner with urgency ticker and live countdown timer. |
| **G-02** | `Navbar` | `src/components/global/Navbar.tsx` | Glassmorphic sticky navigation with brand logo, nav links, and CTA. |
| **G-03** | `TimelinePlayhead` | `src/components/global/TimelinePlayhead.tsx` | Left-edge vertical timeline scrubber showing real-time timecode scroll progress. *(Targeted for complete removal in Phase 1).* |
| **G-04** | `FloatingWhatsApp` | `src/components/global/FloatingWhatsApp.tsx` | Floating quick-chat WhatsApp widget anchored to bottom right. |
| **G-05** | `StickyMobileCta` | `src/components/global/StickyMobileCta.tsx` | Persistent bottom bar for mobile screens with 1-tap booking action. |

---

## Main Landing Page Flow (`src/app/(site)/page.tsx`)

| Order | Section Name | Component File Path | Core Role & Visual Elements |
| :---: | :--- | :--- | :--- |
| **01** | **Hero Section** | `src/components/sections/HeroSection.tsx` | Main value proposition ("You film it. We edit it. Ready in 21 hours."), primary booking CTA, secondary "Watch Reel (35s)" button, trust indicators, and 9:16 phone mockup displaying video and raw-vs-graded comparison toggle. |
| **02** | **Logo Marquee** | `src/components/sections/LogoMarquee.tsx` | Infinite horizontal marquee showing 5 partner/client brand logos (AI Buddies, Bluhawk Marketing, DPM Entertainment, Heart to Mind, Host Dhanraj). |
| **03** | **Pain Section** | `src/components/sections/PainSection.tsx` | "The Endless Editing Nightmare" — highlights common founder frustrations (chasing unreliable freelancers, lost weekends inside CapCut, missed distribution cycles). |
| **04** | **Cost / Friction Section** | `src/components/sections/CostSection.tsx` | Comparison of traditional hiring & freelancer costs vs. dedicated fast turnaround system. |
| **05** | **Solution Section** | `src/components/sections/SolutionSection.tsx` | "Your Dedicated Video Room" — outlines the 21-hour post-production engine, AI workflow integration, and async Google Drive asset drop system. |
| **06** | **How It Works** | `src/components/sections/HowItWorksSection.tsx` | 3-step operational walkthrough (1. Drop raw clip in Drive, 2. We edit & grade in 21 hours, 3. You approve & post). |
| **07** | **Portfolio Section** | `src/components/sections/PortfolioSection.tsx` | 12-item filterable video showcase (Real Estate, Personal Brand, E-Commerce, AI Avatar & UGC, Ads) with hover previews and full audio lightbox playback. |
| **08** | **Before & After Section** | `src/components/sections/BeforeAfterSection.tsx` | Interactive dual split slider comparing raw iPhone camera footage against finished 21-hour edits across 3 industry niches. |
| **09** | **What You Get** | `src/components/sections/WhatYouGetSection.tsx` | Comprehensive package breakdown: dynamic captions, B-roll selection, sound design, color grading, hooks, revisions, and ownership rights. |
| **10** | **Promises / Guarantees** | `src/components/sections/PromisesSection.tsx` | 4 hard guarantees: 21-hour turnaround or edit is free, 2 revision rounds, strict client NDAs, 100% IP ownership. |
| **11** | **Proof / Social Proof** | `src/components/sections/ProofSection.tsx` | Client testimonials and case studies from real founders and creators. |
| **12** | **Comparison Section** | `src/components/sections/ComparisonSection.tsx` | Detailed side-by-side table: In-House Editor vs. Upwork/Fiverr Freelancers vs. Host Editify. |
| **13** | **Founder Section** | `src/components/sections/FounderSection.tsx` | Dhanraj Singh's origin story, background in marketing and AI workflows, and playable video note. |
| **14** | **FAQ Section** | `src/components/sections/FaqSection.tsx` | 10 accordion questions addressing turnaround, raw clip submission, revisions, software, and payment terms. |
| **15** | **Booking Section** | `src/components/sections/BookingSection.tsx` | Lead qualification funnel and booking calendar integration with urgency indicators. |
| **16** | **Footer Section** | `src/components/sections/FooterSection.tsx` | Brand logo, legal links (Privacy Policy, Terms of Service), location and copyright disclosure. |

---

## Step 1.3 Audit Findings

### 1. Video Inventory (Every place a video appears)
1. **Hero Section (`HeroSection.tsx`)**:
   - Embedded 9:16 phone mockup rendering `/videos/hero-showreel-full.mp4` with dynamic raw vs. graded state transition.
   - Lightbox modal triggered by "Watch Reel" CTA button and phone click.
2. **Solution / Use Case Tabs (`SolutionSection.tsx`)**:
   - 3 tabs (Real Estate, Coaches & Personal Brands, E-Commerce), rendering 9 `VideoCard` instances (3 per tab) with preview clips on hover/scroll and full modal lightbox playback.
3. **How It Works (`HowItWorksSection.tsx`)**:
   - Step 2 visual demonstrating fast-turnaround video transformation.
4. **Portfolio Showcase (`PortfolioSection.tsx`)**:
   - 12 filterable `VideoCard` items (Real Estate, Personal Brand, E-Commerce, Ads, AI Avatar & UGC) with hover video preview and `VideoLightbox` with unmuted audio playback.
5. **Before & After Section (`BeforeAfterSection.tsx` / `BeforeAfterSlider.tsx`)**:
   - Interactive dual synchronized `<video>` split player comparing raw mobile footage vs. color-graded/captioned delivery.
6. **Founder Note (`FounderSection.tsx`)**:
   - 9:16 preview card playing `/videos/founder-story-preview.mp4` with click-to-play full founder story video lightbox (`/videos/founder-story-full.mp4`).

### 2. Stats & Numbers Audit (Every place a number/stat appears)
1. **Turnaround Time ("21 hours")**:
   - Appeared across metadata, Hero (`h1`, CTA microcopy, trust bar), How It Works, Promises, Proof, Comparison, Founder, FAQ, and `site.config.ts`. *(Targeted for update to 24 hours)*.
2. **Unverified View & Inquiry Metrics**:
   - `PortfolioSection.tsx`: "420K Views · 26 High-Net Inquiries", "45K Organic Views · 34 Call Bookings", "3.8x Hook Retention on Meta", "91% Completion Rate", "820 Saves · High Intent Calls", "2.9% Engagement Rate", "2.5% Ad CTR (Verified)", "3.4x ROAS on Meta", "14 Inquiries in 48h".
   - `SolutionSection.tsx`: "18 High-Intent DMs", "142K Organic Views", "2.8% Link CTR", "34 Consultation Bookings", "89K Reach", "4.1% Save Rate", "3.2x ROAS Meta Ad", "2.5% Ad CTR", "520+ Direct Orders".
   - `ProofSection.tsx`: "2.5% Ad CTR" in testimonial quote and verified stats callout box.
   - `site.config.ts`: `adCtr: "2.5%"`, `founder.clients: "100+"`.
   *(All unverified numbers targeted for removal / setting to null in Phase 1)*.
3. **Legitimate Operational / Offer Numbers**:
   - Free edit length: "up to 40 sec".
   - Call duration: "30-min Google Meet".
   - Revision allowances: "2 rounds (4 on Authority)".
   - Monthly plan volume: "15 short-form (Growth)" / "25 short-form + 4 long-form (Authority)".
   - Time saved: "8–15 hours / week".

