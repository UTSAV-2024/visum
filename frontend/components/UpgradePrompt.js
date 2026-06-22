export default function UpgradePrompt({ cta }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-6 text-center">
      <p className="text-base sm:text-lg text-foreground font-semibold mb-2 leading-snug">
        {cta}
      </p>
      <p className="text-xs sm:text-sm text-muted-foreground mb-4">
        Visum Pro &middot; $149/month &middot; Hosted MCP server + weekly AI monitoring
      </p>
      <a
        href="mailto:utsav@visum.io?subject=Visum Pro Interest"
        className="inline-block bg-primary text-primary-foreground font-semibold text-sm px-7 py-2.5 rounded-lg hover:bg-primary/90 transition-colors no-underline"
      >
        Get Early Access
      </a>
    </div>
  );
}
