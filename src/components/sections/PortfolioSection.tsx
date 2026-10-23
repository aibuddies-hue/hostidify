"use client";

import Image from "next/image";
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
const rawData = portfolioData as Partial<Record<CategoryKey, PortfolioVideoItem[]>>;
const byCategory: Record<CategoryKey, PortfolioVideoItem[]> = {
  shortForm: rawData.shortForm || [],
  longForm: rawData.longForm || [],
  ads: rawData.ads || [],
};
// Mix the new work into the opening rail so the range is visible without filtering.
const featuredIds = ["shortForm-luxury-real-estate", "ads-ai-skills-ad-01", "shortForm-sequence-02", "ads-ai-workshop-ad-03", "ads-ai-industry-ad-06"];
const categoryVideos = categories.flatMap((c) => byCategory[c.key]);
const allVideos = [
  ...featuredIds.flatMap((id) => categoryVideos.filter((video) => video.id === id)),
  ...categoryVideos.filter((video) => !featuredIds.includes(video.id)),
];
const visibleCategories = categories.filter((c) => byCategory[c.key].length >= 2);
const tabs: { key: TabKey; label: string }[] = visibleCategories.length >= 2 ? [{ key: "all", label: "All" }, ...visibleCategories] : [];

function RotatingWord() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIdx((i) => (i + 1) % rotatingWords.length), 4000);
    return () => clearInterval(timer);
  }, []);
  return <span className="inline-block min-w-[128px] font-semibold text-[#C59AFF]" aria-live="off">{rotatingWords[idx]}</span>;
}

export function PortfolioSection() {
  const { openAuditModal } = useAuditModal();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selected, setSelected] = useState<PortfolioVideoItem | null>(null);
  const [scroll, setScroll] = useState({ left: false, right: false, progress: 0 });
  const trackRef = useRef<HTMLDivElement>(null);
  const closeLightbox = useCallback(() => setSelected(null), []);
  const items = activeTab === "all" ? allVideos : byCategory[activeTab];

  const measureScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScroll({ left: el.scrollLeft > 2, right: el.scrollLeft < max - 2, progress: max > 0 ? Math.max(0, Math.min(1, el.scrollLeft / max)) : 0 });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "instant" });
    measureScroll();
    const observer = new ResizeObserver(measureScroll);
    observer.observe(el);
    return () => observer.disconnect();
  }, [activeTab, measureScroll]);

  const scrollBy = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("button");
    const cardWidth = first?.offsetWidth || 260;
    const gap = parseFloat(getComputedStyle(el).gap) || 20;
    const step = (cardWidth + gap) * Math.max(1, Math.floor(el.clientWidth / (cardWidth + gap)));
    el.scrollBy({ left: direction * step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  if (allVideos.length === 0) return null;
  return (
    <Section id="work-section">
      <SectionHeader title="Watch our work" sub={<>Reels and videos we&apos;ve edited for <RotatingWord /></>} />
      {tabs.length > 0 && (
        <div role="tablist" aria-label="Video type" className="portfolio-tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.key}
              id={`work-tab-${tab.key}`}
              role="tab"
              type="button"
              aria-selected={activeTab === tab.key}
              aria-controls="work-videos"
              tabIndex={activeTab === tab.key ? 0 : -1}
              className="portfolio-tab"
              onClick={() => setActiveTab(tab.key)}
              onKeyDown={(event) => {
                let next = index;
                if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
                else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = tabs.length - 1;
                else return;
                event.preventDefault();
                setActiveTab(tabs[next].key);
                document.getElementById(`work-tab-${tabs[next].key}`)?.focus();
              }}
            >{tab.label}</button>
          ))}
        </div>
      )}
      <div
        id="work-videos"
        role={tabs.length ? "tabpanel" : undefined}
        aria-labelledby={tabs.length ? `work-tab-${activeTab}` : undefined}
        ref={trackRef}
        onScroll={measureScroll}
        className="portfolio-track no-scrollbar"
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelected(item)}
            aria-label="Play portfolio video"
            className={`portfolio-card group ${item.type === "longForm" ? "portfolio-card-long" : ""}`}
          >
            {/* The MP4/YouTube player is created only after the visitor presses play. */}
            <Image
              src={item.posterUrl}
              alt="Portfolio video preview"
              sizes={item.type === "longForm" ? "(max-width: 639px) 82vw, 400px" : "(max-width: 639px) 72vw, 260px"}
              loading="lazy"
              decoding="async"
              width={item.type === "longForm" ? 640 : 720}
              height={item.type === "longForm" ? 360 : 1280}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/10">
              <span className="portfolio-play"><Play className="ml-0.5 h-5 w-5 fill-white" aria-hidden /></span>
            </span>
            {item.duration && <span className="media-duration" aria-hidden>{Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, "0")}</span>}
          </button>
        ))}
      </div>
      <div className="portfolio-controls" style={{ visibility: scroll.left || scroll.right ? "visible" : "hidden" }}>
          <button type="button" onClick={() => scrollBy(-1)} disabled={!scroll.left} aria-label="Scroll left" aria-controls="work-videos" className="carousel-arrow"><ChevronLeft className="h-5 w-5" aria-hidden /></button>
          <div className="carousel-progress" aria-hidden><span style={{ transform: `translateX(${scroll.progress * 60}px)` }} /></div>
          <button type="button" onClick={() => scrollBy(1)} disabled={!scroll.right} aria-label="Scroll right" aria-controls="work-videos" className="carousel-arrow"><ChevronRight className="h-5 w-5" aria-hidden /></button>
      </div>
      <div className="mt-10 flex justify-center">
        <Button onClick={() => openAuditModal("portfolio")}>Book My Free Content Audit<ArrowRight className="h-4 w-4" aria-hidden /></Button>
      </div>
      <VideoLightbox video={selected} onClose={closeLightbox} onBookClick={() => { setSelected(null); openAuditModal("lightbox"); }} />
    </Section>
  );
}
