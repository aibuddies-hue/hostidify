/**
 * Host Editify Client-Side Interactive Engine
 * Provides instant interactivity for Audit Modal, Video Lightbox, Portfolio Tabs, FAQ Accordion, and Niche Rotation.
 */

(function () {
  'use strict';

  // 1. ROTATING NICHE WORD
  const rotatingWords = ['Real estate', 'Personal brands', 'E-commerce', 'AI content'];
  let currentWordIdx = 0;
  const nicheSpan = document.getElementById('rotating-niche-word');

  if (nicheSpan) {
    setInterval(() => {
      currentWordIdx = (currentWordIdx + 1) % rotatingWords.length;
      nicheSpan.style.opacity = '0';
      nicheSpan.style.transform = 'translateY(4px)';
      setTimeout(() => {
        nicheSpan.textContent = rotatingWords[currentWordIdx];
        nicheSpan.style.opacity = '1';
        nicheSpan.style.transform = 'translateY(0)';
      }, 200);
    }, 2200);
  }

  // 2. PORTFOLIO TABS & CAROUSEL NAVIGATION
  const portfolioSection = document.getElementById('work-section');
  if (portfolioSection) {
    const tabButtons = portfolioSection.querySelectorAll('[data-portfolio-tab]');
    const cards = portfolioSection.querySelectorAll('[data-portfolio-card]');
    const carousel = portfolioSection.querySelector('.overflow-x-auto');
    const arrowLeft = portfolioSection.querySelector('[data-scroll-arrow="left"]');
    const arrowRight = portfolioSection.querySelector('[data-scroll-arrow="right"]');

    if (arrowLeft && carousel) {
      arrowLeft.addEventListener('click', () => {
        carousel.scrollBy({ left: -300, behavior: 'smooth' });
      });
    }
    if (arrowRight && carousel) {
      arrowRight.addEventListener('click', () => {
        carousel.scrollBy({ left: 300, behavior: 'smooth' });
      });
    }

    tabButtons.forEach((tab) => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-portfolio-tab');

        // Update active tab styles
        tabButtons.forEach((t) => {
          t.className =
            'px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer bg-[#14141C] text-[#A0A0B0] hover:text-white border border-white/[0.08] hover:border-white/20';
        });
        tab.className =
          'px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer bg-brand-gradient text-white shadow-md shadow-purple-500/20 scale-105';

        // Filter cards
        cards.forEach((card) => {
          const type = card.getAttribute('data-video-type');
          if (
            filter === 'all' ||
            type === filter ||
            (filter === 'shortForm' && type === 'short-form') ||
            (filter === 'longForm' && type === 'long-form')
          ) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });

        if (carousel) {
          carousel.scrollTo({ left: 0, behavior: 'smooth' });
        }
      });
    });
  }

  // 3. VIDEO LIGHTBOX MODAL
  let lightboxModal = null;

  function createLightboxModal() {
    if (lightboxModal) return lightboxModal;

    const modal = document.createElement('div');
    modal.id = 'video-lightbox-modal';
    modal.className =
      'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-300';
    modal.innerHTML = `
      <div class="relative w-full max-w-sm sm:max-w-xl bg-[#14141C] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center">
        <!-- Close Button -->
        <button id="lightbox-close-btn" class="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <!-- Video Player -->
        <div id="lightbox-media-container" class="relative w-full bg-black flex items-center justify-center overflow-hidden" style="aspect-ratio: 9/16; max-height: 72vh;">
          <video id="lightbox-video" controls autoplay playsinline loop class="w-full h-full object-cover"></video>
        </div>

        <!-- Bottom Action Bar -->
        <div class="p-4 sm:p-5 w-full bg-[#14141C] border-t border-white/[0.08] flex items-center justify-between gap-3">
          <div class="truncate">
            <span id="lightbox-tag" class="text-[10px] font-bold uppercase text-[#A24BFF] tracking-wider block">Short-Form</span>
            <p id="lightbox-title" class="text-sm font-bold text-white truncate"></p>
          </div>
          <button id="lightbox-audit-cta" class="shrink-0 px-4 py-2 rounded-full text-xs font-bold bg-brand-gradient text-white shadow-lg shadow-purple-500/20 hover:scale-105 transition-all cursor-pointer">
            Book Free Audit
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#lightbox-close-btn');
    const mediaContainer = modal.querySelector('#lightbox-media-container');
    const auditCta = modal.querySelector('#lightbox-audit-cta');

    const closeLightbox = () => {
      modal.classList.add('opacity-0', 'pointer-events-none');
      if (mediaContainer) {
        mediaContainer.innerHTML = '';
      }
    };

    closeBtn.addEventListener('click', closeLightbox);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('pointer-events-none')) {
        closeLightbox();
      }
    });

    if (auditCta) {
      auditCta.addEventListener('click', () => {
        closeLightbox();
        openAuditModal('lightbox');
      });
    }

    lightboxModal = modal;
    return modal;
  }

  function openLightbox(videoUrl, title, type, youtubeId) {
    const modal = createLightboxModal();
    const mediaContainer = modal.querySelector('#lightbox-media-container');
    const titleEl = modal.querySelector('#lightbox-title');
    const tagEl = modal.querySelector('#lightbox-tag');

    if (youtubeId || (videoUrl && videoUrl.includes('youtube.com'))) {
      const id = youtubeId || (videoUrl.split('v=')[1] || '').split('&')[0];
      mediaContainer.style.aspectRatio = '16/9';
      mediaContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      if (tagEl) tagEl.textContent = 'YouTube Long-Form';
    } else {
      mediaContainer.style.aspectRatio = '9/16';
      mediaContainer.innerHTML = `<video id="lightbox-video" controls autoplay playsinline loop class="w-full h-full object-cover" src="${videoUrl}"></video>`;
      const video = mediaContainer.querySelector('video');
      if (video) video.play().catch(() => {});
      if (tagEl) tagEl.textContent = type === 'ads' ? 'Ad Video' : 'Short-Form';
    }
    if (titleEl) titleEl.textContent = title;
    modal.classList.remove('opacity-0', 'pointer-events-none');
  }

  // Attach lightbox listener to all portfolio cards
  document.querySelectorAll('[data-portfolio-card]').forEach((card) => {
    card.addEventListener('click', () => {
      const url = card.getAttribute('data-video-url');
      const title = card.getAttribute('data-video-title') || 'Host Editify Video';
      const type = card.getAttribute('data-video-type') || 'short-form';
      const ytId = card.getAttribute('data-youtube-id') || '';
      if (url) {
        openLightbox(url, title, type, ytId);
      }
    });
  });

  // 4. MULTI-STEP AUDIT MODAL ENGINE
  let auditModal = null;

  function createAuditModal() {
    if (auditModal) return auditModal;

    const modal = document.createElement('div');
    modal.id = 'lead-audit-modal';
    modal.className =
      'fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-300';
    modal.innerHTML = `
      <div class="relative w-full max-w-lg bg-[#14141C] border border-white/[0.1] rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto text-left flex flex-col">
        <!-- Close Button -->
        <button id="audit-close-btn" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/[0.08]">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <!-- Step Indicator -->
        <div class="flex items-center gap-2 mb-6">
          <span id="audit-step-pill" class="text-[11px] font-bold uppercase tracking-wider text-[#A24BFF] bg-[#A24BFF]/10 px-2.5 py-1 rounded-full border border-[#A24BFF]/20">Step 1 of 2</span>
          <span class="text-xs text-[#A0A0B0]">Free Content Strategy & Video Teardown</span>
        </div>

        <!-- STEP 1: Video Needs & Volume -->
        <div id="audit-step-1" class="space-y-5">
          <div>
            <h3 class="text-xl sm:text-2xl font-extrabold text-white leading-snug">What type of videos do you need?</h3>
            <p class="text-xs sm:text-sm text-[#A0A0B0] mt-1">Select your primary content formats.</p>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <label class="cursor-pointer border border-white/10 hover:border-[#A24BFF]/50 rounded-xl p-3.5 flex items-center gap-2.5 bg-[#0A0A0F]/60 transition-all has-[:checked]:border-[#A24BFF] has-[:checked]:bg-[#A24BFF]/10">
              <input type="checkbox" name="video_types" value="Short-form Reels" checked class="accent-[#A24BFF] w-4 h-4"/>
              <span class="text-xs sm:text-sm font-semibold text-white">Reels & Shorts</span>
            </label>
            <label class="cursor-pointer border border-white/10 hover:border-[#A24BFF]/50 rounded-xl p-3.5 flex items-center gap-2.5 bg-[#0A0A0F]/60 transition-all has-[:checked]:border-[#A24BFF] has-[:checked]:bg-[#A24BFF]/10">
              <input type="checkbox" name="video_types" value="Ad Creatives" class="accent-[#A24BFF] w-4 h-4"/>
              <span class="text-xs sm:text-sm font-semibold text-white">Paid Ad Videos</span>
            </label>
            <label class="cursor-pointer border border-white/10 hover:border-[#A24BFF]/50 rounded-xl p-3.5 flex items-center gap-2.5 bg-[#0A0A0F]/60 transition-all has-[:checked]:border-[#A24BFF] has-[:checked]:bg-[#A24BFF]/10">
              <input type="checkbox" name="video_types" value="AI Avatars & UGC" class="accent-[#A24BFF] w-4 h-4"/>
              <span class="text-xs sm:text-sm font-semibold text-white">AI Avatar / UGC</span>
            </label>
            <label class="cursor-pointer border border-white/10 hover:border-[#A24BFF]/50 rounded-xl p-3.5 flex items-center gap-2.5 bg-[#0A0A0F]/60 transition-all has-[:checked]:border-[#A24BFF] has-[:checked]:bg-[#A24BFF]/10">
              <input type="checkbox" name="video_types" value="Motion Graphics" class="accent-[#A24BFF] w-4 h-4"/>
              <span class="text-xs sm:text-sm font-semibold text-white">Motion Graphics</span>
            </label>
          </div>

          <div>
            <label class="block text-xs font-semibold text-white mb-2">Monthly Target Volume</label>
            <select id="audit-volume" class="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#A24BFF]">
              <option value="15 videos (Growth Plan)">15 videos/month (Growth Plan)</option>
              <option value="25 videos (Authority Plan)" selected>25+ videos/month (Authority Plan - Most Popular)</option>
              <option value="Under 10 videos">5–10 videos/month</option>
              <option value="Custom Enterprise">30+ videos/month (Enterprise)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-white mb-2">Your Business Niche</label>
            <select id="audit-industry" class="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#A24BFF]">
              <option value="Real estate" selected>Real Estate & Property Development</option>
              <option value="Personal brand">Personal Brand / Founder / Executive</option>
              <option value="E-commerce">E-Commerce & DTC Brand</option>
              <option value="Coaching / Education">Coaching, Consulting & EdTech</option>
              <option value="Other">Other High-Growth Business</option>
            </select>
          </div>

          <button id="audit-step-1-btn" class="w-full py-3.5 rounded-full text-sm font-bold bg-brand-gradient text-white shadow-xl shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2">
            <span>Next: Where should we send your audit?</span>
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </button>
        </div>

        <!-- STEP 2: Contact Info -->
        <div id="audit-step-2" class="space-y-4 hidden">
          <div>
            <h3 class="text-xl sm:text-2xl font-extrabold text-white leading-snug">Where should we send your audit?</h3>
            <p class="text-xs sm:text-sm text-[#A0A0B0] mt-1">Our creative director will personally review your channels.</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-white mb-1.5">Your Full Name *</label>
            <input type="text" id="audit-name" placeholder="Dhanraj Singh" required class="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#A24BFF] placeholder:text-white/30"/>
          </div>

          <div>
            <label class="block text-xs font-semibold text-white mb-1.5">Business Email *</label>
            <input type="email" id="audit-email" placeholder="founder@company.com" required class="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#A24BFF] placeholder:text-white/30"/>
          </div>

          <div>
            <label class="block text-xs font-semibold text-white mb-1.5">WhatsApp Number *</label>
            <div class="flex gap-2">
              <select id="audit-country-code" class="w-28 bg-[#0A0A0F] border border-white/10 rounded-xl px-2.5 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#A24BFF]">
                <option value="+971" selected>+971 UAE</option>
                <option value="+91">+91 India</option>
                <option value="+966">+966 KSA</option>
                <option value="+974">+974 Qatar</option>
                <option value="+44">+44 UK</option>
                <option value="+1">+1 USA</option>
              </select>
              <input type="tel" id="audit-phone" placeholder="50 123 4567" required class="flex-1 bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#A24BFF] placeholder:text-white/30"/>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-white mb-1.5">Instagram Handle or Website</label>
            <input type="text" id="audit-website" placeholder="@yourbrand or company.com" class="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#A24BFF] placeholder:text-white/30"/>
          </div>

          <p id="audit-error" class="text-xs text-red-400 hidden"></p>

          <div class="flex items-center gap-3 pt-2">
            <button id="audit-back-btn" type="button" class="px-5 py-3.5 rounded-full text-xs font-bold bg-white/[0.06] hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer">
              Back
            </button>
            <button id="audit-submit-btn" type="button" class="flex-1 py-3.5 rounded-full text-sm font-bold bg-brand-gradient text-white shadow-xl shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2">
              <span>Submit & Access Calendar</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </button>
          </div>
        </div>

        <!-- STEP 3: Success Confirmation -->
        <div id="audit-step-3" class="space-y-5 text-center py-4 hidden">
          <div class="w-16 h-16 rounded-full bg-brand-gradient text-white flex items-center justify-center mx-auto shadow-2xl">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div>
            <h3 class="text-2xl font-extrabold text-white">Audit Request Received!</h3>
            <p class="text-xs sm:text-sm text-[#A0A0B0] mt-2 max-w-sm mx-auto leading-relaxed">
              We have received your details and are analyzing your content. Your dedicated editor will contact you via WhatsApp shortly.
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-[#0A0A0F] border border-white/[0.08] text-left space-y-3">
            <div class="flex items-center gap-2 text-xs font-bold text-white">
              <span class="w-2 h-2 rounded-full bg-[#A24BFF] animate-pulse"></span>
              Next Step: Free Sample Edit
            </div>
            <p class="text-xs text-[#A0A0B0] leading-relaxed">
              Send us any raw footage (up to 40s) via WhatsApp or Google Drive. We will edit it 100% free with a 24-hour turnaround so you can inspect our quality before committing.
            </p>
            <a href="https://cal.com/hosteditify-n0dlbr/free-content-audit" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-full py-3 rounded-xl bg-brand-gradient text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-500/25 hover:scale-[1.02] transition-all gap-2">
              <span>Book 30-Min Call on Cal.com</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </a>
            <a href="https://wa.me/971500000000?text=Hi%20Host%20Editify%2C%20I%20just%20submitted%20my%20audit%20request%20and%20would%20like%20to%20send%20a%20sample%20edit." target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-bold hover:bg-[#25D366] hover:text-white transition-all gap-2">
              <span>Or Chat on WhatsApp Directly</span>
              <svg class="w-4 h-4 fill-current stroke-none" viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
            </a>
          </div>

          <button id="audit-done-btn" class="w-full py-3 rounded-full text-xs font-semibold text-white/70 hover:text-white bg-white/[0.06] hover:bg-white/10 transition-colors cursor-pointer">
            Close Window
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#audit-close-btn');
    const doneBtn = modal.querySelector('#audit-done-btn');
    const step1El = modal.querySelector('#audit-step-1');
    const step2El = modal.querySelector('#audit-step-2');
    const step3El = modal.querySelector('#audit-step-3');
    const pill = modal.querySelector('#audit-step-pill');
    const step1Btn = modal.querySelector('#audit-step-1-btn');
    const backBtn = modal.querySelector('#audit-back-btn');
    const submitBtn = modal.querySelector('#audit-submit-btn');
    const errorEl = modal.querySelector('#audit-error');

    const closeModal = () => {
      modal.classList.add('opacity-0', 'pointer-events-none');
    };

    closeBtn.addEventListener('click', closeModal);
    doneBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('pointer-events-none')) {
        closeModal();
      }
    });

    step1Btn.addEventListener('click', () => {
      step1El.classList.add('hidden');
      step2El.classList.remove('hidden');
      pill.textContent = 'Step 2 of 2';
    });

    backBtn.addEventListener('click', () => {
      step2El.classList.add('hidden');
      step1El.classList.remove('hidden');
      pill.textContent = 'Step 1 of 2';
    });

    submitBtn.addEventListener('click', async () => {
      const name = modal.querySelector('#audit-name').value.trim();
      const email = modal.querySelector('#audit-email').value.trim();
      const code = modal.querySelector('#audit-country-code').value;
      const phone = modal.querySelector('#audit-phone').value.trim();
      const website = modal.querySelector('#audit-website').value.trim();
      const volume = modal.querySelector('#audit-volume').value;
      const industry = modal.querySelector('#audit-industry').value;

      if (!name || !email || !phone) {
        errorEl.textContent = 'Please fill in your name, email, and WhatsApp number.';
        errorEl.classList.remove('hidden');
        return;
      }
      errorEl.classList.add('hidden');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      const payload = {
        name,
        email,
        phone: `${code} ${phone}`,
        website,
        monthlyVideos: volume,
        industry,
      };

      try {
        await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.warn('Lead submission fallback:', err);
      }

      step2El.classList.add('hidden');
      step3El.classList.remove('hidden');
      pill.textContent = 'Confirmed';
    });

    auditModal = modal;
    return modal;
  }

  function openAuditModal(source) {
    const modal = createAuditModal();
    modal.classList.remove('opacity-0', 'pointer-events-none');
    console.log(`[Host Editify] Audit Modal opened from source: ${source}`);
  }

  // Hook all CTA buttons on the page to open the Audit Modal
  function attachAuditButtons() {
    const buttons = document.querySelectorAll('button, a');
    buttons.forEach((el) => {
      const text = (el.textContent || '').trim().toLowerCase();
      const hasCtaAttr = el.hasAttribute('data-cta-position');
      const isAuditButton =
        hasCtaAttr ||
        text.includes('free content audit') ||
        text.includes('book my free') ||
        text.includes('book free audit') ||
        text.includes('try it free') ||
        text.includes('claim your 15 videos') ||
        text.includes('claim your 25 videos');

      if (isAuditButton) {
        el.addEventListener('click', (e) => {
          // If it's a button or link with no href / href="#"
          const href = el.getAttribute('href');
          if (!href || href === '#' || el.tagName === 'BUTTON') {
            e.preventDefault();
            const source = el.getAttribute('data-cta-position') || 'cta-button';
            openAuditModal(source);
          }
        });
      }
    });
  }

  // 5. FAQ ACCORDION ENGINE
  function initFaqAccordion() {
    const faqSection = document.getElementById('faq-section');
    if (!faqSection) return;

    const faqItems = faqSection.querySelectorAll('.rounded-2xl.border');

    faqItems.forEach((item) => {
      const btn = item.querySelector('button');
      const answer = item.querySelector('.faq-answer');
      const iconContainer = item.querySelector('.w-8.h-8');

      if (!btn || !answer) return;

      btn.addEventListener('click', () => {
        const isCurrentlyHidden = answer.classList.contains('hidden');

        // Close all other items
        faqItems.forEach((other) => {
          const otherAns = other.querySelector('.faq-answer');
          const otherIcon = other.querySelector('.w-8.h-8');
          if (otherAns && other !== item) {
            otherAns.classList.add('hidden');
            other.className = 'rounded-2xl border transition-all duration-200 overflow-hidden bg-[#0A0A0F]/60 border-white/[0.08] hover:border-white/20';
            if (otherIcon) {
              otherIcon.innerHTML = `<svg class="w-4 h-4 text-white/70" stroke-width="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>`;
            }
          }
        });

        // Toggle this item
        if (isCurrentlyHidden) {
          answer.classList.remove('hidden');
          item.className = 'rounded-2xl border transition-all duration-200 overflow-hidden bg-[#0A0A0F] border-[#A24BFF]/40 shadow-lg';
          if (iconContainer) {
            iconContainer.innerHTML = `<svg class="w-4 h-4 text-[#A24BFF]" stroke-width="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path></svg>`;
          }
        } else {
          answer.classList.add('hidden');
          item.className = 'rounded-2xl border transition-all duration-200 overflow-hidden bg-[#0A0A0F]/60 border-white/[0.08] hover:border-white/20';
          if (iconContainer) {
            iconContainer.innerHTML = `<svg class="w-4 h-4 text-white/70" stroke-width="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>`;
          }
        }
      });
    });
  }

  // 6. SMOOTH ANCHOR NAVIGATION
  function initSmoothNav() {
    document.querySelectorAll('a[href^="#"], button[data-nav-target]').forEach((el) => {
      el.addEventListener('click', (e) => {
        const targetId = el.getAttribute('href') || el.getAttribute('data-nav-target');
        if (targetId && targetId.startsWith('#')) {
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  // 7. STICKY MOBILE CTA
  function initStickyMobileCta() {
    const stickyCta = document.querySelector('[data-sticky-mobile-cta]');
    if (!stickyCta) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        stickyCta.style.opacity = '1';
        stickyCta.style.transform = 'translateY(0)';
        stickyCta.style.pointerEvents = 'auto';
      } else {
        stickyCta.style.opacity = '0';
        stickyCta.style.transform = 'translateY(100%)';
        stickyCta.style.pointerEvents = 'none';
      }
    }, { passive: true });
  }

  // 8. RENDER AUTHENTIC LUCIDE SVGS
  const LUCIDE_SVGS = {
    Check: '<polyline points="20 6 9 17 4 12"></polyline>',
    CheckCheck: '<path d="M18 6 7 17l-5-5"></path><path d="m22 10-7.5 7.5L13 16"></path>',
    X: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
    ArrowRight: '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>',
    ArrowLeft: '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>',
    Plus: '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',
    Minus: '<line x1="5" y1="12" x2="19" y2="12"></line>',
    Play: '<polygon points="6 3 20 12 6 21 6 3" fill="currentColor"></polygon>',
    Pause: '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>',
    Volume2: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>',
    VolumeX: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="22" y1="9" x2="16" y2="15"></line><line x1="16" y1="9" x2="22" y2="15"></line>',
    ChevronLeft: '<polyline points="15 18 9 12 15 6"></polyline>',
    ChevronRight: '<polyline points="9 18 15 12 9 6"></polyline>',
    Clock: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
    ShieldCheck: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path>',
    Users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
    Building2: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path>',
    UserCheck: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline>',
    GraduationCap: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>',
    ShoppingBag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>',
    Bot: '<rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M12 8V4H8"></path><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path>',
    Gift: '<rect x="3" y="8" width="18" height="4" rx="1"></rect><path d="M12 8v13"></path><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>',
    TrendingDown: '<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline>',
    XCircle: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
    Sparkles: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path>',
    MessageCircle: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>',
    Zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor"></polygon>',
    Phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
    Mail: '<rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>',
    Calendar: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
    Send: '<line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>',
    Award: '<circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>',
  };

  function initIcons() {
    document.querySelectorAll('[data-icon]').forEach((el) => {
      const name = el.getAttribute('data-icon');
      const svgPath = LUCIDE_SVGS[name] || '<circle cx="12" cy="12" r="10"></circle>';
      const size = el.getAttribute('data-icon-size') || 20;
      el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block shrink-0">${svgPath}</svg>`;
    });
  }

  // INITIALIZE EVERYTHING ON DOM READY
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initIcons();
      attachAuditButtons();
      initFaqAccordion();
      initSmoothNav();
      initStickyMobileCta();
    });
  } else {
    initIcons();
    attachAuditButtons();
    initFaqAccordion();
    initSmoothNav();
    initStickyMobileCta();
  }
})();
