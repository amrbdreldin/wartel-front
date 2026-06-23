"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export function PromoBanner() {
  const t = useTranslations();
  const [courseRegistered, setCourseRegistered] = useState(false);

  return (
    <div className="relative rounded-3xl p-8 mb-8 text-white overflow-hidden shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 gradient-primary">
      <div
        className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url('/pattern.png')", backgroundRepeat: "repeat", backgroundSize: "120px" }}
      />
      <div className="absolute -end-20 -top-20 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 text-center md:text-start">
        <h2 className="text-2xl font-bold mb-2 flex justify-center md:justify-start items-center gap-2">
          {t("student.availableNow")} {t("student.tuhfaCourse")}
        </h2>
        <p className="text-white/80 font-medium">
          {t("student.tuhfaCourseDesc")}
        </p>
      </div>

      <div className="relative z-10 w-full md:w-auto shrink-0">
        <button
          disabled={courseRegistered}
          onClick={() => setCourseRegistered(true)}
          className="w-full md:w-auto bg-white text-primary hover:bg-neutral-50 font-bold px-8 py-3 rounded-full shadow-lg transition-all hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/50 disabled:bg-white/50 disabled:cursor-not-allowed"
        >
          {courseRegistered ? t("student.applied") : t("student.applyForLiveCourse")}
        </button>
      </div>
    </div>
  );
}
