"use client";

import { studentService } from "@/services/student.service";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2, Heart, Info, Loader2,
  Search, UserCheck, X
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BuddyAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuddyAssignModal({ isOpen, onClose }: BuddyAssignModalProps) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  
  const [phone, setPhone] = useState("");
  const [searchResult, setSearchResult] = useState<{ id: number; name: string; status: string } | null>(null);
  
  const [isSearching, setIsSearching] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        setShowSuccess(true);
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

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setPhone("");
      setSearchResult(null);
      setErrorMsg(null);
      setShowSuccess(false);
      setIsSearching(false);
      setIsAssigning(false);
    }, 300);
  };

  if (!isOpen) return null;

  const isAvailable = searchResult?.status?.toLowerCase() === "available" || searchResult?.status?.toLowerCase() === "متاحة";

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-4 animate-in fade-in duration-300">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Centered Popup Dialog Box */}
      <div className="relative w-full max-w-lg bg-card rounded-[2.5rem] shadow-2xl border border-border/50 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-400 z-10 flex flex-col">
        {/* Top Header */}
        <div className="bg-primary/5 border-b border-border/50 p-6 flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-foreground">{t("student.searchBuddy") || "البحث عن رفيقة"}</h3>
              <p className="text-xs text-muted-foreground font-bold">{t("student.searchBuddyDesc") || "ابحثي عن رفيقتكِ وتأكدي من تعيينها"}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors shrink-0"
            aria-label={t("common.close") || "إغلاق"}
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="p-8">
          {showSuccess ? (
            <div className="animate-in zoom-in-95 fade-in duration-400 text-center py-10 space-y-6 flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-success-500 blur-3xl opacity-20 animate-pulse" />
                <Heart className="h-20 w-20 text-success-500 mx-auto relative z-10 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h5 className="text-3xl font-black text-success-600">
                  {t("student.buddyAssignedSuccess") || "تم تعيين رفيقة الدرب بنجاح!"}
                </h5>
                <p className="text-xl text-muted-foreground font-medium">
                  {t("student.mayAllahBlessYou") || "بارك الله فيكِ ونفع بكِ."}
                </p>
              </div>
              <button 
                onClick={handleClose}
                className="px-10 py-3 rounded-xl bg-success-600 text-white font-bold hover:bg-success-700 transition-all shadow-lg shadow-success-500/20 cursor-pointer"
              >
                {t("common.close") || "إغلاق"}
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Search Form */}
              <form onSubmit={handleSearch} className="space-y-2">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("student.phonePlaceholder") || "أدخلي رقم الهاتف..."}
                    className="w-full pl-6 pr-16 rtl:pl-16 rtl:pr-6 py-4 bg-muted/30 border border-border/80 rounded-2xl text-foreground font-semibold placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-sm shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground flex items-center justify-center transition-all shadow-md cursor-pointer rtl:right-auto rtl:left-3.5"
                  >
                    {isSearching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </form>

              {/* Error messages */}
              {errorMsg && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 text-xs text-destructive font-bold flex items-start gap-3">
                  <Info className="h-5 w-5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Search Results */}
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
          )}
        </div>
      </div>
    </div>
  );
}
