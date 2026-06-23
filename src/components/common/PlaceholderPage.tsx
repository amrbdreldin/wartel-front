"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";
import { useTranslations } from "next-intl";

// ============================================================
// PlaceholderPage – Coming soon indicator
// ============================================================

interface PlaceholderPageProps {
  titleKey: string;
}

export function PlaceholderPage({ titleKey }: PlaceholderPageProps) {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t(titleKey)}</h1>
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <Construction className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            {t("common.comingSoon")}
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            هذه الصفحة قيد التطوير وستكون متاحة قريبًا
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
