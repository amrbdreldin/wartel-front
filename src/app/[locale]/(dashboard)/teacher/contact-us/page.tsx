import { ContactUsView } from "@/components/contact/ContactUsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معنا - نظام التذاكر للمعلمين | أكاديمية ورتل",
  description:
    "تواصل مع إدارة أكاديمية ورتل واستفسر عن الحلقات والطلبات وتابع تذاكر الدعم الفني بكل سهولة.",
};

export default function TeacherContactUsPage() {
  return <ContactUsView />;
}
