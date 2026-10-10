"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "py-3 bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-white/[0.12] shadow-[0_10px_35px_rgba(0,0,0,0.7)]"
          : "py-4 md:py-5 bg-[#0A0A0F]/85 backdrop-blur-md border-b border-white/[0.08]"
      )}
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Brand Logo: Prominent, crisp, elevated height */}
        <Link href="/" className="flex items-center group">
          <img
            src="/brand/logo-transparent.png"
            alt="Host Editify"
            style={{ height: "48px", width: "auto", objectFit: "contain", display: "block" }}
            className="transition-transform duration-200 group-hover:scale-105 sm:h-[50px] md:h-[52px]"
          />
        </Link>

        {/* Navigation Anchors: Clear, readable typography and comfortable spacing */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-[#B0B0C0]">
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
            className="text-xs sm:text-sm md:text-[15px] font-bold h-11 sm:h-12 px-5 sm:px-7 rounded-full shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.03] transition-all duration-200"
          >
            Book My Free Content Audit
          </Button>
        </div>
      </div>
    </header>
  );
}
