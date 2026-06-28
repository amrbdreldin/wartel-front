"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowLeft,
  XCircle,
  Play,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";

import { studentService } from "@/services/student.service";
import type { WerdRecord } from "@/types/student.types";
import { cn } from "@/lib/utils";

// Sub-components
import { ImageLightbox } from "../_components/ImageLightbox";
import { WerdHero } from "../_components/WerdHero";
import { WerdDetailsContent } from "../_components/WerdDetailsContent";
import { MediaCard } from "../_components/MediaCard";

export default function WerdDetailsPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const werdId = params.werdId as string;

  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["student-werds"],
    queryFn: () => studentService.getWerds(),
  });

  const werds: WerdRecord[] = data?.data || [];
  const werd = werds.find((w) => String(w?.id) === werdId);

  const isRtl = locale === "ar";

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden h-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border/50 rounded-3xl p-8 h-80" />
          </div>
          <div className="space-y-6">
            <div className="bg-card border border-border/50 rounded-3xl p-8 h-80" />
          </div>
        </div>
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

  const mediaList = werd?.media || [];
  const imageMedia = mediaList.filter((m) => m?.type === "image");
  const soundMedia = mediaList.filter((m) => m?.type === "sound");
  const videoMedia = mediaList.filter((m) => m?.type === "video");
  const youtubeMedia = mediaList.filter((m) => m?.type === "youtube");
  const urlMedia = mediaList.filter((m) => m?.type === "url");

  // Non-image media items
  const nonImageMedia = [
    ...soundMedia,
    ...videoMedia,
    ...youtubeMedia,
    ...urlMedia,
  ];

  return (
    <>
      {/* Lightbox Modal */}
      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}

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

        {/* Werd Hero Section */}
        <WerdHero
          werd={werd}
          onImageClick={(src, alt) => setLightbox({ src, alt })}
        />

        {/* Details and Media Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content (Description, Similar verses, Reflection) */}
          <div className="lg:col-span-2">
            <WerdDetailsContent
              description={werd?.description}
              similar={werd?.similar}
              tdbor={werd?.tdbor}
            />
          </div>

          {/* Media Sidebar */}
          <div className="space-y-6">
            {/* Clickable standalone image card if available */}
            {werd?.image && (
              <button
                id="werd-main-image-card"
                onClick={() => setLightbox({ src: werd.image!, alt: werd.title || "" })}
                className="group w-full relative overflow-hidden rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="عرض الصورة بحجم كبير"
              >
                <div className="relative w-full aspect-video">
                  <Image
                    src={werd.image}
                    alt={werd.title || "Werd Image"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/50 rounded-full p-4">
                      <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Media list card */}
            <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Play className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-bold text-lg text-foreground">{t("student.werd.media")}</h2>
              </div>

              {mediaList.length > 0 ? (
                <div className="space-y-4">
                  {/* Images inside the media array */}
                  {imageMedia.map((m) => (
                    <MediaCard
                      key={m?.id || Math.random()}
                      media={m}
                      onImageClick={(src, alt) => setLightbox({ src, alt })}
                    />
                  ))}
                  {/* Audio */}
                  {soundMedia.map((m) => (
                    <MediaCard key={m?.id || Math.random()} media={m} />
                  ))}
                  {/* Videos */}
                  {videoMedia.map((m) => (
                    <MediaCard key={m?.id || Math.random()} media={m} />
                  ))}
                  {/* YouTube */}
                  {youtubeMedia.map((m) => (
                    <MediaCard key={m?.id || Math.random()} media={m} />
                  ))}
                  {/* URLs */}
                  {urlMedia.map((m) => (
                    <MediaCard key={m?.id || Math.random()} media={m} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic text-center py-4">
                  {t("student.werd.noMedia")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
