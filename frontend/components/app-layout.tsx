"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./sidebar/sidebar";
import { useSidebar } from "./sidebar/sidebar-context";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { expanded, isMobile } = useSidebar();

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
        {children}
      </main>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return <AppLayoutContent>{children}</AppLayoutContent>;
}
