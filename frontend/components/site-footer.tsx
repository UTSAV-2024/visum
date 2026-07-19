import { useState } from "react";
import { Logo } from "./logo";
import { Container } from "./container";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "The 8 checks", href: "#checks" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Roadmap", href: "/about#roadmap" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookie Policy", href: "/privacy#cookies" },
    ],
  },
];

export function SiteFooter() {
  const [year] = useState(() => new Date().getFullYear());

  return (
    <footer className="border-t border-border py-16">
      <Container>
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <Logo className="h-6 w-6 text-primary" />
              <span className="text-[17px] font-bold text-foreground">Visum</span>
            </div>
            <p className="max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
              The machine&apos;s-eye view of your website. See what AI systems can — and
              can&apos;t — read.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-4 font-mono text-[12px] text-primary">{col.heading}</h4>
              <ul className="m-0 list-none space-y-3 p-0 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="m-0 text-sm text-muted-foreground">
            &copy; {year} Visum. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="https://twitter.com/visumhq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Visum on Twitter"
            >
              Twitter
            </a>
            <span className="cursor-default text-sm text-muted-foreground opacity-60" title="Coming soon">
              GitHub
            </span>
            <span className="cursor-default text-sm text-muted-foreground opacity-60" title="Coming soon">
              LinkedIn
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
