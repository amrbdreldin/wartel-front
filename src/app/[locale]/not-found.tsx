import { Button } from "@/components/ui/button";
import Link from "next/link";

// ============================================================
// 404 – Not Found Page
// ============================================================

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        الصفحة غير موجودة
      </p>
      <Link href="/">
        <Button>العودة للرئيسية</Button>
      </Link>
    </div>
  );
}
