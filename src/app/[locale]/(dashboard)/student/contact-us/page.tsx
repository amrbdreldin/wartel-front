import { ContactUsView } from "@/components/contact/ContactUsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معنا - الرسائل والدعم الفني | أكاديمية ورتل",
  description:
    "تواصل مع إدارة أكاديمية ورتل واستفسر عن الحلقات وتابع رسائل الدعم الفني بكل سهولة.",
};

export default function StudentContactUsPage() {
  return <ContactUsView />;
}
