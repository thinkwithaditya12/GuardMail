export type OfflineAnalysis = {
  primary_label: string;
  risk_score: number;
  confidence: number;
  summary: string;
  evidence: Array<{ id: string; indicator: string; severity: string; observation: string; description: string; source: string; interpretation: string; impact: string; recommended_action: string; confidence: number }>;
  recommended_actions: string[];
  limitations: string[];
  score_breakdown: Array<{ signal: string; points: number; reason: string }>;
  safety_indicators: Array<{ signal: string; points: number; reason: string }>;
  indicators: string[];
  flags: Record<string, boolean>;
};

const emailOf = (s: string) => s.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0]?.toLowerCase() ?? "";
const domain = (s: string) => emailOf(s).split("@")[1] ?? "";

export function analyzeEmailOffline(raw: string): OfflineAnalysis {
  const text = raw.slice(0, 120000).replace(/\r\n/g, "\n");
  const headerPart = text.split(/\n\n/, 1)[0] ?? text;
  const body = text.slice(headerPart.length).toLowerCase();
  const headers: Record<string,string> = {};
  for (const line of headerPart.replace(/\n[ \t]+/g, " ").split("\n")) {
    const i = line.indexOf(":"); if (i > 0) headers[line.slice(0,i).trim().toLowerCase()] = line.slice(i+1).trim();
  }
  const from = headers.from ?? "", reply = headers["reply-to"] ?? "", ret = headers["return-path"] ?? "";
  const sender = domain(from), replyDomain = domain(reply), returnDomain = domain(ret);
  const urls = Array.from(new Set(text.match(/https?:\/\/[^\s<>"']+/gi) ?? []));
  const authRaw = headers["authentication-results"] ?? "";
  const auth = {
    spf: authRaw.match(/spf\s*=\s*([a-z]+)/i)?.[1]?.toUpperCase() ?? "NOT_AVAILABLE",
    dkim: authRaw.match(/dkim\s*=\s*([a-z]+)/i)?.[1]?.toUpperCase() ?? "NOT_AVAILABLE",
    dmarc: authRaw.match(/dmarc\s*=\s*([a-z]+)/i)?.[1]?.toUpperCase() ?? "NOT_AVAILABLE",
  };
  const credential = /(?:enter|provide|confirm|verify|update|reset|submit)\s+(?:your\s+)?(?:password|passcode|otp|one[- ]time\s+code|credentials?)|sign\s*in\s+(?:to|and)|verify\s+(?:your\s+)?account/i.test(body);
  const financial = /(?:send|pay|transfer|wire|purchase|buy|provide)\s+(?:money|funds|payment|gift\s+cards?|crypto(?:currency)?)|(?:invoice|refund|payment|wire\s+transfer)\s+(?:request|details?|instructions?)|bank\s+(?:account|details?)/i.test(body);
  const urgency = /\b(urgent|immediately|final\s+warning|act\s+now|within\s+\d+\s+(?:hours?|days?))\b/i.test(body);
  const suspiciousUrl = urls.some(u => /bit\.ly|tinyurl|t\.co|xn--|login|verify|account|password/i.test(u));
  const lookalike = /paypa1|micros0ft|arnazon|g00gle|secure-[a-z]+-login/i.test(sender);
  const authFail = [auth.spf, auth.dkim, auth.dmarc].some(v => /FAIL|SOFTFAIL/i.test(v));
  const mismatch = Boolean(sender && replyDomain && sender !== replyDomain);
  const returnMismatch = Boolean(sender && returnDomain && sender !== returnDomain);
  const rows = [
    lookalike ? ["lookalike_domain",22] : null, credential ? ["credential_request",25] : null,
    authFail ? ["authentication_failure",17] : null, suspiciousUrl ? ["suspicious_url",12] : null,
    mismatch ? ["reply_to_mismatch",12] : null, returnMismatch ? ["return_path_mismatch",10] : null,
    financial ? ["financial_request",10] : null, urgency ? ["urgency",7] : null,
  ].filter(Boolean) as [string,number][];
  const safety = [
    auth.spf==="PASS" && auth.dkim==="PASS" && auth.dmarc==="PASS" ? ["authentication_verified",15] : null,
    sender && replyDomain && sender===replyDomain ? ["reply_to_aligned",8] : null,
    sender && returnDomain && sender===returnDomain ? ["return_path_aligned",5] : null,
    urls.length > 0 && !suspiciousUrl ? ["no_suspicious_url_pattern",5] : null,
    !credential ? ["no_credential_request",4] : null,
    !financial ? ["no_financial_request",3] : null,
  ].filter(Boolean) as [string,number][];
  const score = Math.max(0, Math.min(100, rows.reduce((a,r)=>a+r[1],0) - safety.reduce((a,r)=>a+r[1],0)));
  const label = score >= 60 ? "likely_phishing" : score >= 40 ? "suspicious" : score >= 20 ? "inconclusive" : "safe";
  const evidence = rows.map(([indicator,points],i) => ({ id:`OFF-${String(i+1).padStart(3,"0")}`, indicator, severity: points>=20?"high":points>=12?"medium":"low", observation: indicator.replaceAll("_"," "), description:"Observed in supplied email content or headers.", source:"Supplied email", interpretation:"This indicator contributes to the deterministic risk assessment.", impact:"Requires context and independent verification.", recommended_action:"Review the original evidence before taking action.", confidence:0.8 }));
  return {
    primary_label: label, risk_score: score, confidence: Math.min(0.95, 0.58 + (authRaw?0.15:0) + (headers.from&&headers.to&&headers.subject?0.12:0) + (rows.length+safety.length>=2?0.08:0)),
    summary: score ? "Offline fail-safe assessment derived from observable email evidence." : "No strong suspicious indicator was observed in the supplied email; this does not guarantee safety.",
    evidence, recommended_actions:["Verify sensitive requests through an independently known channel.","Do not interact with suspicious links or attachments."],
    limitations:["Offline fallback: external enrichment and AI explanation are unavailable.","Only supplied email evidence is used."],
    score_breakdown: rows.map(([signal,points])=>({signal,points,reason:signal.replaceAll("_"," ")})),
    safety_indicators: safety.map(([signal,points])=>({signal,points,reason:signal.replaceAll("_"," ")})),
    indicators: [emailOf(from),sender,replyDomain,...urls].filter(Boolean),
    flags:{lookalike_domain:lookalike,credential_request:credential,financial_request:financial,urgency,suspicious_url:suspiciousUrl,reply_to_mismatch:mismatch,return_path_mismatch:returnMismatch,authentication_failure:authFail},
  };
}
