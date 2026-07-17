"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface SidebarContextValue {
  expanded: boolean;
  setExpanded: (val: boolean) => void;
  toggle: () => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
  toggleMobile: () => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  expandedGroups: Set<string>;
  toggleGroup: (id: string) => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl/Cmd + B => toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setExpanded((prev) => !prev);
      }
      // Ctrl/Cmd + K => focus search (placeholder)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Dispatch custom event for future command palette
        document.dispatchEvent(new CustomEvent("command-palette-open"));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggle = useCallback(() => setExpanded((prev) => !prev), []);
  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);

  const toggleGroup = useCallback((id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Close mobile sidebar on route change via Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mobileOpen]);

  return (
    <SidebarContext.Provider
      value={{
        expanded,
        setExpanded,
        toggle,
        mobileOpen,
        setMobileOpen,
        toggleMobile,
        activeId,
        setActiveId,
        expandedGroups,
        toggleGroup,
        isMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
