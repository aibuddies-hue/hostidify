"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";
import { Button } from "./Button";
import { trackVideoEngagement } from "@/lib/tracking";
import { MediaDialog } from "./MediaDialog";

export interface PortfolioVideoItem {
  id: string;
  type: string;
  videoUrl: string;
  posterUrl: string;
  caption?: string;
  youtubeId?: string;
  duration?: number;
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
    }
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
  return (
    <MediaDialog open={Boolean(video)} label={video.caption || "Video player"} onClose={onClose}>
      <div
        className={
          "video-dialog-content relative " +
          (isYouTube ? "is-landscape" : "")
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
              preload="metadata"
              onTimeUpdate={onTimeUpdate}
              className="block w-full object-contain"
            />
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close video"
            autoFocus
            className="absolute top-3 right-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/80 text-white transition-colors hover:bg-white/20 z-10"
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
    </MediaDialog>
  );
}
