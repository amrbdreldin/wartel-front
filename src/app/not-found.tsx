"use client";

import { routing } from "@/i18n/routing";
import { redirect } from "next/navigation";

// Root level Not Found simply redirects to the default locale (ar)
export default function NotFound() {
  redirect(`/${routing.defaultLocale}`);
}
