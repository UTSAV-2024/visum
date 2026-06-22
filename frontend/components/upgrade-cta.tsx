import { Container } from "./container";

export function UpgradeCta() {
  return (
    <section id="pricing" className="py-24">
      <Container>
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Visum Pro
              </span>
              <h2 className="text-xl font-semibold text-balance text-foreground sm:text-2xl">
                Fix every issue and become Agent-Ready
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Get step-by-step remediation, continuous monitoring, and re-scans so AI agents
                can find, read, and recommend your site.
              </p>
              <p className="text-xs text-muted-foreground/60">
                $149/month &middot; Hosted MCP server + weekly AI monitoring
              </p>
            </div>

            <a
              href="mailto:utsav@visum.io?subject=Visum Pro Interest"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Early Access
              <svg className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
