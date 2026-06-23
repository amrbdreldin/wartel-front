import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ============================================================
// FieldWrapper – Atom: consistent spacing + label for any field
// ============================================================

interface FieldWrapperProps {
  name: string;
  label: string;
  hasError?: boolean;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FieldWrapper({
  name,
  label,
  hasError,
  required,
  children,
  className,
}: FieldWrapperProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={name}
        className={cn("text-sm font-medium", hasError && "text-destructive")}
      >
        {label}
        {required && <span className="text-destructive ms-1 font-bold">*</span>}
      </Label>
      {children}
    </div>
  );
}
