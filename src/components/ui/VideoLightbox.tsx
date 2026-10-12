"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, X } from "lucide-react";
import { Button } from "./Button";
import { trackVideoEngagement } from "@/lib/tracking";

export interface PortfolioVideoItem {
  id: string;
  type: string;
  videoUrl: string;
  posterUrl: string;
  caption?: string;
  youtubeId?: string;
}

interface VideoLightboxProps {
  video: PortfolioVideoItem | null;
  onClose: () => void;
  onBookClick: () => void;
}

/** Video + close button + one "Book" button. Supports HTML5 and YouTube. */
export function VideoLightbox({ video, onClose, onBookClick }: VideoLightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackedHalf = useRef(false);

  const isYouTube = Boolean(video?.youtubeId);

  useEffect(() => {
    if (!video) return;
    trackedHalf.current = false;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (!isYouTube) {
      const el = videoRef.current;
      if (el) {
        el.muted = false;
        el.play().catch(() => {
          // Browser blocked unmuted autoplay: fall back to muted
          el.muted = true;
          el.play().catch(() => {});
        });
      }
    } else {
      trackVideoEngagement(video.id, 50);
    }

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [video, onClose, isYouTube]);

  if (!video) return null;

  const onTimeUpdate = () => {
    const el = videoRef.current;
    if (!el || trackedHalf.current || !el.duration) return;
    if (el.currentTime / el.duration >= 0.5) {
      trackedHalf.current = true;
      trackVideoEngagement(video.id, 50);
    }
  };

  // Portal to <body> so it stacks above the sticky navbar
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className={
          "relative flex max-h-full w-full flex-col items-center gap-4 " +
          (isYouTube ? "max-w-3xl" : "max-w-[400px]")
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={
            "relative w-full overflow-hidden rounded-[20px] border border-white/10 bg-black " +
            (isYouTube ? "aspect-video" : "")
          }
        >
          {isYouTube ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.caption || "YouTube video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          ) : (
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.posterUrl}
              controls
              playsInline
              onTimeUpdate={onTimeUpdate}
              className="block max-h-[calc(100svh-140px)] w-full object-contain"
            />
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="absolute top-3 right-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/70 text-white transition-colors hover:bg-white/20 z-10"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {video.caption && (
          <p className="text-center text-sm font-semibold text-white/90">
            {video.caption}
          </p>
        )}

        <Button onClick={onBookClick}>
          Book My Free Content Audit
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>,
    document.body
  );
}
