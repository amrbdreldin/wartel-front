import type { Metadata } from "next";
import { StudentAuthGuard } from "./_components/StudentAuthGuard";

// ============================================================
// Student Layout – server component so it can export metadata
// ============================================================

export const metadata: Metadata = {
  title: "لوحة تحكم الطالب/ــة",
};

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentAuthGuard>{children}</StudentAuthGuard>;
}


