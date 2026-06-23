import React from "react";
import { Video, X, Check, Copy, Pencil } from "lucide-react";
import { useLocale } from "next-intl";
import { LoadingButton } from "@/components/ui/loading-button";

interface SessionHeaderProps {
  groupName: string;
  subtitle: string;
  isEditingUrl: boolean;
  meetingUrl: string;
  tempUrl: string;
  setTempUrl: (val: string) => void;
  setIsEditingUrl: (val: boolean) => void;
  handleSaveUrl: () => Promise<void>;
  handleCopyLink: () => void;
  copied: boolean;
  savingUrl: boolean;
  t: (key: string, values?: any) => string;
}

export function SessionHeader({
  groupName,
  subtitle,
  isEditingUrl,
  meetingUrl,
  tempUrl,
  setTempUrl,
  setIsEditingUrl,
  handleSaveUrl,
  handleCopyLink,
  copied,
  savingUrl,
  t,
}: SessionHeaderProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
      <div className="min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-foreground truncate">
            {groupName}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground ms-[52px]">
          {subtitle}
        </p>
      </div>

      {/* Meet link pill / inline form */}
      {isEditingUrl ? (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-card border border-border/80 dark:border-border/40 rounded-2xl p-2.5 sm:p-1.5 w-full md:w-auto shadow-md animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20">
              <Video className="w-4 h-4 text-primary" />
            </div>
            <input
              type="url"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1 min-w-0 px-3 py-2 sm:py-1.5 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
            />
          </div>
          <div className="flex items-center gap-2 justify-end shrink-0">
            <LoadingButton
              onClick={handleSaveUrl}
              disabled={savingUrl || !tempUrl.trim()}
              isLoading={savingUrl}
              className="flex-1 sm:flex-initial px-4 py-2 sm:py-1.5 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-black rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-40 whitespace-nowrap min-w-[90px] sm:min-w-[70px] flex items-center justify-center"
            >
              {t("saveLinkBtn") || "Save"}
            </LoadingButton>
            <button
              onClick={() => {
                setIsEditingUrl(false);
                setTempUrl(meetingUrl);
              }}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all active:scale-90 border border-border/80 dark:border-border/30 sm:border-0"
              title={isArabic ? "إلغاء" : "Cancel"}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : meetingUrl ? (
        <div className="flex items-center justify-between md:justify-start gap-3 bg-info-50/70 dark:bg-info-500/10 border border-info-100/80 dark:border-info-100/20 rounded-2xl p-1.5 ps-3 pe-1.5 self-stretch md:self-start shadow-sm hover:shadow-md hover:border-info-200 dark:hover:border-info-500/30 transition-all duration-300 min-w-0 w-full md:w-auto">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-8 h-8 rounded-xl bg-info-100/70 dark:bg-info-500/20 flex items-center justify-center border border-info-200/40 dark:border-info-500/30 shrink-0">
              <Video className="w-4 h-4 text-info-600 dark:text-info-400" />
              <span className="absolute -top-1 -end-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-info-400 dark:bg-info-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-info-500 dark:bg-info-400"></span>
              </span>
            </div>
            <a
              href={meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="text-info-700 dark:text-info-300 text-xs sm:text-sm font-black hover:text-info-800 dark:hover:text-info-200 hover:underline transition-colors truncate max-w-[130px] xs:max-w-[180px] sm:max-w-[220px] md:max-w-[260px] lg:max-w-[320px]"
            >
              {meetingUrl}
            </a>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleCopyLink}
              className="text-info-600 dark:text-info-400 hover:text-info-800 dark:hover:text-info-200 transition-all p-2 hover:bg-info-100 dark:hover:bg-info-500/20 rounded-xl active:scale-90"
              title={t("copyLink")}
              aria-label={t("copyLink")}
            >
              {copied ? (
                <Check className="w-4 h-4 text-success-600 dark:text-success-400 animate-in zoom-in duration-200" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => {
                setTempUrl(meetingUrl);
                setIsEditingUrl(true);
              }}
              className="text-info-600 dark:text-info-400 hover:text-info-800 dark:hover:text-info-200 transition-all p-2 hover:bg-info-100 dark:hover:bg-info-500/20 rounded-xl active:scale-90 flex items-center justify-center"
              title={isArabic ? "تعديل الرابط" : "Edit Link"}
              aria-label={isArabic ? "تعديل الرابط" : "Edit Link"}
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between md:justify-start gap-3 bg-amber-50/70 dark:bg-amber-500/10 border border-amber-100/80 dark:border-amber-500/20 rounded-2xl p-1.5 ps-3 pe-1.5 self-stretch md:self-start shadow-sm hover:shadow-md hover:border-amber-200 dark:hover:border-amber-500/30 transition-all duration-300 min-w-0 w-full md:w-auto animate-in fade-in duration-300">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-8 h-8 rounded-xl bg-amber-100/70 dark:bg-amber-500/20 flex items-center justify-center border border-amber-200/40 dark:border-amber-500/30 shrink-0">
              <Video className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-black truncate">
              {t("noMeetingLinkSet")}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                setTempUrl(meetingUrl);
                setIsEditingUrl(true);
              }}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-all p-2 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-xl active:scale-90 flex items-center justify-center animate-pulse"
              title={t("addMeetingLink")}
              aria-label={t("addMeetingLink")}
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
