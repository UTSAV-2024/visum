export default function UpgradePrompt({ cta }) {
  return (
    <div className="bg-navy rounded-xl p-6 sm:p-8 mb-6 text-center">
      <p className="text-base sm:text-lg text-white font-semibold mb-2 leading-snug">
        {cta}
      </p>
      <p className="text-xs sm:text-sm text-slate-400 mb-4">
        Visum Pro · $149/month · Hosted MCP server + weekly AI monitoring
      </p>
      <a
        href="mailto:utsav@visum.io?subject=Visum Pro Interest"
        className="inline-block bg-brand text-white font-semibold text-sm px-7 py-2.5 rounded-lg hover:bg-brand-600 transition-colors no-underline"
      >
        Get Early Access
      </a>
    </div>
  );
}
