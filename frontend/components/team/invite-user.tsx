import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { INVITE_LINK } from "./data";

export function InviteUser({ onClose, className }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(INVITE_LINK).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (sent) {
    return (
      <div className={cn("relative rounded-2xl border border-border bg-card p-6 text-center transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 mb-3">
          <svg className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-foreground">Invitation Sent!</h3>
        <p className="text-xs text-muted-foreground mt-1">An invitation has been sent to {email}</p>
        <button onClick={onClose} className="mt-4 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">Done</button>
      </div>
    );
  }

  return (
    <div className={cn("relative rounded-2xl border border-border bg-card p-5 transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z" />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Invite Team Member</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted/20 transition-colors">
          <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider mb-1 block">Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="colleague@company.com"
            className="w-full h-9 rounded-lg border border-border bg-muted/10 px-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider mb-1 block">Role</label>
          <div className="flex gap-1.5">
            {["Viewer", "Member", "Admin"].map((r) => (
              <button key={r} onClick={() => setRole(r)}
                className={cn("flex-1 rounded-lg px-3 py-1.5 text-[10px] font-semibold transition-all",
                  role === r ? "bg-accent/10 text-accent border border-accent/20" : "bg-muted/10 text-muted-foreground border border-border hover:text-foreground"
                )}>{r}</button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={() => setSent(true)} disabled={!email.trim()}
            className="flex-1 rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            Send Invitation
          </button>
          <button onClick={handleCopyLink}
            className="rounded-lg border border-border px-3 py-2 text-[11px] font-semibold text-foreground hover:bg-muted/20 transition-all">
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
}
