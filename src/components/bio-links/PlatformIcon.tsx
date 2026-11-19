"use client";

import { ExternalLink, Globe, Mail, MapPin, Phone } from "lucide-react";

export interface PlatformStyle {
  bg: string;
  text: string;
  border: string;
  accent: string;
}

const PLATFORM_STYLES: Record<string, PlatformStyle> = {
  facebook: {
    bg: "bg-[#1877F2]",
    text: "text-white",
    border: "hover:border-[#1877F2]/50",
    accent: "#1877F2",
  },
  youtube: {
    bg: "bg-[#FF0000]",
    text: "text-white",
    border: "hover:border-[#FF0000]/50",
    accent: "#FF0000",
  },
  linkedin: {
    bg: "bg-[#0A66C2]",
    text: "text-white",
    border: "hover:border-[#0A66C2]/50",
    accent: "#0A66C2",
  },
  instagram: {
    bg: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    text: "text-white",
    border: "hover:border-[#DD2A7B]/50",
    accent: "#DD2A7B",
  },
  twitter: {
    bg: "bg-neutral-900 dark:bg-neutral-800",
    text: "text-white",
    border: "hover:border-neutral-500/50",
    accent: "#111111",
  },
  tiktok: {
    bg: "bg-neutral-950 dark:bg-neutral-800",
    text: "text-white",
    border: "hover:border-[#FE2C55]/50",
    accent: "#FE2C55",
  },
  telegram: {
    bg: "bg-[#26A5E4]",
    text: "text-white",
    border: "hover:border-[#26A5E4]/50",
    accent: "#26A5E4",
  },
  whatsapp: {
    bg: "bg-[#25D366]",
    text: "text-white",
    border: "hover:border-[#25D366]/50",
    accent: "#25D366",
  },
  snapchat: {
    bg: "bg-[#FFFC00]",
    text: "text-neutral-950",
    border: "hover:border-[#E6B800]/60",
    accent: "#E6B800",
  },
  threads: {
    bg: "bg-neutral-900 dark:bg-neutral-800",
    text: "text-white",
    border: "hover:border-neutral-500/50",
    accent: "#111111",
  },
  website: {
    bg: "bg-emerald-600",
    text: "text-white",
    border: "hover:border-emerald-500/50",
    accent: "#059669",
  },
  email: {
    bg: "bg-indigo-600",
    text: "text-white",
    border: "hover:border-indigo-500/50",
    accent: "#4F46E5",
  },
  phone: {
    bg: "bg-sky-600",
    text: "text-white",
    border: "hover:border-sky-500/50",
    accent: "#0284C7",
  },
  location: {
    bg: "bg-rose-600",
    text: "text-white",
    border: "hover:border-rose-500/50",
    accent: "#E11D48",
  },
  other: {
    bg: "bg-slate-600",
    text: "text-white",
    border: "hover:border-slate-500/50",
    accent: "#475569",
  },
};

export function getPlatformStyle(platform: string): PlatformStyle {
  return PLATFORM_STYLES[platform] ?? PLATFORM_STYLES.other;
}

export function PlatformIcon({
  platform,
  className = "w-5 h-5",
}: {
  platform: string;
  className?: string;
}) {
  switch (platform) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      );
    case "telegram":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.188 8.188 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.72 2.75 4.24 3.75 2.1.83 2.52.66 2.98.62.45-.04 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42z" />
        </svg>
      );
    case "snapchat":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12.2 2c2.8 0 4.9 1.8 5.2 4.6.1.9 0 1.9-.1 2.6.3.1.6.1.9.1.5 0 .9.3 1 .7.1.4-.1.9-.6 1.1-.4.2-.8.4-1.1.7.3.8 1 1.7 2.2 2.2.5.2.8.7.6 1.2-.2.4-.7.7-1.2.6-.7-.1-1.3-.1-1.7.1-.3.2-.5.6-.7 1-.2.5-.7.8-1.3.7-.7-.1-1.3-.4-2-.4-.6 0-1.2.3-1.9.4-.6.1-1.1-.2-1.3-.7-.2-.4-.4-.8-.7-1-.4-.2-1-.2-1.7-.1-.5.1-1-.2-1.2-.6-.2-.5.1-1 .6-1.2 1.2-.5 1.9-1.4 2.2-2.2-.3-.3-.7-.5-1.1-.7-.5-.2-.7-.7-.6-1.1.1-.4.5-.7 1-.7.3 0 .6 0 .9-.1-.1-.7-.2-1.7-.1-2.6C7.3 3.8 9.4 2 12.2 2z" />
        </svg>
      );
    case "threads":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.432 1.784 3.632 2.697 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" />
        </svg>
      );
    case "website":
      return <Globe className={className} aria-hidden="true" />;
    case "email":
      return <Mail className={className} aria-hidden="true" />;
    case "phone":
      return <Phone className={className} aria-hidden="true" />;
    case "location":
      return <MapPin className={className} aria-hidden="true" />;
    default:
      return <ExternalLink className={className} aria-hidden="true" />;
  }
}
