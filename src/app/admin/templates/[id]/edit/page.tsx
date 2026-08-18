import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TemplateForm from "@/components/TemplateForm";
import { updateTemplate } from "../../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Template" };

export default async function EditTemplate({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const t = await prisma.template.findUnique({ where: { id: params.id } });
  if (!t) notFound();

  // bind the id so the form only submits FormData
  const action = updateTemplate.bind(null, t.id);

  return (
    <div>
      <Link href="/admin/templates" className="text-sm text-white/50 hover:text-white">← Back to templates</Link>
      <h1 className="mt-2 text-2xl font-black">Edit: {t.title}</h1>
      {searchParams.error === "demo" && (
        <p className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          Please enter a valid demo download URL (must start with https://).
        </p>
      )}
      <div className="mt-6">
        <TemplateForm action={action} t={t} />
      </div>
    </div>
  );
}
