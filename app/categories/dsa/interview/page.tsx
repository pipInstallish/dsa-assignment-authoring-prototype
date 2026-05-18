"use client";

import Link from "next/link";
import { Sparkles, MessageSquareCode, BookMarked, Gauge, Layers, FlaskConical } from "lucide-react";
import { DSA_INTERVIEW_PROBLEMS, DSA_INTERVIEW_CALIBRATION } from "@/lib/seed/dsa";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const TILES = [
  { href: "/categories/dsa/interview/generate", icon: Sparkles, label: "Generate Interview", desc: "Create a new interview problem", color: "violet" },
  { href: "/categories/dsa/interview/problems", icon: MessageSquareCode, label: "Problems", desc: "Browse interview library", color: "neutral" },
  { href: "/categories/dsa/interview/gold-set", icon: BookMarked, label: "Gold Set", desc: "Calibrated exemplars", color: "neutral" },
  { href: "/categories/dsa/interview/calibration", icon: Gauge, label: "Calibration", desc: "Solve-rate deployments", color: "neutral" },
  { href: "/categories/dsa/interview/prompts", icon: Layers, label: "Prompts", desc: "Interview generator prompts", color: "neutral" },
  { href: "/categories/dsa/interview/evals", icon: FlaskConical, label: "Evals", desc: "Differentiation & leakage", color: "neutral" },
];

export default function DSAInterviewHomePage() {
  const calibrated = DSA_INTERVIEW_PROBLEMS.filter(p => p.status === "calibrated").length;
  const awaiting = DSA_INTERVIEW_PROBLEMS.filter(p => p.status === "awaiting_calibration").length;
  const draft = DSA_INTERVIEW_PROBLEMS.filter(p => p.status === "draft").length;

  // Solve-rate distribution across calibrated problems
  const solveDist = DSA_INTERVIEW_PROBLEMS
    .filter(p => p.actualSolveRate !== null)
    .map(p => ({ title: p.title.length > 22 ? p.title.slice(0, 20) + "…" : p.title, rate: Math.round((p.actualSolveRate || 0) * 100) }));

  // Score variance (differentiation signal)
  const variance = DSA_INTERVIEW_PROBLEMS
    .filter(p => p.scoreVariance !== null)
    .map(p => ({ title: p.title.length > 20 ? p.title.slice(0, 18) + "…" : p.title, variance: p.scoreVariance || 0 }));

  // Rubric agreement trend across recent deployments
  const agreement = DSA_INTERVIEW_CALIBRATION.slice(-6).map((r, i) => ({
    cohort: `D${i + 1}`,
    agreement: Math.round(r.rubricAgreement * 100),
  }));

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <Link href="/categories/dsa" className="hover:text-neutral-300">DSA</Link>
            <span>/</span>
            <span className="text-neutral-300">Interview</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100">DSA Interview</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-neutral-400">
            <span>{calibrated} calibrated</span>
            <span className="text-neutral-600">·</span>
            <span>{awaiting} awaiting calibration</span>
            <span className="text-neutral-600">·</span>
            <span>{draft} draft</span>
          </div>
        </div>

        {/* Nav tiles */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {TILES.map(tile => (
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

        {/* Charts */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-white/8 bg-white/2">
            <p className="text-sm font-medium text-neutral-300 mb-1">Actual Solve Rate by Problem</p>
            <p className="text-[10px] text-neutral-600 mb-2">% of candidates who reached optimal</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={solveDist} layout="vertical">
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                <YAxis dataKey="title" type="category" tick={{ fontSize: 9, fill: "#6b7280" }} tickLine={false} axisLine={false} width={100} />
                <Tooltip
                  contentStyle={{ background: "#1a1a2e", border: "1px solid #ffffff20", borderRadius: 6, fontSize: 11 }}
                  formatter={(value) => [`${value}%`, "Solve rate"]}
                />
                <Bar dataKey="rate" fill="#8b5cf6" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 rounded-lg border border-white/8 bg-white/2">
            <p className="text-sm font-medium text-neutral-300 mb-1">Score Variance (Differentiation)</p>
            <p className="text-[10px] text-neutral-600 mb-2">Higher = better candidate separation</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={variance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="title" tick={{ fontSize: 8, fill: "#6b7280" }} tickLine={false} axisLine={false} interval={0} />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1a1a2e", border: "1px solid #ffffff20", borderRadius: 6, fontSize: 11 }}
                />
                <Bar dataKey="variance" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 rounded-lg border border-white/8 bg-white/2">
            <p className="text-sm font-medium text-neutral-300 mb-1">Rubric Inter-Rater Agreement</p>
            <p className="text-[10px] text-neutral-600 mb-2">Recent deployments (target ≥ 80%)</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={agreement}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="cohort" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1a1a2e", border: "1px solid #ffffff20", borderRadius: 6, fontSize: 11 }}
                  formatter={(value) => [`${value}%`, "Agreement"]}
                />
                <Line type="monotone" dataKey="agreement" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
