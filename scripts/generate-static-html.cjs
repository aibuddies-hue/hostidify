const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const swc = require('@next/swc-darwin-arm64');

const rootDir = path.resolve(__dirname, '..');

// 1. Hook require for @/ aliases and CSS imports
const Module = require('module');
const originalResolve = Module._resolveFilename;

// Proxy for motion (e.g. motion.div, motion.span, AnimatePresence)
const motionHandler = {
  get: (target, prop) => {
    if (typeof prop === 'symbol' || prop === '$$typeof') return undefined;
    if (prop === '__esModule') return true;
    if (prop === 'AnimatePresence') return ({ children }) => children;
    return React.forwardRef(({ children, whileHover, whileTap, initial, animate, exit, transition, ...props }, ref) =>
      React.createElement(prop, { ...props, ref }, children)
    );
  },
};
const mockMotion = new Proxy({}, motionHandler);

const iconProxy = new Proxy({}, {
  get: (target, prop) => {
    if (typeof prop === 'symbol' || prop === '$$typeof') return undefined;
    if (prop === '__esModule') return true;
    if (prop === 'default') return iconProxy;
    return (props) => React.createElement('span', { ...props, 'data-icon': String(prop) });
  },
});

const mockCal = {
  getCalApi: async () => () => {},
  Cal: () => React.createElement('div', { className: 'cal-embed-placeholder' }),
};

const mockGsap = {
  gsap: {
    to: () => {},
    from: () => {},
    fromTo: () => {},
    set: () => {},
    timeline: () => ({ to: () => {}, from: () => {}, play: () => {}, pause: () => {} }),
    registerPlugin: () => {},
  },
  ScrollTrigger: {
    getAll: () => [],
    refresh: () => {},
  },
  useGSAP: () => {},
};

const mockLenis = class {
  on() {}
  raf() {}
  destroy() {}
};

Module._resolveFilename = function (request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    const rel = request.slice(2);
    const full = path.join(rootDir, 'src', rel);
    return originalResolve.call(this, full, parent, isMain, options);
  }
  if (request === 'lucide-react' || request.startsWith('lucide-react/')) return 'virtual-lucide-react';
  if (request === 'motion' || request === 'motion/react' || request === 'framer-motion') return 'virtual-motion';
  if (request === '@calcom/embed-react') return 'virtual-calcom';
  if (request === 'gsap' || request.startsWith('gsap/')) return 'virtual-gsap';
  if (request === '@gsap/react') return 'virtual-gsap-react';
  if (request === 'lenis' || request === '@studio-freight/lenis') return 'virtual-lenis';
  if (request === 'libphonenumber-js' || request.startsWith('libphonenumber-js/')) return 'virtual-libphonenumber-js';
  return originalResolve.call(this, request, parent, isMain, options);
};

require.cache['virtual-lucide-react'] = { id: 'virtual-lucide-react', filename: 'virtual-lucide-react', loaded: true, exports: iconProxy };
require.cache['virtual-motion'] = { id: 'virtual-motion', filename: 'virtual-motion', loaded: true, exports: { motion: mockMotion, AnimatePresence: ({ children }) => children, m: mockMotion } };
require.cache['virtual-calcom'] = { id: 'virtual-calcom', filename: 'virtual-calcom', loaded: true, exports: mockCal };
require.cache['virtual-gsap'] = { id: 'virtual-gsap', filename: 'virtual-gsap', loaded: true, exports: { gsap: mockGsap.gsap, ...mockGsap.gsap, ScrollTrigger: mockGsap.ScrollTrigger, default: mockGsap.gsap } };
require.cache['virtual-gsap-react'] = { id: 'virtual-gsap-react', filename: 'virtual-gsap-react', loaded: true, exports: { useGSAP: mockGsap.useGSAP, default: mockGsap.useGSAP } };
require.cache['virtual-lenis'] = { id: 'virtual-lenis', filename: 'virtual-lenis', loaded: true, exports: { default: mockLenis, Lenis: mockLenis } };
require.cache['virtual-libphonenumber-js'] = { id: 'virtual-libphonenumber-js', filename: 'virtual-libphonenumber-js', loaded: true, exports: { parsePhoneNumberFromString: () => ({ isValid: () => true, formatInternational: () => '' }) } };

