import type { Metadata } from "next";
import { getContactSettings } from "@/lib/settings";
import { waLink } from "@/lib/whatsapp";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Orbit Development via WhatsApp, Telegram or email.",
};

export default async function ContactPage() {
  const c = await getContactSettings();
  const supportHref =
    c.whatsappSupportLink || waLink(c.whatsappNumber, c.supportMessage || "Hi Orbit Development!");

  const channels = [
    c.whatsappNumber && {
      icon: "whatsapp",
      title: "WhatsApp Support",
      sub: c.whatsappNumber,
      href: supportHref,
      cta: "Chat on WhatsApp",
    },
    c.whatsappChannelLink && {
      icon: "megaphone",
      title: "WhatsApp Channel",
      sub: "Follow for updates",
      href: c.whatsappChannelLink,
      cta: "Open Channel",
    },
    c.telegramLink && {
      icon: "telegram",
      title: "Telegram",
      sub: c.telegramUsername ? `@${c.telegramUsername}` : "Message us",
      href: c.telegramLink,
      cta: "Open Telegram",
    },
    c.email && {
      icon: "mail",
      title: "Email",
      sub: c.email,
      href: `mailto:${c.email}`,
      cta: "Send Email",
    },
  ].filter(Boolean) as { icon: string; title: string; sub: string; href: string; cta: string }[];

  return (
    <div className="wrap py-16">
      <Reveal>
        <span className="chip text-neonpurple">GET IN TOUCH</span>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">
          Let&apos;s build <span className="grad-text">something great</span>.
        </h1>
        <p className="mt-3 max-w-xl text-white/55">
          {c.supportMessage
            ? c.supportMessage
            : "Reach out on WhatsApp or Telegram — we usually reply within a few hours."}
        </p>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {channels.length === 0 && (
          <p className="text-white/40">Contact details will appear here once configured in the admin panel.</p>
        )}
        {channels.map((ch, i) => (
          <Reveal key={ch.title} delay={i * 0.05}>
            <a
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass group flex items-center gap-4 rounded-2xl p-6 transition hover:-translate-y-1 hover:border-neonpurple"
            >
              <div className="grid h-14 w-14 place-items-center rounded-xl border border-line bg-neonpurple/10 text-neonpurple">
                <Icon name={ch.icon} className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="font-bold">{ch.title}</div>
                <div className="text-sm text-white/50">{ch.sub}</div>
              </div>
              <span className="text-sm font-bold grad-text opacity-0 transition group-hover:opacity-100">
                {ch.cta} →
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
