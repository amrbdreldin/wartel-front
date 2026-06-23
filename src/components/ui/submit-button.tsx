import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// ============================================================
// SubmitButton – Molecule: gradient CTA with loading state
// ============================================================

interface SubmitButtonProps {
  label: string;
  loadingLabel: string;
  isSubmitting: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function SubmitButton({
  label,
  loadingLabel,
  isSubmitting,
  icon,
  className,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={cn(
        "w-full h-12 rounded-lg text-base font-semibold gradient-primary text-white",
        "hover:opacity-90 transition-all duration-200 shadow-md shadow-primary/20 gap-2",
        className
      )}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingLabel}
        </span>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </Button>
  );
}
