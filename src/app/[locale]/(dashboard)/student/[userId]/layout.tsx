import { sectionMetadata } from "@/lib/metadata";

export const generateMetadata = sectionMetadata("common.profile");

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
