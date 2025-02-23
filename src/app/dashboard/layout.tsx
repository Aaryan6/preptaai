import { NavBar } from "@/components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
