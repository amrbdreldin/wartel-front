"use client";

import { studentService } from "@/services/student.service";
import { useQueryClient } from "@tanstack/react-query";
import { 
  UserCheck, Search, Loader2, Info, CheckCircle2, Users
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BuddyInfoCardProps {
  buddy: any;
  tamamCard: any;
}

export function BuddyInfoCard({ buddy, tamamCard }: BuddyInfoCardProps) {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const queryClient = useQueryClient();

  const [phone, setPhone] = useState("");
  const [searchResult, setSearchResult] = useState<{ id: number; name: string; status: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presentStatus = tamamCard?.status?.presentStatus;
  const isPending = !presentStatus || presentStatus.toLowerCase() === "pending";

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setErrorMsg(t("student.pleaseEnterPhone") || "Please enter a phone number to search");
      return;
    }
    if (phone.trim().length < 8) {
      setErrorMsg(t("student.phoneInvalid") || "Phone number must be at least 8 digits");
      return;
    }

    setIsSearching(true);
    setSearchResult(null);
    setErrorMsg(null);

    try {
      const res = await studentService.searchBuddies(phone.trim());
      if (res?.success && res?.data) {
        setSearchResult(res.data);
      } else {
        setErrorMsg(res?.message || t("student.noStudentFound") || "No student found with this phone number");
      }
    } catch (err: any) {
      console.error("Search error:", err);
      const apiMessage = err?.response?.data?.message || err?.message || t("common.error") || "An error occurred";
      setErrorMsg(apiMessage);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAssign = async () => {
    if (!searchResult) return;

    setIsAssigning(true);
    setErrorMsg(null);

    try {
      const res = await studentService.submitBuddyPair(searchResult.id);
      if (res?.success) {
        toast.success(t("student.buddyAssignedSuccess") || "Companion assigned successfully!");
        queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["student-tamam-history"] });
      } else {
        setErrorMsg(res?.message || t("common.error") || "Failed to assign companion");
        toast.error(res?.message || t("common.error"));
      }
    } catch (err: any) {
      console.error("Assign error:", err);
      const apiMessage = err?.response?.data?.message || err?.message || t("common.error") || "An error occurred";
      setErrorMsg(apiMessage);
      toast.error(apiMessage);
    } finally {
      setIsAssigning(false);
    }
  };

  // If a buddy is assigned, render the classic Buddy Info card
  if (buddy?.full_name) {
    return (
      <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm h-full flex flex-col justify-center items-center text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: "url('/pattern.png')", backgroundRepeat: "repeat", backgroundSize: "120px" }}
        />

        <div className="w-20 h-20 bg-success-500/10 text-success-600 rounded-full flex items-center justify-center text-4xl mb-4 relative z-10 shadow-sm border border-success-500/20">
          <UserCheck className="h-10 w-10" />
        </div>

        <h5 className="text-xl font-bold text-foreground mb-1 relative z-10">
          {t("student.rafeqaName")}: {buddy?.full_name}
        </h5>
        <p className="text-muted-foreground text-sm font-medium mb-6 relative z-10">
          {buddy?.phone || "—"}
        </p>

        <div className="w-full border-t border-border/50 mb-6 relative z-10"></div>

        <div className="w-full flex justify-between items-center text-sm relative z-10">
          <span className="text-muted-foreground font-bold">{t("student.weekStatus")}</span>
          <span className={cn(
            "px-4 py-1.5 rounded-full font-bold capitalize",
            isPending
              ? "bg-warning-500/10 text-warning-600"
              : "bg-success-500/10 text-success-600"
          )}>
            {isPending ? (t("student.statusPending") || "معلق") : (t("student.statusCompleted") || "مكتمل")}
          </span>
        </div>
      </div>
    );
  }

  // If no buddy is assigned, render the search card
  const isAvailable = searchResult?.status?.toLowerCase() === "available" || searchResult?.status?.toLowerCase() === "متاحة";

  return (
    <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm h-full flex flex-col justify-between relative overflow-hidden">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-lg text-foreground">
              {t("student.searchBuddy") || "البحث عن رفيقة"}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("student.searchBuddyDesc") || "ابحثي عن رفيقتكِ وتأكدي من تعيينها"}
            </p>
          </div>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="space-y-2">
          <div className="relative flex items-center">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("student.phonePlaceholder") || "أدخلي رقم الهاتف..."}
              className="w-full pl-4 pr-12 py-3 bg-muted/30 border border-border/80 rounded-2xl text-foreground font-semibold placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 rtl:pl-12 rtl:pr-4 text-sm"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground flex items-center justify-center transition-all shadow-md cursor-pointer rtl:right-auto rtl:left-3.5"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>

        {/* Error Messages */}
        {errorMsg && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 text-xs text-destructive font-bold flex items-start gap-2.5">
            <Info className="h-4.5 w-4.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Search Result */}
        {searchResult && (
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center justify-between gap-4 animate-in zoom-in-95 duration-300 w-full">
            <div className="flex flex-col items-start text-start gap-1">
              <h5 className="font-extrabold text-sm text-foreground">
                {searchResult.name}
              </h5>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>{t("student.status") || "الحالة"}:</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                  isAvailable
                    ? "bg-success-500/10 text-success-600 border-success-500/20"
                    : "bg-destructive/10 text-destructive border-destructive/20"
                )}>
                  {isAvailable ? (t("student.available") || "متاحة") : (t("student.notAvailable") || "غير متاحة")}
                </span>
              </div>
            </div>

            <button
              onClick={handleAssign}
              disabled={isAssigning || !isAvailable}
              className={cn(
                "bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs shadow-md cursor-pointer shrink-0",
                (isAssigning || !isAvailable) && "opacity-50 cursor-not-allowed transform-none hover:bg-primary"
              )}
            >
              {isAssigning ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> {t("student.processing") || "جاري..."}</>
              ) : (
                <><CheckCircle2 className="h-3.5 w-3.5" /> {t("student.assignBuddy") || "تعيين"}</>
              )}
            </button>
          </div>
        )}
      </div>

      {!searchResult && (
        <div className="mt-6 pt-4 border-t border-border/40 text-center">
          <p className="text-[11px] text-muted-foreground font-semibold flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-warning-500 shrink-0" />
            <span>{t("student.lockActionWarning") || "يرجى تعيين رفيقة أولاً لتفعيل التمام."}</span>
          </p>
        </div>
      )}
    </div>
  );
}
