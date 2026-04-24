"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-space-950 disabled:opacity-60",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        variant === "primary" &&
          "bg-accent-cyan/90 text-space-950 hover:bg-accent-cyan shadow-glow",
        variant === "outline" &&
          "border border-white/15 text-slate-100 hover:bg-white/5",
        variant === "ghost" && "text-slate-300 hover:bg-white/5 hover:text-white",
        className,
      )}
      {...rest}
    />
  );
}
