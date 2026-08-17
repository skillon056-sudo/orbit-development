import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORY, STATUS, INTENT } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [total, website, app, published, clients, totalLeads, newLeads, serious, info, meetings, converted] =
    await Promise.all([
      prisma.template.count(),
      prisma.template.count({ where: { category: CATEGORY.WEBSITE } }),
      prisma.template.count({ where: { category: CATEGORY.APP } }),
      prisma.template.count({ where: { status: STATUS.PUBLISHED } }),
      prisma.client.count(),
      prisma.consultationRequest.count(),
      prisma.consultationRequest.count({ where: { status: "NEW" } }),
      prisma.consultationRequest.count({ where: { intent: INTENT.SERIOUS } }),
      prisma.consultationRequest.count({ where: { intent: INTENT.INFORMATION_ONLY } }),
      prisma.consultationRequest.count({ where: { status: "MEETING_SCHEDULED" } }),
      prisma.consultationRequest.count({ where: { status: "CONVERTED" } }),
    ]);

  const leadStats = [
    { label: "Total Leads", value: totalLeads, href: "/admin/leads" },
    { label: "New Leads", value: newLeads, href: "/admin/leads?status=NEW" },
    { label: "Serious", value: serious, href: "/admin/leads?intent=SERIOUS" },
    { label: "Info Requests", value: info, href: "/admin/leads?intent=INFORMATION_ONLY" },
    { label: "Meetings Scheduled", value: meetings, href: "/admin/leads?status=MEETING_SCHEDULED" },
    { label: "Converted", value: converted, href: "/admin/leads?status=CONVERTED" },
  ];

  const stats = [
    { label: "Total Templates", value: total, href: "/admin/templates" },
    { label: "Website Templates", value: website, href: "/admin/templates" },
    { label: "App Templates", value: app, href: "/admin/templates" },
    { label: "Published", value: published, href: "/admin/templates" },
    { label: "Clients", value: clients, href: "/admin/clients" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black">Dashboard</h1>
      <p className="mt-1 text-sm text-white/50">Overview of your leads and catalog.</p>

      <h2 className="mt-6 text-sm font-semibold tracking-wide text-white/60">LEADS</h2>
      <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-3">
        {leadStats.map((s) => (
          <Link key={s.label} href={s.href} className="admin-card transition hover:border-neonblue">
            <div className="grad-text text-4xl font-black">{s.value}</div>
            <div className="mt-1 text-sm text-white/55">{s.label}</div>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 text-sm font-semibold tracking-wide text-white/60">CATALOG</h2>
      <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="admin-card transition hover:border-neonblue">
            <div className="grad-text text-4xl font-black">{s.value}</div>
            <div className="mt-1 text-sm text-white/55">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/templates/new" className="btn btn-primary">+ Add Template</Link>
        <Link href="/admin/clients" className="btn btn-ghost">Manage Clients</Link>
        <Link href="/admin/contact" className="btn btn-ghost">Contact Settings</Link>
        <Link href="/admin/homepage" className="btn btn-ghost">Homepage Content</Link>
      </div>
    </div>
  );
}
