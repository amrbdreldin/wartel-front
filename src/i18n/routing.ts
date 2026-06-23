import { LOCALES } from "@/lib/constants";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: "ar" as (typeof LOCALES)[number],
});

