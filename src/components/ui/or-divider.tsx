import { cn } from "@/lib/utils";

// ============================================================
// OrDivider – Atom: horizontal "or" divider
// ============================================================

interface OrDividerProps {
  text: string;
  className?: string;
}

export function OrDivider({ text, className }: OrDividerProps) {
  return (
    <div className={cn("flex items-center gap-3 w-full", className)}>
      <div className="h-px flex-1 bg-border/60" />
      <span className="text-xs text-muted-foreground">{text}</span>
      <div className="h-px flex-1 bg-border/60" />
    </div>
  );
}
