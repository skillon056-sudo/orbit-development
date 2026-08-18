import Link from "next/link";
import { CATEGORY, STATUS, parseList } from "@/lib/constants";
import SubmitButton from "./SubmitButton";

type T = {
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  coverImage: string;
  screenshots: string;
  basePrice: number;
  extraCharges: string;
  pricingNotes: string;
  category: string;
  technologies: string;
  techStack: string;
  features: string;
  deliveryInfo: string;
  supportInfo: string;
  demoDownloadUrl: string;
  liveDemoUrl: string;
  status: string;
  order: number;
};

// Native form -> server action. Works without client JS. `t` prefills for editing.
export default function TemplateForm({
  action,
  t,
}: {
  action: (formData: FormData) => void;
  t?: T;
}) {
  const shots = t ? parseList(t.screenshots) : [];
  const techs = t ? parseList(t.technologies).join("\n") : "";
  const feats = t ? parseList(t.features).join("\n") : "";

  return (
    <form action={action} className="space-y-6">
      <section className="admin-card space-y-4">
        <h2 className="font-bold">Basic Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Template title *"><input name="title" required defaultValue={t?.title} className="admin-input" /></Field>
          <Field label="Slug (auto from title if blank)"><input name="slug" defaultValue={t?.slug} placeholder="modern-ecommerce" className="admin-input" /></Field>
        </div>
        <Field label="Short description *"><input name="shortDesc" required defaultValue={t?.shortDesc} className="admin-input" /></Field>
        <Field label="Full description">
          <textarea name="description" rows={5} defaultValue={t?.description} className="admin-input" />
        </Field>
      </section>

      <section className="admin-card space-y-4">
        <h2 className="font-bold">Images</h2>
        <p className="text-xs text-white/45">
          Upload a file <b>or</b> paste a direct image URL (https://…). URL takes priority.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t ? "Replace cover — upload file" : "Cover image — upload file"}>
            <input name="cover" type="file" accept="image/*" className="admin-input" />
          </Field>
          <Field label="…or cover image URL">
            <input name="coverUrl" type="url" placeholder="https://example.com/cover.jpg" className="admin-input" />
          </Field>
        </div>
        {t?.coverImage && <p className="break-all text-xs text-white/40">Current: {t.coverImage}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Add screenshots — upload files (multiple)">
            <input name="screenshots" type="file" accept="image/*" multiple className="admin-input" />
          </Field>
          <Field label="…or screenshot URLs (one per line)">
            <textarea name="screenshotUrls" rows={3} placeholder={"https://…/1.jpg\nhttps://…/2.jpg"} className="admin-input" />
          </Field>
        </div>
        {shots.length > 0 && (
          <div>
            <p className="admin-label">Keep existing screenshots</p>
            <div className="space-y-1">
              {shots.map((s) => (
                <label key={s} className="flex items-center gap-2 text-xs text-white/60">
                  <input type="checkbox" name="keepShots" value={s} defaultChecked /> {s}
                </label>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="admin-card space-y-4">
        <h2 className="font-bold">Category & Pricing</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Category *">
            <select name="category" defaultValue={t?.category || CATEGORY.WEBSITE} className="admin-input">
              <option value={CATEGORY.WEBSITE}>Website Development</option>
              <option value={CATEGORY.APP}>App Development</option>
            </select>
          </Field>
          <Field label="Base price (₹) *"><input name="basePrice" type="number" required defaultValue={t?.basePrice} className="admin-input" /></Field>
          <Field label="Display order"><input name="order" type="number" defaultValue={t?.order ?? 0} className="admin-input" /></Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Extra charges (free text)"><input name="extraCharges" defaultValue={t?.extraCharges} placeholder="₹5,000 per extra page" className="admin-input" /></Field>
          <Field label="Pricing notes"><input name="pricingNotes" defaultValue={t?.pricingNotes} className="admin-input" /></Field>
        </div>
      </section>

      <section className="admin-card space-y-4">
        <h2 className="font-bold">Demo</h2>
        <p className="text-xs text-white/45">
          Optional. Direct link to an APK/ZIP (or any file). If set, a DOWNLOAD DEMO button appears on the template page. Must be a valid http(s) URL. Leave blank to remove.
        </p>
        <Field label="Demo download URL (APK / ZIP)">
          <input name="demoDownloadUrl" type="url" defaultValue={t?.demoDownloadUrl} placeholder="https://cdn.example.com/demos/app.apk" className="admin-input" />
        </Field>
        <Field label="Live demo URL (optional, for websites)">
          <input name="liveDemoUrl" type="url" defaultValue={t?.liveDemoUrl} placeholder="https://demo.example.com" className="admin-input" />
        </Field>
      </section>

      <section className="admin-card space-y-4">
        <h2 className="font-bold">Technical Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Technologies (one per line or comma-separated)">
            <textarea name="technologies" rows={4} defaultValue={techs} placeholder={"Next.js\nTypeScript\nStripe"} className="admin-input" />
          </Field>
          <Field label="Features (one per line or comma-separated)">
            <textarea name="features" rows={4} defaultValue={feats} placeholder={"Cart & checkout\nAdmin dashboard"} className="admin-input" />
          </Field>
        </div>
        <Field label="Tech stack (one line)"><input name="techStack" defaultValue={t?.techStack} placeholder="Next.js · Tailwind · Prisma" className="admin-input" /></Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Delivery information"><input name="deliveryInfo" defaultValue={t?.deliveryInfo} placeholder="10–14 working days" className="admin-input" /></Field>
          <Field label="Support information"><input name="supportInfo" defaultValue={t?.supportInfo} placeholder="30 days free support" className="admin-input" /></Field>
        </div>
      </section>

      <section className="admin-card space-y-4">
        <h2 className="font-bold">Status</h2>
        <Field label="Publish status">
          <select name="status" defaultValue={t?.status || STATUS.DRAFT} className="admin-input md:w-64">
            <option value={STATUS.DRAFT}>Draft</option>
            <option value={STATUS.PUBLISHED}>Published</option>
            <option value={STATUS.UNPUBLISHED}>Unpublished</option>
          </select>
        </Field>
      </section>

      <div className="flex gap-3">
        <SubmitButton>{t ? "Save Changes" : "Create Template"}</SubmitButton>
        <Link href="/admin/templates" className="btn btn-ghost">Cancel</Link>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      {children}
    </label>
  );
}
