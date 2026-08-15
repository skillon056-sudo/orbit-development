import { getContactSettings } from "@/lib/settings";
import { updateContact } from "../actions";
import SubmitButton from "@/components/SubmitButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact Settings" };

export default async function ContactAdmin({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const c = await getContactSettings();

  const fields: { name: keyof typeof c; label: string; placeholder?: string }[] = [
    { name: "whatsappNumber", label: "WhatsApp number (with country code, digits only)", placeholder: "919999999999" },
    { name: "whatsappSupportLink", label: "WhatsApp support link", placeholder: "https://wa.me/919999999999" },
    { name: "whatsappChannelLink", label: "WhatsApp channel link" },
    { name: "telegramUsername", label: "Telegram username", placeholder: "orbitdev" },
    { name: "telegramLink", label: "Telegram link", placeholder: "https://t.me/orbitdev" },
    { name: "email", label: "Email", placeholder: "hello@orbitdev.io" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black">Contact Settings</h1>
      <p className="mt-1 text-sm text-white/50">
        Used across the site — the ORDER NOW button uses the WhatsApp number below.
      </p>
      {searchParams.saved && (
        <p className="mt-3 rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm text-green-300">
          Saved. The frontend now uses these values.
        </p>
      )}

      <form action={updateContact} className="admin-card mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((f) => (
            <label key={f.name} className="block">
              <span className="admin-label">{f.label}</span>
              <input
                name={f.name}
                defaultValue={String(c[f.name] ?? "")}
                placeholder={f.placeholder}
                className="admin-input"
              />
            </label>
          ))}
        </div>
        <label className="block">
          <span className="admin-label">Support message (pre-filled on contact page)</span>
          <textarea name="supportMessage" rows={3} defaultValue={c.supportMessage} className="admin-input" />
        </label>
        <SubmitButton>Save Settings</SubmitButton>
      </form>
    </div>
  );
}
