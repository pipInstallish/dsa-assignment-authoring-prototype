"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileCode2,
  Archive,
  Layers,
  Database,
  Sparkles,
  GitBranch,
  FlaskConical,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  FolderOpen
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const TOP_LINKS = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/categories", icon: BookOpen, label: "Categories" },
  { href: "/audit", icon: ScrollText, label: "Audit Log" },
];

const DSA_LINKS = [
  { href: "/categories/dsa", icon: LayoutDashboard, label: "DSA Home" },
  { href: "/categories/dsa/generate", icon: Sparkles, label: "Generate" },
  { href: "/categories/dsa/assignments", icon: FileCode2, label: "Assignments" },
  { href: "/categories/dsa/gold-set", icon: BookMarked, label: "Gold Set" },
  { href: "/categories/dsa/taxonomy", icon: GitBranch, label: "Taxonomy" },
  { href: "/categories/dsa/corpus", icon: Database, label: "Corpus" },
  { href: "/categories/dsa/class-context", icon: FolderOpen, label: "Class Context" },
  { href: "/categories/dsa/prompts", icon: Layers, label: "Prompts" },
  { href: "/categories/dsa/evals", icon: FlaskConical, label: "Evals" },
];

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}

function NavItem({ href, icon: Icon, label, collapsed }: NavItemProps) {
  const pathname = usePathname();
  // Exact match for "/" and "/categories/dsa"; prefix match for everything else
  const isActive =
    href === "/" || href === "/categories/dsa"
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-indigo-600/20 text-indigo-400 dark:text-indigo-300"
          : "text-neutral-400 hover:text-neutral-100 hover:bg-white/5",
        collapsed && "justify-center px-2"
      )}
      title={collapsed ? label : undefined}
    >
      <Icon className="shrink-0" size={16} />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const isDSA = pathname.startsWith("/categories/dsa");

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r border-border bg-background transition-all duration-200",
        collapsed ? "w-[52px]" : "w-[220px]"
      )}
    >
      {/* Logo / Brand */}
      <div className={cn("flex items-center h-14 px-4 border-b border-border", collapsed && "justify-center px-2")}>
        {!collapsed && (
          <span className="font-semibold text-sm text-white tracking-tight">
            Authoring Pipeline
          </span>
        )}
        {collapsed && <BookOpen size={18} className="text-indigo-400" />}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {TOP_LINKS.map(link => (
          <NavItem key={link.href} {...link} collapsed={collapsed} />
        ))}

        {/* DSA section */}
        <div className={cn("mt-4 mb-1", !collapsed && "px-3")}>
          {!collapsed ? (
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">DSA</p>
          ) : (
            <div className="h-px bg-border my-2" />
          )}
        </div>
        {DSA_LINKS.map(link => (
          <NavItem key={link.href} {...link} collapsed={collapsed} />
        ))}

        {/* Coming soon categories */}
        {!collapsed && (
          <div className="mt-4 px-3">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Other</p>
            <div className="space-y-0.5">
              {["HLD", "LLD"].map(cat => (
                <div
                  key={cat}
                  className="flex items-center gap-3 px-0 py-2 rounded-md text-sm text-neutral-600 cursor-not-allowed"
                >
                  <BookOpen size={16} className="shrink-0" />
                  <span>{cat}</span>
                  <span className="ml-auto text-[10px] bg-neutral-800 text-neutral-500 rounded px-1.5 py-0.5">Soon</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <div className="border-t border-white/8 p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center justify-center w-full rounded-md px-3 py-2 text-sm text-neutral-400 hover:text-neutral-100 hover:bg-white/5 transition-colors",
            collapsed && "px-2"
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : (
            <>
              <ChevronLeft size={16} className="mr-2" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
