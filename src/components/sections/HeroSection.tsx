"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Clock, ShieldCheck, Video } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site.config";
import { useAuditModal } from "@/context/AuditModalContext";

export function HeroSection() {
  const { openAuditModal } = useAuditModal();

  return (
    <section className="relative min-h-[86vh] md:min-h-[92vh] flex items-center justify-center pt-10 pb-16 md:pt-20 md:pb-28 overflow-hidden bg-[#0A0A0F]">
      {/* Background Cinematic Hero Light Field & Ambient Volumetric Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft centered multi-color aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[850px] md:w-[1000px] h-[450px] sm:h-[650px] bg-gradient-to-tr from-[#3B6BFF]/20 via-[#A24BFF]/25 to-[#FF3D8B]/20 rounded-full blur-[110px] sm:blur-[140px] pointer-events-none" />

        {/* Cinematic light texture image if present */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] max-w-[1300px] aspect-[16/9] opacity-30 mix-blend-screen filter blur-xl">
          <Image
            src="/generated/hero-light-field.jpg"
            alt="Cinematic Light Field"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Subtle dark gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F]/60 via-transparent to-[#0A0A0F]" />
      </div>

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 w-full flex flex-col items-center text-center relative z-10">
        {/* Top Attention Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-white/[0.06] border border-white/[0.12] backdrop-blur-md mb-6 sm:mb-8 shadow-lg shadow-purple-500/10 hover:border-purple-500/40 transition-all">
          <span className="w-2 h-2 rounded-full bg-[#A24BFF] animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/95">
            ⚡ 24-Hour Turnaround · First Video Edited Free · India &amp; Dubai
          </span>
        </div>

        {/* Centered Main Hero Block */}
        <div className="max-w-[940px] flex flex-col items-center">
          {/* Main Headline (Prominent, High-Contrast Typography) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-tight text-white leading-[1.08] mb-5 sm:mb-7">
            We turn your raw footage into high-converting short-form videos in{" "}
            <span className="text-brand-gradient whitespace-nowrap">24 hours.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg md:text-xl text-[#B0B0C4] font-normal leading-relaxed max-w-[720px] mb-8 sm:mb-10">
            For founders, real estate leaders, and personal brands in India &amp; Dubai. No hiring headaches, no chasing slow editors, zero missed post dates.
          </p>

          {/* Primary CTA Button (High-Impact, Magnetic Gradient) */}
          <div className="w-full sm:w-auto flex flex-col items-center mb-4">
            <Button
              variant="primary"
              size="lg"
              ctaPosition="hero"
              magnetic={true}
              onClick={() => openAuditModal("hero")}
              className="w-full sm:w-auto text-base sm:text-lg px-9 py-4 sm:px-10 sm:py-4.5 flex items-center justify-center gap-2.5 font-bold rounded-full shadow-2xl shadow-purple-600/35 hover:shadow-purple-600/55 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 border border-white/20"
            >
              <span>Book My Free Content Audit</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </div>

          {/* Clean Micro-copy under CTA */}
          <p className="text-xs sm:text-sm text-[#A0A0B0] font-medium mb-3">
            ✨ 100% free · 30-min strategy call · First video edited free
          </p>

          {/* Direct Cal.com Slot Booking Link */}
          <p className="text-xs sm:text-sm text-white/70">
            Prefer direct scheduling?{" "}
            <a
              href="https://cal.com/hosteditify-n0dlbr/free-content-audit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A24BFF] hover:text-[#B86BFF] underline font-semibold transition-colors inline-flex items-center gap-1"
            >
              <span>Pick a slot on Cal.com</span>
              <span aria-hidden="true">→</span>
            </a>
          </p>

          {/* Trust Value Badges */}
          <div className="mt-10 sm:mt-12 pt-8 border-t border-white/[0.08] w-full max-w-[700px] grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.02]">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white mb-0.5">
                <Clock className="w-3.5 h-3.5 text-[#A24BFF]" />
                <span>24-Hour</span>
              </div>
              <span className="text-[11px] sm:text-xs text-[#A0A0B0]">Delivery Guarantee</span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.02]">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white mb-0.5">
                <Video className="w-3.5 h-3.5 text-[#A24BFF]" />
                <span>Human Editors</span>
              </div>
              <span className="text-[11px] sm:text-xs text-[#A0A0B0]">Dedicated Creative Team</span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.02]">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Risk</span>
              </div>
              <span className="text-[11px] sm:text-xs text-[#A0A0B0]">First Edit 100% Free</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
