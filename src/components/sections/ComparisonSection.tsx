"use client";

import React, { useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useAuditModal } from "@/context/AuditModalContext";

type AltKey = "self" | "freelancers" | "inHouse";

/** A cell is either text or a yes/no mark (rendered as a lucide icon). */
type Cell = string | boolean;

interface Row {
  feature: string;
  self: Cell;
  freelancers: Cell;
  inHouse: Cell;
  hostEditify: Cell;
}

// Source: copy doc §10, with 24-hour delivery
const rows: Row[] = [
  {
    feature: "Your time",
    self: "8–15 hrs a week",
    freelancers: "Hours chasing briefs and revisions",
    inHouse: "Hours managing and directing",
    hostEditify: "One weekly call",
  },
  {
    feature: "Turnaround",
    self: "Whenever you find time",
    freelancers: "Unpredictable",
    inHouse: "Depends on their workload",
    hostEditify: "24 hours, guaranteed",
  },
  {
    feature: "Consistency",
    self: "Breaks when you're busy",
    freelancers: "Risk of ghosting",
    inHouse: "Stops for leave and sick days",
    hostEditify: "One dedicated editor who learns your brand",
  },
  {
    feature: "Hiring and management",
    self: "None",
    freelancers: "Constant re-hiring",
    inHouse: "Fixed monthly salary + overhead",
    hostEditify: "Zero hiring. We manage the team.",
  },
  {
    feature: "Try before you commit (first video free)",
    self: false,
    freelancers: false,
    inHouse: false,
    hostEditify: true,
  },
];

const alternatives: { key: AltKey; label: string }[] = [
  { key: "self", label: "Editing yourself" },
  { key: "freelancers", label: "Freelancers" },
  { key: "inHouse", label: "In-house editor" },
];

function CellValue({ value, highlight = false }: { value: Cell; highlight?: boolean }) {
  if (value === true) {
    return <Check className="h-5 w-5 text-[#A24BFF]" strokeWidth={2} aria-label="Yes" />;
  }
  if (value === false) {
    return <X className="h-5 w-5 text-white/35" strokeWidth={2} aria-label="No" />;
  }
  return <span className={highlight ? "font-semibold text-white" : "text-[#A0A0B0]"}>{value}</span>;
}

export function ComparisonSection() {
  const [alt, setAlt] = useState<AltKey>("self");
  const { openAuditModal } = useAuditModal();
  const altLabel = alternatives.find((a) => a.key === alt)?.label;

  return (
    <Section id="why-us-section" alt>
      <SectionHeader title="Why Host Editify?" sub="See how we compare to the usual options." />

      {/* Phone: Host Editify vs one selectable alternative, no sideways scroll */}
      <div className="lg:hidden">
        <div role="tablist" aria-label="Compare with" className="mb-4 grid grid-cols-3 gap-1 rounded-full border border-white/[0.08] bg-[var(--card-bg)] p-1">
          {alternatives.map((a) => (
            <button
              key={a.key}
              role="tab"
              type="button"
              aria-selected={alt === a.key}
              onClick={() => setAlt(a.key)}
              className={
                "h-10 cursor-pointer rounded-full px-2 text-[13px] leading-tight font-semibold transition-colors " +
                (alt === a.key ? "bg-[#8434D4] text-white" : "text-[#A0A0B0]")
              }
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <div key={row.feature} className="card !p-4">
              <p className="type-small font-semibold text-white">{row.feature}</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <p className="mb-1 text-xs text-[#A0A0B0]">{altLabel}</p>
                  <div className="type-small">
                    <CellValue value={row[alt]} />
                  </div>
                </div>
                <div className="rounded-xl bg-[#8434D4]/[0.08] p-3">
                  <p className="mb-1 text-xs font-semibold text-white">Host Editify</p>
                  <div className="type-small">
                    <CellValue value={row.hostEditify} highlight />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: full table */}
      <div className="hidden overflow-hidden rounded-[20px] border border-white/[0.08] bg-[var(--card-bg)] lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="w-[26%] px-6 py-5" aria-label="Feature" />
              {alternatives.map((a) => (
                <th key={a.key} className="type-small w-[18%] px-5 py-5 font-semibold text-[#A0A0B0]">
                  {a.label}
                </th>
              ))}
              <th className="type-small w-[20%] bg-[#8434D4]/[0.08] px-6 py-5 font-bold text-white">
                Host Editify
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {rows.map((row) => (
              <tr key={row.feature}>
                <td className="type-small px-6 py-5 font-semibold text-white">{row.feature}</td>
                {alternatives.map((a) => (
                  <td key={a.key} className="type-small px-5 py-5">
                    <CellValue value={row[a.key]} />
                  </td>
                ))}
                <td className="type-small bg-[#8434D4]/[0.08] px-6 py-5">
                  <CellValue value={row.hostEditify} highlight />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Free-first-edit callout: separate card, 32px below the table */}
      <div className="mt-8 rounded-[20px] bg-[var(--card-bg)] px-6 py-10 text-center shadow-[0_0_60px_-20px_rgba(162,75,255,0.35)] md:px-12 md:py-14">
        <h3 className="type-h2 mx-auto max-w-3xl text-white">
          Your first video is edited <span className="text-brand-gradient">FREE</span>.
        </h3>
        <p className="type-body text-muted mx-auto mt-4 max-w-xl">
          See the quality before you pay anything. Send us one raw clip. If you don&apos;t love the
          result, you walk away and pay nothing.
        </p>
        <Button onClick={() => openAuditModal("comparison")} className="mt-8">
          Book My Free Content Audit
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </Section>
  );
}
