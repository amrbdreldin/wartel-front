"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ExternalLink,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  GraduationCap,
} from "lucide-react";
import { libraryService } from "@/services/library.service";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PublicLibraryClient() {
  const t = useTranslations("publicLibrary");

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 350);
  const [contentTypeId, setContentTypeId] = useState<string>("");
  const [trackId, setTrackId] = useState<string>("");
  const [courseId, setCourseId] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, contentTypeId, trackId, courseId]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["public-library", { search: debouncedSearch, contentTypeId, trackId, courseId, page }],
    queryFn: () =>
      libraryService.getPublicLibrary({
        search: debouncedSearch || undefined,
        content_type_id: contentTypeId || undefined,
        track_id: trackId || undefined,
        course_id: courseId || undefined,
        per_page: 12,
        page,
      }),
  });

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const filters = data?.filters;

  const hasActiveFilters = Boolean(searchInput || contentTypeId || trackId || courseId);

  const clearFilters = () => {
    setSearchInput("");
    setContentTypeId("");
    setTrackId("");
    setCourseId("");
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 pt-28 pb-16 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold">
          <BookOpen className="h-4 w-4" />
          <span>{t("badge")}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-foreground">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 md:p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-6">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="ps-10 h-11 rounded-xl"
            />
          </div>

          {/* Track Select */}
          <div className="md:col-span-3">
            <select
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label={t("allTracks")}
            >
              <option value="">{t("allTracks")}</option>
              {filters?.tracks.map((tr) => (
                <option key={tr.id} value={String(tr.id)}>
                  {tr.name}
                </option>
              ))}
            </select>
          </div>

          {/* Course Select */}
          <div className="md:col-span-3">
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label={t("allCourses")}
            >
              <option value="">{t("allCourses")}</option>
              {filters?.courses.map((co) => (
                <option key={co.id} value={String(co.id)}>
                  {co.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Type Pills + Clear */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground me-1">
              <Filter className="h-3.5 w-3.5" />
            </span>
            <button
              type="button"
              onClick={() => setContentTypeId("")}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer",
                contentTypeId === ""
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {t("allTypes")}
            </button>
            {filters?.content_types.map((ct) => (
              <button
                key={ct.id}
                type="button"
                onClick={() => setContentTypeId(String(ct.id))}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer",
                  contentTypeId === String(ct.id)
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {ct.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {pagination && (
              <span className="text-xs text-muted-foreground font-medium">
                {t("totalResources")}: <strong className="text-foreground">{pagination.total}</strong>
              </span>
            )}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs gap-1">
                <X className="h-3.5 w-3.5" />
                {t("clearFilters")}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-52 rounded-2xl border border-border/50 bg-card/60 animate-pulse p-6 space-y-4"
            >
              <div className="h-5 w-24 rounded-full bg-muted" />
              <div className="h-6 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
              <div className="h-10 w-full rounded-xl bg-muted mt-auto" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center space-y-3">
          <p className="text-destructive font-semibold">{t("errorLoading")}</p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center space-y-3">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <h3 className="text-lg font-bold text-foreground">{t("emptyTitle")}</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{t("emptyDesc")}</p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="mt-2">
              {t("clearFilters")}
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.resource_id}
                className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="gap-1.5 font-bold">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      {item.content_type_name || "Resource"}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {item.track && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1">
                        <Layers className="h-3 w-3 text-primary/70" />
                        {item.track.name}
                      </span>
                    )}
                    {item.course && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1">
                        <GraduationCap className="h-3 w-3 text-primary/70" />
                        {item.course.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-border/40">
                  <a
                    href={item.resource_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
                  >
                    <span>{t("openResource")}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="gap-1"
              >
                <ChevronRight className="h-4 w-4 rtl:rotate-0 ltr:rotate-180" />
                {t("prevPage")}
              </Button>
              <span className="text-sm font-medium text-muted-foreground">
                {t("pageOf", { page: pagination.current_page, total: pagination.last_page })}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page >= pagination.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="gap-1"
              >
                {t("nextPage")}
                <ChevronLeft className="h-4 w-4 rtl:rotate-0 ltr:rotate-180" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
