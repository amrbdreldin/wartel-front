import { ContactUsView } from "@/components/contact/ContactUsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معنا - نظام التذاكر لأولياء الأمور | أكاديمية ورتل",
  description:
    "تواصل مع إدارة أكاديمية ورتل واستفسر عن حلقات الأبناء وتابع تذاكر الدعم الفني بكل سهولة.",
};

export default function ParentContactUsPage() {
  return <ContactUsView />;
}
