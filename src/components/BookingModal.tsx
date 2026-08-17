"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "./Calendar";
import { createConsultation } from "@/app/actions/consultation";
import { waLink, consultationMessage } from "@/lib/whatsapp";
import {
  INTENT,
  INTENT_META,
  TIME_SLOTS,
  formatPrice,
  formatDateLabel,
  to12h,
  CATEGORY_META,
  type Category,
  type Intent,
} from "@/lib/constants";

const COUNTRIES = [
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+971", label: "🇦🇪 +971" },
  { code: "+61", label: "🇦🇺 +61" },
  { code: "+65", label: "🇸🇬 +65" },
  { code: "+880", label: "🇧🇩 +880" },
  { code: "+92", label: "🇵🇰 +92" },
];

export type BookingTemplate = {
  id: string;
  title: string;
  category: string;
  basePrice: number;
};

export default function BookingModal({
  template,
  whatsappNumber,
  onClose,
}: {
  template: BookingTemplate;
  whatsappNumber: string;
  onClose: () => void;
}) {
  const [intent, setIntent] = useState<Intent | null>(null);
  const [cc, setCc] = useState("+91");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const cat = CATEGORY_META[template.category as Category];
  const normalized = cc + phone.replace(/\D/g, "");
  const phoneDigits = normalized.replace(/\D/g, "");
  const valid = !!intent && phoneDigits.length >= 10 && phoneDigits.length <= 15 && !!date && !!time;

  async function submit() {
    setError(null);
    if (!intent) return setError("Please choose an option below.");
    if (phoneDigits.length < 10) return setError("Please enter a valid WhatsApp number.");
    if (!date) return setError("Please select a meeting date.");
    if (!time) return setError("Please select a meeting time.");

    setSubmitting(true);
    const res = await createConsultation({
      templateId: template.id,
      templateTitle: template.title,
      category: template.category,
      basePrice: template.basePrice,
      intent,
      whatsappNumber: normalized,
      preferredDate: date,
      preferredTime: time,
      projectMessage: message,
    });
    setSubmitting(false);
    if (res.ok) setDone(true);
    else setError(res.error);
  }

  const followUpHref =
    done && date && time
      ? waLink(
          whatsappNumber,
          consultationMessage({
            templateTitle: template.title,
            category: cat?.label || template.category,
            intentLabel: intent ? INTENT_META[intent].label : "",
            whatsappNumber: normalized,
            dateLabel: formatDateLabel(date),
            timeLabel: to12h(time),
            projectMessage: message,
          })
        )
      : "#";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="relative my-4 w-full max-w-lg rounded-2xl border border-line bg-panel shadow-glow"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-lg border border-line text-white/60 transition hover:border-neonblue hover:text-white"
          >
            ✕
          </button>

          {done ? (
            <SuccessView
              template={template}
              catLabel={cat?.label || template.category}
              dateLabel={date ? formatDateLabel(date) : ""}
              timeLabel={time ? to12h(time) : ""}
              phone={normalized}
              followUpHref={followUpHref}
              hasWhatsapp={!!whatsappNumber}
              onClose={onClose}
            />
          ) : (
            <div className="max-h-[88vh] overflow-y-auto p-5 sm:p-6">
              {/* header */}
              <p className="text-xs font-semibold tracking-wider text-neonblue">REQUEST A CONSULTATION</p>
              <h2 className="mt-1 text-xl font-bold">{template.title}</h2>
              <p className="mt-0.5 text-sm text-white/55">
                {cat?.label} · Starting from <span className="text-white/80">{formatPrice(template.basePrice)}</span>
              </p>
              <p className="mt-2 text-sm text-white/45">
                Tell us a little about your requirements and choose a convenient time for a discussion.
              </p>

              {/* intent */}
              <Section title="What best describes you?">
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {(Object.keys(INTENT) as Intent[]).map((key) => {
                    const active = intent === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setIntent(key)}
                        className={`rounded-xl border p-3.5 text-left transition ${
                          active ? "border-neonblue bg-neonblue/10" : "border-line hover:border-white/25"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{INTENT_META[key].label}</span>
                          <span
                            className={`grid h-4 w-4 place-items-center rounded-full border text-[10px] ${
                              active ? "border-neonblue bg-neonblue text-white" : "border-white/30"
                            }`}
                          >
                            {active ? "✓" : ""}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-white/50">{INTENT_META[key].desc}</p>
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* whatsapp */}
              <Section title="WhatsApp number">
                <div className="flex gap-2">
                  <select
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    className="rounded-lg border border-line bg-ink2 px-2 py-2.5 text-sm outline-none focus:border-neonblue"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ""))}
                    className="flex-1 rounded-lg border border-line bg-ink2 px-3 py-2.5 text-sm outline-none focus:border-neonblue"
                  />
                </div>
              </Section>

              {/* date */}
              <Section title="Preferred meeting date">
                <Calendar value={date} onChange={setDate} />
              </Section>

              {/* time */}
              <Section title="Preferred meeting time">
                <div className="space-y-3">
                  {TIME_SLOTS.map((g) => (
                    <div key={g.group}>
                      <div className="mb-1.5 text-xs font-medium text-white/45">{g.group}</div>
                      <div className="flex flex-wrap gap-2">
                        {g.slots.map((s) => {
                          const active = time === s.value;
                          return (
                            <button
                              key={s.value}
                              type="button"
                              onClick={() => setTime(s.value)}
                              className={`rounded-lg border px-3 py-2 text-sm transition ${
                                active ? "border-neonblue bg-neonblue text-white" : "border-line text-white/75 hover:border-white/25"
                              }`}
                            >
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* message */}
              <Section title="Tell us about your project (optional)">
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Briefly describe what you want to build…"
                  className="w-full rounded-lg border border-line bg-ink2 px-3 py-2.5 text-sm outline-none focus:border-neonblue"
                />
                <div className="mt-1 text-right text-[11px] text-white/35">{message.length}/1000</div>
              </Section>

              {/* summary */}
              <div className="mt-4 rounded-xl border border-line bg-ink2 p-4">
                <div className="mb-2 text-xs font-semibold tracking-wide text-white/50">YOUR REQUEST</div>
                <dl className="grid grid-cols-2 gap-y-1.5 text-sm">
                  <Row k="Template" v={template.title} />
                  <Row k="Category" v={cat?.label || template.category} />
                  <Row k="Starting price" v={formatPrice(template.basePrice)} />
                  <Row k="Interest" v={intent ? INTENT_META[intent].label : "—"} />
                  <Row k="WhatsApp" v={phoneDigits.length >= 10 ? normalized : "—"} />
                  <Row k="Meeting" v={date && time ? `${formatDateLabel(date)} · ${to12h(time)}` : "—"} />
                </dl>
              </div>

              {error && (
                <p className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}

              <button
                onClick={submit}
                disabled={!valid || submitting}
                className="btn btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Booking…" : "BOOK CONSULTATION"}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="mb-2 text-sm font-semibold text-white/85">{title}</h3>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-white/45">{k}</dt>
      <dd className="text-right font-medium text-white/85">{v}</dd>
    </>
  );
}

function SuccessView({
  template,
  catLabel,
  dateLabel,
  timeLabel,
  phone,
  followUpHref,
  hasWhatsapp,
  onClose,
}: {
  template: BookingTemplate;
  catLabel: string;
  dateLabel: string;
  timeLabel: string;
  phone: string;
  followUpHref: string;
  hasWhatsapp: boolean;
  onClose: () => void;
}) {
  return (
    <div className="p-7 text-center sm:p-9">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-2xl text-emerald-400"
      >
        ✓
      </motion.div>
      <h2 className="mt-4 text-2xl font-bold">Request Received</h2>
      <p className="mt-2 text-sm text-white/55">
        Thank you for your interest in Orbit Development. We&apos;ve received your consultation request for{" "}
        <span className="text-white/85">{template.title}</span> ({catLabel}).
      </p>

      <div className="mt-5 space-y-2 rounded-xl border border-line bg-ink2 p-4 text-left text-sm">
        <div className="flex justify-between"><span className="text-white/45">Meeting</span><span className="font-medium">{dateLabel} · {timeLabel}</span></div>
        <div className="flex justify-between"><span className="text-white/45">WhatsApp</span><span className="font-medium">{phone}</span></div>
      </div>
      <p className="mt-3 text-xs text-white/45">Our team will contact you on WhatsApp regarding the meeting.</p>

      <div className="mt-6 flex flex-col gap-2">
        {hasWhatsapp && (
          <a href={followUpHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
            Contact us on WhatsApp
          </a>
        )}
        <button onClick={onClose} className="btn btn-ghost w-full">Back to website</button>
      </div>
    </div>
  );
}
