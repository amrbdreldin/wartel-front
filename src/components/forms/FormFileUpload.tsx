"use client";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { FieldWrapper } from "@/components/ui/field-wrapper";
import { useField } from "formik";
import { FileIcon, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

// ============================================================
// FormFileUpload – Molecule: file upload with label and error
// ============================================================

interface FormFileUploadProps {
  name: string;
  label: string;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
  className?: string;
  uploadText?: string;
}

export function FormFileUpload({
  name,
  label,
  accept,
  maxSize = 10,
  disabled,
  className,
  uploadText,
}: FormFileUploadProps) {
  const [, meta, helpers] = useField(name);
  const t = useTranslations();
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasError = meta.touched && !!meta.error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      helpers.setError("validation.fileTooLarge");
      return;
    }

    helpers.setValue(file);
    setFileName(file.name);
  };

  const handleRemove = () => {
    helpers.setValue(null);
    setFileName(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const buttonLabel = uploadText || t("common.submit");

  return (
    <FieldWrapper name={name} label={label} hasError={hasError} className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
        id={`file-${name}`}
      />

      {fileName ? (
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-3 transition-all">
          <FileIcon className="h-4 w-4 shrink-0 text-primary" />
          <span className="flex-1 truncate text-sm">{fileName}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 h-11 rounded-lg border-dashed border-border/60 hover:border-primary hover:bg-primary/5 transition-all duration-200"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          {buttonLabel}
        </Button>
      )}

      {hasError && <FieldError error={meta.error} />}
    </FieldWrapper>
  );
}
