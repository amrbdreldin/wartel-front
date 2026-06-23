import React from "react";
import { Link2, CheckCircle2, Save, Sparkles, Users, ChevronRight } from "lucide-react";
import Link from "next/link";

interface TodaySessionsProps {
  sessions: any[];
  meetLinks: Record<string, string>;
  setMeetLinks: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  savedLinks: Record<string, boolean>;
  savingLinks: Record<string, boolean>;
  handleSaveLink: (group: any) => Promise<void>;
  locale: string;
  t: (key: string, values?: any) => string;
}

export function TodaySessions({
  sessions,
  meetLinks,
  setMeetLinks,
  savedLinks,
  savingLinks,
  handleSaveLink,
  locale,
  t,
}: TodaySessionsProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h2 className="text-xl font-black text-foreground">{t("todayHalaqas")}</h2>
          <p className="text-sm text-muted-foreground">{t("upcomingSessionsNote")}</p>
        </div>
      </div>

      {sessions.length > 0 ? (
        <div className="grid gap-5">
          {sessions.map((group: any) => {
            const hasUrl = !!(group.url?.trim() || group.meeting_link?.trim());

            return (
              <div
                key={group.id}
                className="group relative bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
              >
                {/* Subtle glow top-right */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-0" />

                <div className="relative z-10 flex flex-col lg:flex-row gap-6">
                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-black px-3 py-1 rounded-full border border-primary/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        {t("today")}
                      </span>
                      {group.track_name && (
                        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full font-medium">
                          {group.track_name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-foreground">{group.group_name ?? group.name}</h3>
                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                      <Users className="w-4 h-4" />{" "}
                      {t("studentCountLabel", { count: group.student_count || 0 })}
                    </p>
                  </div>

                  {/* Meet Link + Actions */}
                  <div className="lg:w-[500px] space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1 w-full">
                        <Link2 className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          id={`meet-link-${group.id}`}
                          type="url"
                          value={meetLinks[group.id] ?? group.url ?? group.meeting_link ?? ""}
                          onChange={(e) => setMeetLinks((p) => ({ ...p, [group.id]: e.target.value }))}
                          placeholder={t("linkPlaceholder")}
                          className="w-full ps-10 pe-4 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground"
                        />
                      </div>
                      <button
                        onClick={() => handleSaveLink(group)}
                        disabled={!meetLinks[group.id]?.trim() || savingLinks[group.id]}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground text-sm font-bold rounded-xl border border-border transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap w-full sm:w-auto"
                      >
                        {savedLinks[group.id] ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-success-500" /> {t("linkSaved")}
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" /> {savingLinks[group.id] ? "..." : t("saveLinkBtn")}
                          </>
                        )}
                      </button>
                    </div>

                    {!hasUrl ? (
                      <button
                        disabled
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-muted text-muted-foreground font-black text-sm rounded-2xl border border-border cursor-not-allowed opacity-60"
                        title={t("meetingLinkRequired")}
                      >
                        <span>{t("startSession")}</span>
                        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                      </button>
                    ) : (
                      <Link
                        href={`/${locale}/teacher/sessions?session=${group.session_id || group.id}&group=${group.group_id || group.id}`}
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <span>{t("startSession")}</span>
                        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card border border-border/80 border-dashed rounded-3xl p-8 text-center text-muted-foreground shadow-sm">
          {t("noSessionsToday")}
        </div>
      )}
    </section>
  );
}
