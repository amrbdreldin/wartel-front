"use client";

import { LocaleSwitcher } from "@/components/common/LocaleSwitcher";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Logo } from "@/components/common/Logo";


import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/enums";
import { GraduationCap, LayoutDashboard, LogOut, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("landing.nav");
  const tCommon = useTranslations("common");
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const initials = user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  // Determine role-based dashboard and extra page links
  const role = user?.role;
  const dashboardHref =
    role === UserRole.STUDENT
      ? `/${locale}/student`
      : role === UserRole.PARENT
        ? `/${locale}/parent`
        : role === UserRole.TEACHER
          ? `/${locale}/teacher`
          : `/${locale}`;



  const protectedLinks: { label: string; href: string; icon: React.ElementType }[] = [];
  if (role === UserRole.STUDENT) {
    protectedLinks.push(
      { label: tCommon("dashboard"), href: `/${locale}/student`, icon: LayoutDashboard },
      { label: tCommon("profile"), href: `/${locale}/student/${user?.id || ""}/profile-details`, icon: GraduationCap }
    );
  } else if (role === UserRole.PARENT) {
    protectedLinks.push(
      { label: tCommon("dashboard"), href: `/${locale}/parent`, icon: LayoutDashboard },
    );
  } else if (role === UserRole.TEACHER) {
    protectedLinks.push(
      { label: tCommon("dashboard"), href: `/${locale}/teacher`, icon: LayoutDashboard }
    );
  }

  return (
    <nav
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        scrolled
          ? "py-2 bg-surface/85 backdrop-blur-md border-b border-primary/10 shadow-sm"
          : "py-4 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <Logo size="md" />

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-primary font-semibold">
          <a
            href="#about"
            className="px-4 py-2 rounded-full text-sm font-bold text-primary/80 hover:text-primary hover:bg-primary/5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            {t("vision")}
          </a>
          <a
            href="#features"
            className="px-4 py-2 rounded-full text-sm font-bold text-primary/80 hover:text-primary hover:bg-primary/5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            {t("features")}
          </a>
          <a
            href="#programs"
            className="px-4 py-2 rounded-full text-sm font-bold text-primary/80 hover:text-primary hover:bg-primary/5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            {t("tracks")}
          </a>
          <a
            href="#faq"
            className="px-4 py-2 rounded-full text-sm font-bold text-primary/80 hover:text-primary hover:bg-primary/5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            {t("faq")}
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LocaleSwitcher />

          {isAuthenticated && user ? (
            /* ── Authenticated: user avatar - direct link to dashboard ── */
            <Link
              href={dashboardHref}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              aria-label={t("myAccount")}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-semibold text-foreground max-w-[120px] truncate">
                {user.full_name}
              </span>
            </Link>
          ) : (
            /* ── Unauthenticated: Login + Register buttons ──────────── */
            <>
              {/* <Link
                href={`/${locale}/instructions?type=student`}
                className="hidden md:inline-flex items-center justify-center h-9 px-5 rounded-lg border border-primary bg-background text-primary font-bold hover:bg-primary/5 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {t("createAccount")}
              </Link> */}
              <Link
                href={`/${locale}/login`}
                className="hidden md:inline-flex items-center justify-center h-9 px-6 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {t("login")}
              </Link>
            </>
          )}

          {/* Mobile Hamburger Menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-10 w-10 cursor-pointer outline-none transition-colors">
              <Menu className="h-6 w-6 text-foreground" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-6 bg-background/95 backdrop-blur-xl border-l-primary/10">
              <SheetHeader className="text-right pb-6 border-b border-border/50">
                <SheetTitle>
                  <Logo size="md" />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 py-8">
                <a href="#about" onClick={() => setMenuOpen(false)} className="text-lg font-bold text-foreground hover:text-primary transition-colors">{t("vision")}</a>
                <a href="#features" onClick={() => setMenuOpen(false)} className="text-lg font-bold text-foreground hover:text-primary transition-colors">{t("features")}</a>
                <a href="#programs" onClick={() => setMenuOpen(false)} className="text-lg font-bold text-foreground hover:text-primary transition-colors">{t("tracks")}</a>
                <a href="#faq" onClick={() => setMenuOpen(false)} className="text-lg font-bold text-foreground hover:text-primary transition-colors">{t("faq")}</a>

                <div className="mt-6 pt-6 border-t border-border/50 flex flex-col gap-4">
                  {isAuthenticated && user ? (
                    /* Mobile: authenticated state */
                    <>
                      <div className="flex items-center gap-3 pb-3 border-b border-border/30">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-sm text-foreground truncate">{user.full_name}</span>
                      </div>
                      <Link
                        href={dashboardHref}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-md"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {t("goToDashboard")}
                      </Link>
                      {/* <button
                        onClick={logout}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-destructive/20 bg-destructive/5 text-destructive font-bold hover:bg-destructive/10 transition-all"
                      >
                        <LogOut className="h-4 w-4" />
                        {tCommon("logout")}
                      </button> */}
                    </>
                  ) : (
                    /* Mobile: unauthenticated state */
                    <>
                      <Link href={`/${locale}/login`} className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-md">
                        {t("login")}
                      </Link>
                      {/* <Link href={`/${locale}/instructions?type=student`} className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 border-primary/20 bg-primary/5 text-primary font-bold hover:bg-primary/10 transition-all">
                        {t("createAccount")}
                      </Link> */}
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
