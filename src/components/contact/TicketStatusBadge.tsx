"use client";

import { cn } from "@/lib/utils";
import type { ContactThreadStatus } from "@/types/contact.types";
import { CheckCircle2, Clock, MessageSquareDot } from "lucide-react";
import { useTranslations } from "next-intl";

interface TicketStatusBadgeProps {
  status: ContactThreadStatus;
  label?: string;
  className?: string;
  showIcon?: boolean;
}

export function TicketStatusBadge({
  status,
  label,
  className,
  showIcon = true,
}: TicketStatusBadgeProps) {
  const t = useTranslations("contactUs");

  const normalizedStatus = String(status).toLowerCase();

  if (normalizedStatus === "pending_admin") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap",
          className
        )}
      >
        {showIcon && (
          <Clock className="hidden sm:inline-block w-3.5 h-3.5 shrink-0 animate-pulse text-amber-600 dark:text-amber-400" />
        )}
        <span>{label || t("pendingAdmin")}</span>
      </span>
    );
  }

  if (normalizedStatus === "pending_user") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap",
          className
        )}
      >
        {showIcon && (
          <MessageSquareDot className="hidden sm:inline-block w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        )}
        <span>{label || t("pendingUser")}</span>
      </span>
    );
  }

  if (normalizedStatus === "closed") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border whitespace-nowrap",
          className
        )}
      >
        {showIcon && <CheckCircle2 className="hidden sm:inline-block w-3.5 h-3.5 shrink-0" />}
        <span>{label || t("closedTickets")}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20",
        className
      )}
    >
      <span>{label || status}</span>
    </span>
  );
}
