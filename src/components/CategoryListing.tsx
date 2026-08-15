import Reveal from "@/components/Reveal";
import TemplateCard from "@/components/TemplateCard";
import Icon from "@/components/Icon";
import { getPublishedTemplates } from "@/lib/queries";
import { getContactSettings } from "@/lib/settings";
import { CATEGORY_META, type Category } from "@/lib/constants";

// Shared listing UI for the Website / App development pages.
export default async function CategoryListing({ category }: { category: Category }) {
  const meta = CATEGORY_META[category];
  const [templates, contact] = await Promise.all([
    getPublishedTemplates(category),
    getContactSettings(),
  ]);

  return (
    <div className="wrap py-16">
      <Reveal>
        <span className="chip text-neonpurple">CATALOG</span>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">
          {meta.label.split(" ")[0]} <span className="grad-text">{meta.label.split(" ").slice(1).join(" ")}</span>
        </h1>
        <p className="mt-3 max-w-2xl text-white/55">{meta.blurb}</p>
      </Reveal>

      {templates.length === 0 ? (
        <div className="glass mt-12 rounded-2xl p-16 text-center">
          <Icon name="box" className="mx-auto h-10 w-10 text-neonpurple" />
          <p className="mt-3 text-white/55">No templates published yet. Check back soon.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 0.06}>
              <TemplateCard t={t} whatsappNumber={contact.whatsappNumber} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
