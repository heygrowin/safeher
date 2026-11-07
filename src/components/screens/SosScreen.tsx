"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing, Check, ChevronLeft, KeyRound, MapPin, Phone, Radio, Users, X, Info, ShieldAlert } from "lucide-react";
import { useDemo } from "@/hooks/useDemoState";
import { BRAND } from "@/config/brand";
import { CURRENT_LOCATION } from "@/data/locations";
import { TRUSTED_CONTACTS } from "@/data/contacts";
import { Avatar, Button } from "@/components/ui/primitives";

const COUNTDOWN = 5;

export function SosScreen() {
  const { state, dispatch, back } = useDemo();
  const s = state.sos;
  const [count, setCount] = useState(COUNTDOWN);
  const [callInfo, setCallInfo] = useState(false);
  const [holding, setHolding] = useState(false);

  useEffect(() => {
    if (s.stage !== "confirm") return;
    setCount(COUNTDOWN);
    const iv = setInterval(() => setCount((c) => c - 1), 1000);
    return () => clearInterval(iv);
  }, [s.stage]);

  useEffect(() => {
    if (s.stage === "confirm" && count <= 0) dispatch({ type: "SOS_CONFIRM" });
  }, [count, s.stage, dispatch]);

  // Press-and-hold the big button for ~1s to arm (reduces accidental taps)
  useEffect(() => {
    if (!holding) return;
    const t = setTimeout(() => {
      setHolding(false);
      dispatch({ type: "SOS_REQUEST", source: "app" });
    }, 900);
    return () => clearTimeout(t);
  }, [holding, dispatch]);

  const live = s.stage === "alerting" || s.stage === "active";
  const steps = [
    { icon: Users, title: `Alerting trusted contacts (${TRUSTED_CONTACTS.length})`, sub: TRUSTED_CONTACTS.map((c) => c.name).join(", ") + " · simulated message" },
    { icon: MapPin, title: "Sharing last-known location", sub: `${CURRENT_LOCATION} · demo location` },
    { icon: Radio, title: "Nearby community beacon", sub: state.charm.beacon ? "Concept · nearby SafeHer users within ~200 m" : "Beacon disabled in charm settings" },
    { icon: Phone, title: "Emergency call information ready", sub: `${BRAND.emergencyCountry}: ${BRAND.emergencyNumber} · no call placed` },
  ];

  return (
    <div className="relative flex h-full flex-col pt-[48px]" style={{ background: "radial-gradient(120% 70% at 50% 0%, rgba(244,63,94,0.28), transparent 60%), #0B0A1A" }}>
      <div className="relative flex h-11 items-center justify-center px-4">
        <button onClick={back} aria-label="Back" className="absolute left-2 grid h-9 w-9 place-items-center rounded-full hover:bg-white/5">
          <ChevronLeft size={22} />
        </button>
        <h2 className="text-[15px] font-bold tracking-wide">SOS</h2>
        <span className="absolute right-3 rounded-full border border-sos/50 bg-sos/15 px-2 py-[2px] text-[9.5px] font-bold uppercase tracking-wider text-sos">Simulation</span>
      </div>

      <div className="phone-scroll flex-1 overflow-y-auto px-4 pb-6">
        {/* Trigger / status visual */}
        <div className="relative mx-auto mt-2 grid h-[190px] w-[190px] place-items-center">
          {(live || s.stage === "confirm" || holding) &&
            [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute inset-6 rounded-full bg-sos/30"
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.65 }}
              />
            ))}
          {s.stage === "confirm" && (
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" stroke="rgba(244,63,94,0.2)" strokeWidth="3" fill="none" />
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                stroke="#F43F5E"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 46}
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 46 }}
                transition={{ duration: COUNTDOWN, ease: "linear" }}
              />
            </svg>
          )}
          <motion.button
            onPointerDown={() => s.stage === "idle" && setHolding(true)}
            onPointerUp={() => setHolding(false)}
            onPointerLeave={() => setHolding(false)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && s.stage === "idle") dispatch({ type: "SOS_REQUEST", source: "app" });
            }}
            animate={{ scale: holding ? 0.92 : 1 }}
            aria-label="Emergency trigger (press and hold)"
            className="relative grid h-[140px] w-[140px] touch-none place-items-center rounded-full text-white"
            style={{
              background: "radial-gradient(circle at 35% 30%, #FB7185, #F43F5E 45%, #BE123C)",
              boxShadow: "0 0 0 10px rgba(244,63,94,0.12), 0 0 60px rgba(244,63,94,0.55), inset 0 2px 0 rgba(255,255,255,0.3)",
            }}
          >
            {s.stage === "confirm" ? (
              <span className="text-[52px] font-extrabold tabular-nums">{Math.max(count, 0)}</span>
            ) : (
              <span className="flex flex-col items-center">
                <BellRing size={44} strokeWidth={2} />
                <span className="mt-1 text-[13px] font-extrabold tracking-[0.2em]">{live ? "ACTIVE" : "SOS"}</span>
              </span>
            )}
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {s.stage === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <h3 className="text-[20px] font-extrabold">Emergency Alert</h3>
              <p className="mt-1 text-[12px] text-fg2">Press and hold the button to start a simulated alert to your trusted contacts.</p>
            </motion.div>
          )}
          {s.stage === "confirm" && (
            <motion.div key="confirm" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
              <h3 className="text-[20px] font-extrabold">Sending alert in {Math.max(count, 0)}s</h3>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-[12px] text-fg2">
                {s.source === "charm" ? (
                  <>
                    <KeyRound size={12} /> Triggered by {BRAND.wearable}
                  </>
                ) : (
                  "Cancel now if this was accidental"
                )}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="ghost" icon={X} onClick={() => dispatch({ type: "SOS_CANCEL" })}>
                  Cancel
                </Button>
                <Button variant="danger" icon={BellRing} onClick={() => dispatch({ type: "SOS_CONFIRM" })}>
                  Send now
                </Button>
              </div>
            </motion.div>
          )}
          {live && (
            <motion.div key="live" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h3 className="text-center text-[20px] font-extrabold">{s.stage === "active" ? "Simulated Alert Active" : "Sending simulated alert…"}</h3>
              <div className="mt-3 space-y-2 rounded-2xl border border-sos/30 bg-[#1f0d1c]/80 p-3">
                {steps.map((st, i) => {
                  const done = s.step > i;
                  const doing = s.step === i && s.stage === "alerting";
                  const Icon = st.icon;
                  return (
                    <motion.div key={st.title} initial={{ opacity: 0.3 }} animate={{ opacity: done || doing ? 1 : 0.35 }} className="flex items-center gap-3">
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${done ? "bg-ok text-bg" : "border border-sos/40 text-sos"}`}>
                        {done ? <Check size={14} strokeWidth={3} /> : doing ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-sos border-t-transparent" /> : <Icon size={13} />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-semibold">{st.title}</p>
                        <p className="truncate text-[10.5px] text-muted">{st.sub}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <p className="mt-2 flex items-start gap-1.5 text-[10.5px] leading-relaxed text-muted">
                <ShieldAlert size={12} className="mt-[1px] shrink-0 text-sos" />
                <span>Simulated only. No messages were sent and emergency services have <b>not</b> been contacted.</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contacts + location */}
        <div className="mt-4 rounded-2xl border border-line bg-card/60 p-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">Trusted contacts</p>
          <div className="space-y-2">
            {TRUSTED_CONTACTS.map((c) => (
              <div key={c.id} className="flex items-center gap-2.5">
                <Avatar initials={c.initials} color={c.color} size={30} />
                <div className="flex-1">
                  <p className="text-[13px] font-semibold">{c.name}</p>
                  <p className="text-[10.5px] text-muted">{c.relation}</p>
                </div>
                <span className={`text-[10.5px] font-semibold ${s.step >= 1 && live ? "text-ok" : "text-muted"}`}>{s.step >= 1 && live ? "Alerted (sim.)" : "Standby"}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-black/25 px-3 py-2 text-[11.5px]">
            <MapPin size={14} className="text-sos" />
            <span className="flex-1 text-fg2">
              {live ? "Last-known" : "Current"} location: <b className="text-fg">{CURRENT_LOCATION}</b>
            </span>
            <span className="text-[9.5px] uppercase text-muted">demo</span>
          </div>
        </div>

        {/* Emergency call info */}
        <div className="mt-3 rounded-2xl border border-sos/30 bg-sos/[0.07] p-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sos text-[15px] font-extrabold text-white">{BRAND.emergencyNumber}</span>
            <div className="flex-1">
              <p className="text-[13px] font-bold">Emergency number · {BRAND.emergencyCountry}</p>
              <p className="text-[11px] text-fg2">In a real emergency, call {BRAND.emergencyNumber} directly from your phone.</p>
            </div>
          </div>
          <Button full variant="ghost" size="sm" className="mt-2.5" icon={Phone} onClick={() => setCallInfo(true)}>
            Call {BRAND.emergencyNumber}
          </Button>
        </div>

        {live && (
          <Button full size="lg" variant="danger" className="mt-4" icon={X} onClick={() => dispatch({ type: "SOS_CANCEL" })}>
            Cancel SOS
          </Button>
        )}
      </div>

      {/* Call info modal */}
      <AnimatePresence>
        {callInfo && (
          <motion.div className="absolute inset-0 z-40 grid place-items-center bg-black/60 px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCallInfo(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-3xl border border-line-strong bg-bg2 p-5 text-center"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sos/15 text-sos">
                <Info size={22} />
              </span>
              <p className="mt-3 text-[16px] font-bold">This is a demo</p>
              <p className="mt-1 text-[12px] leading-relaxed text-fg2">
                No call has been placed. On a real device this button would open the phone dialer with {BRAND.emergencyNumber}. Never rely on this prototype in an emergency.
              </p>
              <Button full className="mt-4" onClick={() => setCallInfo(false)}>
                Understood
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
