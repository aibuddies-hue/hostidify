# Host Editify — Missing Assets Registry

This document lists all media assets that were not present locally in `_inbox/` and could not be fetched automatically from the Google Drive backup due to access restrictions.

> [!IMPORTANT]
> Non-negotiable truth rule: We do NOT invent fake client faces, fake video footage, or unverified claims. All missing media slots are built with clearly labelled, production-ready placeholders that can be swapped instantly once files are dropped into `public/videos/`, `public/testimonials/`, and `public/founder/`.

---

## Required Media Assets to be Provided by Founder

### 1. Hero Showreel
- **Target Location**: `public/videos/showreel/hero-showreel.mp4` (and `hero-showreel.webm`)
- **Format**: 9:16 vertical (1080×1920 or 720×1280), 30–45 seconds.
- **Specification**: Raw-to-edit transformation reel demonstrating cuts, captions, motion graphics, and color grading. Autoplay muted version (≤ 3 MB) + audio version for lightbox.
- **Current Placeholder**: A CSS/Canvas animated 9:16 phone mockup simulating video timeline waveforms and playhead scrubbing with the official logo.

### 2. Portfolio Niche Reels
- **Target Location**: `public/videos/portfolio/[category]/`
- **Categories**:
  1. `real-estate/` (3 reels)
  2. `personal-brand/` (3 reels)
  3. `e-commerce/` (3 reels)
  4. `ai-avatar-ugc/` (2 reels)
  5. `ads/` (2 reels)
- **Format**: 9:16 vertical MP4, with 6–8 second hover previews (≤ 1 MB each) + full versions for lightbox.
- **Current Placeholder**: High-aesthetic 9:16 video cards with category badges, duration timecodes (`00:28`), and interactive play modals.

### 3. Before / After Comparison Pairs
- **Target Location**: `public/videos/before-after/pair-[1..3]/`
  - `pair-1/raw.mp4` & `pair-1/edit.mp4`
  - `pair-2/raw.mp4` & `pair-2/edit.mp4`
  - `pair-3/raw.mp4` & `pair-3/edit.mp4`
- **Format**: Synchronized identical-length clips demonstrating unedited footage vs. Host Editify edited footage with dynamic subtitles, B-roll, and SFX.
- **Current Placeholder**: Interactive dual-pane split slider comparing stylized raw timeline footage with graded/captioned mock edit.

### 4. Client Testimonials
- **Target Location**: `public/testimonials/`
  1. **Rudra Sahu** (Owner, Bluhawk Marketing) — Video or screenshot
  2. **Dr. Kokila** (Heart to Mind) — Video or screenshot
  3. **Shivanshu Mishra** (DPM Entertainment) — Video or screenshot
- **Current Status**: Real client names and business titles from the copy doc are pre-configured; media slots show elegant verified quote badges until video/screenshot files are provided.

### 5. Client Brand Logos
- **Target Location**: `public/logos/`
  - Bluhawk Marketing
  - AI Buddies
  - DPM Entertainment
  - Heart to Mind
  - Host Dhanraj
- **Current Status**: Rendered as clean, optically balanced monochrome typographic SVG badges matching the official typography until vector SVGs are dropped.

### 6. Founder Portrait
- **Target Location**: `public/founder/dhanraj-singh.jpg`
- **Specification**: High-resolution portrait of Dhanraj Singh, studio or crisp lighting, transparent PNG or dark background.
- **Current Placeholder**: Stylized editorial silhouette portrait with brand gradient halo ring and JetBrains Mono timecode coordinates.
