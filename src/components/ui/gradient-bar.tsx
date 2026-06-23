import { cn } from "@/lib/utils";

// ============================================================
// GradientBar – Atom: decorative gradient accent bar
// ============================================================

interface GradientBarProps {
  variant?: "primary" | "secondary" | "brand";
  height?: "sm" | "md";
  className?: string;
}

const heightMap = { sm: "h-0.5", md: "h-1" };

const variantMap = {
  primary: "gradient-primary",
  secondary: "gradient-secondary",
  brand: "gradient-brand",
};

export function GradientBar({
  variant = "primary",
  height = "md",
  className,
}: GradientBarProps) {
  return (
    <div
      className={cn(heightMap[height], variantMap[variant], className)}
      aria-hidden="true"
    />
  );
}
