import Link from "next/link";
import { Logo } from "./logo";
import { Container } from "./container";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Checks", href: "#checks" },
  { label: "Pricing", href: "#pricing" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo — left */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Visum home">
            <Logo className="h-7 w-7 text-accent" />
            <span className="text-lg font-semibold tracking-tight text-foreground">Visum</span>
          </Link>

          {/* Nav — center/left with flex spacing */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-8 mx-auto">
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
          <div className="flex items-center shrink-0">
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
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer border-0"
            >
              Scan My Website
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}
