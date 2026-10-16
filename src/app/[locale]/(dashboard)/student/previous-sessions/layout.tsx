import { sectionMetadata } from "@/lib/metadata";

export const generateMetadata = sectionMetadata("nav.previousSessions");

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
