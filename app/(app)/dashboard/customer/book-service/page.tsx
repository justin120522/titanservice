"use client";

import { useState, useEffect, useRef } from "react";
import { useCurrentUser } from "@/lib/auth";
import dynamic from "next/dynamic";

const serviceTypes = [
  { value: "repair", label: "Repair", icon: "🔧", desc: "Fix broken appliances", price: 149 },
  { value: "maintenance", label: "Maintenance", icon: "⚙️", desc: "Preventive care", price: 89 },
  { value: "installation", label: "Installation", icon: "📦", desc: "New appliance setup", price: 199 },
  { value: "cleaning", label: "Cleaning", icon: "✨", desc: "Deep cleaning service", price: 79 },
  { value: "inspection", label: "Inspection", icon: "🔍", desc: "Diagnostic check", price: 99 },
];

const appliances = ["Refrigerator", "Washer", "Dryer", "Dishwasher", "Oven/Stove", "Microwave", "HVAC System", "Water Heater", "Garbage Disposal", "Other"];
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default function BookServicePage() {
  const { user } = useCurrentUser();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    serviceType: "", appliance: "", issue: "", date: "", time: "", address: "", paymentMethod: "cash",
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const selectedService = serviceTypes.find((s) => s.value === form.serviceType);
  const price = selectedService?.price || 0;
  const tax = Math.round(price * 0.08 * 100) / 100;
  const total = Math.round((price + tax) * 100) / 100;

  const step1Valid = form.serviceType && form.appliance && form.issue.length >= 10;
  const step2Valid = form.date && form.time && form.address.length >= 10 && location;

  const formatTime = (t: string) => {
    const h = parseInt(t.split(":")[0]);
    return `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? "PM" : "AM"}`;
  };

  // Initialize map when step 2 is shown
  useEffect(() => {
    if (step !== 2 || !mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      const map = L.map(mapRef.current!, { zoomControl: true }).setView([10.3157, 123.8854], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap',
      }).addTo(map);

      // Custom marker icon
      const icon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng });
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
        }
      });

      mapInstanceRef.current = map;

      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            map.setView([latitude, longitude], 15);
          },
          () => {}, // ignore errors
          { enableHighAccuracy: true }
        );
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [step]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: user?.id || "guest",
          customerName: user?.name || "Guest",
          customerEmail: user?.email || "",
          customerPhone: user?.phone || "",
          serviceType: form.serviceType,
          appliance: form.appliance,
          issueDescription: form.issue,
          scheduledDate: form.date,
          scheduledTime: form.time,
          serviceAddress: form.address,
          latitude: location?.lat,
          longitude: location?.lng,
          price: total,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingId(data.data.id);
      }
    } catch {
      setBookingId("BK-" + Date.now().toString().slice(-6));
    }
    setLoading(false);
    setBooked(true);
  };

  if (booked) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
        <h1 className="heading-display text-3xl mb-3">Booking Confirmed!</h1>
        <p className="text-text-secondary mb-2">Your service has been booked. An admin will assign a technician shortly.</p>
        <p className="text-xs text-text-muted mb-8">Booking ID: <span className="font-mono text-primary">{bookingId}</span></p>
        <div className="glass-card text-left mb-8">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-text-muted text-xs">Service</span><p className="font-medium text-text-primary capitalize flex items-center gap-2"><span>{selectedService?.icon}</span>{form.serviceType}</p></div>
            <div><span className="text-text-muted text-xs">Appliance</span><p className="font-medium text-text-primary">{form.appliance}</p></div>
            <div><span className="text-text-muted text-xs">Date</span><p className="font-medium text-text-primary">{form.date}</p></div>
            <div><span className="text-text-muted text-xs">Time</span><p className="font-medium text-text-primary">{formatTime(form.time)}</p></div>
            <div className="col-span-2"><span className="text-text-muted text-xs">Address</span><p className="font-medium text-text-primary">{form.address}</p></div>
            {location && <div className="col-span-2"><span className="text-text-muted text-xs">📍 GPS Location</span><p className="font-medium text-primary text-xs">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p></div>}
            <div className="col-span-2 pt-3 border-t border-white/5">
              <div className="flex justify-between text-lg"><span className="font-semibold text-text-primary">Total</span><span className="font-bold text-primary">₱{total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <a href="/dashboard/customer/bookings" className="btn btn-glass">View Bookings</a>
          <a href="/dashboard/customer" className="btn btn-primary">Back to Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <h1 className="heading-display text-3xl mb-2">Book a <span className="gradient-text">Service</span></h1>
      <p className="text-text-secondary mb-8">Complete the steps below to schedule your service.</p>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {["Service", "Schedule & Location", "Confirm"].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <button type="button" onClick={() => { if (i + 1 < step) setStep(i + 1); }}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > i + 1 ? "bg-success text-white cursor-pointer hover:scale-110" : step === i + 1 ? "bg-primary text-white" : "bg-white/5 border border-white/10 text-text-muted"}`}>
              {step > i + 1 ? "✓" : i + 1}
            </button>
            <span className={`text-sm hidden sm:inline ${step === i + 1 ? "text-text-primary font-medium" : "text-text-muted"}`}>{label}</span>
            {i < 2 && <div className={`flex-1 h-0.5 rounded-full transition-all ${step > i + 1 ? "bg-success" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">Service Type *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {serviceTypes.map((s) => (
                <button key={s.value} type="button" onClick={() => update("serviceType", s.value)}
                  className={`relative p-5 rounded-xl border text-center transition-all duration-300 cursor-pointer group ${form.serviceType === s.value ? "border-primary/40 bg-primary/10 scale-[1.02]" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20"}`}>
                  {form.serviceType === s.value && <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-success flex items-center justify-center text-[10px] text-white font-bold z-10">✓</div>}
                  <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">{s.icon}</span>
                  <span className="text-sm font-semibold block text-text-primary">{s.label}</span>
                  <span className="text-xs text-text-muted block mt-0.5">{s.desc}</span>
                  <span className="text-xs font-bold text-primary mt-2 block">₱{s.price}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Appliance *</label>
            <select value={form.appliance} onChange={(e) => update("appliance", e.target.value)} className="glass-input">
              <option value="" className="bg-surface">Select appliance</option>
              {appliances.map((a) => (<option key={a} value={a} className="bg-surface">{a}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Describe the Issue *</label>
            <textarea value={form.issue} onChange={(e) => update("issue", e.target.value)} className="glass-input min-h-[100px] resize-none" placeholder="Tell us what's wrong (min 10 characters)..." />
            <p className={`text-xs mt-1 ${form.issue.length >= 10 ? "text-success" : "text-text-muted"}`}>{form.issue.length}/10 characters minimum</p>
          </div>
          <button type="button" onClick={() => setStep(2)} disabled={!step1Valid} className="btn btn-primary w-full btn-lg disabled:opacity-40 disabled:cursor-not-allowed">Continue to Schedule & Location →</button>
        </div>
      )}

      {/* Step 2: Schedule + Map */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Preferred Date *</label>
              <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="glass-input" min={new Date().toISOString().split("T")[0]} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Service Address *</label>
              <input type="text" value={form.address} onChange={(e) => update("address", e.target.value)} className="glass-input" placeholder="Enter your full address" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">Preferred Time *</label>
            <div className="grid grid-cols-5 gap-2">
              {timeSlots.map((t) => (
                <button key={t} type="button" onClick={() => update("time", t)}
                  className={`py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${form.time === t ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white/[0.03] border border-white/10 text-text-secondary hover:bg-white/[0.06]"}`}>
                  {formatTime(t)}
                </button>
              ))}
            </div>
          </div>

          {/* Map Location Picker */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">📍 Pin Your Exact Location *</label>
            <p className="text-xs text-text-muted mb-3">Click on the map to pin your exact location. This helps our technician find you.</p>
            <div ref={mapRef} className="w-full h-[300px] rounded-xl border border-white/10 overflow-hidden" style={{ zIndex: 1 }} />
            {location ? (
              <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-success/5 border border-success/20">
                <span className="text-success text-sm">✓</span>
                <span className="text-xs text-success">Location pinned: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span>
              </div>
            ) : (
              <p className="text-xs text-warning mt-2">⚠ Please click on the map to pin your location</p>
            )}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="btn btn-glass flex-1">Back</button>
            <button type="button" onClick={() => setStep(3)} disabled={!step2Valid} className="btn btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed">Review Booking →</button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="glass-card">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-text-muted">Service</span><span className="text-text-primary font-medium flex items-center gap-2"><span>{selectedService?.icon}</span>{selectedService?.label}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Appliance</span><span className="text-text-primary font-medium">{form.appliance}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Date</span><span className="text-text-primary font-medium">{form.date}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Time</span><span className="text-text-primary font-medium">{formatTime(form.time)}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Address</span><span className="text-text-primary font-medium text-right max-w-[250px]">{form.address}</span></div>
              {location && <div className="flex justify-between"><span className="text-text-muted">📍 GPS</span><span className="text-primary font-medium text-xs">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span></div>}
              <div className="border-t border-white/5 pt-3 space-y-2">
                <div className="flex justify-between"><span className="text-text-muted">Service Fee</span><span className="text-text-primary font-medium">₱{price}.00</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Tax (8%)</span><span className="text-text-primary font-medium">₱{tax.toFixed(2)}</span></div>
                <div className="border-t border-white/5 pt-2 flex justify-between text-lg"><span className="font-semibold text-text-primary">Total</span><span className="font-bold text-primary">₱{total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="space-y-2">
              {[
                { value: "cash", label: "Cash on Service", icon: "💵", desc: "Pay when the technician arrives" },
                { value: "gcash", label: "GCash", icon: "📱", desc: "Pay via GCash mobile wallet" },
                { value: "card", label: "Credit/Debit Card", icon: "💳", desc: "Visa, Mastercard, etc." },
              ].map((m) => (
                <button key={m.value} type="button" onClick={() => update("paymentMethod", m.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all cursor-pointer ${form.paymentMethod === m.value ? "bg-primary/10 border border-primary/30" : "bg-white/[0.02] border border-white/5 hover:bg-white/[0.05]"}`}>
                  <span className="text-xl">{m.icon}</span>
                  <div className="flex-1"><p className="text-sm font-medium text-text-primary">{m.label}</p><p className="text-xs text-text-muted">{m.desc}</p></div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.paymentMethod === m.value ? "border-primary" : "border-white/20"}`}>
                    {form.paymentMethod === m.value && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)} className="btn btn-glass flex-1">Back</button>
            <button type="button" onClick={handleSubmit} disabled={loading} className="btn btn-accent flex-1 btn-lg disabled:opacity-60">
              {loading ? (<div className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</div>) : (<>Confirm & Pay ₱{total.toFixed(2)}</>)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
