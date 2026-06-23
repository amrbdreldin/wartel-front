"use client";

import { useTranslations } from "next-intl";
import { User, CheckCircle2, UserPlus } from "lucide-react";

interface ParentHeaderProps {
  userName?: string;
  onAddChildClick: () => void;
}

export function ParentHeader({ userName, onAddChildClick }: ParentHeaderProps) {
  const t = useTranslations("parent");
  const displayName = userName || t("unknownUser");

  return (
    <div className="bg-primary hover:bg-primary/95 transition-colors duration-700 text-white pt-8 pb-8 md:pt-10 md:pb-10 rounded-b-[2rem] relative overflow-hidden shadow-lg -mx-4 md:-mx-8 px-4 md:px-8 -mt-8 mb-8 border-b border-primary/20">
      {/* Animated Abstract Backgrounds */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay z-0"></div>
      <div className="absolute -top-[30%] rtl:-left-[10%] ltr:-right-[10%] w-[70%] h-[150%] bg-gradient-to-b from-white/10 to-transparent rtl:-rotate-12 ltr:rotate-12 transform origin-top-right z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-black/20 to-transparent z-0 pointer-events-none"></div>

      {/* Glowing Orbs */}
      <div className="absolute top-10 right-20 w-32 h-32 bg-secondary/30 rounded-full blur-[40px] z-0 animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-success-400/20 rounded-full blur-[50px] z-0 delay-1000 animate-pulse"></div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-5 max-w-5xl mx-auto mt-2 px-4">
        {/* Welcome Block */}
        <div className="flex items-center gap-4 md:gap-6 text-center md:text-start w-full md:w-auto flex-col sm:flex-row">
          {/* Avatar Hexagon or Premium Circle */}
          <div className="relative group">
            <div className="absolute inset-0 bg-secondary rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-white to-primary-50 text-primary-800 flex items-center justify-center shadow-xl border-4 border-white/20 shrink-0 transform group-hover:scale-105 transition-transform duration-500">
              <User className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10" />
              <div className="absolute -bottom-2 -right-2 bg-success-500 text-white w-8 h-8 flex items-center justify-center rounded-full border-2 border-white shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="text-center sm:text-start">
            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white/90 mb-2 md:mb-3 border border-white/20 shadow-sm uppercase tracking-wider">
              {t("dashboard")}
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 md:mb-3 tracking-tight text-white drop-shadow-md flex flex-wrap justify-center sm:justify-start gap-2">
              {t("welcomeName", { name: displayName })}
            </h3>
            <p className="text-primary-50 font-medium text-xs sm:text-sm md:text-base opacity-90 flex items-center justify-center sm:justify-start gap-2 bg-black/20 w-fit sm:mx-0 mx-auto px-3 sm:px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success-500"></span>
              </span>
              {t("liveUpdates")}
            </p>
          </div>
        </div>

        {/* Action CTA Block */}
        <div className="flex w-full md:w-auto justify-center md:justify-end">
          <button
            onClick={onAddChildClick}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-5 sm:px-6 py-2.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2 focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <UserPlus className="w-4 h-4" />
            {t("addChild")}
          </button>
        </div>
      </div>
    </div>
  );
}
