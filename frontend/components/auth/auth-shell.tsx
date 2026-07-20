import Link from "next/link";
import { Logo } from "../logo";

/** Centered card layout shared by the login and signup pages. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Ambient accent glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-foreground no-underline"
            aria-label="Visum home"
          >
            <Logo className="h-7 w-7 text-accent" />
            <span className="text-lg font-bold tracking-tight">Visum</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {children}
        </div>

        {footer && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </p>
        )}
      </div>
    </div>
  );
}
