# Client logos — 15 October 2026

All six brand tiles remain in the original trusted-brands section and retain the original brand order. Blue Hawk and InnovateX Media use their existing supplied assets. AI Buddies uses the supplied JPEG. Host Dhanraj uses the supplied WebP unchanged. The custom SVG proposals for DPM, Heart to Mind and Host Dhanraj are no longer referenced.

Heart to Mind and DPM use high-resolution restorations made with the built-in imagegen tool, followed by lossless WebP encoding for the website. These are AI-assisted reconstructions of the supplied low-resolution images, not original vector masters. Original uploads and the full-resolution PNG results are retained in `public/logos/`.

Files used by the website:
- `public/logos/ai-buddies.jpeg`
- `public/logos/dpm-hd.webp`
- `public/logos/heart-to-mind-hd.webp`
- `public/logos/host-dhanraj.webp`

Restoration prompt — Heart to Mind:

> Edit target: supplied Heart to Mind logo. Restore this exact existing low-resolution logo as a clean high-resolution 1024px square raster asset for a client-logo strip on a website. Preserve its identity and exact composition: dimensional interlocking heart ribbons, pink/magenta on left, cyan/blue/purple on right, inner leaves and pink head/person symbol. Match the original contours, proportions, smooth gradient colors and subtle highlights faithfully. Only remove compression/pixelation and make edges crisp, smooth and polished. Solid near-white background #F5F5F3. Center complete logo with a small safe margin; no cropping, no new text, no additional symbols, no redesign, no mockup. It must look like the same provided logo, simply clearer.

Restoration prompt — DPM:

> Edit target: the supplied DPM Entertainment logo. Make a faithful high-resolution restoration of this exact logo on a transparent background, complete mark centered in a portrait/square canvas with small safe margin. Preserve the original design precisely: a black/charcoal human silhouette crouching on a pedestal and holding an oversized silver/black cinema film reel overhead; reel outer ring with white perforations and central circular holes; the pedestal has lower-case stylized 'dpm' lettering with red d, orange p and black m, plus tiny uppercase 'ENTERTAINMENT' beneath. Preserve the silver highlights, black silhouette, white outline around mark, proportions, posture, typography and original color placements. Clean the fuzzy edges and pixelation and make lettering legible. No redesign, no new decorative elements, no added slogans, no mockup or shadows outside the logo. Exact text: 'dpm' and 'ENTERTAINMENT'. This must look like the same supplied brand asset, only clean and sharper.

Validation: production build and TypeScript checks passed. Browser checks at 320, 390, 768 and 1440px confirmed all six images decode, no horizontal overflow and no uncaught page errors. Desktop/mobile screenshots are saved as `brands-1440.png`, `brands-390.png`, `brands-320.png` and `brands-768.png` alongside this document.
