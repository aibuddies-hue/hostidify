import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ priority, className }: { priority?: boolean; className?: string }) {
  return (
    <a href="/" className={cn("flex items-center group", className)}>
      <Image
        src="/brand/logo-transparent.png"
        alt="Host Editify"
        width={80}
        height={52}
        sizes="80px"
        priority={priority}
        className="h-12 w-20 object-contain transition-transform duration-200 group-hover:scale-105"
      />
    </a>
  );
}
