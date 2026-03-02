import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Button component variants for styling.
 * - primary: Filled primary button (gold background)
 * - outline: Outlined button with gold border
 * - gold: Gold solid button with shadow
 * - goldOutline: Gold outlined button with white background
 * - darkOutline: Dark outlined button for dark backgrounds
 */
export type ButtonVariant =
  | "primary"
  | "outline"
  | "gold"
  | "goldOutline"
  | "darkOutline";

/**
 * Button size options.
 * - sm: Small
 * - md: Medium (default)
 * - lg: Large
 * - icon: Square icon button (equal width/height)
 */
export type ButtonSize = "sm" | "md" | "lg" | "icon";

/**
 * Options for generating button variant class names.
 */
type ButtonVariantOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

// Base classes applied to all buttons
const baseClasses =
  "inline-flex items-center justify-center gap-3 whitespace-nowrap transition-all duration-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

// Mapping of variant to Tailwind classes
const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  outline: "btn-outline",
  gold: "group relative overflow-hidden px-8 py-4 bg-[#c8a34d] text-[#04080f] font-display font-bold text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(200,163,77,0.2)]",
  goldOutline:
    "px-8 py-4 border border-[#c8a34d]/30 bg-white text-[#c8a34d] font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#c8a34d] hover:text-white",
  darkOutline:
    "px-8 py-4 border border-white/10 text-white font-display text-sm uppercase tracking-widest hover:bg-white/5 hover:border-[#c8a34d]/30",
};

// Mapping of size to Tailwind classes
const sizeClasses: Record<ButtonSize, string> = {
  sm: "!px-6 !py-3 !text-xs",
  md: "",
  lg: "!px-10 !py-5 !text-sm",
  icon: "h-10 w-10 p-0",
};

/**
 * Generates the combined class names for a button based on variant, size, and fullWidth.
 * @param options - Button styling options
 * @returns A string of Tailwind classes
 */
export function buttonVariants({
  variant = "primary",
  size = "md",
  fullWidth = false,
}: ButtonVariantOptions = {}) {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], fullWidth && "w-full");
}

/**
 * Props for the Button component, extending native button attributes.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the button */
  variant?: ButtonVariant;
  /** Size preset of the button */
  size?: ButtonSize;
  /** Whether the button should take full width of its container */
  fullWidth?: boolean;
  /** Whether the button is in a loading state (disables button) */
  loading?: boolean;
}

/**
 * A reusable button component with multiple variants and sizes.
 * 
 * @example
 * <Button variant="gold" size="lg" onClick={handleClick}>
 *   Click Me
 * </Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export interface SliderNavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SliderNavButton = React.forwardRef<HTMLButtonElement, SliderNavButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-3 whitespace-nowrap transition-all duration-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] bg-transparent border-0 shadow-none hover:bg-transparent",
        className
      )}
      {...props}
    />
  )
);

SliderNavButton.displayName = "SliderNavButton";

export interface HamburgerMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const HamburgerMenuButton = React.forwardRef<HTMLButtonElement, HamburgerMenuButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap transition-all duration-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] bg-transparent border-0 shadow-none hover:bg-transparent",
        className
      )}
      {...props}
    />
  )
);

HamburgerMenuButton.displayName = "HamburgerMenuButton";

export interface DropdownMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const DropdownMenuButton = React.forwardRef<HTMLButtonElement, DropdownMenuButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap transition-all duration-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] bg-transparent border-0 shadow-none hover:bg-transparent",
        className
      )}
      {...props}
    />
  )
);

DropdownMenuButton.displayName = "DropdownMenuButton";

export default Button;
