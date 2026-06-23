import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "استعادة كلمة المرور",
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
