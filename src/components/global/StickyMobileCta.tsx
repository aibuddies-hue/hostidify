"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappLink } from "@/lib/site.config";
import { trackWhatsAppClick } from "@/lib/tracking";
import { useAuditModal } from "@/context/AuditModalContext";
import { cn } from "@/lib/utils";

/** Phone-only bottom bar. Its height is reserved on <body> via --sticky-bar-h. */
export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);
  const { isOpen, openAuditModal } = useAuditModal();

  useEffect(() => {
    const onScroll = () => {
      const booking = document.getElementById("booking-section");
      const passedHero = window.scrollY > 250;
      if (!booking) return setVisible(passedHero);
      const rect = booking.getBoundingClientRect();
      const bookingInView = rect.top < window.innerHeight && rect.bottom > 0;
      setVisible(passedHero && !bookingInView);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const show = visible && !isOpen;
  const whatsapp = whatsappLink("Hi Host Editify, I'd like a free content audit.");

  return (
    <div
      data-sticky-mobile-cta
      aria-hidden={!show}
      className={cn(
        "sticky-mobile-bar fixed inset-x-0 bottom-0 z-30 flex h-[var(--sticky-bar-h)] items-center border-t border-white/[0.08] bg-[#0A0A0F]/95 px-4 backdrop-blur-lg transition-[opacity,transform] duration-300 md:hidden",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      )}
    >
      <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3">
        <p className="sticky-summary min-w-0 leading-snug font-medium text-white/90">
          <span className="block">24-hour delivery ·</span>
          <span className="block">First video free</span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={show ? 0 : -1}
              onClick={() => trackWhatsAppClick("sticky-mobile")}
              aria-label="Chat with us on WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#128C4A] text-white"
            >
              <WhatsAppIcon className="h-6 w-6" />
            </a>
          )}
          <Button onClick={() => openAuditModal("sticky-mobile")} tabIndex={show ? 0 : -1} className="min-h-11 px-4 text-xs">
            Book Free Audit
          </Button>
        </div>
      </div>
    </div>
  );
}
