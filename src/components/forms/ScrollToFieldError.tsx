"use client";

import { useFormikContext } from "formik";
import { useEffect } from "react";

export function ScrollToFieldError() {
  const { submitCount, isValid, errors } = useFormikContext();

  useEffect(() => {
    if (isValid || submitCount === 0) return;

    // Wait for the next tick to ensure DOM is updated with error states
    setTimeout(() => {
      // Find the first error key in the errors object
      const errorKeys = Object.keys(errors);
      if (errorKeys.length > 0) {
        const firstErrorKey = errorKeys[0];
        // Query the DOM for an element with the corresponding id or name
        const errorElement = document.querySelector(
          `[name="${firstErrorKey}"], [id="${firstErrorKey}"]`
        );
        
        if (errorElement) {
          errorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          
          // Optionally focus the element for better accessibility
          if (errorElement instanceof HTMLElement) {
            errorElement.focus({ preventScroll: true });
          }
        }
      }
    }, 100);
  }, [submitCount, isValid, errors]);

  return null;
}
