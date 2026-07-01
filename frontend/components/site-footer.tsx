import { useState } from "react";
import { Logo } from "./logo";
import { Container } from "./container";

export function SiteFooter() {
  const [year] = useState(() => new Date().getFullYear());

  return (
    <footer className="border-t border-border bg-secondary/20 py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo className="h-7 w-7 text-accent" />
              <span className="text-lg font-semibold text-foreground">Visum</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI agent readiness, measured. Understand whether AI systems can discover and use your website.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-wider text-foreground">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it works</a></li>
              <li><a href="#checks" className="text-muted-foreground hover:text-foreground transition-colors">8 Readiness Checks</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-wider text-foreground">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="/about#roadmap" className="text-muted-foreground hover:text-foreground transition-colors">Roadmap</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-wider text-foreground">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
              <li><a href="/privacy#cookies" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {year} Visum. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="https://twitter.com/visumhq" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors" aria-label="Visum on Twitter">Twitter</a>
            <span className="text-sm text-muted-foreground cursor-default opacity-60" title="Coming soon">GitHub</span>
            <span className="text-sm text-muted-foreground cursor-default opacity-60" title="Coming soon">LinkedIn</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
