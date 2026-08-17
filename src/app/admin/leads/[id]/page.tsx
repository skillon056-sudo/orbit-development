import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateLeadNotes, rescheduleLead } from "../../actions";
import LeadActions from "@/components/LeadActions";
import SubmitButton from "@/components/SubmitButton";
import { waLink } from "@/lib/whatsapp";
import {
  INTENT_META,
  LEAD_STATUS_META,
  CATEGORY_META,
  TIME_SLOTS,
  formatDateLabel,
  formatSubmitted,
  formatPrice,
  to12h,
  type Intent,
  type LeadStatus,
} from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata = { title: "Lead" };

export default async function LeadDetail({ params }: { params: { id: string } }) {
  const l = await prisma.consultationRequest.findUnique({ where: { id: params.id } });
  if (!l) notFound();

  const im = INTENT_META[l.intent as Intent];
  const sm = LEAD_STATUS_META[l.status as LeadStatus];
  const catLabel = CATEGORY_META[l.category as keyof typeof CATEGORY_META]?.label || l.category;
  const openWa = waLink(l.whatsappNumber, `Hi, regarding your consultation request for "${l.templateTitle}".`);

  return (
    <div>
      <Link href="/admin/leads" className="text-sm text-white/50 hover:text-white">← Back to leads</Link>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-black">Consultation Request</h1>
        <span className={`rounded-full border px-2.5 py-0.5 text-xs ${sm?.badge}`}>{sm?.label}</span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        {/* Left: details */}
        <div className="space-y-4">
          <section className="admin-card">
            <div className="admin-label">Requested template</div>
            <div className="text-lg font-bold">{l.templateTitle}</div>
            <div className="mt-1 text-sm text-white/55">{catLabel} · Starting {formatPrice(l.basePrice)}</div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <section className="admin-card">
              <div className="admin-label">Client intent</div>
              <div className={`font-semibold ${l.intent === "SERIOUS" ? "text-blue-300" : "text-white/70"}`}>
                {l.intent === "SERIOUS" ? "🔵 " : "ℹ️ "}{im?.label}
              </div>
            </section>
            <section className="admin-card">
              <div className="admin-label">Client WhatsApp</div>
              <div className="font-semibold">{l.whatsappNumber}</div>
              <a href={openWa} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-semibold text-neonblue hover:underline">
                Open WhatsApp chat →
              </a>
            </section>
          </div>

          <section className="admin-card">
            <div className="admin-label">Preferred meeting</div>
            <div className="text-lg font-bold">{formatDateLabel(l.preferredDate)}</div>
            <div className="text-sm text-white/70">{to12h(l.preferredTime)}</div>

            {/* Reschedule */}
            <form action={rescheduleLead.bind(null, l.id)} className="mt-4 flex flex-wrap items-end gap-2 border-t border-line pt-4">
              <label className="block">
                <span className="admin-label">New date</span>
                <input type="date" name="preferredDate" defaultValue={l.preferredDate} className="admin-input" />
              </label>
              <label className="block">
                <span className="admin-label">New time</span>
                <select name="preferredTime" defaultValue={l.preferredTime} className="admin-input">
                  {TIME_SLOTS.flatMap((g) => g.slots).map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </label>
              <SubmitButton className="btn btn-ghost !py-2 text-xs">Reschedule</SubmitButton>
            </form>
          </section>

          {l.projectMessage && (
            <section className="admin-card">
              <div className="admin-label">Project details</div>
              <p className="whitespace-pre-line text-sm text-white/75">{l.projectMessage}</p>
            </section>
          )}

          <p className="text-xs text-white/40">Submitted {formatSubmitted(l.createdAt)}</p>
        </div>

        {/* Right: actions + notes */}
        <div className="space-y-4">
          <section className="admin-card">
            <LeadActions id={l.id} status={l.status} whatsappNumber={l.whatsappNumber} />
          </section>

          <section className="admin-card">
            <form action={updateLeadNotes.bind(null, l.id)}>
              <div className="admin-label">Internal notes (not visible to client)</div>
              <textarea name="notes" rows={5} defaultValue={l.notes} placeholder="Add a private note…" className="admin-input" />
              <SubmitButton className="btn btn-ghost mt-2 !py-2 text-xs">Save notes</SubmitButton>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
