import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  INTENT_META,
  LEAD_STATUS_META,
  CATEGORY,
  CATEGORY_META,
  formatDateLabel,
  formatSubmitted,
  to12h,
  type Intent,
  type LeadStatus,
} from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leads" };

type SP = {
  status?: string;
  intent?: string;
  category?: string;
  range?: string;
  q?: string;
};

function rangeStart(range?: string): Date | null {
  const now = new Date();
  if (range === "today") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === "week") return new Date(now.getTime() - 7 * 864e5);
  if (range === "month") return new Date(now.getTime() - 30 * 864e5);
  return null;
}

function hrefWith(sp: SP, patch: Partial<SP>): string {
  const merged = { ...sp, ...patch };
  const p = new URLSearchParams();
  (Object.keys(merged) as (keyof SP)[]).forEach((k) => {
    const v = merged[k];
    if (v) p.set(k, v);
  });
  const s = p.toString();
  return `/admin/leads${s ? `?${s}` : ""}`;
}

function todayYMD(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export default async function LeadsAdmin({ searchParams }: { searchParams: SP }) {
  const { status, intent, category, range, q } = searchParams;

  const where: Record<string, unknown> = {};
  if (status && LEAD_STATUS_META[status as LeadStatus]) where.status = status;
  if (intent && INTENT_META[intent as Intent]) where.intent = intent;
  if (category && CATEGORY_META[category as keyof typeof CATEGORY_META]) where.category = category;
  const start = rangeStart(range);
  if (start) where.createdAt = { gte: start };
  if (q) {
    where.OR = [
      { whatsappNumber: { contains: q, mode: "insensitive" } },
      { templateTitle: { contains: q, mode: "insensitive" } },
      { projectMessage: { contains: q, mode: "insensitive" } },
    ];
  }

  const [leads, upcoming] = await Promise.all([
    prisma.consultationRequest.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.consultationRequest.findMany({
      where: { preferredDate: { gte: todayYMD() }, status: { notIn: ["CLOSED", "NOT_INTERESTED", "CONVERTED"] } },
      orderBy: [{ preferredDate: "asc" }, { preferredTime: "asc" }],
      take: 5,
    }),
  ]);

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs transition ${active ? "border-neonblue bg-neonblue/10 text-white" : "border-line text-white/55 hover:text-white"}`;

  return (
    <div>
      <h1 className="text-2xl font-black">Leads</h1>
      <p className="mt-1 text-sm text-white/50">{leads.length} shown · consultation requests</p>

      {/* Upcoming meetings */}
      {upcoming.length > 0 && (
        <div className="admin-card mt-5">
          <div className="mb-3 text-sm font-semibold tracking-wide text-white/60">UPCOMING MEETINGS</div>
          <div className="space-y-2">
            {upcoming.map((m) => (
              <Link key={m.id} href={`/admin/leads/${m.id}`} className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm transition hover:border-neonblue">
                <span className="font-medium text-neonblue">{formatDateLabel(m.preferredDate)} · {to12h(m.preferredTime)}</span>
                <span className="truncate px-3 text-white/70">{m.templateTitle}</span>
                <span className="shrink-0 text-white/50">{m.whatsappNumber}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <form className="mt-5 flex gap-2" action="/admin/leads">
        {status && <input type="hidden" name="status" value={status} />}
        {intent && <input type="hidden" name="intent" value={intent} />}
        {category && <input type="hidden" name="category" value={category} />}
        {range && <input type="hidden" name="range" value={range} />}
        <input name="q" defaultValue={q} placeholder="Search WhatsApp, template, message…" className="admin-input flex-1" />
        <button className="btn btn-primary">Search</button>
      </form>

      {/* Filters */}
      <div className="mt-4 space-y-2">
        <FilterRow label="Intent">
          <Link href={hrefWith(searchParams, { intent: undefined })} className={chip(!intent)}>All</Link>
          {(Object.keys(INTENT_META) as Intent[]).map((k) => (
            <Link key={k} href={hrefWith(searchParams, { intent: k })} className={chip(intent === k)}>{INTENT_META[k].short}</Link>
          ))}
        </FilterRow>
        <FilterRow label="Status">
          <Link href={hrefWith(searchParams, { status: undefined })} className={chip(!status)}>All</Link>
          {(Object.keys(LEAD_STATUS_META) as LeadStatus[]).map((k) => (
            <Link key={k} href={hrefWith(searchParams, { status: k })} className={chip(status === k)}>{LEAD_STATUS_META[k].label}</Link>
          ))}
        </FilterRow>
        <FilterRow label="Category">
          <Link href={hrefWith(searchParams, { category: undefined })} className={chip(!category)}>All</Link>
          <Link href={hrefWith(searchParams, { category: CATEGORY.WEBSITE })} className={chip(category === CATEGORY.WEBSITE)}>Website</Link>
          <Link href={hrefWith(searchParams, { category: CATEGORY.APP })} className={chip(category === CATEGORY.APP)}>App</Link>
        </FilterRow>
        <FilterRow label="Date">
          <Link href={hrefWith(searchParams, { range: undefined })} className={chip(!range)}>All time</Link>
          <Link href={hrefWith(searchParams, { range: "today" })} className={chip(range === "today")}>Today</Link>
          <Link href={hrefWith(searchParams, { range: "week" })} className={chip(range === "week")}>This week</Link>
          <Link href={hrefWith(searchParams, { range: "month" })} className={chip(range === "month")}>This month</Link>
        </FilterRow>
      </div>

      {/* List */}
      {leads.length === 0 ? (
        <div className="admin-card mt-6 text-center text-white/50">No leads match these filters.</div>
      ) : (
        <div className="mt-5 space-y-2.5">
          {leads.map((l) => {
            const im = INTENT_META[l.intent as Intent];
            const sm = LEAD_STATUS_META[l.status as LeadStatus];
            return (
              <Link
                key={l.id}
                href={`/admin/leads/${l.id}`}
                className="admin-card flex flex-col gap-3 !p-4 transition hover:border-neonblue sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{l.whatsappNumber}</span>
                    {im && (
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] ${l.intent === "SERIOUS" ? "border-blue-500/40 bg-blue-500/10 text-blue-300" : "border-line bg-white/5 text-white/55"}`}>
                        {im.short}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-white/60">
                    {l.templateTitle} · {CATEGORY_META[l.category as keyof typeof CATEGORY_META]?.label || l.category}
                  </p>
                </div>
                <div className="text-sm text-white/70 sm:w-44">
                  {formatDateLabel(l.preferredDate)} · {to12h(l.preferredTime)}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] ${sm?.badge}`}>{sm?.label}</span>
                  <span className="hidden text-xs text-white/40 sm:block">{formatSubmitted(l.createdAt).split("·")[0]}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 shrink-0 text-xs text-white/40">{label}</span>
      {children}
    </div>
  );
}
