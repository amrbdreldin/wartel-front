import { AvailableGroupsView } from "@/components/groups/AvailableGroupsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المجموعات المتاحة - لوحة الطالب/ة | أكاديمية ورتل",
  description: "استعرض المجموعات المتاحة في أكاديمية ورتل ومواعيدها وقدّم طلب التحقق للانضمام.",
};

export default function StudentAvailableGroupsPage() {
  return <AvailableGroupsView />;
}
