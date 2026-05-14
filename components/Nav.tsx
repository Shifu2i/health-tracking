"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Today" },
  { href: "/medications", label: "Medications" },
  { href: "/metrics", label: "Metrics" },
  { href: "/trends", label: "Trends" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/settings", label: "Settings" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="border-b border-rule bg-bg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="font-serif text-xl tracking-tight text-ink">
          Health<span className="text-muted">.</span>
        </Link>
        <nav className="hidden gap-6 sm:flex">
          {ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs uppercase tracking-eyebrow transition-colors ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="sm:hidden">
        <div className="mx-auto flex max-w-5xl gap-4 overflow-x-auto border-t border-rule px-6 py-3">
          {ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap text-xs uppercase tracking-eyebrow ${
                  active ? "text-ink" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
