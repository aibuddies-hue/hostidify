import React from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  className,
  alt = false,
  children,
}: {
  id?: string;
  className?: string;
  alt?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-16 sm:py-20 md:py-28 overflow-hidden",
        alt ? "bg-[#0E0E17]" : "bg-[#0A0A0F]",
        className
      )}
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">{children}</div>
    </section>
  );
}

export function SectionHeader({
  title,
  sub,
  className,
}: {
  title: React.ReactNode;
  sub?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 sm:mb-14 text-center max-w-[720px] mx-auto", className)}>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
        {title}
      </h2>
      {sub && <div className="text-sm sm:text-base text-[#A0A0B0] leading-relaxed">{sub}</div>}
    </div>
  );
}
