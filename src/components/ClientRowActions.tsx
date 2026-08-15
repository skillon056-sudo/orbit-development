"use client";
import { useTransition } from "react";
import { toggleClient, deleteClient } from "@/app/admin/actions";

export default function ClientRowActions({
  id,
  enabled,
}: {
  id: string;
  enabled: boolean;
}) {
  const [pending, start] = useTransition();
  return (
    <div className="flex gap-2 text-xs">
      <button
        disabled={pending}
        onClick={() => start(() => toggleClient(id, !enabled))}
        className="rounded-md border border-line px-2.5 py-1.5 hover:border-neonpurple disabled:opacity-50"
      >
        {enabled ? "Disable" : "Enable"}
      </button>
      <button
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this client?")) start(() => deleteClient(id));
        }}
        className="rounded-md border border-red-500/40 px-2.5 py-1.5 text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
