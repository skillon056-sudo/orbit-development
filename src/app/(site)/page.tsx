import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import RevealCard from "@/components/RevealCard";
import TemplateCard from "@/components/TemplateCard";
import Marquee from "@/components/Marquee";
import Icon from "@/components/Icon";
import MagneticButton from "@/components/MagneticButton";
import TechUniverse from "@/components/three/TechUniverse";
import { getPublishedTemplates, getEnabledClients } from "@/lib/queries";
import { getContactSettings, getHomepageSettings } from "@/lib/settings";
import { CATEGORY, CATEGORY_META, parseFeatures } from "@/lib/constants";

// Always reflect the latest admin changes.
export const dynamic = "force-dynamic";

function Chapter({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-2 flex items-center gap-3 text-xs font-bold tracking-[3px] text-neonpurple">
      <span className="grad-text">{n}</span>
      <span className="h-px w-8 bg-line" />
      <span className="text-white/45">{label}</span>
    </div>
  );
}

export default async function HomePage() {
  const [home, contact, websiteT, appT, clients] = await Promise.all([
    getHomepageSettings(),
    getContactSettings(),
    getPublishedTemplates(CATEGORY.WEBSITE),
    getPublishedTemplates(CATEGORY.APP),
    getEnabledClients(),
  ]);
  const features = parseFeatures(home.features);

  return (
    <>
      <Hero
        title={home.heroTitle}
        subtitle={home.heroSubtitle}
        description={home.heroDescription}
        ctaPrimary={home.ctaPrimary}
        ctaSecondary={home.ctaSecondary}
      />

      {/* Two categories — cover banners + button */}
      <section className="wrap py-8">
        <div className="grid gap-5 md:grid-cols-2">
          {[CATEGORY.WEBSITE, CATEGORY.APP].map((cat, i) => {
            const meta = CATEGORY_META[cat];
            const cover = cat === CATEGORY.WEBSITE ? "/covers/website-dev.png" : "/covers/app-dev.png";
            return (
              <RevealCard key={cat} delay={i * 0.1}>
                <Link
                  href={`/${meta.slug}`}
                  className="glass group block overflow-hidden rounded-2xl transition hover:border-neonpurple"
                >
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={cover}
                      alt={meta.label}
                      fill
                      sizes="(max-width:768px) 100vw, 560px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  </div>
                  <div className="flex items-center justify-between gap-4 p-6">
                    <p className="max-w-xs text-sm text-white/55">{meta.blurb}</p>
                    <span className="btn btn-primary shrink-0 !px-5 !py-2.5 text-xs">Browse →</span>
                  </div>
                </Link>
              </RevealCard>
            );
          })}
        </div>
      </section>

      <CategorySection
        id="website"
        chapter="01"
        chapterLabel="WEBSITE DEVELOPMENT"
        title="Website Templates"
        templates={websiteT}
        whatsappNumber={contact.whatsappNumber}
        href={`/${CATEGORY_META.WEBSITE.slug}`}
      />

      {/* Clients — calm content beat */}
      <section id="clients" className="py-16">
        <div className="wrap mb-8">
          <Reveal>
            <Chapter n="02" label="TRUSTED BY" />
            <h2 className="section-title">Trusted by <span className="grad-text">Businesses</span></h2>
            <p className="mt-2 text-white/55">Teams we&apos;ve built websites and apps for.</p>
          </Reveal>
        </div>
        {clients.length > 0 ? (
          <Marquee clients={clients} />
        ) : (
          <p className="wrap text-sm text-white/40">Client logos coming soon.</p>
        )}
      </section>

      {/* Technology universe — 3D moment */}
      <section id="technology" className="wrap py-16">
        <Reveal>
          <Chapter n="03" label="TECHNOLOGY" />
          <h2 className="section-title">A <span className="grad-text">technology</span> universe.</h2>
          <p className="mt-2 max-w-xl text-white/55">
            The modern stack we build on — connected as one digital network.
          </p>
        </Reveal>
        <TechUniverse />
      </section>

      <CategorySection
        id="app"
        chapter="04"
        chapterLabel="APP DEVELOPMENT"
        title="App Templates"
        templates={appT}
        whatsappNumber={contact.whatsappNumber}
        href={`/${CATEGORY_META.APP.slug}`}
      />

      {/* Why choose us */}
      <section id="features" className="wrap py-16">
        <div className="mb-10">
          <Reveal>
            <Chapter n="05" label="WHY ORBIT" />
            <h2 className="section-title">Why Choose <span className="grad-text">Orbit</span></h2>
            <p className="mt-2 text-white/55">The difference is in how we build.</p>
          </Reveal>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <RevealCard key={f.title} delay={(i % 4) * 0.06}>
              <div className="glass h-full rounded-2xl p-6 transition hover:-translate-y-1 hover:border-neonpurple">
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl border border-line bg-neonpurple/10 text-neonpurple">
                  <Icon name={f.icon || "spark"} className="h-6 w-6" />
                </div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-white/55">{f.desc}</p>
              </div>
            </RevealCard>
          ))}
        </div>
      </section>

      {/* Final cinematic CTA */}
      <section className="wrap py-16">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-3xl p-10 text-center md:p-16 [background:linear-gradient(120deg,rgba(47,123,255,.12),rgba(178,59,255,.12))]">
            <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,43,255,0.35),transparent_70%)] blur-2xl" />
            <p className="relative text-xs font-bold tracking-[4px] text-neonpurple">ORBIT DEVELOPMENT</p>
            <h2 className="relative mt-3 text-3xl font-black md:text-5xl">
              Ready to build your <span className="grad-text">digital world?</span>
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-white/60">
              Pick a template or tell us what you need — we&apos;ll take it from concept to launch.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <MagneticButton href="/contact" className="btn btn-primary">Contact Us</MagneticButton>
              <MagneticButton href="/website-development" className="btn btn-ghost">Explore Our Work</MagneticButton>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function CategorySection({
  id,
  chapter,
  chapterLabel,
  title,
  templates,
  whatsappNumber,
  href,
}: {
  id: string;
  chapter: string;
  chapterLabel: string;
  title: string;
  templates: Awaited<ReturnType<typeof getPublishedTemplates>>;
  whatsappNumber: string;
  href: string;
}) {
  return (
    <section id={id} className="wrap py-12">
      <div className="mb-7 flex items-end justify-between">
        <Reveal>
          <Chapter n={chapter} label={chapterLabel} />
          <h2 className="section-title">{title}</h2>
        </Reveal>
        <Link href={href} className="text-sm font-bold text-white/60 hover:text-white">View all →</Link>
      </div>
      {templates.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-white/45">
          No templates published yet in this category.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.slice(0, 3).map((t, i) => (
            <RevealCard key={t.id} delay={i * 0.08}>
              <TemplateCard t={t} whatsappNumber={whatsappNumber} />
            </RevealCard>
          ))}
        </div>
      )}
    </section>
  );
}
