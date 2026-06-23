// ============================================================
// Auth Layout – Islamic-inspired, premium auth experience
// Each sub-route defines its own title via its own layout.tsx
// ============================================================

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {children}
    </div>
  );
}
