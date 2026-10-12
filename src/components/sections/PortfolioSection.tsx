"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import portfolioData from "@/data/portfolio.json";
import { VideoLightbox, PortfolioVideoItem } from "@/components/ui/VideoLightbox";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useAuditModal } from "@/context/AuditModalContext";

const rotatingWords = ["real estate", "personal brands", "e-commerce", "AI content"];

type CategoryKey = "shortForm" | "longForm" | "ads";
type TabKey = "all" | CategoryKey;

const categories: { key: CategoryKey; label: string }[] = [
  { key: "shortForm", label: "Short-form edits" },
  { key: "longForm", label: "YouTube / Long-form" },
  { key: "ads", label: "Ad videos" },
];

const rawData = portfolioData as {
  shortForm?: PortfolioVideoItem[];
  longForm?: PortfolioVideoItem[];
  ads?: PortfolioVideoItem[];
};

const byCategory: Record<CategoryKey, PortfolioVideoItem[]> = {
  shortForm: rawData.shortForm || [],
  longForm: rawData.longForm || [],
  ads: rawData.ads || [],
};
const allVideos = categories.flatMap((c) => byCategory[c.key]);

// A category tab shows only with >= 2 videos; the tab row shows only if 2+ categories qualify.
const visibleCategories = categories.filter((c) => byCategory[c.key].length >= 2);
const tabs: { key: TabKey; label: string }[] =
  visibleCategories.length >= 2 ? [{ key: "all", label: "All" }, ...visibleCategories] : [];

function RotatingWord() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % rotatingWords.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="font-semibold text-[#A24BFF]" aria-live="off">
      {rotatingWords[idx]}
    </span>
  );
}

export function PortfolioSection() {
  const { openAuditModal } = useAuditModal();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selected, setSelected] = useState<PortfolioVideoItem | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const closeLightbox = useCallback(() => setSelected(null), []);

  if (allVideos.length === 0) return null;

  const items = activeTab === "all" ? allVideos : byCategory[activeTab];

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <Section id="work-section">
      <SectionHeader
        title="Watch our work"
        sub={
          <>
            Reels and videos we&apos;ve edited for <RotatingWord />
          </>
        }
      />

      {tabs.length > 0 && (
        <div role="tablist" aria-label="Video type" className="mb-8 flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => {
                  setActiveTab(tab.key);
                  trackRef.current?.scrollTo({ left: 0 });
                }}
                className={
                  "type-small h-10 cursor-pointer rounded-full px-5 font-semibold transition-colors " +
                  (active
                    ? "bg-[#A24BFF] text-white"
                    : "border border-white/[0.08] bg-[#14141C] text-[#A0A0B0] hover:text-white")
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="group/carousel relative">
        <div
          ref={trackRef}
          className={
            "no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:gap-6 md:px-0 " +
            (items.length <= 6 ? "lg:justify-center" : "")
          }
        >
          {items.map((item) => {
            const isLong = item.type === "longForm";
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                aria-label={`Play ${item.caption || "video"}`}
                className={
                  "group relative shrink-0 cursor-pointer snap-start overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#14141C] transition-colors hover:border-[#A24BFF]/60 " +
                  (isLong
                    ? "aspect-video w-[280px] md:w-[360px]"
                    : "aspect-[9/16] w-[220px] md:w-[240px] lg:w-[calc((100%-120px)/6)]")
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.posterUrl}
                  alt={item.caption || "Video poster"}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <span className="bg-brand-gradient flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full shadow-xl transition-transform group-hover:scale-110">
                    <Play className="ml-0.5 h-6 w-6 fill-white text-white" aria-hidden />
                  </span>
                </span>
                {item.caption && (
                  <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 pt-6 text-left text-xs font-semibold text-white/90 line-clamp-2">
                    {item.caption}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {items.length > 5 && (
          <>
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="absolute top-1/2 -left-4 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[#14141C]/95 text-white opacity-0 shadow-xl transition-opacity group-hover/carousel:opacity-100 md:flex"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="absolute top-1/2 -right-4 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[#14141C]/95 text-white opacity-0 shadow-xl transition-opacity group-hover/carousel:opacity-100 md:flex"
            >
              <ChevronRight className="h-6 w-6" aria-hidden />
            </button>
          </>
        )}
      </div>

      <div className="mt-10 flex justify-center">
        <Button onClick={() => openAuditModal("portfolio")}>
          Book My Free Content Audit
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>

      <VideoLightbox
        video={selected}
        onClose={closeLightbox}
        onBookClick={() => {
          setSelected(null);
          openAuditModal("lightbox");
        }}
      />
    </Section>
  );
}
