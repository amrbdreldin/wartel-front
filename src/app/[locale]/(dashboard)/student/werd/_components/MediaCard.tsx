"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Volume2,
  Video,
  PlayCircle,
  Link2,
  ImageIcon,
  Play,
  ExternalLink,
  ZoomIn,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { WerdMedia } from "@/types/student.types";

interface MediaCardProps {
  media: WerdMedia;
  onImageClick?: (src: string, alt: string) => void;
}

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

export function MediaCard({ media, onImageClick }: MediaCardProps) {
  const t = useTranslations();

  if (!media) return null;

  const Icon = getMediaIcon(media.type);
  const colorClass = getMediaTypeBg(media.type);

  const getTypeLabel = () => {
    switch (media.type) {
      case "sound":
        return t("student.werd.mediaSound");
      case "video":
        return t("student.werd.mediaVideo");
      case "youtube":
        return t("student.werd.mediaYoutube");
      case "url":
        return t("student.werd.mediaUrl");
      case "image":
        return t("student.werd.mediaImage");
      default:
        return media.type || "";
    }
  };

  const title = media.title || "";
  const fileUrl = media.file || "#";

  if (media.type === "image") {
    return (
      <button
        onClick={() => onImageClick?.(fileUrl, title)}
        className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-300 w-full text-start outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label={`عرض ${title} بحجم كبير`}
      >
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={fileUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/50 rounded-full p-3">
              <ZoomIn className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="absolute bottom-3 start-3 end-3">
            <p className="text-white font-bold text-sm line-clamp-2">{title}</p>
          </div>
        </div>
        <div className={cn("flex items-center gap-2 px-4 py-2.5 border-t border-border/40", colorClass)}>
          <Icon className="w-4 h-4 shrink-0" />
          <span className="text-xs font-semibold">{getTypeLabel()}</span>
        </div>
      </button>
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
            <p className="font-bold text-sm truncate">{title}</p>
            <p className="text-xs opacity-70">{getTypeLabel()}</p>
          </div>
        </div>
        <audio controls src={fileUrl} className="w-full h-10 rounded-xl" aria-label={title} />
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <div className="group rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <video controls src={fileUrl} className="w-full aspect-video bg-black" aria-label={title} />
        <div className={cn("flex items-center gap-2 px-4 py-3 border-t border-border/40", colorClass)}>
          <Icon className="w-4 h-4 shrink-0" />
          <span className="font-bold text-sm flex-1 truncate">{title}</span>
          <span className="text-xs opacity-70">{getTypeLabel()}</span>
        </div>
      </div>
    );
  }

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      id={`werd-media-link-${media.id || Math.random()}`}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border p-5 bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        colorClass
      )}
    >
      <div className="p-3 rounded-xl bg-current/10 shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-sm line-clamp-2 leading-snug">{title}</p>
        <p className="text-xs opacity-70 mt-0.5 flex items-center gap-1">
          <span>{getTypeLabel()}</span>
          {media.type === "youtube" && <Play className="w-3 h-3" />}
        </p>
      </div>
      <ExternalLink className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}
