"use client";
import Link from "next/link";
import { useState } from "react";
import Emblem from "./Emblem";

const links = [
  { href: "/", label: "Home" },
  { href: "/website-development", label: "Website Dev" },
  { href: "/app-development", label: "App Dev" },
  { href: "/#clients", label: "Clients" },
  { href: "/#features", label: "Why Us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-black/50 backdrop-blur-md">
      <nav className="wrap flex h-[68px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Emblem className="h-9 w-9" />
          <span className="font-black leading-none tracking-[2px]">
            ORBIT
            <span className="block text-[9px] font-semibold tracking-[5px] text-white/45">
              DEVELOPMENT
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 text-sm text-white/60 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-white">
              {l.label}
            </Link>
          ))}
        </div>

        <Link href="/contact" className="btn btn-primary hidden !px-5 !py-2.5 text-xs md:inline-flex">
          Start a Project
        </Link>

        <button
          className="text-2xl md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-ink2 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm text-white/70">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="btn btn-primary mt-2">
              Start a Project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
