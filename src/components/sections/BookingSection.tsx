"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { site, whatsappLink } from "@/lib/site.config";
import { useAuditModal } from "@/context/AuditModalContext";
import { cn } from "@/lib/utils";

export function BookingSection({ alt = false }: { alt?: boolean }) {
  const { openAuditModal } = useAuditModal();
  const sampleEditHref = whatsappLink("Hi Host Editify, I'd like to request a free sample edit.");

  return (
    <section id="booking-section" className={cn("section relative overflow-hidden text-center", alt && "section-alt")}>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-15">
        <Image src="/generated/dubai-night-mood.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)] via-transparent to-[var(--color-bg)]" />
      </div>

      <div className="container-page relative flex flex-col items-center">
        <h2 className="type-h2 max-w-[760px] text-white">
          Your next 30 videos are already in your camera roll.
        </h2>
        <p className="type-h3 mt-4 text-white">Your first video is edited free.</p>
        <p className="type-small text-muted mt-4">
          We onboard only {site.maxClientsPerMonth} new clients per month.
        </p>

        <Button onClick={() => openAuditModal("final")} className="mt-8">
          Book My Free Content Audit
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>

        {sampleEditHref && (
          <a
            href={sampleEditHref}
            target="_blank"
            rel="noopener noreferrer"
            className="type-small mt-5 font-medium text-[#A24BFF] hover:underline"
          >
            Request a free sample edit →
          </a>
        )}
      </div>
    </section>
  );
}
