import { roleLayoutMetadata } from "@/lib/metadata";
import { TeacherAuthGuard } from "./_components/TeacherAuthGuard";

// ============================================================
// Teacher Layout – server component so it can export metadata
// ============================================================

export const generateMetadata = roleLayoutMetadata("meta.teacherDashboard");

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <TeacherAuthGuard>{children}</TeacherAuthGuard>;
}

