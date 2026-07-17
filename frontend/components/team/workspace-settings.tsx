import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { WORKSPACE } from "./data";

export function WorkspaceSettings({ className }) {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState(WORKSPACE.name);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields = [
    { label: "Workspace Name", value: name, onChange: setName, placeholder: "Your Team" },
    { label: "URL Slug", value: WORKSPACE.slug, readonly: true },
    { label: "Domain", value: WORKSPACE.domain, placeholder: "example.com" },
    { label: "Timezone", value: WORKSPACE.timezone, readonly: true },
    { label: "Default Member Role", value: WORKSPACE.defaultRole, readonly: true },
  ];

  return (
    <div className={cn("relative rounded-2xl border border-border bg-card transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />
      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Workspace Settings</p>
          </div>
          <button
            onClick={handleSave}
            className={cn(
              "rounded-lg px-3 py-1.5 text-[10px] font-semibold transition-all",
              saved ? "bg-green-500/10 text-green-500" : "bg-accent/10 text-accent hover:bg-accent/20"
            )}
          >
            {saved ? "Saved!" : "Save"}
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((f) => (
            <div key={f.label}>
              <label className="text-[9px] font-medium text-muted-foreground/70 uppercase tracking-wider mb-1 block">{f.label}</label>
              <input
                type="text"
                value={f.value}
                onChange={(e) => f.onChange?.(e.target.value)}
                readOnly={f.readonly}
                placeholder={f.placeholder}
                className="w-full h-8 rounded-lg border border-border bg-muted/10 px-3 text-[11px] text-foreground placeholder:text-muted-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent read-only:opacity-60 read-only:cursor-default"
              />
            </div>
          ))}
        </div>

        {/* SSO toggle */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-foreground">Single Sign-On (SSO)</p>
              <p className="text-[9px] text-muted-foreground/60">Enable SAML/SSO for your workspace</p>
            </div>
            <div className={cn("h-5 w-9 rounded-full transition-all duration-200 relative cursor-pointer", WORKSPACE.ssoEnabled ? "bg-accent" : "bg-muted/30")}>
              <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200", WORKSPACE.ssoEnabled ? "translate-x-[18px]" : "translate-x-0.5")} />
            </div>
          </div>
        </div>

        <p className="text-[8px] text-muted-foreground/40 mt-3">Workspace created {WORKSPACE.createdAt}</p>
      </div>
    </div>
  );
}
