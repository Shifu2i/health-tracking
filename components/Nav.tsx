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
    <nav className="border-b border-border bg-panel">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-4 py-3">
        <Link href="/" className="mr-4 font-semibold text-text">
          Health Tracking
        </Link>
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded px-3 py-1 text-sm ${
                active ? "bg-accent text-bg" : "text-muted hover:text-text"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
