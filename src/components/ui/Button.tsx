"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = gradient pill, secondary = ghost pill. */
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  ctaPosition?: string;
  magnetic?: boolean;
  children: React.ReactNode;
}

const base =
  "inline-flex h-[52px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 text-[15px] font-semibold text-white transition-[transform,box-shadow,background-color,border-color] duration-200 cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A24BFF]";

const variants = {
  primary:
    "bg-brand-gradient shadow-[0_8px_28px_-8px_rgba(162,75,255,0.6)] hover:shadow-[0_10px_34px_-6px_rgba(162,75,255,0.75)] hover:-translate-y-px active:translate-y-0",
  secondary:
    "bg-transparent border border-white/20 hover:border-white/45 hover:bg-white/[0.04]",
};

export function Button({
  variant = "primary",
  size,
  ctaPosition,
  magnetic,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
