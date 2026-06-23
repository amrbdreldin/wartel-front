"use client";

import { ClipboardList, Shield, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { RequestForm } from "./_components/RequestForm";
import { RequestsTable } from "./_components/RequestsTable";

// ============================================================
// Teacher Leave & Postponement Requests Page
// ============================================================
export default function TeacherRequestsPage() {
  const t = useTranslations();

  return (
    <div className="space-y-10 animate-in fade-in duration-500">

      {/* Page Header */}
      <div className="pb-6 border-b border-border/50">
        <h3 className="text-2xl font-bold flex items-center gap-3 text-foreground">
          <ClipboardList className="h-7 w-7 text-accent" />
          {t("teacherBoard.excusesAndLeavesCenter")}
        </h3>
      </div>

      {/* Main Content */}
      <div className="pb-16">

        {/* Info Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 mb-10 shadow-sm flex items-center gap-6 overflow-hidden relative">
          <div className="w-16 h-16 shrink-0 bg-primary/10 text-primary rounded-2xl flex justify-center items-center shadow-sm z-10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <h5 className="font-bold text-primary text-lg mb-1">{t("teacherBoard.smartRequestsSystem")}</h5>
            <p className="text-primary/80 text-sm m-0">{t("teacherBoard.smartRequestsDesc")}</p>
          </div>
          <Shield className="w-64 h-64 absolute rtl:left-[-2rem] ltr:right-[-2rem] opacity-5 text-primary z-0 stroke-[1]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Submit Request Form */}
          <div className="lg:col-span-4">
            <RequestForm />
          </div>

          {/* Requests History Table */}
          <div className="lg:col-span-8">
            <RequestsTable />
          </div>

        </div>
      </div>
    </div>
  );
}
