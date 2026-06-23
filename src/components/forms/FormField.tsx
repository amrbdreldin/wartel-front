"use client";

import { FieldError } from "@/components/ui/field-error";
import { FieldWrapper } from "@/components/ui/field-wrapper";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useField } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useLocale } from "next-intl";
import { useState, ReactNode } from "react";

// ============================================================
// FormField – Molecule: text input with label and error
// ============================================================

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dir?: "ltr" | "rtl";
  icon?: ReactNode;
  required?: boolean;
}

export function FormField({
  name,
  label,
  type = "text",
  placeholder,
  disabled,
  className,
  dir,
  icon,
  required,
}: FormFieldProps) {
  const [field, meta] = useField(name);
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const hasError = meta.touched && !!meta.error;

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  // For password fields, default to locale direction if not explicitly provided
  const resolvedDir = dir || (isPassword ? (locale === "ar" ? "rtl" : "ltr") : undefined);

  return (
    <FieldWrapper name={name} label={label} hasError={hasError} className={className} required={required}>
      <div className="relative group">
        {icon && (
          <div className="absolute top-1/2 -translate-y-1/2 start-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10 pointer-events-none">
            {icon}
          </div>
        )}
        <Input
          id={name}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          dir={resolvedDir}
          className={cn(
            "h-11 rounded-xl border-border/60 bg-background/50 transition-all duration-200",
            "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary",
            isPassword && "pe-12 text-start", // text-start follows the dir
            icon && "ps-11",
            hasError && "border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive"
          )}
          {...field}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 -translate-y-1/2 end-3 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors z-10"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {hasError && <FieldError error={meta.error} />}
    </FieldWrapper>
  );
}
