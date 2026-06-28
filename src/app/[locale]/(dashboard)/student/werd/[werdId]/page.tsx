"use client";

import {
  Scroll,
  ArrowRight,
  ArrowLeft,
  Star,
  BookOpen,
  Volume2,
  Video,
  PlayCircle,
  Link2,
  ImageIcon,
  Play,
  ExternalLink,
  CheckCircle,
  XCircle,
  Calendar,
  GitBranch,
  FileText,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { studentService } from "@/services/student.service";
import type { WerdMedia, WerdRecord } from "@/types/student.types";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ============================================================
// Media Type helpers
// ============================================================

function getMediaIcon(type: WerdMedia["type"]) {
  switch (type) {
    case "sound":
      return Volume2;
    case "video":
      return Video;
    case "youtube":
      return PlayCircle;
    case "url":
      return Link2;
    case "image":
      return ImageIcon;
    default:
      return FileText;
  }
}

function getMediaTypeBg(type: WerdMedia["type"]) {
  switch (type) {
    case "sound":
      return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200/40 dark:border-green-800/40";
    case "video":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/40 dark:border-blue-800/40";
    case "youtube":
      return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200/40 dark:border-red-800/40";
    case "url":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/40 dark:border-purple-800/40";
    case "image":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/40 dark:border-amber-800/40";
    default:
      return "bg-muted/50 text-muted-foreground border-border/40";
  }
}

// ============================================================
// MediaCard Component
// ============================================================

function MediaCard({ media, t }: { media: WerdMedia; t: ReturnType<typeof useTranslations> }) {
  const Icon = getMediaIcon(media.type);
  const colorClass = getMediaTypeBg(media.type);

  const getTypeLabel = () => {
    switch (media.type) {
      case "sound": return t("student.werd.mediaSound");
      case "video": return t("student.werd.mediaVideo");
      case "youtube": return t("student.werd.mediaYoutube");
      case "url": return t("student.werd.mediaUrl");
      case "image": return t("student.werd.mediaImage");
      default: return media.type;
    }
  };

  if (media.type === "image") {
    return (
      <div className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={media.file}
            alt={media.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 start-3 end-3">
            <p className="text-white font-bold text-sm line-clamp-2">{media.title}</p>
          </div>
        </div>
        <div className={cn("flex items-center gap-2 px-4 py-2.5 border-t border-border/40", colorClass)}>
          <Icon className="w-4 h-4 shrink-0" />
          <span className="text-xs font-semibold">{getTypeLabel()}</span>
        </div>
      </div>
    );
  }

  if (media.type === "sound") {
    return (
      <div className={cn("rounded-2xl border p-5 bg-card shadow-sm hover:shadow-md transition-all duration-300 space-y-3", colorClass)}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-500/20">
            <Volume2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm truncate">{media.title}</p>
            <p className="text-xs opacity-70">{getTypeLabel()}</p>
          </div>
        </div>
        <audio
          controls
          src={media.file}
          className="w-full h-10 rounded-xl"
          aria-label={media.title}
        />
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <div className="group rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <video
          controls
          src={media.file}
          className="w-full aspect-video bg-black"
          aria-label={media.title}
        />
        <div className={cn("flex items-center gap-2 px-4 py-3 border-t border-border/40", colorClass)}>
          <Icon className="w-4 h-4 shrink-0" />
          <span className="font-bold text-sm flex-1 truncate">{media.title}</span>
          <span className="text-xs opacity-70">{getTypeLabel()}</span>
        </div>
      </div>
    );
  }

  // youtube / url — link cards
  return (
    <a
      href={media.file}
      target="_blank"
      rel="noopener noreferrer"
      id={`werd-media-link-${media.id}`}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border p-5 bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        colorClass
      )}
    >
      <div className="p-3 rounded-xl bg-current/10 shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-sm line-clamp-2 leading-snug">{media.title}</p>
        <p className="text-xs opacity-70 mt-0.5 flex items-center gap-1">
          <span>{getTypeLabel()}</span>
          {media.type === "youtube" && <Play className="w-3 h-3" />}
        </p>
      </div>
      <ExternalLink className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

// ============================================================
// Werd Description / Similar formatted text
// ============================================================

function FormattedText({ text }: { text: string }) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  return (
    <div className="space-y-1.5 text-sm leading-relaxed text-foreground/80 font-medium whitespace-pre-line direction-auto">
      {lines.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  );
}

// ============================================================
// Section Card wrapper
// ============================================================

function SectionCard({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm space-y-5", className)}>
      <div className="flex items-center gap-3 pb-4 border-b border-border/40">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="font-bold text-lg text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ============================================================
// Main Werd Details Page
// ============================================================

export default function WerdDetailsPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const werdId = params.werdId as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["student-werds"],
    queryFn: () => studentService.getWerds(),
  });

  const werds: WerdRecord[] = data?.data || [];
  const werd = werds.find((w) => String(w.id) === werdId);

  const isRtl = locale === "ar";

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Hero skeleton */}
        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden h-64" />
        {/* Content skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border/50 rounded-3xl p-8 h-40" />
        ))}
      </div>
    );
  }

  if (isError || !werd) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="p-5 bg-destructive/10 rounded-full">
          <XCircle className="w-12 h-12 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-foreground">{t("common.error")}</h2>
        <p className="text-muted-foreground">{t("common.errorOccurred")}</p>
        <button
          onClick={() => router.push(`/${locale}/student/werd`)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors"
        >
          {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          {t("student.werd.backToList")}
        </button>
      </div>
    );
  }

  const mediaByType = {
    image: werd.media.filter((m) => m.type === "image"),
    sound: werd.media.filter((m) => m.type === "sound"),
    video: werd.media.filter((m) => m.type === "video"),
    youtube: werd.media.filter((m) => m.type === "youtube"),
    url: werd.media.filter((m) => m.type === "url"),
  };

  const hasMedia = werd.media.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

      {/* Back Button */}
      <div>
        <button
          id="werd-back-btn"
          onClick={() => router.push(`/${locale}/student/werd`)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group outline-none focus-visible:text-foreground"
        >
          {isRtl ? (
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          ) : (
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          )}
          {t("student.werd.backToList")}
        </button>
      </div>

      {/* ── Hero Card ── */}
      <div className="relative bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
        {/* Background image with overlay */}
        {werd.image && (
          <div className="absolute inset-0">
            <Image
              src={werd.image}
              alt={werd.title}
              fill
              className="object-cover opacity-20 blur-sm scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-card/80 via-card/70 to-card" />
          </div>
        )}

        <div className="relative z-10 p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Thumbnail */}
            {werd.image ? (
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-border/60 shadow-lg shrink-0">
                <Image
                  src={werd.image}
                  alt={werd.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
                <Scroll className="w-14 h-14 text-primary/60" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 space-y-3 min-w-0">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight">
                {werd.title}
              </h1>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-sm font-semibold">
                  <Star className="w-3.5 h-3.5" />
                  {werd.track_name}
                </span>

                <span className="inline-flex items-center gap-1.5 bg-muted/60 text-muted-foreground border border-border/40 px-3 py-1.5 rounded-full text-sm font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(werd.created_at).toLocaleDateString("ar-EG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>

                {werd.have_exams ? (
                  <span className="inline-flex items-center gap-1.5 bg-warning-100/60 text-warning-700 dark:bg-warning-950/30 dark:text-warning-400 border border-warning-200/40 px-3 py-1.5 rounded-full text-sm font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {t("student.werd.hasExams")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-muted/50 text-muted-foreground border border-border/40 px-3 py-1.5 rounded-full text-sm font-semibold">
                    <XCircle className="w-3.5 h-3.5" />
                    {t("student.werd.noExams")}
                  </span>
                )}

                {werd.media.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200/40 dark:border-green-800/40 px-3 py-1.5 rounded-full text-sm font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    {werd.media.length} {t("student.werd.media")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (description + similar) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Description */}
          <SectionCard icon={BookOpen} title={t("student.werd.description")}>
            {werd.description ? (
              <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-border/60 scrollbar-track-transparent pr-1">
                <FormattedText text={werd.description} />
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                {t("student.werd.noDescription")}
              </p>
            )}
          </SectionCard>

          {/* Similar Verses */}
          {werd.similar && (
            <SectionCard icon={GitBranch} title={t("student.werd.similar")}>
              <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-border/60 scrollbar-track-transparent pr-1">
                <FormattedText text={werd.similar} />
              </div>
            </SectionCard>
          )}

          {/* Tdbor / Reflection */}
          {werd.tdbor && (
            <SectionCard icon={Sparkles} title={t("student.werd.tdbor")}>
              <FormattedText text={werd.tdbor} />
            </SectionCard>
          )}
        </div>

        {/* Right column (media) */}
        <div className="space-y-6">
          <SectionCard icon={Play} title={t("student.werd.media")}>
            {hasMedia ? (
              <div className="space-y-4">
                {/* Images */}
                {mediaByType.image.map((m) => (
                  <MediaCard key={m.id} media={m} t={t} />
                ))}
                {/* Audio */}
                {mediaByType.sound.map((m) => (
                  <MediaCard key={m.id} media={m} t={t} />
                ))}
                {/* Videos */}
                {mediaByType.video.map((m) => (
                  <MediaCard key={m.id} media={m} t={t} />
                ))}
                {/* YouTube */}
                {mediaByType.youtube.map((m) => (
                  <MediaCard key={m.id} media={m} t={t} />
                ))}
                {/* URL Links */}
                {mediaByType.url.map((m) => (
                  <MediaCard key={m.id} media={m} t={t} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic text-center py-4">
                {t("student.werd.noMedia")}
              </p>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
