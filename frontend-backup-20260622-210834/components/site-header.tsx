import Link from "next/link";
import { Logo } from "./logo";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Checks", href: "#checks" },
  { label: "Pricing", href: "#pricing" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-slate-50/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Visum home">
          <Logo className="h-7 w-7 text-brand" />
          <span className="text-lg font-semibold tracking-tight text-navy">Visum</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#scan"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            Run a scan
          </a>
        </div>
      </div>
    </header>
  );
}
