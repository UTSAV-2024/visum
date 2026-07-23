"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/router";
import { Sidebar } from "./sidebar/sidebar";
import { useSidebar } from "./sidebar/sidebar-context";

interface AppLayoutProps {
  children: ReactNode;
}

/*
  Pages that currently render demonstration data rather than the user's own.
  They stay reachable, but never pretend to be live — candor over drama.
*/
const PREVIEW_ROUTES = new Set([
  "/analytics",
  "/insights",
  "/team",
]);

function PreviewBanner() {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2.5 border-b border-copper/30 bg-copper/10 px-4 py-2 text-center"
    >
      <span className="font-mono text-[11px] text-copper">preview</span>
      <p className="m-0 text-[13px] text-foreground/90">
        This page shows sample data. It goes live once accounts launch.
      </p>
    </div>
  );
}

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
