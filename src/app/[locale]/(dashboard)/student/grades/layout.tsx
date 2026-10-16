import { sectionMetadata } from "@/lib/metadata";

export const generateMetadata = sectionMetadata("nav.grades");

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
