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
  const faqs = response?.data || [];

  // Filter FAQs based on search input (matching question or answer)
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const q = searchQuery.toLowerCase().trim();
    return faqs.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [faqs, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <FaqHeader
        totalCount={faqs.length}
        filteredCount={filteredFaqs.length}
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
            faqs={filteredFaqs}
            totalCount={faqs.length}
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
