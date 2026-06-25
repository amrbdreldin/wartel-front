"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

export function LandingFooter() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("landing.footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background pt-16 pb-8 border-t border-border/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href={`/${locale}`} className="text-3xl font-black text-primary tracking-tight block mb-4">
              وَرَتِّلْ
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              {t("desc")}
            </p>
            <div className="flex gap-3">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/profile.php?id=100084393630106"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              {/* Telegram */}
              <a
                href="https://t.me/+_mhvkTv6CH44MWFk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a
                href="https://wa.me/201229449474"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://www.youtube.com/@wartelacademy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4 text-lg">{t("quickLinks")}</h4>
            <ul className="space-y-3">
              <li>
                <Link href={`/${locale}/instructions?type=student`} className="text-muted-foreground hover:text-primary transition-colors">{t("regNew")}</Link>
              </li>
              <li><Link href={`/${locale}/login`} className="text-muted-foreground hover:text-primary transition-colors">{t("studentLogin")}</Link></li>
              <li><Link href={`/${locale}/instructions?type=parent`} className="text-muted-foreground hover:text-primary transition-colors">{t("parentLogin")}</Link></li>
            </ul>
          </div>

          {/* <div>
            <h4 className="font-bold text-foreground mb-4 text-lg">{t("support")}</h4>
            <ul className="space-y-3">
              <li><a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">{t("faq")}</a></li>
              <li><a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">{t("contact")}</a></li>
              <li><a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">{t("privacy")}</a></li>
              <li><a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">{t("terms")}</a></li>
            </ul>
          </div> */}
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">{t("rights")} {year}</p>
          <div className="text-sm text-muted-foreground/60">{t("madeBy")}</div>
        </div>
      </div>
    </footer>
  );
}
