import React from "react";
import { cn } from "@/lib/utils";

export function Logo({ priority, className }: { priority?: boolean; className?: string }) {
  return (
    <a href="/" className={cn("flex items-center group", className)}>
      <img
        src="/brand/logo-transparent.png"
        alt="Host Editify"
        style={{ height: "48px", width: "auto", objectFit: "contain", display: "block" }}
        className="transition-transform duration-200 group-hover:scale-105"
      />
    </a>
  );
}
