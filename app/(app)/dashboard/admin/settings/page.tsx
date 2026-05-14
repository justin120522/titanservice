"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: "ServiceTitan",
    commissionRate: "15",
    taxRate: "8",
    supportEmail: "support@servicetitan.com",
    businessHoursStart: "08:00",
    businessHoursEnd: "18:00",
    enableSMS: true,
    enableEmailNotifs: true,
    enablePushNotifs: false,
    maintenanceMode: false,
  });

  const [prices, setPrices] = useState({
    repair: "149",
    maintenance: "89",
    installation: "199",
    cleaning: "79",
    inspection: "99",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (field: string, value: string | boolean) => setSettings((p) => ({ ...p, [field]: value }));
  const updatePrice = (field: string, value: string) => setPrices((p) => ({ ...p, [field]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl animate-fade-in-up">
      <h1 className="heading-display text-3xl mb-2">Platform <span className="gradient-text">Settings</span></h1>
      <p className="text-text-secondary mb-8">Configure system-wide settings, pricing, and policies.</p>

      {saved && (
        <div className="glass-card border-success/20 bg-success/5 mb-6 flex items-center gap-3 py-3">
          <span className="text-success">✓</span><span className="text-sm text-success">Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General */}
        <div className="glass-card">
          <h3 className="text-lg font-semibold text-text-primary mb-5">General</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Platform Name</label>
              <input type="text" value={settings.platformName} onChange={(e) => update("platformName", e.target.value)} className="glass-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Support Email</label>
              <input type="email" value={settings.supportEmail} onChange={(e) => update("supportEmail", e.target.value)} className="glass-input" />
            </div>
          </div>
        </div>

        {/* Service Prices */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-text-primary">Service Prices (₱)</h3>
            <span className="text-xs text-text-muted">Base price per service type</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: "repair", label: "Repair", icon: "🔧", desc: "Fix broken appliances" },
              { key: "maintenance", label: "Maintenance", icon: "⚙️", desc: "Preventive care" },
              { key: "installation", label: "Installation", icon: "📦", desc: "New appliance setup" },
              { key: "cleaning", label: "Cleaning", icon: "✨", desc: "Deep cleaning" },
              { key: "inspection", label: "Inspection", icon: "🔍", desc: "Diagnostic check" },
            ].map((s) => (
              <div key={s.key} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{s.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{s.label}</p>
                    <p className="text-[10px] text-text-muted">{s.desc}</p>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">₱</span>
                  <input
                    type="number"
                    value={prices[s.key as keyof typeof prices]}
                    onChange={(e) => updatePrice(s.key, e.target.value)}
                    className="glass-input pl-7 text-lg font-bold"
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fees & Tax */}
        <div className="glass-card">
          <h3 className="text-lg font-semibold text-text-primary mb-5">Fees & Tax</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Commission Rate (%)</label>
              <input type="number" value={settings.commissionRate} onChange={(e) => update("commissionRate", e.target.value)} className="glass-input" min="0" max="100" />
              <p className="text-xs text-text-muted mt-1">Platform fee taken from each booking</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Tax Rate (%)</label>
              <input type="number" value={settings.taxRate} onChange={(e) => update("taxRate", e.target.value)} className="glass-input" min="0" max="100" />
              <p className="text-xs text-text-muted mt-1">Applied to all bookings at checkout</p>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="glass-card">
          <h3 className="text-lg font-semibold text-text-primary mb-5">Business Hours</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Start Time</label>
              <input type="time" value={settings.businessHoursStart} onChange={(e) => update("businessHoursStart", e.target.value)} className="glass-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">End Time</label>
              <input type="time" value={settings.businessHoursEnd} onChange={(e) => update("businessHoursEnd", e.target.value)} className="glass-input" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card">
          <h3 className="text-lg font-semibold text-text-primary mb-5">Notifications</h3>
          <div className="space-y-4">
            {[
              { key: "enableEmailNotifs", label: "Email Notifications", desc: "Send email alerts for bookings and updates" },
              { key: "enableSMS", label: "SMS Notifications", desc: "Send SMS alerts via Twilio" },
              { key: "enablePushNotifs", label: "Push Notifications", desc: "Browser push notifications" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5">
                <div>
                  <p className="text-sm font-medium text-text-primary">{item.label}</p>
                  <p className="text-xs text-text-muted">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => update(item.key, !settings[item.key as keyof typeof settings])}
                  className={`w-12 h-7 rounded-full transition-all relative ${settings[item.key as keyof typeof settings] ? "bg-primary" : "bg-white/10"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${settings[item.key as keyof typeof settings] ? "left-6" : "left-1"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-card border-danger/20">
          <h3 className="text-lg font-semibold text-danger mb-5">Danger Zone</h3>
          <div className="flex items-center justify-between p-4 rounded-lg bg-danger/5 border border-danger/10">
            <div>
              <p className="text-sm font-medium text-text-primary">Maintenance Mode</p>
              <p className="text-xs text-text-muted">Temporarily disable the platform for maintenance</p>
            </div>
            <button
              type="button"
              onClick={() => update("maintenanceMode", !settings.maintenanceMode)}
              className={`w-12 h-7 rounded-full transition-all relative ${settings.maintenanceMode ? "bg-danger" : "bg-white/10"}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${settings.maintenanceMode ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
          {saving ? (<div className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</div>) : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
