"use client";

import { useFaqs } from "@/hooks/api/useFaqQueries";
import { useMemo, useState } from "react";
import { FaqAccordionList } from "./_components/FaqAccordionList";
import { FaqHeader } from "./_components/FaqHeader";
import { FaqSearch } from "./_components/FaqSearch";
import { FaqSupportCards } from "./_components/FaqSupportCards";

export default function StudentFaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: response, isLoading, isError, refetch } = useFaqs();
  const categories = useMemo(() => response?.data || [], [response]);
  const totalCount = categories.reduce((sum, c) => sum + c.data.length, 0);

  // Filter FAQs inside each category (matching question or answer), dropping empty categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories
      .map((category) => ({
        ...category,
        data: category.data.filter(
          (item) =>
            item.question.toLowerCase().includes(q) ||
            item.answer.toLowerCase().includes(q)
        ),
      }))
      .filter((category) => category.data.length > 0);
  }, [categories, searchQuery]);
  const filteredCount = filteredCategories.reduce(
    (sum, c) => sum + c.data.length,
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <FaqHeader
        totalCount={totalCount}
        filteredCount={filteredCount}
        isSearching={Boolean(searchQuery.trim())}
        isLoading={isLoading}
        isError={isError}
      />

      {/* Live Search Bar */}
      <FaqSearch value={searchQuery} onChange={setSearchQuery} />

      {/* Main Grid: FAQ List + Support Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <FaqAccordionList
            categories={filteredCategories}
            totalCount={totalCount}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            isSearching={Boolean(searchQuery.trim())}
            onClearSearch={() => setSearchQuery("")}
          />
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <FaqSupportCards />
        </aside>
      </div>
    </div>
  );
}
