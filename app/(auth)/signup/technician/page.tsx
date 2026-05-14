"use client";

import { useState } from "react";
import Link from "next/link";
import { saveUser } from "@/lib/auth";

const specialtyOptions = ["Refrigerators","Washers/Dryers","Dishwashers","Ovens/Stoves","HVAC Systems","Water Heaters","Microwaves","Garbage Disposals"];

export default function TechnicianSignupPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", phone:"", password:"", confirmPassword:"", specialties:[] as string[], experience:"", certifications:"", serviceArea:"", bio:"" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const update = (f: string, v: string) => setForm(p=>({...p,[f]:v}));
  const toggleSpec = (s: string) => setForm(p=>({...p, specialties: p.specialties.includes(s)?p.specialties.filter(x=>x!==s):[...p.specialties,s]}));

  const pwStr = () => { const p=form.password; let s=0; if(p.length>=8)s++; if(/[A-Z]/.test(p))s++; if(/[0-9]/.test(p))s++; if(/[^A-Za-z0-9]/.test(p))s++; return s; };
  const strLbl=["","Weak","Fair","Good","Strong"];
  const strClr=["","bg-danger","bg-warning","bg-primary","bg-success"];
  const match = form.confirmPassword.length>0 && form.password===form.confirmPassword;

  const step1Valid = form.firstName && form.email && form.password.length>=8 && match;
  const step2Valid = form.specialties.length>0 && form.experience;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          password: form.password,
          role: "technician",
          phone: form.phone,
          specialties: form.specialties,
          experience: form.experience,
          certifications: form.certifications,
          service_area: form.serviceArea,
          bio: form.bio,
        }),
      });
      const data = await res.json();
      if (data.success) {
        saveUser(data.data.user);
        window.location.href = data.data.redirect;
      } else {
        setError(data.error || "Registration failed");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up max-w-lg mx-auto">
      <Link href="/" className="flex items-center gap-3 justify-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">ST</div>
        <span className="text-2xl font-bold tracking-tight">Service<span className="text-primary">Titan</span></span>
      </Link>
      <div className="glass-strong p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/signup" className="btn btn-glass btn-icon w-9 h-9"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 19l-7-7 7-7"/></svg></Link>
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-sm">🔧</div>
              <h1 className="heading-display text-xl">Technician Registration</h1>
            </div>
            <p className="text-text-secondary text-xs mt-0.5">Join our network of certified pros</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {["Account","Skills","Review"].map((l,i)=>(
            <div key={l} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step>i+1?"bg-success text-white":step===i+1?"bg-accent text-white":"glass text-text-muted"}`}>{step>i+1?"✓":i+1}</div>
              <span className={`text-xs hidden sm:inline ${step===i+1?"text-text-primary font-medium":"text-text-muted"}`}>{l}</span>
              {i<2 && <div className={`flex-1 h-0.5 rounded-full ${step>i+1?"bg-success":"bg-white/10"}`}/>}
            </div>
          ))}
        </div>

        {/* Step 1: Account Info */}
        {step===1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-text-secondary mb-2">First Name *</label><input type="text" value={form.firstName} onChange={e=>update("firstName",e.target.value)} className="glass-input" placeholder="Mike" required/></div>
              <div><label className="block text-sm font-medium text-text-secondary mb-2">Last Name</label><input type="text" value={form.lastName} onChange={e=>update("lastName",e.target.value)} className="glass-input" placeholder="Johnson"/></div>
            </div>
            <div><label className="block text-sm font-medium text-text-secondary mb-2">Email *</label><input type="email" value={form.email} onChange={e=>update("email",e.target.value)} className="glass-input" placeholder="mike@example.com" required/></div>
            <div><label className="block text-sm font-medium text-text-secondary mb-2">Phone *</label><input type="tel" value={form.phone} onChange={e=>update("phone",e.target.value)} className="glass-input" placeholder="+1 (555) 987-6543" required/></div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Password *</label>
              <div className="relative">
                <input type={showPw?"text":"password"} value={form.password} onChange={e=>update("password",e.target.value)} className="glass-input pr-12" placeholder="Min. 8 characters" required minLength={8}/>
                <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg></button>
              </div>
              {form.password && <div className="mt-2"><div className="flex gap-1 mb-1">{[1,2,3,4].map(i=>(<div key={i} className={`flex-1 h-1 rounded-full ${i<=pwStr()?strClr[pwStr()]:"bg-white/10"}`}/>))}</div><p className={`text-xs ${pwStr()>=3?"text-success":pwStr()>=2?"text-warning":"text-danger"}`}>{strLbl[pwStr()]}</p></div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Confirm Password *</label>
              <input type="password" value={form.confirmPassword} onChange={e=>update("confirmPassword",e.target.value)} className="glass-input" placeholder="Re-enter password" required/>
              {form.confirmPassword && <p className={`text-xs mt-1 ${match?"text-success":"text-danger"}`}>{match?"✓ Match":"✗ No match"}</p>}
            </div>
            <button type="button" onClick={()=>setStep(2)} disabled={!step1Valid} className="btn bg-gradient-to-r from-amber-500 to-orange-600 text-white w-full btn-lg disabled:opacity-40 disabled:cursor-not-allowed">Continue</button>
          </div>
        )}

        {/* Step 2: Skills & Experience */}
        {step===2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">Specialties * <span className="text-text-muted">(select all that apply)</span></label>
              <div className="grid grid-cols-2 gap-2">
                {specialtyOptions.map(s=>(
                  <button key={s} type="button" onClick={()=>toggleSpec(s)} className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${form.specialties.includes(s)?"bg-accent/10 text-accent border border-accent/30":"glass text-text-secondary hover:bg-white/5"}`}>
                    {form.specialties.includes(s)?"✓ ":""}{s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Years of Experience *</label>
              <select value={form.experience} onChange={e=>update("experience",e.target.value)} className="glass-input">
                <option value="" className="bg-surface">Select...</option>
                <option value="0-1" className="bg-surface">Less than 1 year</option>
                <option value="1-3" className="bg-surface">1-3 years</option>
                <option value="3-5" className="bg-surface">3-5 years</option>
                <option value="5-10" className="bg-surface">5-10 years</option>
                <option value="10+" className="bg-surface">10+ years</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-text-secondary mb-2">Certifications</label><input type="text" value={form.certifications} onChange={e=>update("certifications",e.target.value)} className="glass-input" placeholder="EPA, NATE, etc."/></div>
            <div><label className="block text-sm font-medium text-text-secondary mb-2">Service Area</label><input type="text" value={form.serviceArea} onChange={e=>update("serviceArea",e.target.value)} className="glass-input" placeholder="Manhattan, Brooklyn, etc."/></div>
            <div><label className="block text-sm font-medium text-text-secondary mb-2">Short Bio</label><textarea value={form.bio} onChange={e=>update("bio",e.target.value)} className="glass-input min-h-[80px] resize-none" placeholder="Tell customers about yourself..."/></div>
            <div className="flex gap-3">
              <button type="button" onClick={()=>setStep(1)} className="btn btn-glass flex-1">Back</button>
              <button type="button" onClick={()=>setStep(3)} disabled={!step2Valid} className="btn bg-gradient-to-r from-amber-500 to-orange-600 text-white flex-1 disabled:opacity-40 disabled:cursor-not-allowed">Continue</button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step===3 && (
          <form onSubmit={submit} className="space-y-4">
            <div className="glass-card">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Account Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-text-muted">Name</span><p className="font-medium text-text-primary">{form.firstName} {form.lastName}</p></div>
                <div><span className="text-text-muted">Email</span><p className="font-medium text-text-primary">{form.email}</p></div>
                <div><span className="text-text-muted">Phone</span><p className="font-medium text-text-primary">{form.phone||"—"}</p></div>
                <div><span className="text-text-muted">Experience</span><p className="font-medium text-text-primary">{form.experience} years</p></div>
              </div>
            </div>
            <div className="glass-card">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {form.specialties.map(s=>(<span key={s} className="badge text-accent bg-accent/10 border-accent/20 text-xs">{s}</span>))}
              </div>
              {form.certifications && <p className="text-sm text-text-secondary mt-3">Certifications: {form.certifications}</p>}
              {form.serviceArea && <p className="text-sm text-text-secondary mt-1">Service area: {form.serviceArea}</p>}
            </div>
            {error && (
              <div className="flex items-center gap-3 py-3 px-4 rounded-lg bg-danger/5 border border-danger/20">
                <span className="text-danger text-sm">⚠</span>
                <span className="text-sm text-danger">{error}</span>
              </div>
            )}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/30"/>
              <span className="text-sm text-text-secondary">I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a>, <a href="#" className="text-primary hover:underline">Privacy Policy</a>, and <a href="#" className="text-primary hover:underline">Technician Agreement</a></span>
            </label>
            <div className="flex gap-3">
              <button type="button" onClick={()=>setStep(2)} className="btn btn-glass flex-1">Back</button>
              <button type="submit" disabled={loading||!agreed} className="btn bg-gradient-to-r from-amber-500 to-orange-600 text-white flex-1 btn-lg disabled:opacity-40 disabled:cursor-not-allowed">
                {loading?<div className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Creating...</div>:"Create Technician Account"}
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-text-secondary mt-6">Already have an account? <Link href="/login" className="text-primary hover:text-primary-light font-medium transition-colors">Sign in</Link></p>
      </div>
    </div>
  );
}
