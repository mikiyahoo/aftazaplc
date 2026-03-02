import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
  border?: boolean;
}

export default function Section({ 
  children, 
  className, 
  id, 
  dark = false,
  border = false 
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "section-y relative overflow-hidden", // Inherits: padding-top/bottom: var(--section-y)
        dark ? "bg-[#04080f] text-white" : "bg-white text-[#09111f]",
        border && "border-b border-white/5",
        className
      )}
    >
      {/* Optional Noise Overlay for Dark Sections */}
      {dark && <div className="absolute inset-0 noise-overlay pointer-events-none opacity-20" />}
      
      {children}
    </section>
  );
}

export interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3";
  tone?: "light" | "dark";
  size?: "section" | "hero";
}

export const SectionTitle = React.forwardRef<HTMLHeadingElement, SectionTitleProps>(
  ({ as = "h2", tone = "light", size = "section", className, ...props }, ref) => {
    const Comp = as;

    return (
      <Comp
        ref={ref}
        className={cn(
          "font-display tracking-tight",
          size === "hero"
            ? "text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1]"
            : "text-4xl md:text-5xl font-extrabold leading-[1.15]",
          tone === "dark" ? "text-white" : "text-[#09111f]",
          className
        )}
        {...props}
      />
    );
  }
);

SectionTitle.displayName = "SectionTitle";

export interface TitleAccentProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const TitleAccent = React.forwardRef<HTMLSpanElement, TitleAccentProps>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("text-[#c8a34d] font-bold", className)} {...props} />
));

TitleAccent.displayName = "TitleAccent";
