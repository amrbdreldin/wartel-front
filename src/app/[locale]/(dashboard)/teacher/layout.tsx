import type { Metadata } from "next";
import { TeacherAuthGuard } from "./_components/TeacherAuthGuard";

// ============================================================
// Teacher Layout – server component so it can export metadata
// ============================================================

export const metadata: Metadata = {
  title: "لوحة تحكم الأستاذ/ة",
};

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <TeacherAuthGuard>{children}</TeacherAuthGuard>;
}

