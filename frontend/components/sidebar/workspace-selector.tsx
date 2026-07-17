"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Plus, Check, Building2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { useSidebar } from "./sidebar-context";
import type { Workspace } from "./types";

const MOCK_WORKSPACES: Workspace[] = [
  { id: "w1", name: "Acme Inc.", plan: "Pro" },
  { id: "w2", name: "Personal Project", plan: "Free" },
  { id: "w3", name: "Client Workspace", plan: "Enterprise" },
];

interface WorkspaceSelectorProps {
  currentWorkspace?: Workspace;
}

export function WorkspaceSelector({ currentWorkspace }: WorkspaceSelectorProps) {
  const { expanded } = useSidebar();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(currentWorkspace || MOCK_WORKSPACES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = MOCK_WORKSPACES.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      // Focus search input
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => expanded && setOpen(!open)}
        className={cn(
          "flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all duration-150",
          "text-muted-foreground hover:text-foreground hover:bg-muted/20",
          "outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          !expanded && "justify-center"
        )}
        aria-label="Switch workspace"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex items-center justify-center w-5 h-5 shrink-0">
          <Building2 className="w-[18px] h-[18px]" />
        </div>
        <motion.div
          className="flex items-center gap-2 min-w-0 flex-1"
          animate={{ opacity: expanded ? 1 : 0, width: expanded ? "auto" : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-medium truncate text-foreground">
              {selected.name}
            </p>
            <p className="text-[10px] text-muted-foreground/60 truncate">
              {selected.plan}
            </p>
          </div>
          <ChevronDown className="w-3 h-3 shrink-0 text-muted-foreground/40" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && expanded && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-2 right-2 top-full mt-1 z-50 rounded-xl border border-border bg-popover shadow-xl backdrop-blur-xl overflow-hidden"
            role="listbox"
          >
            {/* Search */}
            <div className="relative border-b border-border">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search workspaces..."
                className="w-full bg-transparent pl-9 pr-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none"
              />
            </div>

            {/* Workspace list */}
            <div className="max-h-48 overflow-y-auto py-1">
              {filtered.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setSelected(ws);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 text-left transition-colors",
                    "hover:bg-muted/20 text-sm",
                    ws.id === selected.id ? "text-accent" : "text-muted-foreground"
                  )}
                  role="option"
                  aria-selected={ws.id === selected.id}
                >
                  <div className="flex items-center justify-center w-5 h-5 shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{ws.name}</p>
                    <p className="text-[10px] text-muted-foreground/60">{ws.plan}</p>
                  </div>
                  {ws.id === selected.id && (
                    <Check className="w-3.5 h-3.5 shrink-0 text-accent" />
                  )}
                </button>
              ))}

              {filtered.length === 0 && (
                <p className="px-3 py-4 text-xs text-muted-foreground/40 text-center">
                  No workspaces found
                </p>
              )}
            </div>

            {/* Create workspace */}
            <button
              onClick={() => {
                setOpen(false);
                setSearch("");
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 border-t border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Create Workspace</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
