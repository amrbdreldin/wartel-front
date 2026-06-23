"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

// ── Role Selection Card ─────────────────────────────────────
export function RoleCard({
  value,
  currentValue,
  icon: Icon,
  label,
  accentClass,
  onChange,
}: {
  value: string;
  currentValue: string;
  icon: React.ElementType;
  label: string;
  accentClass: string;
  onChange: (v: string) => void;
}) {
  const isSelected = currentValue === value;

  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={cn(
        "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-300 cursor-pointer group hover:-translate-y-0.5 active:translate-y-0",
        isSelected
          ? `${accentClass} scale-[1.03] shadow-lg ring-4 ring-current/5 border-current`
          : "border-border/40 bg-muted/30 hover:bg-muted/50 hover:border-border hover:shadow-sm"
      )}
    >
      <Icon
        className={cn(
          "h-6 w-6 transition-colors",
          isSelected ? "text-current" : "text-muted-foreground"
        )}
      />
      <span className="text-sm font-bold">{label}</span>
      {isSelected && (
        <div className="absolute top-2 start-2 animate-in fade-in zoom-in duration-200">
          <CheckCircle2 className="h-4 w-4" />
        </div>
      )}
    </button>
  );
}
