"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Baby, UserPlus } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import {
  useParentChildren,
  useParentAddStudent,
  useParentLoginAsStudent,
} from "@/hooks/api/useParentQueries";
import { useRegisterFormDataQuery } from "@/hooks/api/useAuthMutations";
import { requestNotificationToken } from "@/utils/firebaseMessaging";
import { resolveRoleId } from "@/utils/role";

import { ParentHeader } from "./_components/ParentHeader";
import { ChildCard } from "./_components/ChildCard";
import { AddChildModal } from "./_components/AddChildModal";
import { ChildCardSkeleton } from "./_components/ChildCardSkeleton";

// ============================================================
// Parent Dashboard Page
// ============================================================

const initialValues = {
  full_name: "",
  age: "",
  phone: "",
  password: "",
  password_confirmation: "",
  user_type: "student",
  enrollment_type_id: "",
  selected_track_id: "",
  selected_group_id: "",
  quran_audio: null as File | null,
  quran_audio_duration: undefined as number | undefined,
};

export default function ParentDashboardPage() {
  const t = useTranslations("parent");
  const tCommon = useTranslations("common");
  const tNotifications = useTranslations("notifications");
  const tAuth = useTranslations("auth");
  const locale = useLocale();

  const { user, switchToChild } = useAuth();
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [switchingChildId, setSwitchingChildId] = useState<number | null>(null);
  const [fcmToken, setFcmToken] = useState("");

  useEffect(() => {
    const initFCM = async () => {
      const token = await requestNotificationToken(tNotifications("blocked_guide"), true);
      if (token) {
        setFcmToken(token);
      }
    };
    initFCM();
  }, [tNotifications]);

  // Queries & Mutations
  const { data: children, isLoading: isChildrenLoading } = useParentChildren();
  const { mutateAsync: addStudentMutateAsync, isPending: isAddPending } = useParentAddStudent();
  const { mutate: loginAsStudent, isPending: isSwitchingPending } = useParentLoginAsStudent();

  // Register Form Data (tracks, enrollment types, user roles)
  const { data: formData, isLoading: isFormDataLoading } = useRegisterFormDataQuery(5);

  const userRoles = formData?.user_roles ?? [];
  const enrollmentTypes = formData?.enrollment_types ?? [];

  const getEnrollmentTypeLabel = (type: string) => {
    const normalized = type?.toLowerCase();
    if (normalized === "academy" || normalized === "الأكاديمية" || normalized === "الأكاديميه") return tAuth("academy");
    if (normalized === "institute" || normalized === "المعهد") return tAuth("institute");
    return type;
  };

  const handleAddStudent = async (
    values: typeof initialValues,
    { resetForm }: any
  ) => {
    const fd = new FormData();
    fd.append("full_name", values.full_name);
    fd.append("phone", values.phone);
    if (values.enrollment_type_id) {
      fd.append("enrollment_type_id", values.enrollment_type_id);
    }
    if (values.selected_track_id) {
      fd.append("track_id", values.selected_track_id);
    }
    if (values.selected_group_id) {
      fd.append("group_id", values.selected_group_id);
    }
    if (values.quran_audio) {
      fd.append("audio_test_path", values.quran_audio);
    }
    fd.append("user_role_id", resolveRoleId("student", userRoles));
    if (fcmToken) {
      fd.append("firebase_token", fcmToken);
    }
    fd.append("age", values.age);
    fd.append("password", values.password);

    try {
      const res = await addStudentMutateAsync(fd);
      toast.success((res as any)?.message || t("childAddedSuccess"));
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to add student:", error);
    }
  };

  const handleViewProfile = (childId: number) => {
    router.push(`/${locale}/parent/children/${childId}/profile-details`);
  };

  const handleLoginAsChild = (child: { id: number; name: string }) => {
    setSwitchingChildId(child.id);
    loginAsStudent(child.id, {
      onSuccess: (res) => {
        const token = res.token || res.access_token || "";
        if (token) {
          switchToChild({
            user: res.user || { id: child.id, full_name: child.name, role: "student" as any, phone: "" },
            accessToken: token,
            refreshToken: res.refresh_token || "",
          });

          toast.success(t("loginAsChildSuccess", { name: child.name }));

          // Signal student layout that this is an intentional parent→student switch
          // so it skips the permission modal during the brief token-swap transition.
          if (typeof window !== "undefined") {
            sessionStorage.setItem("switching_to_student", "1");
          }

          setTimeout(() => {
            router.push(`/${locale}/student`);
          }, 150);
        } else {
          toast.error(tCommon("error") || "Error logging in");
        }
      },
      onError: (error: any) => {
        console.error("Failed to login as student:", error);
        toast.error(tCommon("error") || "Error logging in");
      },
      onSettled: () => {
        setSwitchingChildId(null);
      },
    });
  };

  return (
    <div className="animate-in fade-in duration-500 overflow-x-hidden">
      {/* Creative Parent Header Banner */}
      <ParentHeader
        userName={user?.full_name}
        onAddChildClick={() => setIsAddModalOpen(true)}
      />

      {/* Main Content */}
      <div className="relative z-20 pb-16">
        {/* Children Section Heading */}
        <div className="flex justify-between items-end mb-4 md:mb-6 px-1 sm:px-2">
          <h5 className="font-bold text-foreground text-base sm:text-lg flex items-center">
            {t("registeredChildren")}
            {children && children.length > 0 && (
              <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs mx-2 font-black">
                {children.length}
              </span>
            )}
          </h5>
        </div>

        {/* Dynamic Children Render */}
        {isChildrenLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-12">
            <ChildCardSkeleton />
            <ChildCardSkeleton />
            <div className="hidden sm:block">
              <ChildCardSkeleton />
            </div>
          </div>
        ) : !children || children.length === 0 ? (
          <div className="bg-card rounded-3xl p-12 text-center border-2 border-dashed border-border/80 flex flex-col items-center justify-center gap-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Baby className="w-8 h-8" />
            </div>
            <div>
              <h6 className="font-black text-foreground text-lg mb-1">{t("noChildren")}</h6>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">{t("liveUpdates")}</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 text-sm flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              <UserPlus className="w-4 h-4" />
              {t("addChild")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-12">
            {children.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                onViewProfile={handleViewProfile}
                onLoginAsChild={handleLoginAsChild}
                isLoggingIn={switchingChildId === child.id}
                isAnyLoggingIn={isSwitchingPending}
                getEnrollmentTypeLabel={getEnrollmentTypeLabel}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Add Student Modal */}
      <AddChildModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        isAddPending={isAddPending}
        enrollmentTypes={enrollmentTypes}
        isFormDataLoading={isFormDataLoading}
        onSubmit={handleAddStudent}
        initialValues={initialValues}
      />
    </div>
  );
}
