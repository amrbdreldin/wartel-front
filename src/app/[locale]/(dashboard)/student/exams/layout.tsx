import { sectionMetadata } from "@/lib/metadata";

export const generateMetadata = sectionMetadata("nav.exams");

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
