import { roleLayoutMetadata } from "@/lib/metadata";
import { ParentAuthGuard } from "./_components/ParentAuthGuard";

// ============================================================
// Parent Layout – server component so it can export metadata
// ============================================================

export const generateMetadata = roleLayoutMetadata("meta.parentDashboard");

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <ParentAuthGuard>{children}</ParentAuthGuard>;
}

