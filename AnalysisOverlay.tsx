import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, ShieldCheck } from "lucide-react";

/**
 * Choreographed, UI-locking analysis overlay.
 *
 * The whole sequence runs for exactly `TOTAL_MS` (4.5s). A gradient progress
 * bar fills 0 -> 100% linearly across that window, while four steps flip from
 * a glowing cyan spinner to a green checkmark at the timings below. When the
 * final step completes, `onComplete` fires so the parent can reveal the
 * populated dashboard.
 */

const TOTAL_MS = 4500;

type Step = { label: string; at: number };

const STEPS: Step[] = [
  { label: "Parsing raw .eml headers & metadata...", at: 1000 },
  { label: "Extracting 'Received:' IP addresses...", at: 2500 },
  { label: "Triangulating geographic server paths...", at: 3500 },
  { label: "Running AI NLP intent classification...", at: 4500 },
];

export function AnalysisOverlay({
  open,
  onComplete,
}: {
  open: boolean;
  onComplete: () => void;
}) {
  const [doneCount, setDoneCount] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!open) {
      setDoneCount(0);
      return;
    }

    // Lock background scroll while the sequence is running.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timers = STEPS.map((step, index) =>
      window.setTimeout(() => setDoneCount(index + 1), step.at),
    );
    const finish = window.setTimeout(() => onCompleteRef.current(), TOTAL_MS);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // The first not-yet-done step is the one actively processing.
  const activeIndex = doneCount;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="analysis-overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020913]/70 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          role="dialog"
          aria-modal="true"
          aria-busy="true"
          aria-label="Running forensic analysis"
          // Capture every pointer event so the user cannot click through.
          onMouseDown={(e) => e.preventDefault()}
        >
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0c1b2a]/80 shadow-[0_30px_120px_rgba(2,9,19,.65)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Top gradient progress bar: cyan -> emerald, 0 -> 100% over 4.5s */}
            <div className="absolute inset-x-0 top-0 h-1 bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.7)]"
                initial={{ width: "0%" }}
                animate={{ width: open ? "100%" : "0%" }}
                transition={{ duration: TOTAL_MS / 1000, ease: "linear" }}
              />
            </div>

            <div className="p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300 text-[#06101a] shadow-[0_0_30px_rgba(103,232,249,.35)]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-mono text-sm font-bold tracking-[.18em] text-cyan-100">
                    FORENSIC ANALYSIS
                  </div>
                  <div className="text-[10px] uppercase tracking-[.2em] text-slate-500">
                    processing supplied email
                  </div>
                </div>
              </div>

              <ul className="mt-6 space-y-1">
                {STEPS.map((step, index) => {
                  const done = index < doneCount;
                  const activeStep = index === activeIndex;
                  return (
                    <li
                      key={step.label}
                      className={`flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors ${
                        activeStep ? "bg-cyan-300/5" : ""
                      }`}
                    >
                      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                        <AnimatePresence mode="wait" initial={false}>
                          {done ? (
                            <motion.span
                              key="check"
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[#06101a] shadow-[0_0_12px_rgba(52,211,153,.7)]"
                              initial={{ scale: 0 }}
                              animate={{ scale: [0, 1.35, 1] }}
                              transition={{ duration: 0.35, ease: "easeOut" }}
                            >
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="spinner"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <Loader2
                                className={`h-5 w-5 animate-spin ${
                                  activeStep
                                    ? "text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,.8)]"
                                    : "text-slate-600"
                                }`}
                              />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <span
                        className={`text-sm transition-colors ${
                          done
                            ? "text-slate-200"
                            : activeStep
                              ? "text-cyan-100"
                              : "text-slate-500"
                        }`}
                      >
                        {step.label}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[.24em] text-slate-500">
                secure workspace · do not close
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
