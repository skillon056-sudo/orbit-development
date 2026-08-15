import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { createClient, updateClient } from "../actions";
import ClientRowActions from "@/components/ClientRowActions";
import SubmitButton from "@/components/SubmitButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clients" };

export default async function ClientsAdmin({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const clients = await prisma.client.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-black">Clients</h1>
      <p className="mt-1 text-sm text-white/50">Logos shown in the homepage marquee.</p>

      {/* Add client */}
      <form action={createClient} className="admin-card mt-6 space-y-4">
        <p className="text-xs text-white/45">Upload a logo file <b>or</b> paste a direct image URL. URL takes priority.</p>
        <div className="grid gap-4 md:grid-cols-2 md:items-end">
          <label className="block">
            <span className="admin-label">Client name *</span>
            <input name="name" required className="admin-input" />
          </label>
          <label className="block">
            <span className="admin-label">Order</span>
            <input name="order" type="number" defaultValue={clients.length + 1} className="admin-input" />
          </label>
          <label className="block">
            <span className="admin-label">Logo — upload file</span>
            <input name="logo" type="file" accept="image/*" className="admin-input" />
          </label>
          <label className="block">
            <span className="admin-label">…or logo image URL</span>
            <input name="logoUrl" type="url" placeholder="https://example.com/logo.png" className="admin-input" />
          </label>
        </div>
        <SubmitButton>+ Add Client</SubmitButton>
      </form>
      {searchParams.error === "missing" && (
        <p className="mt-3 text-sm text-red-300">Name and a logo (file or URL) are required.</p>
      )}

      {/* List / edit */}
      <div className="mt-6 space-y-3">
        {clients.length === 0 && <p className="text-white/45">No clients yet.</p>}
        {clients.map((c) => (
          <form
            key={c.id}
            action={updateClient.bind(null, c.id)}
            className="admin-card flex flex-col gap-4 !p-4 sm:flex-row sm:items-center"
          >
            <div className="grid h-14 w-24 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-ink p-2">
              <Image src={c.logo} alt={c.name} width={90} height={45} className="max-h-10 w-auto object-contain" />
            </div>
            <input name="name" defaultValue={c.name} className="admin-input sm:max-w-48" />
            <input name="order" type="number" defaultValue={c.order} className="admin-input sm:w-20" />
            <label className="flex items-center gap-2 text-xs text-white/60">
              <input type="checkbox" name="enabled" defaultChecked={c.enabled} /> Enabled
            </label>
            <label className="block text-xs text-white/50">
              Replace logo — file
              <input name="logo" type="file" accept="image/*" className="admin-input mt-1" />
            </label>
            <label className="block text-xs text-white/50">
              …or image URL
              <input name="logoUrl" type="url" placeholder="https://…" className="admin-input mt-1" />
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <SubmitButton className="btn btn-ghost !px-3 !py-1.5 text-xs">Save</SubmitButton>
              <ClientRowActions id={c.id} enabled={c.enabled} />
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
