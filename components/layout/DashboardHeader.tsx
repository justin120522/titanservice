"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser, clearUser, getInitials } from "@/lib/auth";

export default function DashboardHeader() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useCurrentUser();

  const role = pathname.includes("/admin") ? "admin" : pathname.includes("/technician") ? "technician" : "customer";

  const mobileItems = {
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

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Welcome to ServiceTitan!", message: `Hello ${user?.name?.split(" ")[0] || "there"}, your account is all set up.`, time: "Just now", unread: true, icon: "🎉" },
    { id: 2, title: "Complete Your Profile", message: "Add your details to get the best experience.", time: "1m ago", unread: true, icon: "👤" },
    { id: 3, title: "System Update", message: "Platform maintenance scheduled for this weekend.", time: "1h ago", unread: false, icon: "🔔" },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const dismissNotif = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    setNotifOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-surface/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden btn btn-glass btn-icon" aria-label="Menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
            {/* Mobile Logo */}
            <Link href="/" className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">ST</div>
            </Link>
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 glass-input max-w-xs py-2 px-3">
              <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm text-text-primary placeholder-text-muted w-full" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Badge */}
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
              role === "admin" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
              role === "technician" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
              "bg-sky-500/10 text-sky-400 border border-sky-500/20"
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                role === "admin" ? "bg-rose-400" : role === "technician" ? "bg-amber-400" : "bg-sky-400"
              }`} />
              {role}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="btn btn-glass btn-icon relative">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full text-[10px] font-bold flex items-center justify-center text-white animate-pulse">{unreadCount}</span>
                )}
              </button>

              {notifOpen && (
                <>
                  {/* Backdrop to close on outside click */}
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 glass-strong rounded-xl overflow-hidden z-50 shadow-2xl shadow-black/40">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Notifications {unreadCount > 0 && <span className="text-primary ml-1">({unreadCount})</span>}</h3>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs text-primary hover:text-primary-light transition-colors">Mark all read</button>
                        )}
                        {notifications.length > 0 && (
                          <button onClick={clearAll} className="text-xs text-text-muted hover:text-danger transition-colors">Clear all</button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <span className="text-3xl block mb-2">🔔</span>
                          <p className="text-sm text-text-muted">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group ${n.unread ? "bg-primary/5" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-lg flex-shrink-0">{n.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-text-primary">{n.title}</p>
                                  {n.unread && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                                </div>
                                <p className="text-xs text-text-secondary mt-0.5 truncate">{n.message}</p>
                                <p className="text-xs text-text-muted mt-1">{n.time}</p>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); dismissNotif(n.id); }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-danger p-1"
                                title="Dismiss"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sign Out */}
            <button onClick={() => { clearUser(); window.location.href = "/login"; }} className="btn btn-glass btn-sm text-xs hidden sm:flex">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>

            {/* User Avatar → links to Profile */}
            <Link
              href={`/dashboard/${role}/profile`}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:shadow-lg hover:scale-110 transition-all ${
                role === "admin" ? "bg-gradient-to-br from-rose-400 to-red-600 hover:shadow-rose-500/20" :
                role === "technician" ? "bg-gradient-to-br from-amber-400 to-orange-600 hover:shadow-amber-500/20" :
                "bg-gradient-to-br from-sky-400 to-blue-600 hover:shadow-primary/20"
              }`}
              title="My Profile"
            >
              {user ? getInitials(user.name) : "??"}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-72 h-full bg-surface border-r border-white/5 animate-slide-left p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">ST</div>
              <span className="text-lg font-bold">Service<span className="text-primary">Titan</span></span>
            </div>
            <nav className="space-y-1">
              {mobileItems[role as keyof typeof mobileItems].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${pathname === item.href ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-white/5"}`}>
                  <span className="text-lg">{item.icon}</span>{item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
