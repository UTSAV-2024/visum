import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6 text-brand" />
          <span className="text-base font-semibold text-navy">Visum</span>
        </div>
        <p className="text-sm text-slate-400">
          &copy; {new Date().getFullYear()} Visum. AI agent readiness, measured.
        </p>
        <nav aria-label="Footer" className="flex items-center gap-6">
          <a href="#" className="text-sm text-slate-400 transition-colors hover:text-slate-900">
            Privacy
          </a>
          <a href="#" className="text-sm text-slate-400 transition-colors hover:text-slate-900">
            Terms
          </a>
          <a href="#" className="text-sm text-slate-400 transition-colors hover:text-slate-900">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
