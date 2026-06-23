"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/enums";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { updateUser } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { PhoneInput } from "@/components/forms/PhoneInput";
import { LogoutConfirmDialog } from "@/components/common/LogoutConfirmDialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  User,
  Phone,
  Clock,
  Shield,
  Award,
  Calendar,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Inbox,
  Globe,
  Star,
  Users,
  Settings,
  LogOut,
  Lock,
  Loader2,
  Mail,
  Save,
  Camera
} from "lucide-react";

// Helper to resolve media URLs
const resolveMediaUrl = (url: string | null) => {
  if (!url) return undefined;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return `https://wartel.amrbdr.com/storage/${url}`;
};

export default function StudentProfileDetailsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  
  const userId = params.userId as string;
  const isOwnProfile = currentUser && currentUser.id && String(currentUser.id) === String(userId);

  const [activeTab, setActiveTab] = useState<"details" | "groups" | "exams" | "buddy" | "tamam" | "leaves" | "certifications" | "warnings" | "settings">("details");

  // Modal State for Logout
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  // Edit Form Local States
  const [age, setAge] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Profile Avatar State & Ref
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch detailed profile using react-query
  const { data: profileResponse, isLoading, isError, error } = useQuery({
    queryKey: ["student-detailed-profile", userId],
    queryFn: () => studentService.getDetailedProfile(userId),
    enabled: !!userId,
  });

  const profile = profileResponse?.profile;
  const joined_groups = profileResponse?.joined_groups || [];

  // Sync form states with profile & currentUser details
  useEffect(() => {
    if (currentUser) {
      setAge(String(currentUser.age || ""));
      setEmail(currentUser.email || "");
    }
    if (profile) {
      setPhone(profile.phone || "");
      setAvatar((profile as typeof profile & { avatar?: string | null }).avatar || (isOwnProfile ? currentUser?.avatar || null : null));
    }
  }, [currentUser, profile, activeTab, isOwnProfile]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto p-4" dir={isRTL ? "rtl" : "ltr"}>
        {/* Banner Skeleton */}
        <div className="h-44 w-full rounded-[2rem] bg-muted animate-pulse" />
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-12 w-48 rounded-full" />
            <Skeleton className="h-96 w-full rounded-[2rem]" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !profileResponse || !profile) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    const apiErrorMsg = err.response?.data?.message || err.message;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 max-w-md mx-auto" dir={isRTL ? "rtl" : "ltr"}>
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">{t("common.error")}</h2>
        <p className="text-muted-foreground mb-6">
          {apiErrorMsg || t("common.errorOccurred") || "Failed to load student profile."}
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl bg-primary text-white font-bold transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5"
        >
          {t("common.back") || "Back"}
        </button>
      </div>
    );
  }

  // Handle instant profile picture upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64String = event.target.result as string;
          setAvatar(base64String);

          try {
            // 1. Upload to backend profile
            await studentService.updateProfile({ avatar: base64String });
            
            // 2. Save locally in Redux store
            dispatch(updateUser({ avatar: base64String }));
            
            // 3. Invalidate Query cache
            await queryClient.invalidateQueries({ queryKey: ["student-detailed-profile", userId] });
            
            toast.success(t("student.savedSuccessfully") || "Profile picture updated successfully!");
          } catch {
            toast.error(t("common.error") || "Failed to update profile picture.");
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Profile Update Submission
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    if (phone && !/^01[0125][0-9]{8}$/.test(phone)) {
      setIsSaving(false);
      toast.error(t("validation.phoneInvalid") || "Invalid phone number format");
      return;
    }

    const payload = {
      age: Number(age),
      email,
      phone,
    };

    try {
      const response = await studentService.updateProfile(payload);
      if (response.success) {
        // 1. Update Redux store locally to sync changes immediately across UI
        dispatch(updateUser({
          age: payload.age,
          email: payload.email,
          phone: payload.phone
        }));

        // 2. Invalidate React Query cache so the profile page updates details
        await queryClient.invalidateQueries({ queryKey: ["student-detailed-profile", userId] });

        toast.success(response.message || t("student.savedSuccessfully"));
        
        // 3. Switch back to details tab to see updated read-only profile data
        setActiveTab("details");
      } else {
        toast.error(response.message || t("common.error"));
      }
    } catch {
      // Global error interceptor will handle error display
    } finally {
      setIsSaving(false);
    }
  };

  // Custom back button handler based on current user role
  const handleBackClick = () => {
    if (!currentUser) {
      router.back();
      return;
    }
    switch (currentUser.role) {
      case UserRole.PARENT:
        router.push(`/${locale}/parent`);
        break;
      case UserRole.TEACHER:
        router.push(`/${locale}/teacher`);
        break;
      case UserRole.STUDENT:
      default:
        router.push(`/${locale}/student`);
        break;
    }
  };

  const getBackLabel = () => {
    if (!currentUser) return t("common.back") || "Back";
    switch (currentUser.role) {
      case UserRole.PARENT:
        return t("student.profileDetails.backToParent") || "Back to Parent Portal";
      case UserRole.TEACHER:
        return t("student.profileDetails.backToTeacher") || "Back to Teacher Portal";
      case UserRole.STUDENT:
      default:
        return t("student.profileDetails.backToStudent") || "Back to Dashboard";
    }
  };

  // Helper to format dates cleanly
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Helper to format attendance status with color and localized text
  const getAttendanceBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t("student.profileDetails.present") || "Present"}
          </span>
        );
      case "absent":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-destructive/10 text-destructive border border-destructive/20 inline-flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            {t("student.profileDetails.absent") || "Absent"}
          </span>
        );
      case "excused":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {t("student.profileDetails.excused") || "Excused"}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-muted text-muted-foreground border border-border inline-flex items-center gap-1">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 p-4 pb-20" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Modals */}
      <LogoutConfirmDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen} />

      {/* Back Navigation Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border/40">
        <h2 className="text-xl font-bold text-foreground">
          {t("student.profileDetails.title") || "Student Detailed Profile"}
        </h2>
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted text-sm font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{getBackLabel()}</span>
        </button>
      </div>

      {/* Profile Header Banner with High-Contrast Deep-Teal Gradient */}
      <div className="bg-teal-900 bg-gradient-to-r from-teal-950 via-teal-900 to-teal-800 py-10 border-b border-teal-950/20 shadow-md relative overflow-hidden rounded-[2rem] px-6 md:px-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-15 mix-blend-overlay pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          
          {/* Avatar Area with Hover Camera Overlay */}
          <div 
            className={cn(
              "relative group shrink-0 select-none rounded-full overflow-hidden border-4 border-white/20 shadow-xl",
              isOwnProfile && "cursor-pointer"
            )}
            onClick={isOwnProfile ? () => fileInputRef.current?.click() : undefined}
          >
            <div className="w-24 h-24 md:w-28 md:h-28 bg-white flex items-center justify-center text-teal-950 text-4xl font-black relative">
              {!avatar ? (
                <span>{profile.full_name?.charAt(0) || "م"}</span>
              ) : (
                <Image 
                  fill
                  sizes="(max-width: 768px) 96px, 112px"
                  className="absolute inset-0 w-full h-full object-cover" 
                  src={resolveMediaUrl(avatar) || ""} 
                  alt="Avatar" 
                />
              )}
              
              {isOwnProfile && (
                <div className="absolute inset-0 bg-black/55 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] duration-200">
                  <Camera className="w-6 h-6 mb-1 shrink-0" />
                  <span className="font-bold">{t("student.changeImage") || "Change"}</span>
                </div>
              )}
            </div>
            {isOwnProfile && (
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
            )}
          </div>

          {/* Name & High-Contrast Badges */}
          <div className="text-center md:text-start text-white space-y-2.5">
            <h3 className="text-2xl md:text-3xl font-black">{profile.full_name}</h3>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              {/* Status Badge with High-Contrast Solid Background */}
              <span className={cn(
                "px-3.5 py-1 rounded-full text-xs font-black shadow-sm",
                (profile.status === "active" || profile.status === "نشط")
                  ? "bg-emerald-600 text-white"
                  : "bg-amber-600 text-white"
              )}>
                {profile.status}
              </span>
              
              {/* Pathway Badge with High-Contrast Solid White Background */}
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-white text-teal-950 shadow-sm">
                {profile.enrollment_type === "institute" || profile.enrollment_type === "المعهد"
                  ? (t("student.institutePath") || "Institute")
                  : (t("student.academyPath") || "Academy")
                }
              </span>

              {/* Reward Badge with Solid Yellow Background */}
              {profile.badge && (
                <span className="px-3.5 py-1 rounded-full text-xs font-black bg-yellow-400 text-yellow-950 shadow-sm flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {profile.badge}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-3xl p-4 border border-border/50 shadow-sm space-y-2">
            <button
              onClick={() => setActiveTab("details")}
              className={cn(
                "w-full text-start px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer border-s-4",
                activeTab === "details"
                  ? "bg-primary/10 text-primary border-primary"
                  : "text-muted-foreground hover:bg-muted border-transparent"
              )}
            >
              <User className="w-5 h-5 shrink-0" />
              <span>{t("student.profileDetails.personalInfo") || "Personal Info"}</span>
            </button>

            <button
              onClick={() => setActiveTab("groups")}
              className={cn(
                "w-full text-start px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer border-s-4",
                activeTab === "groups"
                  ? "bg-primary/10 text-primary border-primary"
                  : "text-muted-foreground hover:bg-muted border-transparent"
              )}
            >
              <Users className="w-5 h-5 shrink-0" />
              <span>{t("student.profileDetails.groupsTab") || "Groups & Attendance"}</span>
            </button>

            <button
              onClick={() => setActiveTab("exams")}
              className={cn(
                "w-full text-start px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer border-s-4",
                activeTab === "exams"
                  ? "bg-primary/10 text-primary border-primary"
                  : "text-muted-foreground hover:bg-muted border-transparent"
              )}
            >
              <Award className="w-5 h-5 shrink-0" />
              <span>{t("student.profileDetails.examsTab") || "Exam Degrees"}</span>
            </button>

            {String(profile.role_id) !== "3" && (
              <button
                onClick={() => setActiveTab("buddy")}
                className={cn(
                  "w-full text-start px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer border-s-4",
                  activeTab === "buddy"
                    ? "bg-primary/10 text-primary border-primary"
                    : "text-muted-foreground hover:bg-muted border-transparent"
                )}
              >
                <Users className="w-5 h-5 shrink-0 text-amber-500" />
                <span>{t("student.profileDetails.buddyTab") || "Companion (Buddy)"}</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab("tamam")}
              className={cn(
                "w-full text-start px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer border-s-4",
                activeTab === "tamam"
                  ? "bg-primary/10 text-primary border-primary"
                  : "text-muted-foreground hover:bg-muted border-transparent"
              )}
            >
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
              <span>{t("student.profileDetails.tamamTab") || "Daily Tamam"}</span>
            </button>

            <button
              onClick={() => setActiveTab("leaves")}
              className={cn(
                "w-full text-start px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer border-s-4",
                activeTab === "leaves"
                  ? "bg-primary/10 text-primary border-primary"
                  : "text-muted-foreground hover:bg-muted border-transparent"
              )}
            >
              <Calendar className="w-5 h-5 shrink-0 text-blue-500" />
              <span>{t("student.profileDetails.leavesTab") || "Leaves Requests"}</span>
            </button>

            <button
              onClick={() => setActiveTab("certifications")}
              className={cn(
                "w-full text-start px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer border-s-4",
                activeTab === "certifications"
                  ? "bg-primary/10 text-primary border-primary"
                  : "text-muted-foreground hover:bg-muted border-transparent"
              )}
            >
              <Award className="w-5 h-5 shrink-0 text-yellow-500" />
              <span>{t("student.profileDetails.certificationsTab") || "Certifications"}</span>
            </button>

            <button
              onClick={() => setActiveTab("warnings")}
              className={cn(
                "w-full text-start px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer border-s-4",
                activeTab === "warnings"
                  ? "bg-primary/10 text-primary border-primary"
                  : "text-muted-foreground hover:bg-muted border-transparent"
              )}
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{t("student.profileDetails.warningsTab") || "Warnings"}</span>
            </button>


            {/* Profile Action Buttons for Students visiting their own profile */}
            {/* {isOwnProfile && (
              <>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={cn(
                    "w-full text-start px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer border-s-4",
                    activeTab === "settings"
                      ? "bg-primary/10 text-primary border-primary"
                      : "text-muted-foreground hover:bg-muted border-transparent"
                  )}
                >
                  <Settings className="w-5 h-5 shrink-0" />
                  <span>{t("student.settingsPage") || "Settings"}</span>
                </button>

                <div className="border-t border-border/40 my-3" />

                <button
                  onClick={() => setIsLogoutOpen(true)}
                  className="w-full text-start px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer text-destructive hover:bg-destructive/10 border-s-4 border-transparent hover:border-destructive"
                >
                  <LogOut className="w-5 h-5 shrink-0 text-destructive/85" />
                  <span>{t("student.logoutAccount") || "Log Out"}</span>
                </button>
              </>
            )} */}
          </div>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-3xl p-6 md:p-8 border border-border/50 shadow-sm min-h-[400px]">
            
            {/* 1. PERSONAL DETAILS TAB */}
            {activeTab === "details" && (
              <div className="space-y-6">
                <h4 className="font-bold text-foreground text-lg border-b border-border/40 pb-2">
                  {t("student.profileDetails.personalInfo") || "Personal Information"}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student ID */}
                  <div className="bg-muted/30 p-4 rounded-2xl border border-border/20 space-y-1">
                    <span className="text-xs text-muted-foreground font-black uppercase flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-primary" />
                      {t("student.profileDetails.id") || "Student ID"}
                    </span>
                    <p className="text-base font-extrabold text-foreground">{profile.id}</p>
                  </div>

                  {/* Phone */}
                  <div className="bg-muted/30 p-4 rounded-2xl border border-border/20 space-y-1">
                    <span className="text-xs text-muted-foreground font-black uppercase flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      {t("student.profileDetails.phone") || "Phone Number"}
                    </span>
                    <p className="text-base font-extrabold text-foreground" dir="ltr">
                      {profile.phone}
                    </p>
                  </div>

                  {/* Role */}
                  <div className="bg-muted/30 p-4 rounded-2xl border border-border/20 space-y-1">
                    <span className="text-xs text-muted-foreground font-black uppercase flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                      {t("student.profileDetails.role") || "Role"}
                    </span>
                    <p className="text-base font-extrabold text-foreground">
                      {profile.role === "student"
                        ? (t("student.profileDetails.roleStudent") || "Student")
                        : profile.role
                      }
                    </p>
                  </div>

                  {/* Timezone */}
                  <div className="bg-muted/30 p-4 rounded-2xl border border-border/20 space-y-1">
                    <span className="text-xs text-muted-foreground font-black uppercase flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-primary" />
                      {t("student.profileDetails.timezone") || "Timezone"}
                    </span>
                    <p className="text-base font-extrabold text-foreground">{profile.timezone}</p>
                  </div>

                  {/* Created At */}
                  <div className="bg-muted/30 p-4 rounded-2xl border border-border/20 space-y-1">
                    <span className="text-xs text-muted-foreground font-black uppercase flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {t("student.profileDetails.createdAt") || "Joined At"}
                    </span>
                    <p className="text-base font-extrabold text-foreground">
                      {formatDate(profile.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. GROUPS & ATTENDANCE TAB */}
            {activeTab === "groups" && (
              <div className="space-y-8">
                <h4 className="font-bold text-foreground text-lg border-b border-border/40 pb-2">
                  {t("student.profileDetails.groupsTab") || "Joined Groups & Attendance"}
                </h4>

                {joined_groups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-3">
                    <Inbox className="w-12 h-12 text-border" />
                    <p className="font-bold">
                      {t("student.profileDetails.noGroups") || "This student is not enrolled in any groups yet."}
                    </p>
                  </div>
                ) : (
                  joined_groups.map((group) => (
                    <div key={group.group_id} className="border border-border/60 rounded-3xl overflow-hidden bg-card/50 shadow-[0_4px_20px_rgb(0,0,0,0.01)] space-y-4 p-6">
                      {/* Group Header Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
                        <div className="space-y-1">
                          <h5 className="text-base font-extrabold text-foreground flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            {group.group_name}
                          </h5>
                          <p className="text-xs text-muted-foreground font-medium">
                            {t("student.profileDetails.enrollmentDate") || "Enrollment Date"}: {formatDate(group.enrollment_date)}
                          </p>
                        </div>

                        <div>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-black border",
                            group.is_active === "1"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-muted text-muted-foreground border-border"
                          )}>
                            {group.is_active === "1"
                              ? (t("student.profileDetails.statusActive") || "Active")
                              : (t("student.profileDetails.statusInactive") || "Inactive")
                            }
                          </span>
                        </div>
                      </div>

                      {/* Attendance List */}
                      <div className="space-y-4">
                        <h6 className="text-xs font-black text-muted-foreground uppercase tracking-wider">
                          {t("student.profileDetails.attendanceTab") || "Attendance History"}
                        </h6>

                        {group.attendance.length === 0 ? (
                          <p className="text-sm text-muted-foreground italic pl-2">
                            {t("student.profileDetails.noAttendance") || "No attendance records found."}
                          </p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-sm text-start">
                              <thead>
                                <tr className="border-b border-border/40 text-muted-foreground text-xs font-black">
                                  <th className="py-2 text-start font-black whitespace-nowrap">{t("student.profileDetails.scheduledAt") || "Date & Time"}</th>
                                  <th className="py-2 text-start font-black whitespace-nowrap">{t("student.profileDetails.attendanceStatus") || "Status"}</th>
                                  <th className="py-2 text-start font-black whitespace-nowrap">{t("student.profileDetails.points") || "Points"}</th>
                                  <th className="py-2 text-start font-black whitespace-nowrap">{t("student.profileDetails.comment") || "Comment"}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/20 font-bold">
                                {group.attendance.map((att) => (
                                  <tr key={att.session_id} className="hover:bg-muted/10">
                                    <td className="py-3 text-start whitespace-nowrap text-xs text-foreground/80 font-sans">
                                      {att.scheduled_at}
                                    </td>
                                    <td className="py-3 text-start whitespace-nowrap">
                                      {getAttendanceBadge(att.status)}
                                    </td>
                                    <td className="py-3 text-start whitespace-nowrap text-foreground font-sans">
                                      {att.points}
                                    </td>
                                    <td className="py-3 text-start max-w-xs truncate text-muted-foreground text-xs font-medium" title={att.comment || undefined}>
                                      {att.comment || "-"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. EXAMS TAB */}
            {activeTab === "exams" && (
              <div className="space-y-8">
                <h4 className="font-bold text-foreground text-lg border-b border-border/40 pb-2">
                  {t("student.profileDetails.examsTab") || "Exam Degrees"}
                </h4>

                {joined_groups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-3">
                    <Inbox className="w-12 h-12 text-border" />
                    <p className="font-bold">
                      {t("student.profileDetails.noGroups") || "This student is not enrolled in any groups yet."}
                    </p>
                  </div>
                ) : (
                  joined_groups.map((group) => (
                    <div key={group.group_id} className="border border-border/60 rounded-3xl overflow-hidden bg-card/50 shadow-[0_4px_20px_rgb(0,0,0,0.01)] space-y-4 p-6">
                      <div className="border-b border-border/40 pb-3">
                        <h5 className="text-base font-extrabold text-foreground flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-primary" />
                          {group.group_name}
                        </h5>
                      </div>

                      {group.exam_degrees.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic pl-2">
                          {t("student.profileDetails.noExams") || "No exam records found."}
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {group.exam_degrees.map((exam) => {
                            const scoreNum = parseFloat(exam.score) || 0;
                            const totalNum = parseFloat(exam.total_marks) || 1;
                            const pct = Math.round((scoreNum / totalNum) * 100);
                            const isPassed = pct >= 50;

                            return (
                              <Link
                                key={exam.exam_id}
                                href={`/${locale}/student/exams/${exam.exam_id}/result`}
                                className="block border border-border/50 rounded-2xl p-4 space-y-3 bg-muted/10 hover:border-primary/40 hover:bg-muted/20 hover:shadow-sm transition-all cursor-pointer"
                              >
                                <div className="flex justify-between items-start gap-4">
                                  <div className="space-y-1">
                                    <h6 className="text-sm font-extrabold text-foreground leading-snug">
                                      {exam.exam_title}
                                    </h6>
                                    <p className="text-[10px] text-muted-foreground font-medium">
                                      {formatDate(exam.created_at)}
                                    </p>
                                  </div>
                                  <span className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase shrink-0",
                                    isPassed
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                      : "bg-destructive/10 text-destructive border-destructive/20"
                                  )}>
                                    {isPassed 
                                      ? (t("student.passed") || "Passed")
                                      : (t("student.fail") || "Failed")
                                    }
                                  </span>
                                </div>

                                <div className="flex items-end justify-between pt-2 border-t border-border/30">
                                  <div className="space-y-0.5">
                                    <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">
                                      {t("student.profileDetails.score") || "Score"}
                                    </span>
                                    <p className="text-sm font-extrabold text-foreground font-sans">
                                      {scoreNum.toFixed(0)} <span className="text-xs text-muted-foreground font-medium">{t("student.profileDetails.outOf") || "of"}</span> {totalNum.toFixed(0)}
                                    </p>
                                  </div>

                                  <span className={cn(
                                    "text-lg font-black font-sans leading-none",
                                    isPassed ? "text-emerald-500" : "text-destructive"
                                  )}>
                                    {pct}%
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* BUDDY PAIRS TAB */}
            {activeTab === "buddy" && String(profile.role_id) !== "3" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h4 className="font-bold text-foreground text-lg border-b border-border/40 pb-2">
                  {t("student.profileDetails.buddyTab") || "Companion (Buddy)"}
                </h4>

                {joined_groups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-3">
                    <Inbox className="w-12 h-12 text-border" />
                    <p className="font-bold">
                      {t("student.profileDetails.noGroups") || "This student is not enrolled in any groups yet."}
                    </p>
                  </div>
                ) : (
                  joined_groups.map((group) => {
                    const buddyPairs = group.buddy_pairs || [];
                    return (
                      <div key={group.group_id} className="border border-border/60 rounded-3xl overflow-hidden bg-card/50 shadow-[0_4px_20px_rgb(0,0,0,0.01)] space-y-4 p-6">
                        <div className="border-b border-border/40 pb-3">
                          <h5 className="text-base font-extrabold text-foreground flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            {group.group_name}
                          </h5>
                        </div>

                        {buddyPairs.length === 0 ? (
                          <p className="text-sm text-muted-foreground italic pl-2">
                            {t("student.profileDetails.noBuddy") || "No buddy pairings found."}
                          </p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[500px] text-sm text-start">
                              <thead>
                                <tr className="border-b border-border/40 text-muted-foreground text-xs font-black">
                                  <th className="py-2 text-start font-black whitespace-nowrap">{t("student.profileDetails.buddyName") || "Companion Name"}</th>
                                  <th className="py-2 text-start font-black whitespace-nowrap">{t("student.profileDetails.startDateShort") || "Start Date"}</th>
                                  <th className="py-2 text-start font-black whitespace-nowrap">{t("student.profileDetails.status") || "Status"}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/20 font-bold">
                                {buddyPairs.map((pair) => (
                                  <tr key={pair.id} className="hover:bg-muted/10">
                                    <td className="py-3 text-start whitespace-nowrap text-foreground flex items-center gap-2">
                                      <Users className="w-4 h-4 text-amber-500" />
                                      {pair.buddy_name}
                                    </td>
                                    <td className="py-3 text-start whitespace-nowrap text-xs text-foreground/80 font-sans">
                                      {formatDate(pair.start_date)}
                                    </td>
                                    <td className="py-3 text-start whitespace-nowrap">
                                      <span className={cn(
                                        "px-2.5 py-0.5 rounded-full text-xs font-black border",
                                        pair.is_active === "1"
                                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                          : "bg-muted text-muted-foreground border-border"
                                      )}>
                                        {pair.is_active === "1"
                                          ? (t("student.profileDetails.statusActive") || "Active")
                                          : (t("student.profileDetails.statusInactive") || "Inactive")
                                        }
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* DAILY TAMAM TAB */}
            {activeTab === "tamam" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h4 className="font-bold text-foreground text-lg border-b border-border/40 pb-2">
                  {t("student.profileDetails.tamamTab") || "Daily Tamam"}
                </h4>

                {joined_groups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-3">
                    <Inbox className="w-12 h-12 text-border" />
                    <p className="font-bold">
                      {t("student.profileDetails.noGroups") || "This student is not enrolled in any groups yet."}
                    </p>
                  </div>
                ) : (
                  joined_groups.map((group) => {
                    const dailyTamam = group.daily_tamam || [];
                    return (
                      <div key={group.group_id} className="border border-border/60 rounded-3xl overflow-hidden bg-card/50 shadow-[0_4px_20px_rgb(0,0,0,0.01)] space-y-4 p-6">
                        <div className="border-b border-border/40 pb-3">
                          <h5 className="text-base font-extrabold text-foreground flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            {group.group_name}
                          </h5>
                        </div>

                        {dailyTamam.length === 0 ? (
                          <p className="text-sm text-muted-foreground italic pl-2">
                            {t("student.profileDetails.noTamam") || "No daily tamam records found."}
                          </p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[650px] text-sm text-start">
                              <thead>
                                <tr className="border-b border-border/40 text-muted-foreground text-xs font-black">
                                  <th className="py-2 text-start font-black whitespace-nowrap">{t("student.profileDetails.tamamDate") || "Tamam Date"}</th>
                                  {String(profile.role_id) !== "3" && (
                                    <th className="py-2 text-start font-black whitespace-nowrap">{t("student.profileDetails.buddyName") || "Companion Name"}</th>
                                  )}
                                  <th className="py-2 text-start font-black whitespace-nowrap">{t("student.profileDetails.pastStatus") || "Past Status"}</th>
                                  <th className="py-2 text-start font-black whitespace-nowrap">{t("student.profileDetails.presentStatus") || "Present Status"}</th>
                                  <th className="py-2 text-start font-black whitespace-nowrap">{t("student.profileDetails.confirmedAt") || "Confirmed At"}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/20 font-bold">
                                {dailyTamam.map((tamam) => (
                                  <tr key={tamam.id} className="hover:bg-muted/10">
                                    <td className="py-3 text-start whitespace-nowrap text-xs text-foreground/80 font-sans">
                                      {formatDate(tamam.tamam_date)}
                                    </td>
                                    {String(profile.role_id) !== "3" && (
                                      <td className="py-3 text-start whitespace-nowrap text-foreground">
                                        {tamam.buddy_name}
                                      </td>
                                    )}
                                    <td className="py-3 text-start whitespace-nowrap">
                                      <span className={cn(
                                        "px-2.5 py-0.5 rounded-full text-xs font-black border",
                                        tamam.past_status === "completed"
                                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                          : "bg-destructive/10 text-destructive border-destructive/20"
                                      )}>
                                        {tamam.past_status === "completed" 
                                          ? (t("student.statusCompleted") || "Completed")
                                          : (t("student.statusAbsent") || "Absent")
                                        }
                                      </span>
                                    </td>
                                    <td className="py-3 text-start whitespace-nowrap">
                                      <span className={cn(
                                        "px-2.5 py-0.5 rounded-full text-xs font-black border",
                                        tamam.present_status === "completed"
                                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                          : "bg-destructive/10 text-destructive border-destructive/20"
                                      )}>
                                        {tamam.present_status === "completed" 
                                          ? (t("student.statusCompleted") || "Completed")
                                          : (t("student.statusAbsent") || "Absent")
                                        }
                                      </span>
                                    </td>
                                    <td className="py-3 text-start whitespace-nowrap text-xs text-muted-foreground font-medium font-sans">
                                      {tamam.confirmed_at ? formatDate(tamam.confirmed_at) : (t("student.profileDetails.notConfirmed") || "Not Confirmed")}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* LEAVES REQUESTS TAB */}
            {activeTab === "leaves" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h4 className="font-bold text-foreground text-lg border-b border-border/40 pb-2">
                  {t("student.profileDetails.leavesTab") || "Leaves Requests"}
                </h4>

                {joined_groups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-3">
                    <Inbox className="w-12 h-12 text-border" />
                    <p className="font-bold">
                      {t("student.profileDetails.noGroups") || "This student is not enrolled in any groups yet."}
                    </p>
                  </div>
                ) : (
                  joined_groups.map((group) => {
                    const leavesRequests = group.leaves_requests || [];
                    return (
                      <div key={group.group_id} className="border border-border/60 rounded-3xl overflow-hidden bg-card/50 shadow-[0_4px_20px_rgb(0,0,0,0.01)] space-y-4 p-6">
                        <div className="border-b border-border/40 pb-3">
                          <h5 className="text-base font-extrabold text-foreground flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            {group.group_name}
                          </h5>
                        </div>

                        {leavesRequests.length === 0 ? (
                          <p className="text-sm text-muted-foreground italic pl-2">
                            {t("student.profileDetails.noLeaves") || "No leave requests found."}
                          </p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-sm text-start">
                              <thead>
                                <tr className="border-b border-border/40 text-muted-foreground text-xs font-black">
                                  <th className="py-2 text-start font-black whitespace-nowrap">{t("student.profileDetails.startDate") || "Start Date"}</th>
                                  <th className="py-2 text-start font-black whitespace-nowrap">{t("student.profileDetails.endDate") || "End Date"}</th>
                                  <th className="py-2 text-start font-black whitespace-nowrap">{t("student.profileDetails.reason") || "Reason"}</th>
                                  <th className="py-2 text-start font-black whitespace-nowrap">{t("student.profileDetails.status") || "Status"}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/20 font-bold">
                                {leavesRequests.map((leave) => (
                                  <tr key={leave.id} className="hover:bg-muted/10">
                                    <td className="py-3 text-start whitespace-nowrap text-xs text-foreground/80 font-sans">
                                      {formatDate(leave.start_date)}
                                    </td>
                                    <td className="py-3 text-start whitespace-nowrap text-xs text-foreground/80 font-sans">
                                      {formatDate(leave.end_date)}
                                    </td>
                                    <td className="py-3 text-start text-xs text-muted-foreground font-medium max-w-xs truncate" title={leave.reason}>
                                      {leave.reason}
                                    </td>
                                    <td className="py-3 text-start whitespace-nowrap">
                                      <span className={cn(
                                        "px-2.5 py-0.5 rounded-full text-xs font-black border",
                                        leave.status === "approved"
                                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                          : leave.status === "pending"
                                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                          : "bg-destructive/10 text-destructive border-destructive/20"
                                      )}>
                                        {leave.status === "approved"
                                          ? (t("student.statusApproved") || "Approved")
                                          : leave.status === "pending"
                                          ? (t("student.statusPending") || "Pending")
                                          : (t("student.statusRejected") || "Rejected")
                                        }
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* CERTIFICATIONS TAB */}
            {activeTab === "certifications" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h4 className="font-bold text-foreground text-lg border-b border-border/40 pb-2">
                  {t("student.profileDetails.certificationsTab") || "Certifications"}
                </h4>

                {joined_groups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-3">
                    <Inbox className="w-12 h-12 text-border" />
                    <p className="font-bold">
                      {t("student.profileDetails.noGroups") || "This student is not enrolled in any groups yet."}
                    </p>
                  </div>
                ) : (
                  joined_groups.map((group) => {
                    const certifications = group.certifications || [];
                    return (
                      <div key={group.group_id} className="border border-border/60 rounded-3xl overflow-hidden bg-card/50 shadow-[0_4px_20px_rgb(0,0,0,0.01)] space-y-4 p-6">
                        <div className="border-b border-border/40 pb-3">
                          <h5 className="text-base font-extrabold text-foreground flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            {group.group_name}
                          </h5>
                        </div>

                        {certifications.length === 0 ? (
                          <p className="text-sm text-muted-foreground italic pl-2">
                            {t("student.profileDetails.noCertifications") || "No certifications found."}
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {certifications.map((cert) => (
                              <div key={cert.id} className="border border-border/50 rounded-2xl p-4 bg-muted/10 flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                  <h6 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                                    <Award className="w-4 h-4 text-yellow-500 shrink-0" />
                                    {cert.title}
                                  </h6>
                                  <p className="text-[10px] text-muted-foreground font-medium font-sans">
                                    {formatDate(cert.issued_at)}
                                  </p>
                                </div>
                                {cert.file_url && (
                                  <a
                                    href={cert.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-all"
                                  >
                                    {t("student.profileDetails.viewFile") || "View"}
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* WARNINGS TAB */}
            {activeTab === "warnings" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h4 className="font-bold text-foreground text-lg border-b border-border/40 pb-2">
                  {t("student.profileDetails.warningsTab") || "Warnings"}
                </h4>

                {joined_groups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-3">
                    <Inbox className="w-12 h-12 text-border" />
                    <p className="font-bold">
                      {t("student.profileDetails.noGroups") || "This student is not enrolled in any groups yet."}
                    </p>
                  </div>
                ) : (
                  joined_groups.map((group) => {
                    const warnings = group.warnings || [];
                    return (
                      <div key={group.group_id} className="border border-border/60 rounded-3xl overflow-hidden bg-card/50 shadow-[0_4px_20px_rgb(0,0,0,0.01)] space-y-4 p-6">
                        <div className="border-b border-border/40 pb-3">
                          <h5 className="text-base font-extrabold text-foreground flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            {group.group_name}
                          </h5>
                        </div>

                        {warnings.length === 0 ? (
                          <p className="text-sm text-muted-foreground italic pl-2">
                            {t("student.profileDetails.noWarnings") || "No warnings found."}
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {warnings.map((warning: { id: number | string; violation_type?: string; message?: string; remaining_chances?: number; issued_at?: string }) => (
                              <div key={warning.id} className="border border-destructive/20 rounded-2xl p-4 bg-destructive/5 space-y-2">
                                <div className="flex justify-between items-start gap-4">
                                  <h6 className="text-sm font-extrabold text-destructive flex items-center gap-1.5">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {warning.violation_type || t("student.warningViolation")}
                                  </h6>
                                  <span className="text-[10px] text-muted-foreground font-medium font-sans">
                                    {warning.issued_at && formatDate(warning.issued_at)}
                                  </span>
                                </div>
                                <p className="text-xs text-foreground/80 font-bold leading-relaxed">
                                  {warning.message}
                                </p>
                                {warning.remaining_chances !== undefined && (
                                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold">
                                    {t("student.warningRemaining", { count: warning.remaining_chances })}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 4. SETTINGS INLINE TAB */}
            {/* {activeTab === "settings" && isOwnProfile && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h4 className="font-bold text-foreground text-lg border-b border-border/40 pb-2">
                  {t("student.settingsPage") || "Settings"}
                </h4>

                <form onSubmit={handleEditSubmit} className="space-y-6 max-w-xl mx-auto">
                  {/* Full Name (Disabled) */}
                  {/* <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/80 flex items-center gap-1">
                      {t("student.quadripartiteName") || "Full Name"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground z-10">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        disabled
                        value={profile.full_name}
                        className="w-full h-11 bg-muted/20 border border-border/40 text-muted-foreground text-sm font-bold rounded-xl px-3 ps-11 pe-11 cursor-not-allowed opacity-75 outline-none"
                      />
                      <div className="absolute inset-y-0 end-0 flex items-center pe-4 pointer-events-none text-muted-foreground z-10">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {t("student.cannotChangeExceptAdmin") || "Cannot be changed except by administration"}
                    </p>
                  </div> */}

                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
                    {/* Age */}
                    {/* <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground/80">
                        {t("auth.age") || "Age"}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground z-10">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <input
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="w-full h-11 bg-background/50 border border-border/60 text-foreground text-sm font-semibold rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary px-3 ps-11 transition-all outline-none cursor-text font-bold"
                          dir={isRTL ? "rtl" : "ltr"}
                        />
                      </div>
                    </div> */}

                    {/* Email */}
                    {/* <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground/80">
                        {t("common.email") || "Email"}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground z-10">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-11 bg-background/50 border border-border/60 text-foreground text-sm font-semibold rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary px-3 ps-11 transition-all outline-none text-left outline-none cursor-text font-bold"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div> */}

                  {/* Phone */}
                  {/* <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/80">
                      {t("student.currentWhatsapp") || "WhatsApp / Phone"}
                    </label>
                    <PhoneInput
                      value={phone}
                      onChange={(val) => {
                        setPhone(val);
                        if (val && !/^01[0125][0-9]{8}$/.test(val)) {
                          setPhoneError(t("validation.phoneInvalid") || "Invalid phone number format");
                        } else {
                          setPhoneError(null);
                        }
                      }}
                      hasError={!!phoneError}
                      icon={<Phone className="w-4 h-4 text-muted-foreground" />}
                    />
                    {phoneError && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <span>⚠️</span> {phoneError}
                      </p>
                    )}
                  </div> */}

                  {/* Submit Button */}
                  {/* <div className="flex justify-end pt-4 border-t border-border/40">
                    <Button
                      type="submit"
                      disabled={isSaving || !!phoneError}
                      className="rounded-xl font-bold py-3 px-6 bg-primary text-white hover:bg-primary/95 flex items-center gap-2 cursor-pointer transition-all active:scale-98 shadow-md shadow-primary/10 hover:shadow-primary/20"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                          {t("student.saving") || "Saving..."}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 shrink-0" />
                          {t("student.saveChanges") || "Save"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )} */}

          </div>
        </div>

      </div>

    </div>
  );
}
