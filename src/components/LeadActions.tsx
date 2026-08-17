"use client";
import { useState, useTransition } from "react";
import { setLeadStatus, deleteLead } from "@/app/admin/actions";
import { LEAD_STATUS_META, type LeadStatus } from "@/lib/constants";

export default function LeadActions({
  id,
  status,
  whatsappNumber,
}: {
  id: string;
  status: string;
  whatsappNumber: string;
}) {
  const [pending, start] = useTransition();
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <div className="admin-label">Status</div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(LEAD_STATUS_META) as LeadStatus[]).map((k) => {
            const active = status === k;
            return (
              <button
                key={k}
                disabled={pending}
                onClick={() => start(() => setLeadStatus(id, k))}
                className={`rounded-md border px-2.5 py-1.5 text-xs transition disabled:opacity-50 ${
                  active ? "border-neonblue bg-neonblue/15 text-white" : "border-line text-white/60 hover:border-neonblue"
                }`}
              >
                {LEAD_STATUS_META[k].label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            navigator.clipboard?.writeText(whatsappNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="rounded-md border border-line px-3 py-1.5 text-xs hover:border-neonblue"
        >
          {copied ? "Copied ✓" : "Copy WhatsApp number"}
        </button>
        <button
          disabled={pending}
          onClick={() => {
            if (confirm("Delete this lead permanently?")) start(() => deleteLead(id));
          }}
          className="rounded-md border border-red-500/40 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-50"
        >
          Delete lead
        </button>
      </div>
    </div>
  );
}
