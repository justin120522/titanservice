"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  role: "customer" | "technician" | "admin";
}

const menuItems = {
  customer: [
    { label: "Dashboard", href: "/dashboard/customer", icon: "📊" },
    { label: "Book Service", href: "/dashboard/customer/book-service", icon: "📅" },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: "📋" },
    { label: "Profile", href: "/dashboard/customer/profile", icon: "👤" },
  ],
  technician: [
    { label: "Dashboard", href: "/dashboard/technician", icon: "📊" },
    { label: "Jobs", href: "/dashboard/technician/jobs", icon: "🔧" },
    { label: "Profile", href: "/dashboard/technician/profile", icon: "👤" },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard/admin", icon: "📊" },
    { label: "Technicians", href: "/dashboard/admin/technicians", icon: "🔧" },
    { label: "Customers", href: "/dashboard/admin/customers", icon: "👥" },
    { label: "Bookings", href: "/dashboard/admin/bookings", icon: "📋" },
    { label: "Revenue", href: "/dashboard/admin/revenue", icon: "💰" },
    { label: "Settings", href: "/dashboard/admin/settings", icon: "⚙️" },
    { label: "Profile", href: "/dashboard/admin/profile", icon: "👤" },
  ],
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = menuItems[role];

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-white/5 bg-surface/50 backdrop-blur-xl">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
            ST
          </div>
          <span className="text-lg font-bold tracking-tight">
            Service<span className="text-primary">Titan</span>
          </span>
        </Link>
      </div>

      {/* Role Badge */}
      <div className="px-6 py-4">
        <div className="glass rounded-lg px-3 py-2 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${role === "admin" ? "bg-danger" : role === "technician" ? "bg-accent" : "bg-success"}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {role} Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/5">
        <div className="text-center">
          <p className="text-[10px] text-text-muted">© 2025 ServiceTitan</p>
        </div>
      </div>
    </aside>
  );
}
