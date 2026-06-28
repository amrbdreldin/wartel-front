"use client";

import { Scroll } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { studentService } from "@/services/student.service";
import { WerdTable } from "./_components/WerdTable";

export default function WerdPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-werds"],
    queryFn: () => studentService.getWerds(),
  });

  const werds = data?.data || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="pb-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-2xl">
            <Scroll className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("student.werd.pageTitle")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("student.werd.pageSubtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Werd Table Component */}
      <WerdTable
        werds={werds}
        isLoading={isLoading}
        isError={isError}
        error={error}
        locale={locale}
      />
    </div>
  );
}
