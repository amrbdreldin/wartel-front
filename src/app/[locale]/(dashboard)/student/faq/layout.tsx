import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr ? "الأسئلة الشائعة" : "FAQ",
    description: isAr
      ? "مركز الأسئلة الشائعة والدعم لطالبات منصة ورتل"
      : "Frequently Asked Questions and Student Support Center",
  };
}

export default function StudentFaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
