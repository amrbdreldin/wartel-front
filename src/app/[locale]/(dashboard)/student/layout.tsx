import { roleLayoutMetadata } from "@/lib/metadata";
import { StudentAuthGuard } from "./_components/StudentAuthGuard";

// ============================================================
// Student Layout – server component so it can export metadata
// ============================================================

export const generateMetadata = roleLayoutMetadata("meta.studentDashboard");

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentAuthGuard>{children}</StudentAuthGuard>;
}


