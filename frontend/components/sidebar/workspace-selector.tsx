"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { useSidebar } from "./sidebar-context";
import { useAccount } from "../../lib/account-context";
import { getPlan } from "../../lib/plans";

/**
 * The account label.
 *
 * There is one workspace per account, so this is a real, static label — not a
 * switcher. A multi-workspace picker (with search and "create workspace") would
 * imply a teams feature that doesn't exist; showing the user's actual plan is
 * the honest version.
 */
export function WorkspaceSelector() {
  const { expanded } = useSidebar();
  const { account } = useAccount();

  const tier = account?.subscription?.tier ?? "free";
  const planName = account?.subscription?.planName ?? getPlan(tier).name;
  const email = account?.profile?.email ?? "";
  // The part after @ reads as an org name for most business accounts.
  const workspaceName = email ? email.split("@")[1] || "Your workspace" : "Your workspace";

  return (
    <div
      className={cn(
        "flex items-center gap-2 w-full px-3 py-2 rounded-lg",
        !expanded && "justify-center"
      )}
    >
      <div className="flex items-center justify-center w-5 h-5 shrink-0 text-muted-foreground">
        <Building2 className="w-[18px] h-[18px]" />
      </div>
      <motion.div
        className="flex items-center gap-2 min-w-0 flex-1"
        animate={{ opacity: expanded ? 1 : 0, width: expanded ? "auto" : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm font-medium truncate text-foreground">{workspaceName}</p>
          <p className="text-[10px] text-muted-foreground/60 truncate">{planName} plan</p>
        </div>
      </motion.div>
    </div>
  );
}
