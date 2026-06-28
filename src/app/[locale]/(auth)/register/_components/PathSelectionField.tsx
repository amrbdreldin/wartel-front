import { useFormikContext } from "formik";
import {
  BookOpen, Mic, GraduationCap, Bookmark, CheckCircle2, Clock, Calendar, ChevronDown, ChevronUp, Check
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { FormDataEnrollmentType, FormDataTrack } from "@/types/auth.types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface RegisterValues {
  user_type: string;
  enrollment_type_id: string;
  selected_track_id: string;
  selected_group_id: string;
}

// Helper to get styling and metadata for tracks based on their name
function getTrackInfo(trackName: string) {
  const nameLower = trackName.toLowerCase();
  const isMemorization = nameLower.includes("حفظ") || nameLower.includes("memoriz");
  const isTilawah = nameLower.includes("تلاوة") || nameLower.includes("تلقين") || nameLower.includes("recit") || nameLower.includes("correct") || nameLower.includes("تجويد") || nameLower.includes("tajweed");
  const isTeachers = nameLower.includes("معلم") || nameLower.includes("teach") || nameLower.includes("تأهيلي") || nameLower.includes("تأهيل") || nameLower.includes("train");

  if (isMemorization) {
    return {
      icon: BookOpen,
      selectedClass: "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/5",
      unselectedClass: "border-border/60 bg-card hover:border-emerald-300 dark:hover:border-emerald-800 hover:bg-emerald-50/10 dark:hover:bg-emerald-950/5",
      iconBgClass: "bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    };
  }
  if (isTilawah) {
    return {
      icon: Mic,
      selectedClass: "border-cyan-500 bg-cyan-50/30 dark:bg-cyan-950/20 text-cyan-800 dark:text-cyan-400 ring-2 ring-cyan-500/20 shadow-lg shadow-cyan-500/5",
      unselectedClass: "border-border/60 bg-card hover:border-cyan-300 dark:hover:border-cyan-800 hover:bg-cyan-50/10 dark:hover:bg-cyan-950/5",
      iconBgClass: "bg-cyan-100/80 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
    };
  }
  if (isTeachers) {
    return {
      icon: GraduationCap,
      selectedClass: "border-amber-500 bg-amber-50/30 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 ring-2 ring-amber-500/20 shadow-lg shadow-amber-500/5",
      unselectedClass: "border-border/60 bg-card hover:border-amber-300 dark:hover:border-amber-800 hover:bg-amber-50/10 dark:hover:bg-amber-950/5",
      iconBgClass: "bg-amber-100/80 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    };
  }
  return {
    icon: Bookmark,
    selectedClass: "border-primary bg-primary/5 text-primary ring-2 ring-primary/20 shadow-lg shadow-primary/5",
    unselectedClass: "border-border/60 bg-card hover:border-primary/45 hover:bg-primary/5 dark:hover:bg-primary/5",
    iconBgClass: "bg-primary/10 text-primary",
  };
}

export function PathSelectionField({ 
  enrollmentTypes, 
  allTracks = [],
  isLoading 
}: { 
  enrollmentTypes: FormDataEnrollmentType[]; 
  allTracks?: FormDataTrack[];
  isLoading: boolean;
}) {
  const tAuth = useTranslations("auth");
  const tRoot = useTranslations();
  const { setFieldValue, values, errors, touched, submitCount } = useFormikContext<RegisterValues & Record<string, any>>(); // eslint-disable-line @typescript-eslint/no-explicit-any

  // Find selected enrollment type to dynamically get its tracks
  const selectedEnrollmentType = enrollmentTypes.find(
    (type) => String(type.id) === String(values.enrollment_type_id)
  );
  
  // Try selected type's tracks, then all tracks from all enrollment types, then top-level allTracks
  let tracks = selectedEnrollmentType?.tracks ?? [];
  if (tracks.length === 0) {
    const allTracksFromEnrollmentTypes = enrollmentTypes.flatMap((type) => type.tracks || []);
    if (allTracksFromEnrollmentTypes.length > 0) {
      tracks = allTracksFromEnrollmentTypes;
    } else if (allTracks.length > 0) {
      tracks = allTracks;
    }
  }

  // Find selected track to dynamically get its pending groups
  const selectedTrack = tracks.find(
    (track) => String(track.id) === String(values.selected_track_id)
  );
  const pendingGroups = selectedTrack?.pending_groups ?? [];

  const mainGroups = pendingGroups.filter(
    (g) => !g.type || String(g.type).toLowerCase() === "main"
  );
  const spareGroups = pendingGroups.filter(
    (g) => String(g.type).toLowerCase() === "spare"
  );

  const hasSelectedSpare = spareGroups.some(
    (g) => String(g.id) === String(values.selected_group_id)
  );
  const [showSpare, setShowSpare] = useState(hasSelectedSpare);

  useEffect(() => {
    if (!hasSelectedSpare) {
      setShowSpare(false); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [values.selected_track_id, hasSelectedSpare]);


  // Find Academy enrollment type dynamically
  const academyType = enrollmentTypes.find(
    (type) => type.name.toLowerCase() !== "institute" && type.name !== "المعهد"
  ) || enrollmentTypes[0]; // Fallback to first enrollment type if not explicitly found

  // Automatically select Academy enrollment type if it is loaded and not already set
  useEffect(() => {
    if (academyType && !values.enrollment_type_id) {
      setFieldValue("enrollment_type_id", String(academyType.id));
    }
  }, [academyType, values.enrollment_type_id, setFieldValue]);

  const formatSessionTime = (timeStr: string | null) => {
    if (!timeStr) return null;
    const parts = timeStr.split(":");
    if (parts.length < 2) return { time: timeStr, period: "am" };
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? "pm" : "am";
    const displayHours = hours % 12 || 12;
    return {
      time: `${displayHours}:${minutes}`,
      period: ampm
    };
  };

  const renderGroupGrid = (groupsList: typeof pendingGroups) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {groupsList.map((group) => {
        const isSelected = String(group.id) === String(values.selected_group_id);
        
        return (
          <button
            key={group.id}
            type="button"
            onClick={() => setFieldValue("selected_group_id", String(group.id))}
            className={cn(
              "w-full text-start p-4 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden group/card cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-sm",
              isSelected
                ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20 shadow-md shadow-primary/5"
                : "border-border/50 bg-card hover:border-primary/40 hover:bg-muted/30 hover:shadow-md"
            )}
          >
            <div className="flex items-start gap-3 w-full">
              {/* Radio Indicator (start-aligned) */}
              <div className="mt-1 shrink-0">
                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-primary animate-in zoom-in-75 duration-200" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-border/80 group-hover/card:border-primary/45 transition-colors" />
                )}
              </div>

              {/* Group details */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h6 className={cn(
                    "font-black text-sm transition-colors break-words leading-tight",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {group.name}
                  </h6>
                </div>

                {/* Session Days & Times */}
                {group.session_days && group.session_days.length > 0 && (
                  <div className="space-y-1.5 pt-1.5 border-t border-dashed border-border/60">
                    <div className="text-[10px] font-extrabold text-muted-foreground/80 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{tAuth("sessionDays")}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 w-full">
                      {group.session_days.map((sd, idx) => {
                        const formatted = formatSessionTime(sd.time);
                        return (
                          <div
                            key={sd.id || idx}
                            className={cn(
                              "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-colors",
                              isSelected
                                ? "bg-primary/10 border-primary/20 text-primary"
                                : "bg-muted/50 border-border/50 text-muted-foreground group-hover/card:bg-muted group-hover/card:text-foreground"
                            )}
                          >
                            <span className="capitalize">{tAuth(sd.day)}</span>
                            {formatted && (
                              <span className="opacity-85 font-semibold">
                                ({formatted.time} {tAuth(formatted.period)})
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-5 border border-border/50 space-y-5 animate-pulse">
        {/* Track Selection Skeleton */}
        <div>
          <div className="h-4 bg-foreground/10 rounded w-1/4 mb-3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="h-[76px] bg-foreground/5 rounded-2xl border border-border/20" />
            <div className="h-[76px] bg-foreground/5 rounded-2xl border border-border/20" />
          </div>
        </div>

        {/* Group Selection Skeleton */}
        <div>
          <div className="h-4 bg-foreground/10 rounded w-1/5 mb-3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="h-[96px] bg-foreground/5 rounded-xl border border-border/20" />
            <div className="h-[96px] bg-foreground/5 rounded-xl border border-border/20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-5 border border-border/50 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* ── Enrollment Type Selection (Hashed for now) ── */}

      {/* ── Track Selection ── */}
      {tracks.length > 0 && (
        <div id="selected_track_id" className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-sm font-bold text-foreground mb-3">
            {tAuth("chooseTrack")} <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tracks.map((track) => {
              const isSelected = String(track.id) === String(values.selected_track_id);
              const trackInfo = getTrackInfo(track.name);
              const TrackIcon = trackInfo.icon;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => {
                    setFieldValue("selected_track_id", String(track.id));
                    setFieldValue("selected_group_id", "");
                    
                    // Auto-populate enrollment_type_id on track selection
                    const selectedTrackObj = tracks.find((t) => String(t.id) === String(track.id));
                    if (selectedTrackObj && selectedTrackObj.enrollment_type_id) {
                      setFieldValue("enrollment_type_id", String(selectedTrackObj.enrollment_type_id));
                    }
                  }}
                  className={cn(
                    "relative flex items-center gap-4 rounded-2xl border-2 p-4 text-start transition-all duration-300 cursor-pointer group hover:-translate-y-0.5 active:translate-y-0 shadow-sm",
                    isSelected ? trackInfo.selectedClass : trackInfo.unselectedClass
                  )}
                >
                  {/* Icon container */}
                  <div className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-105",
                    trackInfo.iconBgClass
                  )}>
                    <TrackIcon className="w-6 h-6" />
                  </div>

                  {/* Text label */}
                  <div className="flex-1 min-w-0 pr-1 pl-1">
                    <h5 className="text-sm font-black leading-snug text-foreground">
                      {track.name}
                    </h5>
                  </div>

                  {/* Checkmark overlay */}
                  {isSelected && (
                    <div className="absolute top-2.5 end-2.5 text-primary animate-in fade-in zoom-in duration-200">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {errors.selected_track_id && (touched.selected_track_id || submitCount > 0) && (
            <p className="text-xs font-bold text-destructive animate-in fade-in mt-1">{tRoot(errors.selected_track_id as string)}</p>
          )}
        </div>
      )}

      {/* ── Group Selection ── */}
      {values.selected_track_id && (
        <div id="selected_group_id" className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-sm font-bold text-foreground mb-3">
            {tAuth("chooseGroup")} {pendingGroups.length > 0 && <span className="text-destructive">*</span>}
          </label>
          
          {pendingGroups.length === 0 ? (
            <div className="text-center py-6 px-4 bg-muted/10 border border-dashed border-border/60 rounded-xl text-xs text-muted-foreground">
              {tAuth("noGroupsAvailable")}
            </div>
          ) : (
            <div className="space-y-6">
              {mainGroups.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-xs font-black text-muted-foreground/80 uppercase tracking-wider">
                      {tAuth("mainGroups")}
                    </span>
                  </div>
                  {renderGroupGrid(mainGroups)}
                </div>
              )}

              {spareGroups.length > 0 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSpare(!showSpare)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 text-sm font-black text-foreground hover:text-primary transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
                  >
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span>{tAuth("timesNotSuitsMe")}</span>
                    {showSpare ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </button>
                </div>
              )}

              {showSpare && spareGroups.length > 0 && (
                <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span className="text-xs font-black text-amber-600 dark:text-amber-500 uppercase tracking-wider">
                      {tAuth("spareGroups")}
                    </span>
                  </div>
                  {renderGroupGrid(spareGroups)}
                </div>
              )}
            </div>
          )}
          {errors.selected_group_id && (touched.selected_group_id || submitCount > 0) && (
            <p className="text-xs font-bold text-destructive animate-in fade-in mt-1">{tRoot(errors.selected_group_id as string)}</p>
          )}
        </div>
      )}
    </div>
  );
}
