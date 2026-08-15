"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CATEGORY_META, formatPrice, parseList, type Category } from "@/lib/constants";
import OrderButton from "./OrderButton";

export type TemplateCardData = {
  slug: string;
  title: string;
  shortDesc: string;
  coverImage: string;
  basePrice: number;
  extraCharges: string;
  category: string;
  technologies: string;
  features: string;
};

export default function TemplateCard({
  t,
  whatsappNumber,
}: {
  t: TemplateCardData;
  whatsappNumber: string;
}) {
  const cat = CATEGORY_META[t.category as Category];
  const techs = parseList(t.technologies).slice(0, 4);
  const feats = parseList(t.features).slice(0, 3);

  // subtle 3D tilt toward cursor
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 18 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 18 });
  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileHover={{ y: -6 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 900 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group glass relative flex flex-col overflow-hidden rounded-2xl"
    >
      {/* animated gradient border on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:linear-gradient(120deg,rgba(47,123,255,.5),rgba(178,59,255,.5))] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] p-px" />

      <Link href={`/templates/${t.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        <Image
          src={t.coverImage}
          alt={t.title}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 chip bg-black/50 backdrop-blur">{cat?.label}</span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/templates/${t.slug}`}>
          <h3 className="text-lg font-bold transition-colors group-hover:text-neonpurple">{t.title}</h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-white/55">{t.shortDesc}</p>

        {feats.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs text-white/50">
            {feats.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-neonpurple">◆</span> {f}
              </li>
            ))}
          </ul>
        )}

        {techs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {techs.map((tech) => (
              <span key={tech} className="chip text-[11px]">{tech}</span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
          <div>
            <div className="text-xs text-white/40">Starting at</div>
            <div className="grad-text text-xl font-black">{formatPrice(t.basePrice)}</div>
            {t.extraCharges && <div className="text-[11px] text-white/35">+ {t.extraCharges}</div>}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <OrderButton
            templateTitle={t.title}
            whatsappNumber={whatsappNumber}
            className="btn btn-primary !px-3 !py-2.5 text-xs"
          />
          <Link href={`/templates/${t.slug}`} className="btn btn-ghost !px-3 !py-2.5 text-xs">
            VIEW DETAILS
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
