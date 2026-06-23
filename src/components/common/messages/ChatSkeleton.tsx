"use client";

import { cn } from "@/lib/utils";

interface ChatSkeletonProps {
  showSidebar?: boolean;
}

export function ChatSkeleton({ showSidebar = false }: ChatSkeletonProps) {
  return (
    <div
      className={cn(
        "max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-3 lg:gap-6 px-0 lg:px-4 animate-pulse",
        !showSidebar && "max-w-5xl"
      )}
    >
      {/* Mobile Dropdown Skeleton */}
      {showSidebar && (
        <div className="w-full h-[50px] bg-card border border-border/40 rounded-2xl p-3 flex items-center justify-between lg:hidden shrink-0">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-4 h-4 bg-muted rounded shrink-0" />
            <div className="space-y-1.5 flex-grow min-w-0">
              <div className="w-24 h-3 bg-muted rounded" />
              <div className="w-32 h-2.5 bg-muted rounded" />
            </div>
          </div>
          <div className="w-4 h-4 bg-muted rounded shrink-0" />
        </div>
      )}

      {/* Desktop Sidebar Skeleton */}
      {showSidebar && (
        <div className="hidden lg:flex lg:w-72 shrink-0 bg-card border border-border/40 rounded-2xl lg:rounded-3xl p-3 lg:p-4 flex-col h-auto lg:h-full overflow-hidden shadow-sm">
          <div className="w-24 lg:w-32 h-4 lg:h-5 bg-muted rounded mb-3 lg:mb-6" />
          <div className="flex flex-col gap-2 lg:space-y-3 flex-grow overflow-hidden w-full">
            <div className="w-full h-12 lg:h-16 bg-muted rounded-xl lg:rounded-2xl shrink-0" />
            <div className="w-full h-12 lg:h-16 bg-muted rounded-xl lg:rounded-2xl shrink-0" />
            <div className="w-full h-12 lg:h-16 bg-muted rounded-xl lg:rounded-2xl shrink-0" />
          </div>
        </div>
      )}
      {/* Chat Area Skeleton */}
      <div
        className={cn(
          "flex-grow bg-card border border-border/40 rounded-2xl lg:rounded-3xl flex flex-col overflow-hidden shadow-sm h-full"
        )}
      >
        {/* Header */}
        <div className="p-3 md:p-4 border-b border-border/40 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-muted" />
            <div className="space-y-2">
              <div className="w-20 md:w-24 h-3 md:h-4 bg-muted rounded" />
              <div className="w-28 md:w-32 h-2.5 md:h-3 bg-muted rounded" />
            </div>
          </div>
        </div>
        {/* Body Feed */}
        <div className="flex-grow p-4 md:p-6 space-y-4 md:space-y-6 bg-muted/5">
          <div className="flex gap-3 max-w-[80%] md:max-w-[60%]">
            <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
            <div className="space-y-2 flex-grow">
              <div className="w-16 md:w-20 h-3 bg-muted rounded" />
              <div className="w-full h-10 md:h-12 bg-muted rounded-xl md:rounded-2xl" />
            </div>
          </div>
          <div className="flex gap-3 max-w-[70%] md:max-w-[50%] ms-auto justify-end">
            <div className="space-y-2 flex-grow flex flex-col items-end">
              <div className="w-12 md:w-16 h-3 bg-muted rounded" />
              <div className="w-full h-12 md:h-14 bg-muted rounded-xl md:rounded-2xl" />
            </div>
          </div>
        </div>
        {/* Input */}
        <div className="p-2.5 md:p-4 border-t border-border/40 bg-card flex items-center gap-2.5 md:gap-3">
          <div className="flex-grow h-9 md:h-12 bg-muted rounded-xl md:rounded-2xl" />
          <div className="w-9 h-9 md:w-12 md:h-12 bg-muted rounded-xl md:rounded-2xl shrink-0" />
        </div>
      </div>
    </div>
  );
}
