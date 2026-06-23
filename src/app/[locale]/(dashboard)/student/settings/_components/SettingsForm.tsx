"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Award, Camera, Check, Loader2, Lock, LogOut, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LogoutConfirmDialog } from "@/components/common/LogoutConfirmDialog";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { studentService } from "@/services/student.service";
import { PhoneInput } from "@/components/forms/PhoneInput";

// ============================================================
// SettingsForm – extracted for maintenance ease
// ============================================================

export function SettingsForm() {
  const t = useTranslations();
  const { user } = useAuth();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formState, setFormState] = useState<"idle" | "saving" | "success">("idle");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setAvatar(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("saving");

    const formData = new FormData(e.currentTarget);
    const data = {
      age: Number(formData.get("age")),
      email: formData.get("email"),
      phone: formData.get("phone") as string,
    };

    if (data.phone && !/^01[0125][0-9]{8}$/.test(data.phone)) {
      setFormState("idle");
      toast.error(t("validation.phoneInvalid") || "Invalid phone number format");
      return;
    }

    try {
      const response = await studentService.updateProfile(data);
      if (response.success) {
        setFormState("success");
        toast.success(response.message || t("student.savedSuccessfully"));
        setTimeout(() => setFormState("idle"), 2500);
      } else {
        setFormState("idle");
        toast.error(response.message || t("common.error"));
      }
    } catch {
      setFormState("idle");
      // Global error interceptor will handle the error toast
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Page Header Area */}
      <div className="bg-gradient-to-br from-primary-800 to-primary py-12 md:py-16 border-b border-primary-900 shadow-lg relative overflow-hidden -mx-4 md:-mx-8 px-4 md:px-8 -mt-8 mb-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-white flex items-center justify-center text-primary text-5xl font-black border-4 border-white shadow-xl overflow-hidden relative">
              {!avatar ? (
                <span>{user?.full_name?.charAt(0) || "م"}</span>
              ) : (
                <Image 
                  fill
                  sizes="(max-width: 768px) 128px, 144px"
                  className="absolute inset-0 w-full h-full object-cover" 
                  src={avatar} 
                  alt="Avatar" 
                />
              )}
              <div className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                <Camera className="w-8 h-8 mb-1" />
                <span className="font-bold">{t("student.changeImage")}</span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          <div className="text-center md:text-start text-white">
            <h3 className="text-3xl font-bold mb-2 cursor-default">{user?.full_name || t("student.studentName")}</h3>
            <p className="text-primary-100 font-medium mb-4 flex items-center justify-center md:justify-start gap-4 flex-wrap cursor-default">
              <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-accent" /> {t("student.activeStudent")}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="pb-16 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm sticky top-28">
            <button
              type="button"
              onClick={() => setLogoutDialogOpen(true)}
              className="w-full text-start px-5 py-3.5 rounded-xl font-bold transition-colors text-destructive hover:bg-destructive/10 block border-s-4 border-transparent hover:border-destructive flex items-center cursor-pointer"
            >
              <LogOut className="ms-2 shrink-0 rtl:ms-0 rtl:me-2 w-5 h-5 rtl:-rotate-90" />
              {t("student.logoutAccount")}
            </button>
          </div>
        </div>

        {/* Profile Form Area */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-[2rem] p-8 md:p-10 border border-border/50 shadow-sm slide-in-from-bottom-2 animate-in duration-300">
            <div className="mb-8">
              <h4 className="font-bold text-foreground text-xl mb-1">{t("student.personalInfo")}</h4>
              <p className="text-sm text-muted-foreground">{t("student.updatePersonalInfo")}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-foreground/80 mb-2 flex items-center">
                    {t("student.quadripartiteName")}
                    <span title={t("student.cannotChangeExceptAdmin")} className="flex items-center">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0 mx-1" />
                    </span>
                  </label>
                  <input type="text" className="w-full bg-muted/50 border border-border/50 text-muted-foreground text-sm font-bold rounded-xl block p-3.5 cursor-not-allowed opacity-70" value={user?.full_name || ""} disabled />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground/80 mb-2">{t("auth.age")}</label>
                  <input name="age" type="number" className="w-full bg-muted/50 border border-border/50 text-foreground text-sm rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary block p-3.5 transition-colors cursor-text" dir={isRTL ? "rtl" : "ltr"} defaultValue={user?.age || ""} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-foreground/80 mb-2">{t("common.email")}</label>
                  <input name="email" type="email" className="w-full bg-muted/50 border border-border/50 text-foreground text-sm rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary block p-3.5 transition-colors text-left cursor-text" dir="ltr" defaultValue={user?.email || ""} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground/80 mb-2">{t("student.currentWhatsapp")}</label>
                  <PhoneInput
                    name="phone"
                    value={user?.phone || ""}
                    onChange={(val) => {
                      if (val && !/^01[0125][0-9]{8}$/.test(val)) {
                        setPhoneError(t("validation.phoneInvalid"));
                      } else {
                        setPhoneError(null);
                      }
                    }}
                    hasError={!!phoneError}
                  />
                  {phoneError && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      <span className="shrink-0">⚠️</span> {phoneError}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Section */}
              <div className="flex justify-end pt-6 border-t border-border/50">
                <button
                  type="submit"
                  disabled={formState !== "idle"}
                  className={cn(
                    "font-bold py-3.5 px-8 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/20",
                    formState === "idle"
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground hover:-translate-y-1 shadow-primary/20"
                      : formState === "saving"
                      ? "bg-primary/70 text-primary-foreground cursor-not-allowed"
                      : "bg-success-500 hover:bg-success-600 text-white"
                  )}
                >
                  {formState === "idle" && <><Save className="w-5 h-5" /> {t("student.saveChanges")}</>}
                  {formState === "saving" && <><Loader2 className="w-5 h-5 animate-spin" /> {t("student.saving")}</>}
                  {formState === "success" && <><Check className="w-5 h-5" /> {t("student.savedSuccessfully")}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <LogoutConfirmDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen} />
    </div>
  );
}
