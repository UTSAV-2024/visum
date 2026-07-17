"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { useSidebar } from "./sidebar-context";
import type { NavItem as NavItemType } from "./types";

interface NavItemProps {
  item: NavItemType;
  isChild?: boolean;
  onNavigate?: () => void;
}

export function NavItem({ item, isChild, onNavigate }: NavItemProps) {
  const router = useRouter();
  const { expanded, setActiveId } = useSidebar();

  const isActive =
    router.pathname === item.href ||
    (item.href !== "#" && router.pathname.startsWith(item.href));

  const Icon = item.icon;

  const handleClick = () => {
    setActiveId(item.id);
    onNavigate?.();
  };

  if (item.disabled) {
    return (
      <div
        className={cn(
          "relative group flex items-center gap-3 px-3 py-2 rounded-lg cursor-not-allowed",
          "text-muted-foreground/40 select-none",
          isChild ? "ml-3 pl-3" : ""
        )}
      >
        <div className="relative z-10 flex items-center justify-center w-5 h-5 shrink-0">
          <Icon className="w-[18px] h-[18px]" />
        </div>
        <motion.span
          className="text-sm font-medium truncate"
          animate={{ opacity: expanded ? 1 : 0, width: expanded ? "auto" : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {item.label}
        </motion.span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={handleClick}
      className={cn(
        "relative group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150",
        "outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        isChild ? "ml-3 pl-3" : "",
        isActive
          ? "bg-accent/10 text-accent"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/20",
        item.disabled && "pointer-events-none opacity-40"
      )}
      aria-current={isActive ? "page" : undefined}
      aria-label={item.label}
    >
      {/* Active indicator */}
      {isActive && (
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
        className="text-sm font-medium truncate"
        animate={{
          opacity: expanded ? 1 : 0,
          width: expanded ? "auto" : 0,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {item.label}
      </motion.span>

      {/* Badge */}
      {item.badge && expanded && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-accent/10",
            item.badgeColor || "text-accent"
          )}
        >
          {item.badge}
        </motion.span>
      )}

      {/* New badge */}
      {item.isNew && expanded && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ml-auto text-[9px] font-bold uppercase tracking-wider text-accent"
        >
          New
        </motion.span>
      )}
    </Link>
  );
}
