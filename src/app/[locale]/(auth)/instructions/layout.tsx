import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "معايير القبول",
};

export default function InstructionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
