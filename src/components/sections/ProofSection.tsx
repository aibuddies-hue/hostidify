"use client";

import React, { useState, useEffect } from "react";
import { Award, X } from "lucide-react";
import rawReviews from "@/data/reviews.json";

export interface ReviewItem {
  id: string;
  src: string;
  name?: string;
  business?: string;
  caption?: string;
}

export function ProofSection() {
  const [activeReview, setActiveReview] = useState<ReviewItem | null>(null);
  const reviews = rawReviews as ReviewItem[];

  // Hide section if empty
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Handle Escape key to close review lightbox
  useEffect(() => {
    if (!activeReview) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveReview(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeReview]);

  return (
    <section id="reviews-section" className="relative py-20 sm:py-24 md:py-28 bg-[#0A0A0F] overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#A24BFF]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-[720px] mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="px-3.5 py-1 rounded-full text-xs uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Real Client Feedback</span>
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            What our clients say.
          </h2>
          <p className="text-sm sm:text-base text-[#A0A0B0] max-w-[620px] mx-auto">
            Screenshots and messages directly from founders and creators working with Host Editify. Tap any review to inspect.
          </p>
        </div>

        {/* 1 Row Grid on Tablet & Desktop (All 3 in one line, no awkward empty spots!) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              onClick={() => setActiveReview(rev)}
              className="rounded-2xl bg-[#14141C] border border-white/10 hover:border-[#A24BFF]/50 p-3 sm:p-3.5 overflow-hidden cursor-pointer hover:-translate-y-1.5 transition-all duration-300 shadow-xl shadow-black/40 flex flex-col justify-between group"
            >
              {/* WhatsApp Screenshot Container: Fixed height with object-contain so NO cropping happens */}
              <div className="relative w-full h-[320px] sm:h-[350px] md:h-[370px] bg-[#0A0A10] rounded-xl flex items-center justify-center p-2.5 overflow-hidden border border-white/[0.04]">
                <img
                  src={rev.src}
                  alt={rev.caption || rev.name || "Client WhatsApp review"}
                  className="max-h-full max-w-full w-auto h-auto object-contain mx-auto rounded-lg transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                {/* Subtle zoom indicator on hover */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none rounded-xl">
                  <span className="px-3 py-1 rounded-full bg-black/80 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm">
                    Tap to expand 🔍
                  </span>
                </div>
              </div>

              {/* Caption & Trust Proof */}
              <div className="pt-3.5 px-1.5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#A24BFF]">
                    {rev.business || "Verified Client"}
                  </span>
                  <div className="flex text-amber-400 gap-0.5" aria-hidden="true">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xs">★</span>
                    ))}
                  </div>
                </div>
                {rev.caption && (
                  <p className="text-xs sm:text-[13px] text-white/90 font-medium leading-snug">
                    "{rev.caption}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tap to View Full Size Modal / Lightbox */}
      {activeReview && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveReview(null)}
        >
          <button
            type="button"
            onClick={() => setActiveReview(null)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            aria-label="Close review"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative max-w-3xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-full max-h-[80vh] flex items-center justify-center p-2 bg-[#14141C] border border-white/15 rounded-2xl shadow-2xl overflow-hidden">
              <img
                src={activeReview.src}
                alt={activeReview.caption || "Client review full size"}
                className="max-h-[75vh] max-w-full object-contain rounded-lg"
              />
            </div>
            {activeReview.caption && (
              <p className="mt-4 text-xs sm:text-sm text-white/90 font-semibold text-center bg-black/70 px-5 py-2 rounded-full border border-white/15 backdrop-blur-sm">
                "{activeReview.caption}"
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
