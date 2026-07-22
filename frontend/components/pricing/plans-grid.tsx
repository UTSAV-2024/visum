"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { PLANS, PLAN_ORDER } from "../../lib/plans";
import { STRIPE_PAYMENT_LINK, hasPaymentLink } from "../../lib/config";
import { useAuth } from "../../lib/auth-context";
import { useAccount } from "../../lib/account-context";
import { track } from "../../lib/analytics";
import { cn } from "../../lib/utils";

function Check() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * The three plans, priced from the shared catalogue so the page can never
 * advertise a limit the server won't provision.
 */
export function PlansGrid() {
  const router = useRouter();
  const { user, authEnabled } = useAuth();
  const { account, applyAccount } = useAccount();
  const [pending, setPending] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const currentTier = account?.subscription?.tier ?? null;
  const signedIn = !authEnabled || !!user;

  async function handleChoose(tier: string) {
    setNotice("");
    track("clicked_upgrade", { action: "choose_plan", tier, source: "pricing_page" });

    // No account yet — sign up first, then come back here to finish.
    if (!signedIn) {
      router.push(`/signup?next=${encodeURIComponent("/pricing")}`);
      return;
    }

    // A configured payment link is the real checkout; take it when it exists.
    if (hasPaymentLink) {
      window.location.assign(STRIPE_PAYMENT_LINK);
      return;
    }

    setPending(tier);
    try {
      const res = await fetch("/api/subscription/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ tier }),
      });
      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        setNotice(payload.error || "Could not start your upgrade. Please try again.");
        return;
      }

      applyAccount(payload.account);
      setNotice(`You're on ${PLANS[tier].name}. Your new scan allowance is available now.`);
    } catch {
      setNotice("Could not reach the server. Please try again.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {PLAN_ORDER.map((id) => {
          const plan = PLANS[id];
          const isCurrent = currentTier === id;
          const recommended = !!plan.recommended;

          return (
            <div
              key={id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6 sm:p-7",
                recommended
                  ? "border-primary/60 shadow-[0_0_0_1px_var(--color-primary)]/10 lg:-mt-4 lg:pb-10"
                  : "border-border"
              )}
            >
              {recommended && (
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                  Recommended
                </span>
              )}

              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>

              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">
                  {plan.priceLabel}
                </span>
                <span className="text-sm text-muted-foreground">{plan.cadence}</span>
              </div>

              {/* The two numbers that decide the plan, stated plainly. */}
              <dl className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-border bg-background/50 p-4">
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    Scans
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">
                    {plan.scanLimitLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    Storage
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">
                    {plan.storageLabel}
                  </dd>
                </div>
              </dl>

              <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                {plan.features.map((feature: string) => (
                  <li key={feature} className="flex gap-2.5 text-sm text-muted-foreground">
                    <Check />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                {isCurrent ? (
                  <span className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-muted/20 px-6 text-sm font-semibold text-muted-foreground">
                    Your current plan
                  </span>
                ) : id === "free" ? (
                  <Link
                    href={signedIn ? "/dashboard" : "/signup"}
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-transparent px-6 text-sm font-semibold text-foreground no-underline transition-colors hover:bg-muted/20"
                  >
                    {signedIn ? "Go to dashboard" : "Start free"}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleChoose(id)}
                    disabled={pending === id}
                    className={cn(
                      "inline-flex h-11 w-full items-center justify-center rounded-xl px-6 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                      recommended
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border border-primary/40 text-primary hover:bg-primary/10"
                    )}
                  >
                    {pending === id ? "Working…" : `Choose ${plan.name}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {notice && (
        <p
          className="mt-6 rounded-xl border border-border bg-card px-4 py-3 text-center text-sm text-foreground"
          role="status"
        >
          {notice}{" "}
          {notice.includes("touch") && (
            <Link href="/contact" className="font-semibold text-primary hover:underline">
              Contact us
            </Link>
          )}
        </p>
      )}
    </div>
  );
}
