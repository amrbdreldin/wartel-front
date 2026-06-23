import React from "react";
import { BookOpen, Users } from "lucide-react";

interface GroupBannerProps {
  trackName: string;
  groupName: string;
  totalStudents: number;
  t: (key: string, values?: any) => string;
}

export function GroupBanner({ trackName, groupName, totalStudents, t }: GroupBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-xl bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 md:p-8 text-white border border-emerald-700/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]" />
      <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-emerald-300">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{trackName}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">{groupName}</h1>
        </div>

        <div className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-200/80 uppercase">{t("totalStudents")}</p>
            <p className="text-2xl font-black text-white">{totalStudents}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
