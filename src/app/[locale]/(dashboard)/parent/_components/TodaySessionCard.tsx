"use client";

import { Video, Calendar, Clock, User, Users } from "lucide-react";
import { useTranslations } from "next-intl";

interface TodaySessionCardProps {
  session: {
    session_id: number;
    group_name: string;
    teacher_name: string;
    scheduled_at: string;
    status: string;
    url: string;
    children_names: string[];
  };
}

export function TodaySessionCard({ session }: TodaySessionCardProps) {
  const t = useTranslations();

  const handleJoinSession = () => {
    if (session.url) {
      window.open(session.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] transition-all duration-500 flex flex-col h-full relative overflow-hidden group">
      {/* Glow effects */}
      <div className="absolute -right-20 -top-20 w-44 h-44 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />
      <div className="absolute -left-20 -bottom-20 w-44 h-44 bg-success-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-success-500/10 transition-colors duration-500" />

      {/* Header section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/20 to-primary/5 text-primary flex items-center justify-center border border-primary/10 shadow-sm">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-foreground line-clamp-2">
              {session.group_name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <User className="w-3.5 h-3.5" />
              <span>{session.teacher_name}</span>
            </div>
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-end">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-500/10 text-success-600 text-[10px] font-bold border border-success-500/20">
            {session.status}
          </span>
        </div>
      </div>

      {/* Children included */}
      {session.children_names && session.children_names.length > 0 && (
        <div className="flex items-center gap-2 mb-4 bg-muted/30 px-3 py-2 rounded-xl">
          <Users className="w-4 h-4 text-primary shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            {session.children_names.map((name, idx) => (
              <span key={idx} className="text-xs font-bold bg-background px-2 py-0.5 rounded-md border border-border/50 text-foreground">
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Time section */}
      <div className="bg-muted/40 border border-border/20 rounded-2xl p-4 mb-5 flex flex-col gap-2">
        <div className="flex items-center gap-2.5 text-xs font-bold text-foreground">
          <Calendar className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate">{session.scheduled_at}</span>
        </div>
      </div>

      {/* Join Button */}
      <div className="mt-auto">
        <button
          onClick={handleJoinSession}
          disabled={!session.url}
          className="block w-full py-3 rounded-xl bg-gradient-to-r from-success-600 to-[#047857] hover:from-[#047857] hover:to-success-600 text-white text-center font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Video className="w-4 h-4 shrink-0" />
          <span>
            {t("parent.joinSessionForChildren") || "دخول الحصة"}
          </span>
        </button>
      </div>
    </div>
  );
}
