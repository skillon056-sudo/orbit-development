import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORY, STATUS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [total, website, app, published, drafts, clients] = await Promise.all([
    prisma.template.count(),
    prisma.template.count({ where: { category: CATEGORY.WEBSITE } }),
    prisma.template.count({ where: { category: CATEGORY.APP } }),
    prisma.template.count({ where: { status: STATUS.PUBLISHED } }),
    prisma.template.count({ where: { status: STATUS.DRAFT } }),
    prisma.client.count(),
  ]);

  const stats = [
    { label: "Total Templates", value: total, href: "/admin/templates" },
    { label: "Website Templates", value: website, href: "/admin/templates" },
    { label: "App Templates", value: app, href: "/admin/templates" },
    { label: "Published", value: published, href: "/admin/templates" },
    { label: "Drafts", value: drafts, href: "/admin/templates" },
    { label: "Clients", value: clients, href: "/admin/clients" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black">Dashboard</h1>
      <p className="mt-1 text-sm text-white/50">Overview of your catalog.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="admin-card transition hover:border-neonpurple">
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
