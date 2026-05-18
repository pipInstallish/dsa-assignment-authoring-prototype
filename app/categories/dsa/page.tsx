"use client";

import Link from "next/link";
import { Sparkles, FileCode2, BookMarked, GitBranch, Database, FolderOpen, Layers, FlaskConical, MessageSquareCode, Gauge } from "lucide-react";
import { DSA_ASSIGNMENTS } from "@/lib/seed/dsa";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const ASSIGNMENT_TILES = [
  { href: "/categories/dsa/generate", icon: Sparkles, label: "Generate Assignment", desc: "Create a new DSA assignment", color: "indigo" },
  { href: "/categories/dsa/assignments", icon: FileCode2, label: "Assignments", desc: "Browse the assignment library", color: "neutral" },
  { href: "/categories/dsa/gold-set", icon: BookMarked, label: "Gold Set", desc: "Hand-authored exemplars", color: "neutral" },
  { href: "/categories/dsa/class-context", icon: FolderOpen, label: "Class Contexts", desc: "Curriculum module library", color: "neutral" },
  { href: "/categories/dsa/prompts", icon: Layers, label: "Prompts", desc: "Prompt version management", color: "neutral" },
  { href: "/categories/dsa/evals", icon: FlaskConical, label: "Eval Judge", desc: "Run and review evaluations", color: "neutral" },
];

const INTERVIEW_TILES = [
  { href: "/categories/dsa/interview/generate", icon: Sparkles, label: "Generate Interview", desc: "Create a new interview problem", color: "violet" },
  { href: "/categories/dsa/interview/problems", icon: MessageSquareCode, label: "Problems", desc: "Browse interview problem library", color: "neutral" },
  { href: "/categories/dsa/interview/gold-set", icon: BookMarked, label: "Gold Set", desc: "Calibrated interview exemplars", color: "neutral" },
  { href: "/categories/dsa/interview/calibration", icon: Gauge, label: "Calibration", desc: "Solve-rate data from deployments", color: "neutral" },
  { href: "/categories/dsa/interview/prompts", icon: Layers, label: "Prompts", desc: "Interview generator prompts", color: "neutral" },
  { href: "/categories/dsa/interview/evals", icon: FlaskConical, label: "Evals", desc: "Differentiation & leakage checks", color: "neutral" },
];

const SHARED_TILES = [
  { href: "/categories/dsa/taxonomy", icon: GitBranch, label: "Taxonomy", desc: "Concept hierarchy (shared)", color: "neutral" },
  { href: "/categories/dsa/corpus", icon: Database, label: "Corpus", desc: "Question reference set (shared)", color: "neutral" },
];

// Mock chart data
const SCORE_TREND = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  score: 3.5 + Math.sin(i * 0.3) * 0.6 + Math.random() * 0.3
}));

const CONCEPT_COVERAGE = [
  { concept: "hashmaps", count: 8 },
  { concept: "two_pointers", count: 6 },
  { concept: "sliding_window", count: 5 },
  { concept: "trees", count: 4 },
  { concept: "dynamic_programming_1d", count: 4 },
  { concept: "graphs", count: 3 },
  { concept: "heaps", count: 3 },
  { concept: "stacks", count: 2 },
];

const REFINEMENT_RATE = [
  { week: "W1", rate: 35 },
  { week: "W2", rate: 28 },
  { week: "W3", rate: 42 },
  { week: "W4", rate: 20 },
];

export default function DSACategoryPage() {
  const approvedCount = DSA_ASSIGNMENTS.filter(a => a.status === "approved").length;
  const pendingCount = DSA_ASSIGNMENTS.filter(a => a.status === "awaiting_approval").length;
  const failedCount = DSA_ASSIGNMENTS.filter(a => a.status === "failed_eval" || a.status === "failed_hard_check").length;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <Link href="/categories" className="hover:text-neutral-300">Categories</Link>
            <span>/</span>
            <span className="text-neutral-300">DSA</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100">Data Structures & Algorithms</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-neutral-400">
            <span>{approvedCount} approved</span>
            <span className="text-neutral-600">·</span>
            <span>{pendingCount} awaiting review</span>
            <span className="text-neutral-600">·</span>
            <span>{failedCount} failed</span>
          </div>
        </div>

        {/* Assignments section */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Assignments</p>
          <div className="grid grid-cols-3 gap-3">
            {ASSIGNMENT_TILES.map(tile => (
              <Link
                key={tile.href}
                href={tile.href}
                className={`p-4 rounded-lg border transition-all group ${
                  tile.color === "indigo"
                    ? "border-indigo-500/40 bg-indigo-950/20 hover:border-indigo-500/60 hover:bg-indigo-950/30"
                    : "border-white/8 bg-white/2 hover:border-white/20 hover:bg-white/4"
                }`}
              >
                <tile.icon size={18} className={tile.color === "indigo" ? "text-indigo-400 mb-2" : "text-neutral-400 mb-2"} />
                <p className="text-sm font-medium text-neutral-200">{tile.label}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{tile.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Interview section */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Interview</p>
          <div className="grid grid-cols-3 gap-3">
            {INTERVIEW_TILES.map(tile => (
              <Link
                key={tile.href}
                href={tile.href}
                className={`p-4 rounded-lg border transition-all group ${
                  tile.color === "violet"
                    ? "border-violet-500/40 bg-violet-950/20 hover:border-violet-500/60 hover:bg-violet-950/30"
                    : "border-white/8 bg-white/2 hover:border-white/20 hover:bg-white/4"
                }`}
              >
                <tile.icon size={18} className={tile.color === "violet" ? "text-violet-400 mb-2" : "text-neutral-400 mb-2"} />
                <p className="text-sm font-medium text-neutral-200">{tile.label}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{tile.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Shared section */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Shared</p>
          <div className="grid grid-cols-3 gap-3">
            {SHARED_TILES.map(tile => (
              <Link
                key={tile.href}
                href={tile.href}
                className="p-4 rounded-lg border border-white/8 bg-white/2 hover:border-white/20 hover:bg-white/4 transition-all group"
              >
                <tile.icon size={18} className="text-neutral-400 mb-2" />
                <p className="text-sm font-medium text-neutral-200">{tile.label}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{tile.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-white/8 bg-white/2">
            <p className="text-sm font-medium text-neutral-300 mb-3">Composite Score Trend (30d)</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={SCORE_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} interval={6} />
                <YAxis domain={[2, 5]} tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1a1a2e", border: "1px solid #ffffff20", borderRadius: 6, fontSize: 11 }}
                  labelStyle={{ color: "#9ca3af" }}
                  itemStyle={{ color: "#818cf8" }}
                />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 rounded-lg border border-white/8 bg-white/2">
            <p className="text-sm font-medium text-neutral-300 mb-3">Concept Coverage Frequency</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={CONCEPT_COVERAGE} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                <YAxis dataKey="concept" type="category" tick={{ fontSize: 9, fill: "#6b7280" }} tickLine={false} axisLine={false} width={90} />
                <Tooltip
                  contentStyle={{ background: "#1a1a2e", border: "1px solid #ffffff20", borderRadius: 6, fontSize: 11 }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 rounded-lg border border-white/8 bg-white/2">
            <p className="text-sm font-medium text-neutral-300 mb-3">Refinement Rate by Week (%)</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={REFINEMENT_RATE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 60]} tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1a1a2e", border: "1px solid #ffffff20", borderRadius: 6, fontSize: 11 }}
                  labelStyle={{ color: "#9ca3af" }}
                  formatter={(value) => [`${value}%`, "Refinement rate"]}
                />
                <Bar dataKey="rate" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
