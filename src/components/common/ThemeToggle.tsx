"use client";

import { Button } from "@/components/ui/button";
import type { RootState } from "@/store";
import { selectTheme, setTheme } from "@/store/slices/uiSlice";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

// ============================================================
// ThemeToggle – Switch between light and dark mode
// ============================================================

export function ThemeToggle({ showText = false }: { showText?: boolean }) {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => selectTheme(state));
  const t = useTranslations("common");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    dispatch(setTheme(theme === "dark" ? "light" : "dark"));
  };

  if (showText) {
    return (
      <Button
        variant="ghost"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground cursor-pointer justify-start"
      >
        {theme === "dark" ? (
          <>
            <Sun className="h-5 w-5 shrink-0 text-muted-foreground" />
            <span>{t("lightMode")}</span>
          </>
        ) : (
          <>
            <Moon className="h-5 w-5 shrink-0 text-muted-foreground" />
            <span>{t("darkMode")}</span>
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="h-9 w-9 cursor-pointer"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
