import type { Metadata } from "next";

// ============================================================
// Root Layout (minimal – locale layout handles everything)
// ============================================================

export const metadata: Metadata = {
  title: {
    template: "%s | ورتل",
    default: "ورتل - أكاديمية القرآن",
  },
  description: "منصة قرآنية متكاملة لإدارة الحلقات والتسميع والمتابعة",
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
