"use client";

import { FieldError } from "@/components/ui/field-error";
import { FieldWrapper } from "@/components/ui/field-wrapper";
import { cn } from "@/lib/utils";
import { useField } from "formik";
import { ReactNode } from "react";

// ============================================================
// FormTextarea – Formik-connected multi-line input field
// ============================================================

interface FormTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  rows?: number;
  icon?: ReactNode;
  required?: boolean;
}

export function FormTextarea({
  name,
  label,
  placeholder,
  disabled,
  className,
  rows = 3,
  required,
}: FormTextareaProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <FieldWrapper
      name={name}
      label={label}
      hasError={hasError}
      className={className}
      required={required}
    >
      <div className="relative">
        <textarea
          id={name}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full rounded-xl border border-border/60 bg-background/50 p-3 text-sm text-foreground transition-all duration-200 resize-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary",
            "placeholder:text-muted-foreground/60",
            hasError &&
              "border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive"
          )}
          {...field}
        />
      </div>
      {hasError && <FieldError error={meta.error} />}
    </FieldWrapper>
  );
}
