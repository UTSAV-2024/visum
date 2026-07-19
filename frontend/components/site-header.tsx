import Link from "next/link";
import { Logo } from "./logo";
import { Container } from "./container";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "The 8 checks", href: "#checks" },
  { label: "Pricing", href: "#pricing" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo — left */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Visum home">
            <Logo className="h-6 w-6 text-primary" />
            <span className="text-[17px] font-bold tracking-tight text-foreground">Visum</span>
          </Link>

          {/* Nav — center */}
          <nav aria-label="Primary" className="mx-auto hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA — right */}
          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => {
                const target = document.getElementById("scan-url") || document.getElementById("scan");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth", block: "center" });
                  requestAnimationFrame(() => {
                    const input = document.getElementById("scan-url");
                    if (input) {
                      requestAnimationFrame(() => {
                        input.focus({ preventScroll: true });
                      });
                    }
                  });
                }
              }}
              className="cursor-pointer rounded-lg border-0 bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-200"
            >
              Run a scan
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}
