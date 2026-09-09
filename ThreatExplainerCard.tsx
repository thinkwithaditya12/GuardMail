import { useState } from "react";
import { AlertTriangle, Flame, ShieldAlert, ShieldCheck, UserRound } from "lucide-react";

type EvidenceItem = { id: string; indicator: string; severity: string; observation: string; source: string; interpretation: string; impact: string; recommended_action: string; confidence: number };

export function ThreatExplainerCard({ score, evidence = [], flags = {}, onHighlight }: { score: number; evidence?: EvidenceItem[]; flags?: Record<string, boolean>; onHighlight?: (enabled: boolean) => void }) {
  const [highlight, setHighlight] = useState(false);
  const critical = score >= 80, caution = score >= 50;
  const Icon = critical ? ShieldAlert : caution ? AlertTriangle : ShieldCheck;
  const severity = critical ? "CRITICAL" : caution ? "CAUTION" : "SAFE";
  const psychological = evidence.filter(e => /urgency|credential|impersonation|financial/i.test(e.indicator)).slice(0, 4);
  const infrastructure = evidence.filter(e => /domain|auth|url|attachment|reply|return|ip/i.test(e.indicator)).slice(0, 5);
  const action = critical ? "Immediate Action: Quarantine the message. Do not interact with links or attachments." : caution ? "Review the message and verify the request through an independently known channel." : "No strong risk indicator was observed. Continue normal verification practices.";
  return <section className={`rounded-2xl border p-5 ${critical ? "border-red-500/50 bg-red-950/40" : caution ? "border-amber-500/50 bg-amber-950/40" : "border-emerald-500/50 bg-emerald-950/40"}`}>
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3"><Icon className={`h-6 w-6 ${critical ? "text-red-400" : caution ? "text-amber-400" : "text-emerald-400"}`} /><div><p className="text-xs font-mono uppercase tracking-[.18em] opacity-70">Threat explainer</p><h3 className="mt-1 text-lg font-bold text-white">Why Was This Email Flagged?</h3></div></div>
      <label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={highlight} onChange={e => { setHighlight(e.target.checked); onHighlight?.(e.target.checked); }} /> Highlight deceptive elements</label>
    </div>
    <div className="mt-5 grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border border-white/10 bg-black/10 p-4"><p className="text-xs uppercase tracking-wider text-slate-400">Psychological tactics</p>{psychological.length ? psychological.map(e => <p key={e.id} className="mt-2 text-sm text-slate-200">• {e.interpretation}</p>) : <p className="mt-2 text-sm text-slate-400">No supported social-engineering finding.</p>}</div>
      <div className="rounded-xl border border-white/10 bg-black/10 p-4"><p className="text-xs uppercase tracking-wider text-slate-400">Infrastructure flags</p><div className="mt-3 flex flex-wrap gap-2">{infrastructure.length ? infrastructure.map(e => <span key={e.id} className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-xs text-slate-200">{e.indicator.replaceAll("_"," ")}</span>) : <span className="text-sm text-slate-400">None observed</span>}</div></div>
      <div className="rounded-xl border border-white/10 bg-black/10 p-4"><p className="text-xs uppercase tracking-wider text-slate-400">Actionable verdict</p><p className="mt-2 text-sm font-medium text-white">{action}</p></div>
    </div>
    {highlight && <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-100">Highlight mode is evidence-driven: only findings extracted from the supplied email are eligible for emphasis. Raw HTML is never rendered.</div>}
  </section>;
}
