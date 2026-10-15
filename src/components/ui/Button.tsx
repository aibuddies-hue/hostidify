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
  "button inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 rounded-full px-7 py-3 text-[15px] font-semibold text-white transition-[transform,box-shadow,background-color,border-color] duration-200 cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C59AFF]";

const variants = {
  primary:
    "button-primary bg-brand-gradient hover:-translate-y-px active:translate-y-0",
  secondary:
    "bg-transparent border border-white/20 hover:border-white/45 hover:bg-white/[0.04]",
};

export function Button({
  variant = "primary",
  size: _size,
  ctaPosition,
  magnetic: _magnetic,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  // Legacy styling props are intentionally consumed instead of passed to the DOM.
  void _size;
  void _magnetic;
  return (
    <button type={type} className={cn(base, variants[variant], className)} data-cta-position={ctaPosition} {...props}>
      {children}
    </button>
  );
}
