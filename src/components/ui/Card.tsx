/**
 * Card components library.
 * Provides a base Card component and themed variants (Glass, Perspective, Pillar).
 * Uses the `cn` utility for conditional class name merging.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// BASE CARD
// ============================================================================

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * A simple card container with base styling.
 * Use the `className` prop to extend or override styles.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("card", className)} {...props} />
));
Card.displayName = "Card";

// ============================================================================
// VARIANT: GLASS CARD
// ============================================================================

export interface GlassCardProps extends CardProps {}

/**
 * A card with a glassmorphism effect (translucent, blurred background).
 * Extends the base Card component and adds the "glass-card" class.
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(({ className, ...props }, ref) => (
  <Card ref={ref} className={cn("glass-card", className)} {...props} />
));
GlassCard.displayName = "GlassCard";

// ============================================================================
// VARIANT: PERSPECTIVE CARD
// ============================================================================

export interface PerspectiveCardProps extends CardProps {}

/**
 * A card with a 3D perspective transform effect.
 * Applies the "perspective-card" class to the base Card.
 */
export const PerspectiveCard = React.forwardRef<HTMLDivElement, PerspectiveCardProps>(
  ({ className, ...props }, ref) => <Card ref={ref} className={cn("perspective-card", className)} {...props} />
);
PerspectiveCard.displayName = "PerspectiveCard";

// ============================================================================
// VARIANT: PILLAR CARD (structured content card)
// ============================================================================

export interface PillarCardProps extends Omit<CardProps, "title"> {
  /** Optional node ID to display in the top-left corner */
  nodeId?: React.ReactNode;
  /** Index number or string – formatted with leading zero if numeric and <10 */
  index: number | string;
  /** Title text (rendered as an uppercase heading) */
  title?: React.ReactNode;
  /** Description text, prefixed with a right arrow */
  description?: React.ReactNode;
  /** Version information (displayed below description) */
  version?: React.ReactNode;
  /** Optional icon – replaces the formatted index when provided */
  icon?: React.ReactNode;
  /** Whether to show a small connection dot next to the index/icon */
  showConnectionDot?: boolean;
  /** Whether to render decorative corner elements */
  showCorners?: boolean;
  /** Additional class names for the content wrapper */
  contentClassName?: string;
}

/**
 * Formats a numeric index with a leading zero if less than 10.
 * Non‑numeric values are returned as is.
 */
function formatPillarIndex(index: number | string) {
  if (typeof index === "number") {
    return index < 10 ? `0${index}` : String(index);
  }
  return index;
}

/**
 * A structured card variant that displays an index/icon, title, description,
 * version, and optional decorative elements (connection dot, corners).
 * If no structured content props are provided, it renders `children` instead.
 */
export const PillarCard = React.forwardRef<HTMLDivElement, PillarCardProps>(
  (
    {
      className,
      nodeId,
      index,
      title,
      description,
      version,
      icon,
      showConnectionDot = true,
      showCorners = true,
      contentClassName,
      children,
      ...props
    },
    ref
  ) => {
    const hasStructuredContent = title || description || version || icon;

    return (
      <Card ref={ref} className={cn("pillar-card group", className)} {...props}>
        {/* Optional node identifier in the top-left */}
        {nodeId ? <div className="pillar-node-id">{nodeId}</div> : null}

        {/* Pillar index/icon area with optional connection dot */}
        <div className="pillar-number">
          {icon ? <span className="pillar-icon">{icon}</span> : formatPillarIndex(index)}
          {showConnectionDot ? <span className="pillar-connection-dot" /> : null}
        </div>

        {/* Main content area – either structured content or children */}
        <div className={cn("flex-1", contentClassName)}>
          {hasStructuredContent ? (
            <>
              {title ? (
                <h4 className="text-white font-bold uppercase tracking-widest text-[11px] mb-1 transition-colors duration-300 group-hover:text-[#c8a34d]">
                  {title}
                </h4>
              ) : null}

              {description ? (
                <p className="pillar-description">
                  <span className="pillar-description-arrow">&rarr;</span> {description}
                </p>
              ) : null}

              {version ? <div className="pillar-version mt-2">{version}</div> : null}
            </>
          ) : (
            children
          )}
        </div>

        {/* Decorative corner elements (top‑right and bottom‑left) */}
        {showCorners ? (
          <>
            <div className="data-corner-tr">
              <div className="corner-line-horizontal" />
              <div className="corner-line-vertical" />
            </div>
            <div className="data-corner-bl">
              <div className="corner-line-horizontal" />
              <div className="corner-line-vertical" />
            </div>
          </>
        ) : null}
      </Card>
    );
  }
);
PillarCard.displayName = "PillarCard";

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default Card;