"use client";
import Link from "next/link";
import { useTransition } from "react";
import { deleteTemplate, duplicateTemplate, setTemplateStatus } from "@/app/admin/actions";
import { STATUS } from "@/lib/constants";

export default function TemplateRowActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [pending, start] = useTransition();
  const published = status === STATUS.PUBLISHED;

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <Link href={`/admin/templates/${id}/edit`} className="rounded-md border border-line px-2.5 py-1.5 hover:border-neonpurple">
        Edit
      </Link>
      <button
        disabled={pending}
        onClick={() =>
          start(() => setTemplateStatus(id, published ? STATUS.UNPUBLISHED : STATUS.PUBLISHED))
        }
        className="rounded-md border border-line px-2.5 py-1.5 hover:border-neonpurple disabled:opacity-50"
      >
        {published ? "Unpublish" : "Publish"}
      </button>
      <button
        disabled={pending}
        onClick={() => start(() => duplicateTemplate(id))}
        className="rounded-md border border-line px-2.5 py-1.5 hover:border-neonpurple disabled:opacity-50"
      >
        Duplicate
      </button>
      <button
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this template? This cannot be undone.")) start(() => deleteTemplate(id));
        }}
        className="rounded-md border border-red-500/40 px-2.5 py-1.5 text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
