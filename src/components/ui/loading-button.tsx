"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean;
  loadingText?: string;
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, isLoading, loadingText, className, disabled, ...props }, ref) => {
    const t = useTranslations("common");
    const defaultLoadingText = t("loading");

    return (
      <Button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn("relative transition-all duration-200", className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText || defaultLoadingText}
          </span>
        ) : (
          children
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";
