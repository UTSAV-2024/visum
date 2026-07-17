"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  KeyRound,
  Globe,
  Users,
  RefreshCw,
  Plus,
  Copy,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { AUTH_CONFIG } from "./data";

export function AuthenticationPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Authentication</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
          <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground/50 mb-0.5">
            <Shield className="h-2.5 w-2.5" /> OAuth
          </div>
          <p className={cn("text-sm font-bold font-mono", AUTH_CONFIG.oauthEnabled ? "text-green-500" : "text-red-500")}>
            {AUTH_CONFIG.oauthEnabled ? "On" : "Off"}
          </p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
          <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground/50 mb-0.5">
            <KeyRound className="h-2.5 w-2.5" /> Bearer Tokens
          </div>
          <p className="text-sm font-bold text-foreground font-mono">{AUTH_CONFIG.bearerTokens}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
          <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground/50 mb-0.5">
            <Lock className="h-2.5 w-2.5" /> API Keys
          </div>
          <p className="text-sm font-bold text-foreground font-mono">{AUTH_CONFIG.apiKeys}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
          <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground/50 mb-0.5">
            <Users className="h-2.5 w-2.5" /> Sessions
          </div>
          <p className="text-sm font-bold text-foreground font-mono">{AUTH_CONFIG.activeSessions}</p>
        </div>
      </div>

      {/* Allowed Domains */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Globe className="h-3 w-3 text-muted-foreground/50" />
          <span className="text-[9px] font-medium text-muted-foreground/60">Allowed Domains</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {AUTH_CONFIG.allowedDomains.map((d) => (
            <span key={d} className="rounded-md bg-accent/10 border border-accent/20 px-2 py-0.5 text-[9px] font-mono font-medium text-accent">
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Permissions */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <CheckCircle2 className="h-3 w-3 text-muted-foreground/50" />
          <span className="text-[9px] font-medium text-muted-foreground/60">Permissions ({AUTH_CONFIG.permissions.length})</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {AUTH_CONFIG.permissions.map((p) => (
            <span key={p} className="rounded-md bg-muted/10 border border-border/60 px-1.5 py-0.5 text-[8px] font-mono text-muted-foreground/60">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Rotation */}
      <div className="rounded-lg border border-orange-500/10 bg-orange-500/[0.02] p-2.5 mb-3">
        <div className="flex items-center gap-1.5">
          <RefreshCw className="h-3 w-3 text-orange-500" />
          <span className="text-[9px] text-orange-500/80">{AUTH_CONFIG.rotationHistory}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex items-center gap-1 rounded-lg bg-accent/10 px-3 py-2 text-[10px] font-semibold text-accent hover:bg-accent/20 transition-colors">
          <Plus className="h-3 w-3" />
          Generate Key
        </button>
        <button className="flex items-center gap-1 rounded-lg border border-border bg-muted/5 px-3 py-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="h-3 w-3" />
          Rotate
        </button>
        <button className="flex items-center gap-1 rounded-lg border border-border bg-muted/5 px-3 py-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
          <Copy className="h-3 w-3" />
          Copy Config
        </button>
      </div>
    </div>
  );
}
