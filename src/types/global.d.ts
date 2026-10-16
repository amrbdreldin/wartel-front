// ============================================================
// Global type augmentations
// Browser APIs missing from lib.dom (vendor-prefixed / non-standard)
// and project-wide library extensions.
// ============================================================

import type { AxiosError } from "axios";
import type { ApiErrorBody } from "@/utils/apiError";

declare global {
  interface Window {
    /** Safari < 14.1 */
    webkitAudioContext?: typeof AudioContext;
    webkitOfflineAudioContext?: typeof OfflineAudioContext;
    /** Google Analytics / Tag Manager */
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    /** Legacy IE flag used to rule out fake iOS user agents */
    MSStream?: unknown;
  }

  interface Navigator {
    /** iOS Safari: true when launched from the home screen */
    standalone?: boolean;
  }

  /** Audio files carry their measured length (seconds) for validation and UI */
  type FileWithDuration = File & { duration?: number };
}

declare module "axios" {
  interface AxiosRequestConfig {
    /** Handle errors locally — the global interceptor won't toast them */
    skipGlobalToast?: boolean;
  }
}

// Every request goes through the axios client, so query/mutation errors are AxiosErrors
declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError<ApiErrorBody>;
  }
}

export {};
