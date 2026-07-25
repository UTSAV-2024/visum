"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/router";
import { Sidebar } from "./sidebar/sidebar";
import { useSidebar } from "./sidebar/sidebar-context";
import { PreviewBanner } from "./preview-banner";

interface AppLayoutProps {
  children: ReactNode;
}

/*
  Pages that still render demonstration data rather than the user's own —
  each needs a data source Visum doesn't produce yet (crawler-traffic logs, a
  teams model, a hosted MCP service, AI-query monitoring…). They stay
  reachable, but never pretend to be live — candor over drama. As each is
  wired to real data (dashboard, recommendations, reports, competitors already
  were), it comes off this list.
*/
const PREVIEW_ROUTES = new Set([
  "/analytics",
  "/insights",
  "/crawl-explorer",
  "/hosted-mcp",
  "/org-command-center",
  "/optimization-workspace",
  "/prompt-intelligence",
]);

function AppLayoutContent({ children }: AppLayoutProps) {
  const { expanded, isMobile } = useSidebar();
  const router = useRouter();
  const isPreview = PREVIEW_ROUTES.has(router.pathname);

  const sidebarWidth = expanded ? 280 : 72;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <main
        className="transition-[margin-left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
        }}
      >
        {isPreview && <PreviewBanner />}
        {children}
      </main>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return <AppLayoutContent>{children}</AppLayoutContent>;
}
