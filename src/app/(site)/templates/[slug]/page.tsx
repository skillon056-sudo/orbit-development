import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplateBySlug } from "@/lib/queries";
import { getContactSettings } from "@/lib/settings";
import {
  CATEGORY_META,
  formatPrice,
  parseList,
  isValidDemoUrl,
  STATUS,
  type Category,
} from "@/lib/constants";
import BookNowButton from "@/components/BookNowButton";
import DownloadDemoButton from "@/components/DownloadDemoButton";
import PixelView from "@/components/PixelView";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const t = await getTemplateBySlug(params.slug);
  if (!t) return { title: "Template not found" };
  return {
    title: t.title,
    description: t.shortDesc,
    openGraph: {
      title: t.title,
      description: t.shortDesc,
      images: t.coverImage ? [{ url: t.coverImage }] : [],
    },
  };
}

export default async function TemplateDetail({
  params,
}: {
  params: { slug: string };
}) {
  const t = await getTemplateBySlug(params.slug);
  if (!t || t.status !== STATUS.PUBLISHED) notFound();

  const contact = await getContactSettings();
  const cat = CATEGORY_META[t.category as Category];
  const techs = parseList(t.technologies);
  const feats = parseList(t.features);
  const shots = parseList(t.screenshots);

  return (
    <article className="wrap py-12">
      <PixelView name={t.title} category={t.category} value={t.basePrice} />
      <nav className="mb-6 text-sm text-white/45">
        <Link href="/" className="hover:text-white">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/${cat?.slug}`} className="hover:text-white">{cat?.label}</Link>
        <span className="mx-2">/</span>
        <span className="text-white/70">{t.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: media */}
        <div>
          <Reveal>
            <div className="glass relative aspect-[16/10] overflow-hidden rounded-2xl">
              <Image src={t.coverImage} alt={t.title} fill sizes="(max-width:1024px) 100vw, 60vw" className="object-cover" priority />
              <span className="absolute left-4 top-4 chip bg-black/50 backdrop-blur">{cat?.label}</span>
            </div>
          </Reveal>

          {shots.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {shots.map((s, i) => (
                <div key={i} className="glass relative aspect-[16/10] overflow-hidden rounded-xl">
                  <Image src={s} alt={`${t.title} screenshot ${i + 1}`} fill sizes="30vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}

          <Reveal>
            <div className="glass mt-6 rounded-2xl p-6">
              <h2 className="text-xl font-bold">About this template</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-white/65">{t.description}</p>
            </div>
          </Reveal>

          {feats.length > 0 && (
            <div className="glass mt-4 rounded-2xl p-6">
              <h2 className="text-xl font-bold">Features</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {feats.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-white/65">
                    <span className="mt-1 text-neonpurple">◆</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {t.deliveryInfo && (
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold">Delivery</h3>
                <p className="mt-2 text-sm text-white/60">{t.deliveryInfo}</p>
              </div>
            )}
            {t.supportInfo && (
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold">Support</h3>
                <p className="mt-2 text-sm text-white/60">{t.supportInfo}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: sticky order panel */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="glass rounded-2xl p-7">
            <h1 className="text-2xl font-black leading-tight">{t.title}</h1>
            <p className="mt-2 text-white/55">{t.shortDesc}</p>

            <div className="mt-5 border-y border-line py-5">
              <div className="text-xs text-white/40">Starting at</div>
              <div className="grad-text text-4xl font-black">{formatPrice(t.basePrice)}</div>
              {t.extraCharges && <div className="mt-1 text-sm text-white/50">+ {t.extraCharges}</div>}
              {t.pricingNotes && <div className="mt-2 text-xs text-white/40">{t.pricingNotes}</div>}
            </div>

            {techs.length > 0 && (
              <div className="mt-5">
                <div className="mb-2 text-xs font-bold tracking-wide text-white/50">TECHNOLOGIES</div>
                <div className="flex flex-wrap gap-1.5">
                  {techs.map((tech) => (
                    <span key={tech} className="chip">{tech}</span>
                  ))}
                </div>
              </div>
            )}
            {t.techStack && <p className="mt-3 text-xs text-white/40">{t.techStack}</p>}

            <div className="mt-6 flex flex-col gap-2">
              {isValidDemoUrl(t.demoDownloadUrl) && (
                <DownloadDemoButton url={t.demoDownloadUrl} title={t.title} className="btn btn-ghost w-full" />
              )}
              <BookNowButton
                template={{ id: t.id, title: t.title, category: t.category, basePrice: t.basePrice }}
                whatsappNumber={contact.whatsappNumber}
                className="btn btn-primary w-full"
              />
              <Link href="/contact" className="btn btn-ghost w-full">Ask a question</Link>
            </div>
            <p className="mt-3 text-center text-xs text-white/35">Opens WhatsApp with your inquiry pre-filled.</p>
          </div>
        </aside>
      </div>
    </article>
  );
}
