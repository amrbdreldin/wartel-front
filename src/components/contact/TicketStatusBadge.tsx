"use client";

import { cn } from "@/lib/utils";
import type { ContactThreadStatus } from "@/types/contact.types";
import { THREAD_STATUS, normalizeThreadStatus } from "@/utils/contactThread";
import { CheckCircle2, Clock, MessageSquareDot, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface TicketStatusBadgeProps {
  status: ContactThreadStatus;
  label?: string;
  className?: string;
  showIcon?: boolean;
}

const STATUS_STYLES: Record<string, { className: string; icon: LucideIcon; labelKey: string; iconClassName?: string }> = {
  [THREAD_STATUS.PENDING_ADMIN]: {
    className: "font-semibold bg-warning-50 text-warning-600 dark:text-warning-400 border-warning-100",
    icon: Clock,
    iconClassName: "motion-safe:animate-pulse",
    labelKey: "pendingAdmin",
  },
  [THREAD_STATUS.PENDING_USER]: {
    className: "font-semibold bg-success-50 text-success-600 dark:text-success-400 border-success-100",
    icon: MessageSquareDot,
    labelKey: "pendingUser",
  },
  [THREAD_STATUS.CLOSED]: {
    className: "font-medium bg-muted text-muted-foreground border-border",
    icon: CheckCircle2,
    labelKey: "closedTickets",
  },
};

export function TicketStatusBadge({
  status,
  label,
  className,
  showIcon = true,
}: TicketStatusBadgeProps) {
  const t = useTranslations("contactUs");
  const style = STATUS_STYLES[normalizeThreadStatus(status)];

  if (!style) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 whitespace-nowrap",
          className
        )}
      >
        {label || status}
      </span>
    );
  }

  const Icon = style.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs border whitespace-nowrap",
        style.className,
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn("hidden sm:inline-block w-3.5 h-3.5 shrink-0", style.iconClassName)}
          aria-hidden="true"
        />
      )}
      {/* Known statuses use our translation — the backend `status_label` ignores Accept-Language */}
      <span>{t(style.labelKey)}</span>
    </span>
  );
}
