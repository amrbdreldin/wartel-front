"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "floating_whatsapp_offset";
const EDGE_GAP = 8;
// Movement (px) before a press counts as a drag instead of a tap
const DRAG_THRESHOLD = 5;

type Offset = { x: number; y: number };

interface FloatingWhatsAppProps {
  whatsappNumber: string;
}

export function FloatingWhatsApp({ whatsappNumber }: FloatingWhatsAppProps) {
  const t = useTranslations("common");
  const [mounted, setMounted] = useState(false);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startOffset: Offset;
    rect: DOMRect;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setOffset(JSON.parse(saved));
    } catch {
      // Ignore unavailable storage or malformed value
    }
  }, []);

  // Keep the button inside the viewport (e.g. saved offset on a smaller screen, rotation)
  useEffect(() => {
    if (!mounted) return;
    const keepInView = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setOffset((prev) => clampOffset(prev, rect, prev));
    };
    keepInView();
    window.addEventListener("resize", keepInView);
    return () => window.removeEventListener("resize", keepInView);
  }, [mounted]);

  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = wrapperRef.current;
    if (!el) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startOffset: offset,
      rect: el.getBoundingClientRect(),
      moved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      drag.moved = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    setOffset(
      clampOffset(
        { x: drag.startOffset.x + dx, y: drag.startOffset.y + dy },
        drag.rect,
        drag.startOffset
      )
    );
  };

  const handlePointerEnd = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag?.moved) return;
    suppressClickRef.current = true;
    setDragging(false);
    setOffset((current) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      } catch {
        // Position just won't persist
      }
      return current;
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // A drag must not open WhatsApp
    if (suppressClickRef.current) {
      e.preventDefault();
      suppressClickRef.current = false;
    }
  };

  if (!mounted || !whatsappNumber) return null;

  const cleanNumber = whatsappNumber.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanNumber}`;


  return (
    <div
      ref={wrapperRef}
      className="fixed bottom-4 sm:bottom-6 inset-s-3 sm:inset-s-6 z-50 animate-in fade-in duration-500"
      style={{ translate: `${offset.x}px ${offset.y}px` }}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClick={handleClick}
        className={cn(
          "flex items-center justify-center gap-2 h-10 w-10 sm:h-12 sm:w-auto sm:px-4 rounded-full",
          "bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white",
          "shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30",
          "hover:-translate-y-1 active:translate-y-0 transition-all duration-300 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]",
          "touch-none select-none",
          dragging ? "cursor-grabbing" : "cursor-grab"
        )}
        aria-label={t("whatsappFloating") || "Contact us on WhatsApp"}
        title={t("whatsappFloating") || "Contact us on WhatsApp"}
      >
        <svg 
          className="w-5 h-5 sm:w-6 sm:h-6 fill-current flex-shrink-0 animate-pulse duration-1000" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}

// `rect` is the element's box when it sat at `rectOffset`
function clampOffset(next: Offset, rect: DOMRect, rectOffset: Offset): Offset {
  const baseLeft = rect.left - rectOffset.x;
  const baseTop = rect.top - rectOffset.y;
  const maxX = window.innerWidth - EDGE_GAP - rect.width - baseLeft;
  const maxY = window.innerHeight - EDGE_GAP - rect.height - baseTop;
  return {
    x: Math.min(Math.max(next.x, EDGE_GAP - baseLeft), maxX),
    y: Math.min(Math.max(next.y, EDGE_GAP - baseTop), maxY),
  };
}
