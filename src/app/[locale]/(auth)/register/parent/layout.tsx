import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل ولي أمر",
};

export default function ParentRegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
