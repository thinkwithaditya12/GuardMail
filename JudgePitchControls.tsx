import { ShieldCheck } from "lucide-react";
type Preset = { id: string; label: string; email: string };
export const GUARDMAIL_PRESETS: Preset[] = [
  { id: "banking", label: "Case 1: Banking Phish", email: "From: Bank Security <security@paypa1-alert.example>\nTo: user@example.com\nSubject: URGENT: Verify your account\nAuthentication-Results: spf=fail; dkim=fail; dmarc=fail\n\nVerify your password immediately at https://secure-login.example/verify" },
  { id: "bec", label: "Case 2: CEO BEC Wire", email: "From: CEO <ceo@company.example>\nTo: finance@example.com\nReply-To: personal-mail.example@external.example\nSubject: Urgent invoice wire transfer\nAuthentication-Results: spf=pass; dkim=pass; dmarc=pass\n\nPlease transfer the invoice payment today and keep this request confidential." },
  { id: "clean", label: "Case 3: Clean Corporate", email: "From: HR <hr@company.example>\nTo: employee@example.com\nSubject: Benefits newsletter\nAuthentication-Results: spf=pass; dkim=pass; dmarc=pass\n\nHere is the monthly benefits newsletter. No action is required." },
];
export function JudgePitchControls({ onPreset }: { onPreset: (preset: Preset) => void }) {
  return <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/90 p-1.5 shadow-2xl backdrop-blur-md">
    <span className="flex items-center gap-1.5 px-2 font-mono text-[10px] uppercase tracking-wider text-emerald-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Demo Mode: Active</span>
    {GUARDMAIL_PRESETS.map(p => <button key={p.id} onClick={() => onPreset(p)} className="rounded-lg px-2 py-1.5 text-[10px] text-slate-300 transition hover:bg-white/10 hover:text-white">{p.label}</button>)}
  </div>;
}
