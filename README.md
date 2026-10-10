# Host Editify — Landing Page & Audit Booking Funnel

A high-converting, single-page landing page and audit booking funnel engineered for **Host Editify**, a short-form video editing agency delivering publish-ready content in 24 hours for founders, coaches, and brands in **India and Dubai**.

---

## ⚡ Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Montserrat (Headings) + Inter (Body)
- **Forms & Popups**: React Hook Form + Zod + Libphonenumber-js + AuditModal Context (Mobile bottom-sheet, Desktop modal)
- **Scheduling**: Cal.com Embed (`@calcom/embed-react`)
- **Analytics & Tracking**: Meta Pixel + Meta Conversions API (CAPI) deduplicated via event IDs + UTM parameter persistence
- **Media Automation**: Automated portfolio and review scanner scripts (`npm run portfolio`, `npm run reviews`)

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Populate the required credentials:
```ini
# Cal.com booking link (e.g. your-username/content-audit)
NEXT_PUBLIC_CALCOM_LINK="hosteditify/content-audit"

# Direct communication channels
NEXT_PUBLIC_WHATSAPP_NUMBER="971500000000"
NEXT_PUBLIC_CONTACT_EMAIL="contact@hosteditify.com"

# Social links
NEXT_PUBLIC_INSTAGRAM_URL="https://instagram.com/hosteditify"
NEXT_PUBLIC_LINKEDIN_URL="https://linkedin.com/company/hosteditify"
NEXT_PUBLIC_PORTFOLIO_URL="https://canva.com"

# Meta Ads tracking (Pixel + Conversions API)
NEXT_PUBLIC_META_PIXEL_ID=""
META_CAPI_TOKEN=""
META_TEST_EVENT_CODE=""

# Webhook for CRM / Lead routing (n8n / Zapier)
N8N_LEAD_WEBHOOK_URL=""
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🛠️ Content & Media Management Guide

### 1. Adding Portfolio Videos
All videos on the site appear exclusively in the **"Watch our work"** section.
1. Place vertical 9:16 `.mp4` video files into the corresponding directory:
   - `public/videos/work/short-form/` — Short-form Reels, Shorts, and TikTok cuts.
   - `public/videos/work/ads/` — Direct-response and paid ads.
   - `public/videos/work/before-after/pair-1/` — Subfolders with `raw.mp4` and `edit.mp4`.
2. Run the automated scan script:
   ```bash
   npm run portfolio
   ```
   *This automatically generates clean posters in `public/posters/work/` and updates `src/data/portfolio.json`.*

### 2. Adding Client Review Screenshots
The "What our clients say" section is a screenshot-based review wall (swipe carousel on mobile, masonry on desktop, tap to expand full size).
1. Drop screenshot images (`.png`, `.jpg`, `.jpeg`, `.webp`) into `public/reviews/`.
   - Name format: `ClientName_Company.png` (e.g. `Rudra-Sahu_Bluhawk-Marketing.png`).
   - Or add a JSON sidecar with the same name: `Rudra-Sahu.json` containing `{ "name": "Rudra Sahu", "business": "Bluhawk Marketing", "caption": "..." }`.
2. Run the reviews builder:
   ```bash
   npm run reviews
   ```
   *If `public/reviews/` is empty, the section automatically hides from the landing page with zero fake placeholders.*

### 3. Adding Client & Brand Logos
1. Place SVGs or transparent PNGs in `public/logos/`.
2. Add brand names to the `clients` array in `src/lib/site.config.ts`:
   ```ts
   clients: [
     "Bluhawk Marketing",
     "AI Buddies",
     "DPM Entertainment",
     "Heart to Mind",
     "Host Dhanraj",
   ],
   ```

### 4. Founder Photo & Story
- Replace `public/founder/dhanraj-singh.jpg` with Dhanraj's official high-resolution headshot.
- Edit bio text or details in `src/components/sections/FounderSection.tsx` (keep under 60 words).

### 5. Configuring Plan Bonuses & Turnaround (`src/lib/site.config.ts`)
Turnaround hours, onboarding limits, and optional bonus deliverables can be adjusted in `src/lib/site.config.ts`:
```ts
export const site = {
  deliveryHours: 24,
  maxClientsPerMonth: 5,
  freeFirstVideoMaxSeconds: 40,
  bonuses: {
    hookBank: true,               // Always true (included free)
    contentStyleIdeas: false,     // Set to true when client confirms inclusion
    monthlyStrategyCall: false,   // Set to true when client confirms inclusion
  },
  // ...
};
```
