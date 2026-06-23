"use client";

export function ChildCardSkeleton() {
  return (
    <div className="relative bg-card rounded-3xl border border-border/60 overflow-hidden shadow-sm p-5">
      {/* Top accent stripe skeleton */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted animate-pulse" />

      {/* Avatar + Name block */}
      <div className="flex items-center gap-4 mb-5 relative z-10">
        {/* Avatar ring skeleton */}
        <div className="w-16 h-16 rounded-2xl bg-muted animate-pulse shrink-0" />

        {/* Name + badge skeleton */}
        <div className="overflow-hidden flex-1 space-y-2.5">
          <div className="h-4 bg-muted rounded-md animate-pulse w-3/4" />
          <div className="h-5 bg-muted rounded-lg animate-pulse w-1/2" />
        </div>
      </div>

      {/* Action buttons skeleton */}
      <div className="grid grid-cols-2 gap-2.5 relative z-10">
        <div className="h-9 bg-muted rounded-xl animate-pulse" />
        <div className="h-9 bg-muted rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
