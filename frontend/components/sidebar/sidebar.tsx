"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PanelLeftClose, PanelLeft, Command } from "lucide-react";
import { cn } from "../../lib/utils";
import { Logo } from "../logo";
import { useSidebar } from "./sidebar-context";
import { NavItem } from "./nav-item";
import { NavGroup } from "./nav-group";
import { WorkspaceSelector } from "./workspace-selector";
import { UserSection } from "./user-section";
import { UsageMeter } from "./usage-meter";
import { PRIMARY_NAV, SECONDARY_NAV, ROUTE_MAP } from "./navigation";
import type { NavItem as NavItemType, NavGroup as NavGroupType } from "./types";

// ── Type guards ──────────────────────────────────────────────────

function isNavGroup(item: NavItemType | NavGroupType): item is NavGroupType {
  return "items" in item && Array.isArray((item as NavGroupType).items);
}

export function Sidebar() {
  const router = useRouter();
  const {
    expanded,
    toggle,
    mobileOpen,
    toggleMobile,
    setMobileOpen,
    setActiveId,
    isMobile,
  } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Set active nav item based on route
  useEffect(() => {
    const active = ROUTE_MAP[router.pathname] || null;
    setActiveId(active);
  }, [router.pathname, setActiveId]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [router.pathname, setMobileOpen]);



  const handleNavigate = () => {
    if (isMobile) setMobileOpen(false);
  };

  const SIDEBAR_WIDTH_EXPANDED = 280;
  const SIDEBAR_WIDTH_COLLAPSED = 72;

  const sidebarContent = (
    <div
      ref={sidebarRef}
      className={cn(
        "flex flex-col h-full bg-background border-r border-border",
        "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        expanded ? "w-[280px]" : "w-[72px]"
      )}
    >
      {/* ── Logo + Collapse ──────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center h-14 border-b border-border shrink-0",
          expanded ? "justify-between px-4" : "justify-center px-3"
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline"
          aria-label="Visum home"
        >
          <Logo className="w-7 h-7 text-accent shrink-0" />
          <motion.div
            animate={{
              opacity: expanded ? 1 : 0,
              width: expanded ? "auto" : 0,
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <span className="text-base font-bold tracking-tight text-foreground whitespace-nowrap">
              Visum
            </span>
            <span className="block text-[9px] font-medium uppercase tracking-widest text-accent/70 whitespace-nowrap -mt-0.5">
              AI Infrastructure
            </span>
          </motion.div>
        </Link>

        <motion.button
          animate={{ opacity: expanded ? 1 : 0, scale: expanded ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          onClick={toggle}
          className="flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground/40 hover:text-foreground hover:bg-muted/20 transition-colors"
          aria-label="Collapse sidebar"
          title="Collapse sidebar (Ctrl+B)"
        >
          <PanelLeftClose className="w-4 h-4" />
        </motion.button>
      </div>

      {/* ── Workspace Selector ───────────────────────────────────── */}
      <div className="px-2 pt-3 pb-2 shrink-0">
        <WorkspaceSelector />
      </div>

      {/* ── Scrollable Nav Area ──────────────────────────────────── */}
      <nav
        className="flex-1 overflow-y-auto scrollbar-none px-2 py-1 space-y-3"
        aria-label="Primary navigation"
      >
        {/* Primary Navigation */}
        <div className="space-y-0.5">
          <motion.p
            className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 px-3 pb-1"
            animate={{
              opacity: expanded ? 1 : 0,
              height: expanded ? "auto" : 0,
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            Platform
          </motion.p>
          {PRIMARY_NAV.map((item) => {
            if (isNavGroup(item)) {
              return (
                <NavGroup
                  key={item.id}
                  group={item}
                  onNavigate={handleNavigate}
                />
              );
            }
            return (
              <NavItem
                key={item.id}
                item={item}
                onNavigate={handleNavigate}
              />
            );
          })}
        </div>

        {/* Divider */}
        <div className="mx-3 h-px bg-border/50" />

        {/* Secondary Navigation */}
        <div className="space-y-0.5">
          <motion.p
            className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 px-3 pb-1"
            animate={{
              opacity: expanded ? 1 : 0,
              height: expanded ? "auto" : 0,
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            Workspace
          </motion.p>
          {SECONDARY_NAV.map((group) => (
            <NavGroup
              key={group.id}
              group={group}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      </nav>

      {/* ── Bottom Section ───────────────────────────────────────── */}
      <div className="shrink-0 border-t border-border">
        {/* Collapse button (when collapsed) */}
        {!expanded && (
          <div className="flex justify-center py-2">
            <button
              onClick={toggle}
              className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground/40 hover:text-foreground hover:bg-muted/20 transition-colors"
              aria-label="Expand sidebar"
              title="Expand sidebar (Ctrl+B)"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Usage + Plan */}
        <UsageMeter />

        {/* User */}
        <div className="px-2 pb-3">
          <UserSection />
        </div>
      </div>
    </div>
  );

  // ── Mobile: Drawer with overlay ──────────────────────────────
  if (isMobile) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: -SIDEBAR_WIDTH_EXPANDED }}
              animate={{ x: 0 }}
              exit={{ x: -SIDEBAR_WIDTH_EXPANDED }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[280px]"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  // ── Desktop: Persistent sidebar ─────────────────────────────
  return (
    <aside className="fixed left-0 top-0 bottom-0 z-30">
      {sidebarContent}
    </aside>
  );
}
