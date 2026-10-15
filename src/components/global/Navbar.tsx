"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useAuditModal } from "@/context/AuditModalContext";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { openAuditModal } = useAuditModal();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  };

  return (
    <header
      className={cn(
        "site-header sticky top-0 z-40 w-full py-4 md:py-5 transition-[background-color,box-shadow,border-color] duration-300",
        scrolled
          ? "bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-white/[0.12] shadow-[0_10px_35px_rgba(0,0,0,0.7)]"
          : "bg-[#0A0A0F]/85 backdrop-blur-md border-b border-white/[0.08]"
      )}
    >
      <div className="container-page flex items-center justify-between gap-3">
        {/* Brand Logo: Prominent, crisp, elevated height */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/brand/logo-transparent.png"
            alt="Host Editify"
            width={80}
            height={52}
            sizes="80px"
            priority
            className="nav-logo object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Navigation Anchors: Clear, readable typography and comfortable spacing */}
        <nav aria-label="Main Navigation" className="hidden xl:flex items-center gap-6 text-[14px] font-medium text-[#B0B0C0]">
          <button
            onClick={() => scrollToSection("work-section")}
            className="hover:text-white transition-colors cursor-pointer py-1 relative hover:-translate-y-0.5 transition-transform"
          >
            Watch our work
          </button>
          <button
            onClick={() => scrollToSection("why-us-section")}
            className="hover:text-white transition-colors cursor-pointer py-1 relative hover:-translate-y-0.5 transition-transform"
          >
            Why us
          </button>
          <button
            onClick={() => scrollToSection("process-section")}
            className="hover:text-white transition-colors cursor-pointer py-1 relative hover:-translate-y-0.5 transition-transform"
          >
            How it works
          </button>
          <button
            onClick={() => scrollToSection("plans-section")}
            className="hover:text-white transition-colors cursor-pointer py-1 relative hover:-translate-y-0.5 transition-transform"
          >
            Plans
          </button>
          <button
            onClick={() => scrollToSection("faq-section")}
            className="hover:text-white transition-colors cursor-pointer py-1 relative hover:-translate-y-0.5 transition-transform"
          >
            FAQ
          </button>
        </nav>

        {/* Primary Booking CTA: Prominent, high-converting pill button */}
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            ctaPosition="nav"
            onClick={() => openAuditModal("nav")}
            className="nav-cta text-xs sm:text-sm font-semibold px-4 sm:px-6"
          >
            Book My Free Content Audit
          </Button>
        </div>
      </div>
    </header>
  );
}
