"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt || "الصورة"}
    >
      <button
        onClick={onClose}
        className="absolute top-4 end-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        aria-label="إغلاق"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className="relative max-w-5xl w-full max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt || "Werd Image"}
          width={1600}
          height={1200}
          className="w-full h-auto object-contain max-h-[90vh]"
          priority
        />
      </div>
    </div>
  );
}
