import Link from "next/link";
import Emblem from "./Emblem";
import { getContactSettings } from "@/lib/settings";

export default async function Footer() {
  const c = await getContactSettings();
  return (
    <footer className="mt-24 border-t border-line">
      <div className="wrap grid gap-8 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <Emblem className="h-9 w-9" />
            <span className="font-black tracking-[2px]">ORBIT DEVELOPMENT</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/50">
            Building digital worlds — premium websites, apps and custom software.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold tracking-wide text-white/80">Explore</h4>
          <ul className="space-y-2 text-sm text-white/55">
            <li><Link href="/website-development" className="hover:text-white">Website Development</Link></li>
            <li><Link href="/app-development" className="hover:text-white">App Development</Link></li>
            <li><Link href="/#features" className="hover:text-white">Why Choose Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold tracking-wide text-white/80">Get in touch</h4>
          <ul className="space-y-2 text-sm text-white/55">
            {c.email && <li>{c.email}</li>}
            {c.whatsappSupportLink && (
              <li><a href={c.whatsappSupportLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp Support</a></li>
            )}
            {c.telegramLink && (
              <li><a href={c.telegramLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">Telegram</a></li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-6 text-center text-xs text-white/35">
        © {new Date().getFullYear()} Orbit Development. Building Digital Worlds.
      </div>
    </footer>
  );
}
