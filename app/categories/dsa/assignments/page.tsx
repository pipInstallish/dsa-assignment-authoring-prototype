"use client";

import { useState } from "react";
import Link from "next/link";
import { DSA_ASSIGNMENTS } from "@/lib/seed/dsa";
import { getUserApprovedAssignments } from "@/lib/storage/local";
import { ConceptBadge } from "@/components/domain/ConceptBadge";
import { ScoreBadge } from "@/components/domain/ScoreBadge";
import { Search, CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";

const STATUS_CONFIG = {
  approved: { label: "Approved", color: "text-emerald-400 bg-emerald-900/20 border-emerald-800/40", icon: CheckCircle },
  awaiting_approval: { label: "Awaiting Review", color: "text-blue-400 bg-blue-900/20 border-blue-800/40", icon: Clock },
  rejected: { label: "Rejected", color: "text-rose-400 bg-rose-900/20 border-rose-800/40", icon: XCircle },
  failed_eval: { label: "Failed Eval", color: "text-rose-400 bg-rose-900/20 border-rose-800/40", icon: AlertTriangle },
  failed_hard_check: { label: "Failed Hard Check", color: "text-rose-400 bg-rose-900/20 border-rose-800/40", icon: AlertTriangle },
  in_progress: { label: "In Progress", color: "text-neutral-400 bg-neutral-800 border-neutral-700", icon: Clock },
};

export default function AssignmentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const userApproved = getUserApprovedAssignments();
  const allRecords = [
    ...DSA_ASSIGNMENTS,
    ...userApproved,
  ];

  const filtered = allRecords.filter(r => {
    const matchSearch = !search || r.assignment.problem.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <a href="/categories/dsa" className="hover:text-neutral-300">DSA</a>
          <span>/</span>
          <span className="text-neutral-300">Assignments</span>
        </div>
        <h1 className="text-2xl font-semibold text-neutral-100">Assignment Library</h1>
        <p className="text-sm text-neutral-400 mt-1">{allRecords.length} total · {allRecords.filter(r => r.status === "approved").length} approved</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search assignments..."
            className="w-full bg-neutral-800/60 border border-white/10 rounded-md pl-9 pr-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 placeholder:text-neutral-600"
          />
        </div>
        <div className="flex rounded-md border border-white/10 overflow-hidden">
          <button onClick={() => setStatusFilter("")} className={`px-3 py-1.5 text-xs transition-colors ${!statusFilter ? "bg-white/10 text-neutral-100" : "text-neutral-500 hover:text-neutral-300"}`}>All</button>
          <button onClick={() => setStatusFilter("approved")} className={`px-3 py-1.5 text-xs transition-colors ${statusFilter === "approved" ? "bg-white/10 text-neutral-100" : "text-neutral-500 hover:text-neutral-300"}`}>Approved</button>
          <button onClick={() => setStatusFilter("awaiting_approval")} className={`px-3 py-1.5 text-xs transition-colors ${statusFilter === "awaiting_approval" ? "bg-white/10 text-neutral-100" : "text-neutral-500 hover:text-neutral-300"}`}>Awaiting</button>
          <button onClick={() => setStatusFilter("failed_eval")} className={`px-3 py-1.5 text-xs transition-colors ${statusFilter === "failed_eval" ? "bg-white/10 text-neutral-100" : "text-neutral-500 hover:text-neutral-300"}`}>Failed</button>
        </div>
      </div>

      <div className="rounded-lg border border-white/8 overflow-hidden">
        <div className="grid grid-cols-[1fr_180px_100px_140px_80px] text-xs text-neutral-500 border-b border-white/8 bg-white/2">
          <div className="px-4 py-2.5">Problem</div>
          <div className="px-4 py-2.5">Concepts</div>
          <div className="px-4 py-2.5">Score</div>
          <div className="px-4 py-2.5">Status</div>
          <div className="px-4 py-2.5">Iters</div>
        </div>
        <div className="divide-y divide-white/5">
          {filtered.map(record => {
            const latestEval = record.evalRuns[record.evalRuns.length - 1];
            const statusConf = STATUS_CONFIG[record.status] || STATUS_CONFIG.in_progress;
            const StatusIcon = statusConf.icon;

            return (
              <Link
                key={record.assignment.id}
                href={`/categories/dsa/assignments/${record.assignment.id}`}
                className="grid grid-cols-[1fr_180px_100px_140px_80px] hover:bg-white/3 transition-colors"
              >
                <div className="px-4 py-3">
                  <p className="text-sm text-neutral-200 truncate">{record.assignment.problem.title}</p>
                  <p className="text-xs text-neutral-600 mt-0.5 font-mono truncate">{record.assignment.id}</p>
                </div>
                <div className="px-4 py-3 flex items-center flex-wrap gap-1">
                  {record.assignment.metadata.conceptsRequired.slice(0, 2).map(cid => (
                    <ConceptBadge key={cid} conceptId={cid} size="xs" />
                  ))}
                  {record.assignment.metadata.conceptsRequired.length > 2 && (
                    <span className="text-xs text-neutral-600">+{record.assignment.metadata.conceptsRequired.length - 2}</span>
                  )}
                </div>
                <div className="px-4 py-3 flex items-center">
                  {latestEval ? <ScoreBadge score={latestEval.compositeScore} max={5} size="sm" showMax /> : <span className="text-xs text-neutral-600">—</span>}
                </div>
                <div className="px-4 py-3 flex items-center gap-1.5">
                  <StatusIcon size={12} className={statusConf.color.split(" ")[0]} />
                  <span className={`text-xs border rounded px-1.5 py-0.5 ${statusConf.color}`}>{statusConf.label}</span>
                </div>
                <div className="px-4 py-3 flex items-center">
                  <span className="text-xs text-neutral-500">{record.evalRuns.length}</span>
                </div>
              </Link>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-neutral-500 text-sm">No assignments match filters</div>
          )}
        </div>
      </div>
    </div>
  );
}
