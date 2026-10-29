"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { FaqCategory } from "@/types/faq.types";
import {
  AlertTriangle,
  HelpCircle,
  Layers,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Fragment, useMemo, useState, type ReactNode } from "react";

interface FaqBrowserProps {
  categories: FaqCategory[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  searchPlaceholder?: string;
  /** Extra content rendered under the category list on large screens (e.g. support cards) */
  sidebarFooter?: ReactNode;
  className?: string;
}

// Wraps every occurrence of the search query in a <mark> so matches are easy to spot
function highlight(text: string, query: string) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query ? (
      <mark key={i} className="bg-secondary/40 text-foreground rounded px-0.5">
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

/**
 * Two-pane FAQ browser: every category is always visible in the side list,
 * and only the selected category's questions render in a fixed-height panel,
 * so long FAQs stay on one screen instead of one tall scrolling page.
 */
export function FaqBrowser({
  categories: rawCategories,
  isLoading,
  isError,
  onRetry,
  searchPlaceholder,
  sidebarFooter,
  className,
}: FaqBrowserProps) {
  const t = useTranslations("faqBrowser");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Drop empty categories so they don't render an empty panel
  const categories = useMemo(
    () => rawCategories.filter((c) => c.data.length > 0),
    [rawCategories]
  );

  const query = searchQuery.toLowerCase().trim();
  const isSearching = query.length > 0;

  // Same categories, with items narrowed to the ones matching the search
  const visibleCategories = useMemo(() => {
    if (!isSearching) return categories;
    return categories.map((category) => ({
      ...category,
      data: category.data.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      ),
    }));
  }, [categories, query, isSearching]);

  const resultCount = visibleCategories.reduce((s, c) => s + c.data.length, 0);

  // Keep the selection valid: fall back to the first category that has items
  const active =
    visibleCategories.find((c) => c.id === selectedId && c.data.length > 0) ??
    visibleCategories.find((c) => c.data.length > 0);

  if (isLoading) {
    return (
      <div
        className={cn("grid grid-cols-1 lg:grid-cols-12 gap-6", className)}
        aria-busy="true"
      >
        <div className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
        <div className="lg:col-span-8 xl:col-span-9 space-y-3">
          <Skeleton className="h-12 w-full rounded-2xl" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-destructive/5 border border-destructive/20 rounded-3xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="font-bold text-foreground">{t("error")}</p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:bg-destructive/90 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t("retry")}</span>
        </button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-card border border-border/60 rounded-3xl p-12 text-center space-y-3">
        <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto" />
        <p className="text-foreground font-bold">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start",
        className
      )}
    >
      {/* ===== Category navigation ===== */}
      <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-4 space-y-4 min-w-0">
        <nav
          aria-label={t("categories")}
          className="lg:bg-card lg:border lg:border-border/60 lg:rounded-2xl lg:p-2"
        >
          <p className="hidden lg:flex items-center gap-2 px-3 pt-2 pb-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            {t("categories")}
          </p>
          {/* Horizontal chips on mobile, vertical list on desktop */}
          <ul className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-y-auto lg:max-h-[calc(100vh-16rem)] pb-1 lg:pb-0 -mx-1 px-1 snap-x">
            {visibleCategories.map((category) => {
              const isActive = category.id === active?.id;
              const isDisabled = category.data.length === 0;
              return (
                <li key={category.id} className="shrink-0 snap-start">
                  <button
                    type="button"
                    disabled={isDisabled}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => setSelectedId(category.id)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold text-start transition-all cursor-pointer whitespace-nowrap lg:whitespace-normal",
                      "border lg:border-transparent",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-card border-border/60 text-foreground hover:bg-primary/5 hover:text-primary",
                      isDisabled &&
                        "opacity-40 cursor-not-allowed hover:bg-card hover:text-foreground"
                    )}
                  >
                    <span className="leading-snug">{category.name}</span>
                    <span
                      className={cn(
                        "shrink-0 min-w-6 text-center text-xs font-black rounded-full px-2 py-0.5",
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      {category.data.length}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {sidebarFooter && <div className="hidden lg:block">{sidebarFooter}</div>}
      </aside>

      {/* ===== Questions panel ===== */}
      <section className="lg:col-span-8 xl:col-span-9 min-w-0 bg-card border border-border/60 rounded-2xl lg:rounded-3xl overflow-hidden flex flex-col lg:h-[calc(100vh-12rem)] lg:min-h-[480px] lg:max-h-[760px]">
        {/* Search + panel title */}
        <div className="p-3 md:p-4 border-b border-border/60 space-y-3 bg-muted/20">
          <div className="relative flex items-center">
            <Search
              className="absolute start-3.5 w-4.5 h-4.5 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder ?? t("searchPlaceholder")}
              aria-label={searchPlaceholder ?? t("searchPlaceholder")}
              className="w-full bg-background border border-border/70 rounded-xl ps-11 pe-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                title={t("clearSearch")}
                aria-label={t("clearSearch")}
                className="absolute end-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {active && (
            <div className="flex items-center justify-between gap-3 px-1">
              <h3 className="font-black text-foreground font-heading text-base md:text-lg truncate">
                {active.name}
              </h3>
              <span className="shrink-0 text-xs font-bold text-muted-foreground">
                {isSearching
                  ? t("resultsSummary", { count: resultCount })
                  : t("questionsCount", { count: active.data.length })}
              </span>
            </div>
          )}
        </div>

        {/* Question list scrolls inside the panel so the page itself stays put */}
        <div className="flex-1 overflow-y-auto p-2 md:p-3">
          {!active ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 p-10">
              <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <p className="font-bold text-foreground">{t("noResults")}</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                {t("noResultsDesc")}
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/90 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>{t("clearSearch")}</span>
              </button>
            </div>
          ) : (
            // Remount per category so the open item collapses when switching
            <Accordion key={active.id} dir={dir} className="gap-1.5">
              {active.data.map((faq, index) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="not-last:border-b-0 rounded-xl border border-transparent transition-colors hover:bg-muted/40 data-open:bg-primary/5 data-open:border-primary/20"
                >
                  <AccordionTrigger className="hover:no-underline px-3 md:px-4 py-3 gap-3 text-sm md:text-[0.95rem] font-bold text-foreground data-panel-open:text-primary">
                    <span className="flex items-start gap-3 flex-1">
                      <span className="shrink-0 mt-0.5 w-6 h-6 rounded-lg bg-primary/10 text-primary text-[0.7rem] font-black flex items-center justify-center tabular-nums">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">
                        {highlight(faq.question, query)}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="ps-12 pe-4 md:pe-6 pb-4 text-sm md:text-[0.95rem] text-muted-foreground leading-loose whitespace-pre-line">
                    {highlight(faq.answer, query)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>
    </div>
  );
}
