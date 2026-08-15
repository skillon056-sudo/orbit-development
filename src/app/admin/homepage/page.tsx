import { getHomepageSettings } from "@/lib/settings";
import { updateHomepage } from "../actions";
import SubmitButton from "@/components/SubmitButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Homepage Settings" };

export default async function HomepageAdmin({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const h = await getHomepageSettings();
  // pretty-print the features JSON for editing
  let featuresPretty = h.features;
  try {
    featuresPretty = JSON.stringify(JSON.parse(h.features), null, 2);
  } catch {}

  return (
    <div>
      <h1 className="text-2xl font-black">Homepage Content</h1>
      <p className="mt-1 text-sm text-white/50">Hero text, CTA labels and the features grid.</p>
      {searchParams.saved && (
        <p className="mt-3 rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm text-green-300">
          Saved.
        </p>
      )}

      <form action={updateHomepage} className="admin-card mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="admin-label">Hero subtitle (small label)</span>
            <input name="heroSubtitle" defaultValue={h.heroSubtitle} className="admin-input" />
          </label>
          <label className="block">
            <span className="admin-label">Hero title</span>
            <input name="heroTitle" defaultValue={h.heroTitle} className="admin-input" />
          </label>
        </div>
        <label className="block">
          <span className="admin-label">Hero description</span>
          <textarea name="heroDescription" rows={3} defaultValue={h.heroDescription} className="admin-input" />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="admin-label">Primary CTA label</span>
            <input name="ctaPrimary" defaultValue={h.ctaPrimary} className="admin-input" />
          </label>
          <label className="block">
            <span className="admin-label">Secondary CTA label</span>
            <input name="ctaSecondary" defaultValue={h.ctaSecondary} className="admin-input" />
          </label>
        </div>
        <label className="block">
          <span className="admin-label">
            Features (JSON array of {`{ "title", "desc", "icon" }`})
          </span>
          <textarea name="features" rows={12} defaultValue={featuresPretty} className="admin-input font-mono text-xs" />
        </label>
        <SubmitButton>Save Content</SubmitButton>
      </form>
    </div>
  );
}
