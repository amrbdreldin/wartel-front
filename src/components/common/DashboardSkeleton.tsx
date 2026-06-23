"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse select-none pointer-events-none opacity-50 blur-[1px]">
      {/* Header Skeleton */}
      <div className="pb-6 border-b border-border/50">
        <div className="space-y-3">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>
      </div>

      {/* Grid Cards (4 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-6 w-32 rounded-lg" />
              <div className="space-y-1.5 pt-2 border-t border-border/40">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Section Content Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-border/40">
              <Skeleton className="h-6 w-48 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
            <div className="space-y-4 pt-2">
              {[1, 2, 3].map((row) => (
                <div key={row} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-40 rounded-md" />
                      <Skeleton className="h-3.5 w-28 rounded-md" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width on desktop) */}
        <div className="space-y-6">
          <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-4">
            <Skeleton className="h-6 w-36 rounded-lg pb-2 border-b border-border/40" />
            <div className="flex justify-center py-6">
              <div className="relative flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-muted flex items-center justify-center">
                  <Skeleton className="w-24 h-24 rounded-full" />
                </div>
              </div>
            </div>
            <div className="space-y-2 text-center">
              <Skeleton className="h-4 w-2/3 mx-auto rounded-md" />
              <Skeleton className="h-3.5 w-1/2 mx-auto rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
