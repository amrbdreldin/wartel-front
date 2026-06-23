import type { Metadata } from "next";
import { ParentAuthGuard } from "./_components/ParentAuthGuard";

// ============================================================
// Parent Layout – server component so it can export metadata
// ============================================================

export const metadata: Metadata = {
  title: "لوحة تحكم ولي الأمر",
};

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <ParentAuthGuard>{children}</ParentAuthGuard>;
}

