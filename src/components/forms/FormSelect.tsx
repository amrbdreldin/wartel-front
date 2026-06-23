"use client";

import { FieldError } from "@/components/ui/field-error";
import { FieldWrapper } from "@/components/ui/field-wrapper";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useField } from "formik";

// ============================================================
// FormSelect – Molecule: select dropdown with label and error
// ============================================================

interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
}

export function FormSelect({
  name,
  label,
  placeholder,
  options,
  disabled,
  className,
}: FormSelectProps) {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <FieldWrapper name={name} label={label} hasError={hasError} className={className}>
      <Select
        value={field.value}
        onValueChange={(value) => helpers.setValue(value)}
        disabled={disabled}
      >
        <SelectTrigger
          id={name}
          className={cn(
            "h-11 rounded-lg border-border/60 bg-background/50 transition-all duration-200",
            hasError && "border-destructive focus:ring-destructive/30"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && <FieldError error={meta.error} />}
    </FieldWrapper>
  );
}
