import { ContactUsView } from "@/components/contact/ContactUsView";
import { generateContactMetadata } from "@/components/contact/contactMetadata";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return generateContactMetadata(params);
}

export default function ParentContactUsPage() {
  return <ContactUsView />;
}
