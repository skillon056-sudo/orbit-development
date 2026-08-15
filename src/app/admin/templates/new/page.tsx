import Link from "next/link";
import TemplateForm from "@/components/TemplateForm";
import { createTemplate } from "../../actions";

export const metadata = { title: "New Template" };

export default function NewTemplate({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div>
      <Link href="/admin/templates" className="text-sm text-white/50 hover:text-white">← Back to templates</Link>
      <h1 className="mt-2 text-2xl font-black">Add Template</h1>
      {searchParams.error === "missing" && (
        <p className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          Title and a cover image are required.
        </p>
      )}
      <div className="mt-6">
        <TemplateForm action={createTemplate} />
      </div>
    </div>
  );
}
