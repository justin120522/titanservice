"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const role = pathname.includes("/admin")
    ? "admin"
    : pathname.includes("/technician")
    ? "technician"
    : "customer";

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar role={role as "customer" | "technician" | "admin"} />
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
