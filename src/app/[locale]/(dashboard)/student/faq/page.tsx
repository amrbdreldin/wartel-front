"use client";

import { FaqBrowser } from "@/components/common/FaqBrowser";
import { useFaqs } from "@/hooks/api/useFaqQueries";
import { useTranslations } from "next-intl";
import { FaqHeader } from "./_components/FaqHeader";
import { FaqSupportCards } from "./_components/FaqSupportCards";

export default function StudentFaqPage() {
  const t = useTranslations("student.faq");
  const { data: response, isLoading, isError, refetch } = useFaqs();
  const categories = response?.data || [];
  const totalCount = categories.reduce((sum, c) => sum + c.data.length, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      <FaqHeader
        totalCount={totalCount}
        isLoading={isLoading}
        isError={isError}
      />

      <FaqBrowser
        categories={categories}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        searchPlaceholder={t("searchPlaceholder")}
        sidebarFooter={<FaqSupportCards />}
      />

      {/* Support cards live in the sidebar on desktop; show them under the list on mobile */}
      <div className="lg:hidden">
        <FaqSupportCards />
      </div>
    </div>
  );
}
