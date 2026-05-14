"use client";

import Link from "next/link";
import { BookOpen, Sparkles, BookMarked, CheckCircle, Clock, AlertCircle, RotateCcw } from "lucide-react";
import { DSA_ASSIGNMENTS, DSA_GOLD_SET, DSA_PROMPT_PROPOSALS } from "@/lib/seed/dsa";
import { resetPrototypeData } from "@/lib/storage/local";
import { toast } from "sonner";

const RECENT_ACTIVITY = [
  { text: "Generated: Most Frequently Ordered Product Category", time: "2h ago", status: "approved" },
  { text: "Generated: Longest Valid Session Window", time: "4h ago", status: "approved" },
  { text: "Approved: Most Frequently Ordered Product Category", time: "2h ago", status: "approved" },
  { text: "Rejected: Next Higher Bid in Auction Queue", time: "5h ago", status: "rejected" },
  { text: "Prompt proposal submitted: Generation v4", time: "1d ago", status: "pending" },
  { text: "Prompt proposal submitted: Judge Alignment v2", time: "1d ago", status: "pending" },
  { text: "Refinement exhausted: Optimal Stock Trade Sequence", time: "2d ago", status: "failed" },
  { text: "Concept proposal: Segment Tree", time: "3d ago", status: "pending" },
  { text: "Hard check failed: Edit Distance (concept containment)", time: "4d ago", status: "failed" },
  { text: "Awaiting review: Deepest Directory with One File", time: "5d ago", status: "awaiting" },
];

const STATUS_COLORS: Record<string, string> = {
  approved: "text-emerald-400",
  rejected: "text-rose-400",
  pending: "text-amber-400",
  failed: "text-rose-400",
  awaiting: "text-blue-400",
};

export default function DashboardPage() {
  const approvedCount = DSA_ASSIGNMENTS.filter(a => a.status === "approved").length;
  const pendingCount = DSA_ASSIGNMENTS.filter(a => a.status === "awaiting_approval").length;
  const goldSetCount = DSA_GOLD_SET.length;
  const pendingProposals = DSA_PROMPT_PROPOSALS.filter(p => p.status === "pending").length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-100">Assignment Authoring Pipeline</h1>
        <p className="text-sm text-neutral-400 mt-1">DSA prototype — instructor view as Sarah Chen</p>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Link href="/categories/dsa" className="p-5 rounded-lg border border-indigo-500/30 bg-indigo-950/20 hover:border-indigo-500/50 hover:bg-indigo-950/30 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-md bg-indigo-600/20 flex items-center justify-center">
              <BookOpen size={18} className="text-indigo-400" />
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-800/40 rounded px-1.5 py-0.5">Active</span>
          </div>
          <h3 className="font-semibold text-neutral-100 mb-1">Data Structures & Algorithms</h3>
          <p className="text-xs text-neutral-500">{approvedCount} approved · {pendingCount} pending · {goldSetCount} gold entries</p>
        </Link>
        {["High-Level Design", "Low-Level Design"].map(cat => (
          <div key={cat} className="p-5 rounded-lg border border-white/5 bg-white/2 opacity-50 cursor-not-allowed">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-md bg-neutral-800 flex items-center justify-center">
                <BookOpen size={18} className="text-neutral-600" />
              </div>
              <span className="text-xs text-neutral-600 bg-neutral-800 border border-neutral-700 rounded px-1.5 py-0.5">Coming Soon</span>
            </div>
            <h3 className="font-semibold text-neutral-400 mb-1">{cat}</h3>
            <p className="text-xs text-neutral-600">Not yet seeded</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: CheckCircle, label: "Approved", value: approvedCount, color: "text-emerald-400" },
          { icon: Clock, label: "Awaiting Review", value: pendingCount, color: "text-amber-400" },
          { icon: BookMarked, label: "Gold Set Size", value: goldSetCount, color: "text-indigo-400" },
          { icon: AlertCircle, label: "Pending Proposals", value: pendingProposals, color: "text-amber-400" },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-lg border border-white/8 bg-white/2">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={15} className={stat.color} />
              <span className="text-xs text-neutral-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-semibold text-neutral-100">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions + activity */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-lg border border-white/8">
          <h3 className="text-sm font-medium text-neutral-200 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/categories/dsa/generate" className="flex items-center gap-3 px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition-colors">
              <Sparkles size={15} />Generate New Assignment
            </Link>
            <Link href="/categories/dsa/gold-set/new" className="flex items-center gap-3 px-3 py-2 rounded-md border border-white/10 hover:border-white/20 text-neutral-300 text-sm transition-colors">
              <BookMarked size={15} />Author Gold Set Entry
            </Link>
            <Link href="/categories/dsa/prompts/proposals" className="flex items-center gap-3 px-3 py-2 rounded-md border border-amber-800/40 bg-amber-900/10 hover:border-amber-700/60 text-amber-300 text-sm transition-colors">
              <AlertCircle size={15} />Review {pendingProposals} Pending Proposals
            </Link>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-white/8">
          <h3 className="text-sm font-medium text-neutral-200 mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {RECENT_ACTIVITY.map((activity, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`mt-0.5 shrink-0 ${STATUS_COLORS[activity.status]}`}>●</span>
                <span className="text-neutral-400 flex-1 truncate">{activity.text}</span>
                <span className="text-neutral-600 shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-white/5">
        <button onClick={() => { resetPrototypeData(); toast.success("Prototype data reset"); }} className="flex items-center gap-2 text-xs text-neutral-500 hover:text-rose-400 transition-colors">
          <RotateCcw size={12} />Reset prototype data
        </button>
      </div>
    </div>
  );
}
