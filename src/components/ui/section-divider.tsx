import { cn } from "@/lib/utils";

// ============================================================
// SectionDivider – Atom: labeled section separator with lines
// ============================================================

interface SectionDividerProps {
  label: string;
  className?: string;
}

export function SectionDivider({ label, className }: SectionDividerProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <h3 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
        <div className="h-px flex-1 bg-primary/10" />
        {label}
        <div className="h-px flex-1 bg-primary/10" />
      </h3>
    </div>
  );
}
