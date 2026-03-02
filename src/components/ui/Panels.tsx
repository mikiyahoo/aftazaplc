/**
 * Panel components library.
 * Provides a base Panel component with a subtle border and background,
 * and a GlassPanel variant with glassmorphism styling.
 * Uses the `cn` utility for conditional class name merging.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// BASE PANEL
// ============================================================================

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * A generic panel container with a light border and semi‑transparent background.
 * The default styling includes a white/10 border, white/2% background, and a
 * transition for smooth animations. Extend or override styles using the `className` prop.
 */
export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border border-white/10 bg-white/[0.02] text-inherit transition-all duration-300",
      className
    )}
    {...props}
  />
));
Panel.displayName = "Panel";

// ============================================================================
// VARIANT: GLASS PANEL
// ============================================================================

export interface GlassPanelProps extends PanelProps {}

/**
 * A panel with glassmorphism effects.
 * Extends the base Panel and adds the "glass-panel" class for additional styling
 * (e.g., backdrop blur, stronger transparency, etc.).
 */
export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, ...props }, ref) => <Panel ref={ref} className={cn("glass-panel", className)} {...props} />
);
GlassPanel.displayName = "GlassPanel";

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default Panel;