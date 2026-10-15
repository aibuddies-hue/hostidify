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
        "section relative overflow-hidden",
        alt && "section-alt",
        className
      )}
    >
      <div className="container-page">{children}</div>
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
    <div className={cn("section-header", className)}>
      <h2 className="type-h2 text-white mb-4">
        {title}
      </h2>
      {sub && <div className="text-sm sm:text-base text-[#A0A0B0] leading-relaxed">{sub}</div>}
    </div>
  );
}
