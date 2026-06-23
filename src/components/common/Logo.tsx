import { cn } from "@/lib/utils";

// ============================================================
// Logo – Wartel Academy Logo
// ============================================================

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-14 w-14",
};

const textSizeMap = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-3xl",
};

import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const locale = useLocale();
  return (
    <Link href={`/${locale}`} className={cn("flex items-center gap-3 cursor-pointer", className)}>
      <Image
        src="/logo.png"
        alt="Waratel Logo"
        width={56}
        height={56}
        className={cn(
          "object-contain rounded-xl",
          sizeMap[size]
        )}
      />
      {showText && (
        <span
          className={cn(
            "font-heading font-black text-foreground tracking-tight",
            textSizeMap[size]
          )}
        >
           أكاديمية ورتل
        </span>
      )}
    </Link>
  );
}
