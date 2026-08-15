import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { CATEGORY_META, STATUS, formatPrice, type Category } from "@/lib/constants";
import TemplateRowActions from "@/components/TemplateRowActions";

export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  PUBLISHED: "text-green-300 border-green-500/40 bg-green-500/10",
  DRAFT: "text-yellow-300 border-yellow-500/40 bg-yellow-500/10",
  UNPUBLISHED: "text-white/50 border-line bg-white/5",
};

export default async function TemplatesAdmin() {
  const templates = await prisma.template.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Templates</h1>
          <p className="mt-1 text-sm text-white/50">{templates.length} total</p>
        </div>
        <Link href="/admin/templates/new" className="btn btn-primary">+ Add Template</Link>
      </div>

      {templates.length === 0 ? (
        <div className="admin-card mt-6 text-center text-white/50">
          No templates yet. <Link href="/admin/templates/new" className="grad-text font-bold">Create your first one →</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {templates.map((t) => (
            <div key={t.id} className="admin-card flex flex-col gap-4 !p-4 sm:flex-row sm:items-center">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-ink">
                {t.coverImage && (
                  <Image src={t.coverImage} alt={t.title} fill sizes="96px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{t.title}</h3>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] ${statusStyle[t.status] || ""}`}>
                    {t.status}
                  </span>
                  <span className="chip !text-[10px]">{CATEGORY_META[t.category as Category]?.label}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-white/45">/{t.slug} · {formatPrice(t.basePrice)}</p>
              </div>
              <TemplateRowActions id={t.id} status={t.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
