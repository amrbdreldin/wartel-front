import { ContactUsView } from "@/components/contact/ContactUsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معنا - نظام التذاكر | أكاديمية ورتل",
  description:
    "تواصل مع إدارة أكاديمية ورتل واستفسر عن الحلقات وتابع تذاكر الدعم الفني بكل سهولة.",
};

export default function StudentContactUsPage() {
  return <ContactUsView />;
}
