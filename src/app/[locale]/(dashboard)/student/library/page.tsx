"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { studentService } from "@/services/student.service";
import type { LibraryResource } from "@/types/student.types";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  DownloadCloud,
  FileText,
  FolderOpen,
  Library,
  Loader2,
  Play,
  Video,
  X,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

// ============================================================
// Helpers
// ============================================================

type FilterType = "all" | "pdf" | "video";

function isPdf(r: LibraryResource) {
  return r.content_type_name === "pdf" || r.content_type_id === "1";
}

function getYoutubeId(url: string) {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtube.com") && urlObj.pathname === "/watch") {
      return urlObj.searchParams.get("v");
    }
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    }
  } catch (e) {
    // Ignore invalid URLs
  }
  return null;
}

function getEmbedUrl(url: string) {
  const ytId = getYoutubeId(url);
  if (ytId) return `https://www.youtube.com/embed/${ytId}`;
  return url;
}

// ============================================================
// Video Modal
// ============================================================

function VideoModal({
  resource,
  onClose,
}: {
  resource: LibraryResource;
  onClose: () => void;
}) {
  const t = useTranslations();

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={resource.title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full h-full max-w-[95vw] bg-card rounded-3xl border border-border/60 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-300">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 border-b border-border/50 shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg text-foreground truncate">{resource.title}</h2>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {resource.track?.name && (
                <span className="text-xs bg-muted px-2.5 py-0.5 rounded-full border border-border/40 text-muted-foreground">
                  {resource.track.name}
                </span>
              )}
              {resource.course?.name && (
                <span className="text-xs bg-muted px-2.5 py-0.5 rounded-full border border-border/40 text-muted-foreground">
                  {resource.course.name}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-9 h-9 rounded-full bg-muted hover:bg-destructive hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label={t("common.close")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Player — video or audio */}
        <div className="bg-black flex-1 relative overflow-hidden flex flex-col justify-center">
          {resource.resource_url.match(/\.(mp4|webm|ogg)(\?|$)/i) ? (
            // Native video
            <video
              src={resource.resource_url}
              controls
              autoPlay
              className="w-full h-full object-contain outline-none"
            />
          ) : resource.resource_url.match(/\.(mp3|wav|aac|ogg)(\?|$)/i) ? (
            // Audio file
            <div className="flex flex-col items-center justify-center py-16 gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="w-10 h-10 text-primary fill-current ms-1" />
              </div>
              <audio
                src={resource.resource_url}
                controls
                autoPlay
                className="w-full max-w-md"
              />
            </div>
          ) : (
            // Embedded iframe (YouTube / external)
            <iframe
              src={getEmbedUrl(resource.resource_url)}
              title={resource.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Resource Card
// ============================================================

function ResourceCard({
  resource,
  onPlay,
}: {
  resource: LibraryResource;
  onPlay: (r: LibraryResource) => void;
}) {
  const t = useTranslations();
  const pdf = isPdf(resource);
  const ytId = !pdf ? getYoutubeId(resource.resource_url) : null;

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If it's a same-origin URL, default download attribute works fine
    if (!resource.resource_url.startsWith("http")) return;

    e.preventDefault();
    try {
      const response = await fetch(resource.resource_url);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${resource.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Fallback: open in new tab if fetch fails (e.g., due to CORS)
      window.open(resource.resource_url, "_blank");
    }
  };

  return (
    <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative group">
      {/* Badge */}
      <span
        className={cn(
          "absolute top-4 end-4 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-black z-10 flex items-center gap-1.5",
          pdf ? "bg-primary/90" : "bg-destructive/90"
        )}
      >
        {pdf ? (
          <>
            <FileText className="w-3 h-3" />
            {t("student.pdfBooklet")}
          </>
        ) : (
          <>
            <Video className="w-3 h-3" />
            {t("student.videoLecture")}
          </>
        )}
      </span>

      {/* Thumbnail / Preview */}
      {pdf ? (
        <div className="relative h-40 bg-gradient-to-br from-primary/5 to-primary/15 flex flex-col items-center justify-center text-primary border-b border-border/50">
          <BookOpen className="w-12 h-12 group-hover:scale-110 transition-transform duration-300" />
          <span className="mt-2 text-xs font-semibold opacity-50">{t("student.eBook")}</span>
        </div>
      ) : (
        <button
          onClick={() => onPlay(resource)}
          className="relative h-40 w-full bg-gradient-to-br from-muted to-muted/70 flex items-center justify-center overflow-hidden border-b border-border/50 cursor-pointer"
          aria-label={`${t("student.watchLecture")}: ${resource.title}`}
        >
          {ytId && (
            <Image
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
              alt={resource.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
          <span className="relative w-14 h-14 bg-white/90 text-primary rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-white transition-all duration-300 z-10">
            <Play className="w-7 h-7 fill-current ms-1" />
          </span>
        </button>
      )}

      {/* Body */}
      <div className="p-5 flex flex-col flex-grow gap-3">
        <h5 className="font-bold text-sm text-foreground leading-snug line-clamp-2">{resource.title}</h5>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
          {resource.track?.name && (
            <span className="bg-muted px-2 py-0.5 rounded-full border border-border/40">
              {resource.track.name}
            </span>
          )}
          {resource.course?.name && (
            <span className="bg-muted px-2 py-0.5 rounded-full border border-border/40">
              {resource.course.name}
            </span>
          )}
        </div>

        {/* CTA */}
        {pdf ? (
          <a
            href={resource.resource_url}
            onClick={handleDownload}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground font-bold hover:opacity-90 active:scale-95 rounded-xl py-2.5 transition-all cursor-pointer text-sm"
          >
            <DownloadCloud className="w-4 h-4" />
            {t("student.downloadBooklet")}
          </a>
        ) : (
          <button
            onClick={() => onPlay(resource)}
            className="mt-auto flex items-center justify-center gap-2 w-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-primary-foreground rounded-xl py-2.5 transition-colors cursor-pointer text-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            {t("student.watchLecture")}
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Page
// ============================================================

export default function LibraryPage() {
  const t = useTranslations();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeVideo, setActiveVideo] = useState<LibraryResource | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-library"],
    queryFn: () => studentService.getLibrary(),
  });

  const allResources = useMemo<LibraryResource[]>(() => {
    if (!data?.data?.resources) return [];
    return Object.values(data.data.resources).flat();
  }, [data]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return allResources;
    if (activeFilter === "pdf") return allResources.filter(isPdf);
    return allResources.filter((r) => !isPdf(r));
  }, [allResources, activeFilter]);

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: t("common.all") },
    { id: "video", label: t("student.videoLecture") },
    { id: "pdf", label: t("student.pdfBooklet") },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Page Header */}
        <div className="pb-6 border-b border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-3">
          <Skeleton className="w-16 h-10 rounded-full" />
          <Skeleton className="w-28 h-10 rounded-full" />
          <Skeleton className="w-24 h-10 rounded-full" />
        </div>

        {/* Grid of Resource Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm flex flex-col relative h-[360px]">
              {/* Thumbnail Area */}
              <Skeleton className="h-40 w-full rounded-t-3xl" />
              {/* Card Body */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    const err = error as { response?: { data?: { message?: string } } };
    const apiErrorMsg = err.response?.data?.message || (error as Error)?.message;
    return (
      <div className="text-center py-12 text-destructive">
        {apiErrorMsg || t("common.errorOccurred") || t("common.error")}
      </div>
    );
  }

  return (
    <>
      {/* Inline Video Modal */}
      {activeVideo && !isPdf(activeVideo) && (
        <VideoModal resource={activeVideo} onClose={() => setActiveVideo(null)} />
      )}

      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Page Header */}
        <div className="pb-6 border-b border-border/50">
          <h3 className="text-2xl font-bold flex items-center gap-3 text-foreground mb-1">
            <Library className="h-7 w-7 text-accent" />
            {t("student.educationalLibrary")}
          </h3>
          <p className="text-muted-foreground text-sm">{t("student.librarySubtitle")}</p>
        </div>

        {/* Filter Pills */}
        <div className="w-full overflow-x-auto scrollbar-hide pb-1">
          <ul className="flex gap-3 min-w-max text-sm font-bold">
            {filters.map((f) => {
              const count =
                f.id === "all"
                  ? allResources.length
                  : f.id === "pdf"
                  ? allResources.filter(isPdf).length
                  : allResources.filter((r) => !isPdf(r)).length;

              return (
                <li key={f.id}>
                  <button
                    onClick={() => setActiveFilter(f.id)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 border cursor-pointer",
                      activeFilter === f.id
                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                        : "border-transparent text-muted-foreground hover:bg-card hover:border-border/50 hover:text-foreground"
                    )}
                  >
                    {f.label}
                    {count > 0 && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-black",
                          activeFilter === f.id
                            ? "bg-white/20 text-white"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Grid / Empty */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 px-4 bg-card rounded-3xl border border-dashed border-border text-muted-foreground animate-in fade-in zoom-in-95 duration-400">
            <FolderOpen className="w-20 h-20 mx-auto mb-4 opacity-40" />
            <h5 className="font-bold text-foreground text-xl mb-2">
              {t("student.noContentCurrently")}
            </h5>
            <p className="text-sm">{t("student.libraryEmptyDesc")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 fade-in duration-400">
            {filtered.map((resource) => (
              <ResourceCard
                key={resource.resource_id}
                resource={resource}
                onPlay={setActiveVideo}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

