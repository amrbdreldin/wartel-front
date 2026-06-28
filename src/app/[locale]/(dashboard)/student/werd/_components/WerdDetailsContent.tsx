"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { BookOpen, GitBranch, Sparkles } from "lucide-react";

interface WerdDetailsContentProps {
  description?: string;
  similar?: string;
  tdbor?: string | null;
}

function FormattedText({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split(/\r?\n/).filter(Boolean);
  return (
    <div className="space-y-1.5 text-sm leading-relaxed text-foreground/80 font-medium whitespace-pre-line direction-auto">
      {lines.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm space-y-5", className)}>
      <div className="flex items-center gap-3 pb-4 border-b border-border/40">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="font-bold text-lg text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function WerdDetailsContent({ description, similar, tdbor }: WerdDetailsContentProps) {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      {/* Description */}
      <SectionCard icon={BookOpen} title={t("student.werd.description")}>
        {description ? (
          <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-border/60 scrollbar-track-transparent pr-1">
            <FormattedText text={description} />
          </div>
        ) : (
          <p className="text-muted-foreground text-sm italic">{t("student.werd.noDescription")}</p>
        )}
      </SectionCard>

      {/* Similar Verses */}
      {similar && (
        <SectionCard icon={GitBranch} title={t("student.werd.similar")}>
          <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-border/60 scrollbar-track-transparent pr-1">
            <FormattedText text={similar} />
          </div>
        </SectionCard>
      )}

      {/* Reflection (Tdbor) */}
      {tdbor && (
        <SectionCard icon={Sparkles} title={t("student.werd.tdbor")}>
          <FormattedText text={tdbor} />
        </SectionCard>
      )}
    </div>
  );
}
