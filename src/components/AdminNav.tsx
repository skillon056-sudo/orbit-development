"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Emblem from "./Emblem";
import Icon from "./Icon";
import { logoutAction } from "@/app/admin/actions";

const items = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/templates", label: "Templates", icon: "stack" },
  { href: "/admin/clients", label: "Clients", icon: "users" },
  { href: "/admin/contact", label: "Contact Settings", icon: "phone" },
  { href: "/admin/homepage", label: "Homepage", icon: "home" },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-line bg-ink2 md:h-screen md:w-64 md:border-b-0 md:border-r">
      <Link href="/admin" className="flex items-center gap-2.5 px-5 py-5">
        <Emblem className="h-8 w-8" />
        <span className="font-black tracking-[2px]">
          ORBIT<span className="block text-[9px] tracking-[4px] text-white/45">ADMIN</span>
        </span>
      </Link>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:pb-0">
        {items.map((it) => {
          const active = it.href === "/admin" ? path === "/admin" : path.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm transition ${
                active ? "bg-neonpurple/15 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon name={it.icon} className="h-4 w-4 text-white/50" /> {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden gap-2 p-4 md:flex md:flex-col">
        <Link href="/" target="_blank" className="btn btn-ghost !py-2 text-xs">View site ↗</Link>
        <form action={logoutAction}>
          <button className="btn btn-ghost w-full !py-2 text-xs">Log out</button>
        </form>
      </div>
    </aside>
  );
}
