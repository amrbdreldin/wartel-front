"use client";

import { FieldError } from "@/components/ui/field-error";
import { FieldWrapper } from "@/components/ui/field-wrapper";
import { useField } from "formik";
import { ReactNode } from "react";
import { PhoneInput } from "./PhoneInput";

interface PhoneFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  required?: boolean;
}

export function PhoneFormField({
  name,
  label,
  placeholder,
  disabled,
  className,
  icon,
  required,
}: PhoneFormFieldProps) {
  const [field, meta, helpers] = useField(name);
  // Show error if touched OR if we have a value (instant feedback)
  const hasError = !!meta.error && (meta.touched || !!field.value);

  return (
    <FieldWrapper name={name} label={label} hasError={hasError} className={className} required={required}>
      <PhoneInput
        value={field.value}
        onChange={(val) => {
          helpers.setValue(val);
        }}
        onBlur={() => helpers.setTouched(true)}
        disabled={disabled}
        hasError={hasError}
        placeholder={placeholder}
        icon={icon}
      />
      {hasError && <FieldError error={meta.error} />}
    </FieldWrapper>
  );
}
