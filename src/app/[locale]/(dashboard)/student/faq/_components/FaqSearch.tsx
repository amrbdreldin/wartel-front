"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface FaqSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function FaqSearch({ value, onChange }: FaqSearchProps) {
  const t = useTranslations("student.faq");

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <Search
          className="absolute start-4 w-5 h-5 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          className="w-full bg-card border border-border/70 rounded-2xl ps-12 pe-12 py-3.5 text-sm md:text-base text-foreground placeholder:text-muted-foreground/60 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            title={t("clearSearch")}
            aria-label={t("clearSearch")}
            className="absolute end-4 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
