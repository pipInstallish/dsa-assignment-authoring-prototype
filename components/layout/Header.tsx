"use client";

import { Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DSA_PROMPT_PROPOSALS } from "@/lib/seed/dsa";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pendingCount = DSA_PROMPT_PROPOSALS.filter(p => p.status === "pending").length;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-background shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-500">Prototype</span>
        <span className="text-xs text-neutral-600">·</span>
        <span className="text-xs text-indigo-400 font-medium">DSA Focus</span>
      </div>

      <div className="flex items-center gap-3">
        {pendingCount > 0 && (
          <Link
            href="/categories/dsa/prompts/proposals"
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Bell size={14} />
            <span>{pendingCount} proposal{pendingCount > 1 ? "s" : ""} pending</span>
          </Link>
        )}

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center w-8 h-8 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-white/5 transition-colors"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white">
            SC
          </div>
          <span className="text-sm text-neutral-300 font-medium">Sarah Chen</span>
        </div>
      </div>
    </header>
  );
}
