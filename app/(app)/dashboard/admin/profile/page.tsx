"use client";

import { useState, useEffect } from "react";
import { useCurrentUser, getInitials, saveUser, type AuthUser } from "@/lib/auth";

export default function AdminProfilePage() {
  const { user, loading } = useCurrentUser();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (user) {
      const updatedUser: AuthUser = { ...user, name: form.name, email: form.email, phone: form.phone };
      saveUser(updatedUser);
    }
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="animate-pulse text-text-muted p-8">Loading profile...</div>;

  const initials = user ? getInitials(user.name) : "AD";
  const memberDate = user ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";

  return (
    <div className="max-w-2xl animate-fade-in-up">
      <h1 className="heading-display text-3xl mb-2">Admin <span className="gradient-text">Profile</span></h1>
      <p className="text-text-secondary mb-8">Manage your administrator account.</p>

      {saved && (
        <div className="glass-card border-success/20 bg-success/5 mb-6 flex items-center gap-3 py-3">
          <span className="text-success">✓</span>
          <span className="text-sm text-success">Profile updated successfully!</span>
        </div>
      )}

      {/* Avatar */}
      <div className="glass-card mb-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-400 to-red-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-rose-500/20">{initials}</div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{form.name || "Admin"}</h3>
            <p className="text-sm text-text-muted mb-1">Administrator · Member since {memberDate}</p>
            <span className="badge text-rose-400 bg-rose-400/10 border-rose-400/20">🛡️ Admin</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-card">
          <h3 className="text-lg font-semibold text-text-primary mb-5">Account Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className="glass-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="glass-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="glass-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Role</label>
              <input type="text" value="Administrator" disabled className="glass-input opacity-50 cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="text-lg font-semibold text-text-primary mb-5">Security</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Current Password</label>
              <input type="password" className="glass-input" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">New Password</label>
              <input type="password" className="glass-input" placeholder="••••••••" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
          {saving ? (<div className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</div>) : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
