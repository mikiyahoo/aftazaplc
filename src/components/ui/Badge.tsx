import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the Badge component.
 */
type BadgeProps = {
  /** The content to display inside the badge. */
  children: ReactNode;
  /** Additional CSS classes to apply to the badge. */
  className?: string;
  /** Whether to show a pulsing animation dot (used for "live" indicators). */
  pulse?: boolean;
  /** If true, the default dot (usually a small circle) will be hidden. */
  hideDefaultDot?: boolean;
};

/**
 * A small badge component for statuses, labels, or counts.
 * Can optionally display a pulsing dot for live/active states.
 *
 * @example
 * <Badge>New</Badge>
 * <Badge pulse>Live</Badge>
 * <Badge hideDefaultDot>Archived</Badge>
 */
export default function Badge({
  children,
  className,
  pulse = false,
  hideDefaultDot = false,
}: BadgeProps) {
  return (
    // The "badge" class provides base styling, and "badge-no-dot" removes the default dot if desired.
    <span className={cn("badge", hideDefaultDot && "badge-no-dot", className)}>
      {pulse ? (
        // Pulse indicator: consists of a "ping" element for the outer ripple and a static dot.
        <span className="badge-pulse" aria-hidden="true">
          <span className="ping" />
          <span className="dot" />
        </span>
      ) : null}
      {children}
    </span>
  );
}