"use client";

import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { useSidebar } from "./sidebar-context";
import { NavItem } from "./nav-item";
import type { NavGroup as NavGroupType } from "./types";

interface NavGroupProps {
  group: NavGroupType;
  onNavigate?: () => void;
}

export function NavGroup({ group, onNavigate }: NavGroupProps) {
  const router = useRouter();
  const { expanded, expandedGroups, toggleGroup, activeId } = useSidebar();
  const isOpen = expandedGroups.has(group.id);

  // Check if any child is active using Next.js router
  const hasActiveChild = group.items.some(
    (item) => item.href !== "#" && router.pathname === item.href
  );

  const Icon = group.icon;

  return (
    <div className="space-y-0.5">
      {/* Group header */}
      <button
        onClick={() => {
          if (expanded) toggleGroup(group.id);
        }}
        className={cn(
          "relative group flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-150",
          "outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          hasActiveChild
            ? "text-accent"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
        )}
        aria-expanded={isOpen}
        aria-label={group.label}
      >
        {/* Active indicator */}
        {hasActiveChild && (
          <motion.span
            layoutId="nav-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-full"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}

        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center w-5 h-5 shrink-0">
          <Icon className="w-[18px] h-[18px]" />
        </div>

        {/* Label */}
        <motion.span
          className="text-sm font-medium truncate flex-1 text-left"
          animate={{
            opacity: expanded ? 1 : 0,
            width: expanded ? "auto" : 0,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {group.label}
        </motion.span>

        {/* Chevron */}
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
            opacity: expanded ? 1 : 0,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="shrink-0"
        >
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Nested items */}
      <AnimatePresence initial={false}>
        {expanded && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="py-0.5 space-y-0.5">
              {group.items.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isChild
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