require.extensions['.css'] = () => ({});
require.extensions['.ts'] = require.extensions['.tsx'] = function (module, filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const transformed = swc.transformSync(
    content,
    false,
    Buffer.from(
      JSON.stringify({
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
          target: 'es2022',
        },
        module: { type: 'commonjs' },
      })
    )
  );
  module._compile(transformed.code, filename);
};

// 3. Mock Next.js internal modules
const mockLink = ({ href, children, className, ...props }) =>
  React.createElement('a', { href, className, ...props }, children);
const mockImage = ({ src, alt, width, height, className, priority, fill, style, ...props }) => {
  const objFit = (className && className.includes('object-contain')) ? 'contain' : (style?.objectFit || (fill ? 'cover' : 'contain'));
  const mergedStyle = fill
    ? { position: 'absolute', height: '100%', width: '100%', inset: 0, objectFit: objFit, display: 'block', ...style }
    : { display: 'block', maxWidth: '100%', ...style };
  return React.createElement('img', {
    src: typeof src === 'object' && src?.src ? src.src : src,
    alt: alt || '',
    width,
    height,
    className,
    style: mergedStyle,
    ...props,
  });
};
const mockNav = {
  useRouter: () => ({ push: () => {}, replace: () => {}, back: () => {} }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
};

require.cache[require.resolve('next/link')] = { id: require.resolve('next/link'), filename: require.resolve('next/link'), loaded: true, exports: mockLink };
require.cache[require.resolve('next/link')].exports.default = mockLink;
require.cache[require.resolve('next/image')] = { id: require.resolve('next/image'), filename: require.resolve('next/image'), loaded: true, exports: mockImage };
require.cache[require.resolve('next/image')].exports.default = mockImage;
try {
  const navPath = require.resolve('next/navigation');
  require.cache[navPath] = { id: navPath, filename: navPath, loaded: true, exports: mockNav };
} catch {}

// 4. Import components directly
console.log('Compiling components...');
const { TopBar } = require('../src/components/global/TopBar');
const { Navbar } = require('../src/components/global/Navbar');
const { HeroSection } = require('../src/components/sections/HeroSection');
const { LogoMarquee } = require('../src/components/sections/LogoMarquee');
const { PortfolioSection } = require('../src/components/sections/PortfolioSection');
const { PainSection } = require('../src/components/sections/PainSection');
const { CostSection } = require('../src/components/sections/CostSection');
const { ComparisonSection } = require('../src/components/sections/ComparisonSection');
const { SolutionSection } = require('../src/components/sections/SolutionSection');
const { HowItWorksSection } = require('../src/components/sections/HowItWorksSection');
const { WhatYouGetSection } = require('../src/components/sections/WhatYouGetSection');
const { PromisesSection } = require('../src/components/sections/PromisesSection');
const { ProofSection } = require('../src/components/sections/ProofSection');
const { FounderSection } = require('../src/components/sections/FounderSection');
const { FaqSection } = require('../src/components/sections/FaqSection');
const { BookingSection } = require('../src/components/sections/BookingSection');
const { FooterSection } = require('../src/components/sections/FooterSection');
const { StickyMobileCta } = require('../src/components/global/StickyMobileCta');
const { FloatingWhatsApp } = require('../src/components/global/FloatingWhatsApp');

console.log('Rendering complete site to static HTML...');
const bodyHtml = ReactDOMServer.renderToStaticMarkup(
  React.createElement(
    'div',
    { className: 'min-h-screen bg-[#0A0A0F] text-white flex flex-col selection:bg-[#A24BFF] selection:text-white' },
    React.createElement(TopBar),
    React.createElement(Navbar),
    React.createElement(
      'main',
      { className: 'relative flex flex-col w-full' },
      React.createElement(HeroSection),
      React.createElement(LogoMarquee),
      React.createElement(PortfolioSection),
      React.createElement(PainSection),
      React.createElement(CostSection),
      React.createElement(ComparisonSection),
      React.createElement(SolutionSection),
      React.createElement(HowItWorksSection),
      React.createElement(WhatYouGetSection),
      React.createElement(PromisesSection),
      React.createElement(ProofSection),
      React.createElement(FounderSection),
      React.createElement(FaqSection),
      React.createElement(BookingSection)
    ),
    React.createElement(FooterSection),
    React.createElement(StickyMobileCta),
    React.createElement(FloatingWhatsApp)
  )
);

const fullHtml = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Host Editify — Short-Form & YouTube Video Editing for Founders in India & Dubai (24h Turnaround)</title>
  <meta name="description" content="Host Editify is a specialized short-form and YouTube video editing agency for founders, creators, and brands across India and Dubai. 24-hour turnaround, human creative editors, first video edited free."/>
  <link rel="icon" href="/favicon.ico"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800&display=swap" rel="stylesheet"/>
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Complete Design System & Interactive Fallbacks -->
  <style>
    :root {
      --font-heading: 'Montserrat', system-ui, -apple-system, sans-serif;
      --font-body: 'Inter', system-ui, -apple-system, sans-serif;
      --purple: #A24BFF;
      --purple-hover: #B86BFF;
      --brand-gradient: linear-gradient(135deg, #7928CA 0%, #A24BFF 50%, #FF0080 100%);
    }

    *, ::before, ::after {
      box-sizing: border-box;
    }

    html, body {
      background-color: #0A0A0F !important;
      color: #FFFFFF !important;
      font-family: var(--font-body);
      margin: 0;
      padding: 0;
      width: 100%;
      max-width: 100vw;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    h1, h2, h3, h4, h5, h6, .font-heading {
      font-family: var(--font-heading);
      text-wrap: balance;
    }

    p, li, blockquote {
      text-wrap: pretty;
    }

    /* Container Standard */
    .max-w-\\[1200px\\] {
      max-width: 1200px !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    .max-w-\\[1240px\\] {
      max-width: 1240px !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    .max-w-\\[720px\\] {
      max-width: 720px !important;
    }
    .max-w-\\[680px\\] {
      max-width: 680px !important;
    }
    .max-w-\\[760px\\] {
      max-width: 760px !important;
    }

    /* Brand Gradients */
    .text-brand-gradient {
      background: var(--brand-gradient) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      display: inline-block;
    }
    .bg-brand-gradient {
      background: var(--brand-gradient) !important;
    }

    /* Lucide SVGs */
    svg.lucide, svg[data-icon] {
      display: inline-block;
      vertical-align: middle;
      flex-shrink: 0;
    }

    /* Portfolio Video Cards */
    .portfolio-card, [data-portfolio-card] {
      width: 240px !important;
      min-width: 220px !important;
      height: 426px !important;
      aspect-ratio: 9 / 16 !important;
      position: relative !important;
      flex-shrink: 0 !important;
      border-radius: 16px !important;
      overflow: hidden !important;
      background-color: #14141C !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
    }

    /* Aspect Ratio Utilities */
    .aspect-\\[9\\/16\\], [style*="aspect-ratio: 9 / 16"], [style*="aspect-ratio:9 / 16"] {
      aspect-ratio: 9 / 16 !important;
    }
    .aspect-\\[16\\/9\\] {
      aspect-ratio: 16 / 9 !important;
    }

    /* Buttons & Interactive Elements */
    button {
      cursor: pointer;
    }

    /* Custom Scrollbar for Carousel */
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  </style>
</head>
<body class="bg-[#0A0A0F] text-white">
  ${bodyHtml}

  <!-- Client Script for Modals, Lightbox, Tabs, and Accordions -->
  <script src="/js/client.js"></script>
</body>
</html>`;

const outDir = path.join(rootDir, '.next/server/app');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), fullHtml, 'utf8');
console.log('✓ Successfully generated .next/server/app/index.html (' + fullHtml.length + ' bytes)!');
