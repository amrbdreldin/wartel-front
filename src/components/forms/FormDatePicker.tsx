"use client";

import { FieldError } from "@/components/ui/field-error";
import { FieldWrapper } from "@/components/ui/field-wrapper";
import { DatePicker } from "@/components/ui/DatePicker";
import { useField } from "formik";

// ============================================================
// FormDatePicker – Molecule: date picker with label and error
// ============================================================

interface FormDatePickerProps {
  name: string;
  label: string;
  disabled?: boolean;
  className?: string;
  min?: string;
  max?: string;
}

export function FormDatePicker({
  name,
  label,
  disabled,
  className,
  min,
  max,
}: FormDatePickerProps) {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <FieldWrapper name={name} label={label} hasError={hasError} className={className}>
      <DatePicker
        value={field.value || ""}
        minDate={min}
        maxDate={max}
        disabled={disabled}
        onChange={(val) => helpers.setValue(val)}
        hasError={hasError}
        placeholder={label}
      />
      {hasError && <FieldError error={meta.error} />}
    </FieldWrapper>
  );
}
