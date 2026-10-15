"use client";

import React from "react";
import { ArrowRight, Check, Gift } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconTile } from "@/components/ui/IconTile";
import { Section, SectionHeader } from "@/components/ui/Section";
import { site, type Plan } from "@/lib/site.config";
import { useAuditModal } from "@/context/AuditModalContext";
import { cn } from "@/lib/utils";

// Source: copy doc §6
const deliverables = [
  "15 or 25 short-form videos a month, based on your\u00A0plan",
  "Long-form YouTube edits (Authority plan)",
  "Dynamic captions, with English or Arabic subtitles",
  "Motion graphics and sound design",
  "Stock and AI-generated B-roll where your footage needs it",
  "Reel covers and thumbnails",
  "A dedicated editor who learns your brand",
  `${site.revisions.growth} revision rounds per video (${site.revisions.authority}\u00A0on\u00A0Authority)`,
  "Weekly project call on Google Meet + WhatsApp updates",
  "NDA and encrypted file handling",
];

const formats = ["Instagram Reels", "YouTube Shorts & long-form", "LinkedIn", "Meta Ads"];

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#A24BFF]" strokeWidth={1.75} aria-hidden />
      <span className="text-[15px] leading-relaxed text-white/90 md:text-base">{children}</span>
    </li>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const { openAuditModal } = useAuditModal();
  return (
    <div
      className={cn(
        "card flex h-full flex-col",
        plan.featured && "plan-featured"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="type-h2 text-white">{plan.name}</h3>
        {plan.featured && (
          <span className="rounded-full border border-white/[0.12] bg-white/[0.08] px-3 py-1 text-xs font-semibold text-white">
            Most popular
          </span>
        )}
      </div>
      <p className="type-small text-muted mt-2">{plan.audience}</p>
      {plan.lead && <p className="type-body mt-6 -mb-3 font-semibold text-white">{plan.lead}</p>}

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {plan.features.map((f) => (
          <CheckItem key={f}>{f}</CheckItem>
        ))}
      </ul>

      <div className="mt-8 border-t border-white/[0.08] pt-6">
        <Button onClick={() => openAuditModal(`${plan.name.toLowerCase()}-plan`)} className="w-full">
          {plan.cta}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}

export function WhatYouGetSection() {
  return (
    <Section id="plans-section">
      <SectionHeader title="Everything you need to post like a full-time creator" />

      {/* Deliverables (2/3, two-column list) + Hook Bank (1/3): similar content height, so no empty gap */}
      <div className="grid-gap mx-auto grid max-w-5xl grid-cols-1 items-stretch lg:grid-cols-3">
        <div className="card h-full lg:col-span-2">
          <h3 className="type-h3 text-white">Core monthly deliverables</h3>
          <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
            {deliverables.map((d) => (
              <CheckItem key={d}>{d}</CheckItem>
            ))}
          </ul>
        </div>

        {site.bonuses.hookBank && (
          <div className="card flex h-full flex-col justify-center">
            <IconTile icon={Gift} />
            <h3 className="type-h3 mt-5 text-white">Bonus: The Hook Bank</h3>
            <p className="type-body text-muted mt-3">
              Before your first batch, we write a custom hook bank of opening lines for your niche,
              so every video starts strong. Included with every plan.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <h3 className="type-small font-semibold text-white">Formats we edit for</h3>
        <ul className="flex flex-wrap justify-center gap-2">
          {formats.map((f) => (
            <li key={f} className="type-small rounded-full bg-white/[0.06] px-3 py-1.5 text-white/85">
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-20 md:mt-28">
        <SectionHeader title="Choose your plan" sub="Pricing shared on your free audit call." />
        <div className="grid-gap mx-auto grid max-w-4xl grid-cols-1 items-stretch md:grid-cols-2">
          {site.plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </Section>
  );
}
