import { ContactUsView } from "@/components/contact/ContactUsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معنا - الرسائل والدعم الفني لأولياء الأمور | أكاديمية ورتل",
  description:
    "تواصل مع إدارة أكاديمية ورتل واستفسر عن حلقات الأبناء وتابع رسائل الدعم الفني بكل سهولة.",
};

export default function ParentContactUsPage() {
  return <ContactUsView />;
}
