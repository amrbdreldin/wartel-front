"use client";

import { cn } from "@/lib/utils";
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    ChevronRight,
    Clock,
    DownloadCloud, FileText, Library, Pause, Play, PlayCircle, Volume2
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

// ============================================================
// Library Video Detail Page – Nested
// ============================================================

const VIDEO_DATA: Record<string, {
  titleKey: string;
  descKey: string;
  duration: string;
  category: string;
  thumbnail: string;
  materials: { nameKey: string; type: "pdf" | "doc"; size: string }[];
}> = {
  "intro-noon-sakinah": {
    titleKey: "student.introToNoonSakinahRules",
    descKey: "student.detailedExplanation",
    duration: "42:15",
    category: "student.tajweed",
    thumbnail: "https://images.unsplash.com/photo-1584281722880-97686dc66b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    materials: [
      { nameKey: "student.tuhfatAlAtfalColoredVersion", type: "pdf", size: "2.5 MB" },
      { nameKey: "student.introToNoonSakinahRules", type: "doc", size: "320 KB" },
    ],
  },
  "makharij-practical": {
    titleKey: "student.practicalApplicationMakharij",
    descKey: "student.liveRecordingExplanation",
    duration: "58:30",
    category: "student.tajweed",
    thumbnail: "https://images.unsplash.com/photo-1609599006353-e629afabfe14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    materials: [
      { nameKey: "student.tuhfatAlAtfalColoredVersion", type: "pdf", size: "2.5 MB" },
    ],
  },
};

export default function VideoDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === "ar";
  const videoId = params.videoId as string;
  const [playing, setPlaying] = useState(false);

  const video = VIDEO_DATA[videoId] ?? VIDEO_DATA["intro-noon-sakinah"];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href={`/${locale}/student/library`}
          className="flex items-center gap-1.5 font-bold hover:text-primary transition-colors"
        >
          <Library className="w-4 h-4" />
          {t("student.library")}
        </Link>
        <ChevronRight className={cn("w-4 h-4 opacity-40", isRTL && "rotate-180")} />
        <span className="font-medium text-foreground truncate max-w-[200px]">
          {t(video.titleKey as Parameters<typeof t>[0])}
        </span>
      </nav>

      {/* Back button */}
      <Link
        href={`/${locale}/student/library`}
        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
      >
        {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        {t("student.backToLibrary")}
      </Link>

      {/* ── Video Player ───────────────────────────────────── */}
      <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden">
        {/* Player area */}
        <div
          className="relative w-full aspect-video bg-black overflow-hidden cursor-pointer group"
          onClick={() => setPlaying(!playing)}
        >
          <Image
            fill
            sizes="100vw"
            src={video.thumbnail}
            alt={t(video.titleKey as Parameters<typeof t>[0])}
            className={cn(
              "w-full h-full object-cover transition-all duration-700",
              playing ? "opacity-40 scale-105" : "opacity-80 group-hover:opacity-70"
            )}
          />

          {/* Play/pause overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(
              "w-20 h-20 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transition-all duration-300",
              "group-hover:scale-110 group-hover:bg-white/25"
            )}>
              {playing ? (
                <Pause className="w-10 h-10 text-white fill-white" />
              ) : (
                <Play className="w-10 h-10 text-white fill-white ms-1" />
              )}
            </div>
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-4 end-4 bg-black/70 backdrop-blur text-white px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {video.duration}
          </div>
        </div>

        {/* Player controls bar */}
        <div className="bg-slate-950 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setPlaying(!playing)}
            className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors shrink-0"
          >
            {playing ? <Pause className="w-5 h-5 text-white fill-white" /> : <Play className="w-5 h-5 text-white fill-white ms-0.5" />}
          </button>

          {/* Progress bar */}
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className={cn(
              "h-full bg-primary rounded-full transition-all duration-1000",
              playing ? "w-1/3" : "w-0"
            )} />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Volume2 className="w-4 h-4 text-white/60" />
            <span className="text-white/60 text-xs font-mono">{playing ? "14:05" : "00:00"} / {video.duration}</span>
          </div>
        </div>
      </div>

      {/* ── Two-column: Description + Materials ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Description (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20 mb-3 inline-block">
                  {t(video.category as Parameters<typeof t>[0])}
                </span>
                <h1 className="text-2xl font-bold text-foreground leading-snug">
                  {t(video.titleKey as Parameters<typeof t>[0])}
                </h1>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed text-base">
                {t(video.descKey as Parameters<typeof t>[0])}
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                {t("student.videoDetailExpanded")}
              </p>
            </div>

            {/* Key points */}
            <div className="mt-6 space-y-3">
              <h3 className="font-bold text-foreground">{t("student.learningPoints")}</h3>
              <div className="space-y-2">
                {["student.learningPoint1", "student.learningPoint2", "student.learningPoint3"].map((key) => (
                  <div key={key} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <p className="text-sm text-muted-foreground">{t(key as Parameters<typeof t>[0])}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related videos */}
          <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm">
            <h3 className="font-bold text-lg text-foreground mb-5">{t("student.relatedContent")}</h3>
            <div className="space-y-3">
              {[
                { id: "makharij-practical", titleKey: "student.practicalApplicationMakharij" },
                { id: "intro-noon-sakinah", titleKey: "student.introToNoonSakinahRules" },
              ].filter(r => r.id !== videoId).map((related) => (
                <Link
                  key={related.id}
                  href={`/${locale}/student/library/${related.id}`}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <PlayCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-sm truncate">
                      {t(related.titleKey as Parameters<typeof t>[0])}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("student.tajweed")}</p>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 text-muted-foreground shrink-0", isRTL && "rotate-180")} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Materials sidebar (1/3) */}
        <div className="space-y-6">
          <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm">
            <h3 className="font-bold text-lg text-foreground mb-5 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              {t("student.materials")}
            </h3>

            <div className="space-y-3">
              {video.materials.map((mat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-border/40 hover:border-primary/30 hover:bg-muted/30 transition-all group"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    mat.type === "pdf" ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-info-500/10 text-info-600 border border-info-500/20"
                  )}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-xs leading-snug truncate">
                      {t(mat.nameKey as Parameters<typeof t>[0])}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">{mat.size} • {mat.type.toUpperCase()}</p>
                  </div>
                  <button className="w-8 h-8 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all shrink-0">
                    <DownloadCloud className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Session info card */}
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
            <h4 className="font-bold text-primary mb-3">{t("student.videoInfo")}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("student.duration")}</span>
                <span className="font-bold text-foreground">{video.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("common.status")}</span>
                <span className="font-bold text-success-600">{t("student.videoAvailable")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("student.category")}</span>
                <span className="font-bold text-foreground">{t(video.category as Parameters<typeof t>[0])}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
