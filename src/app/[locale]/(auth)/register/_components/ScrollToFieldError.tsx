"use client";

import { useEffect } from "react";
import { useFormikContext } from "formik";

// ── Auto-scroll to first error on submit ──────────────────
export function ScrollToFieldError() {
  const { submitCount, isValid, errors } = useFormikContext();

  useEffect(() => {
    if (submitCount > 0 && !isValid) {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const errorElement =
          document.querySelector(`[name="${firstErrorKey}"]`) ||
          document.getElementById(firstErrorKey);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  }, [submitCount, isValid, errors]);

  return null;
}
