"use client";

import Link from "next/link";
import { DSA_INTERVIEW_CALIBRATION, DSA_INTERVIEW_PROBLEMS } from "@/lib/seed/dsa";
import { Gauge, TrendingUp, AlertTriangle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from "recharts";

export default function InterviewCalibrationPage() {
  const records = DSA_INTERVIEW_CALIBRATION;

  // Group by problem
  const byProblem = records.reduce<Record<string, typeof records>>((acc, r) => {
    (acc[r.problemId] ||= []).push(r);
    return acc;
  }, {});

  // Estimated vs actual chart data
  const accuracy = DSA_INTERVIEW_PROBLEMS
    .filter(p => p.actualSolveRate !== null)
    .map(p => {
      // Parse band like "50-70%" → midpoint
      const m = p.estimatedSolveBand.match(/(\d+)-(\d+)/);
      const midEst = m ? (parseInt(m[1]) + parseInt(m[2])) / 2 : 0;
      return {
        title: p.title.length > 18 ? p.title.slice(0, 16) + "…" : p.title,
        estimated: midEst,
        actual: Math.round((p.actualSolveRate || 0) * 100),
      };
    });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <Link href="/categories/dsa" className="hover:text-neutral-300">DSA</Link>
          <span>/</span>
          <Link href="/categories/dsa/interview" className="hover:text-neutral-300">Interview</Link>
          <span>/</span>
          <span className="text-neutral-300">Calibration</span>
        </div>
        <h1 className="text-2xl font-semibold text-neutral-100">Calibration</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Real solve-rate data from deployed interview problems. Closes the loop on difficulty estimates.
        </p>
      </div>

      {/* Estimated vs Actual */}
      <div className="rounded-lg border border-white/8 bg-white/2 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-violet-400" />
          <p className="text-sm font-medium text-neutral-200">Estimated vs Actual Solve Rate</p>
          <span className="text-xs text-neutral-500 ml-auto">Goal: estimate falls within ±10% of actual</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={accuracy}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="title" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "#1a1a2e", border: "1px solid #ffffff20", borderRadius: 6, fontSize: 11 }}
              formatter={(value, name) => [`${value}%`, name]}
            />
            <Bar dataKey="estimated" fill="#8b5cf6" name="Estimated (midpoint)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="actual" fill="#10b981" name="Actual" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Deployment log */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Gauge size={14} className="text-violet-400" />
          <p className="text-sm font-medium text-neutral-200">Deployment Log</p>
        </div>
        <div className="rounded-lg border border-white/8 overflow-hidden">
          <div className="grid grid-cols-[1fr_140px_90px_90px_90px_90px_110px] text-xs text-neutral-500 border-b border-white/8 bg-white/2">
            <div className="px-4 py-2.5">Problem</div>
            <div className="px-4 py-2.5">Cohort</div>
            <div className="px-4 py-2.5">Attempts</div>
            <div className="px-4 py-2.5">Optimal</div>
            <div className="px-4 py-2.5">Brute</div>
            <div className="px-4 py-2.5">Avg time</div>
            <div className="px-4 py-2.5">Rubric agree</div>
          </div>
          <div className="divide-y divide-white/5">
            {records.map((r, i) => (
              <div key={i} className="grid grid-cols-[1fr_140px_90px_90px_90px_90px_110px] hover:bg-white/3 transition-colors text-xs">
                <div className="px-4 py-3">
                  <p className="text-neutral-200">{r.problemTitle}</p>
                  <p className="text-neutral-600 mt-0.5">{r.date}</p>
                </div>
                <div className="px-4 py-3 flex items-center text-neutral-400">{r.cohort}</div>
                <div className="px-4 py-3 flex items-center text-neutral-300">{r.attempts}</div>
                <div className="px-4 py-3 flex items-center text-emerald-400">{r.solvedOptimal} ({Math.round(r.solvedOptimal / r.attempts * 100)}%)</div>
                <div className="px-4 py-3 flex items-center text-amber-400">{r.solvedBrute} ({Math.round(r.solvedBrute / r.attempts * 100)}%)</div>
                <div className="px-4 py-3 flex items-center text-neutral-300">{r.avgTimeMin} min</div>
                <div className="px-4 py-3 flex items-center">
                  <span className={r.rubricAgreement >= 0.8 ? "text-emerald-400" : "text-amber-400"}>
                    {Math.round(r.rubricAgreement * 100)}%
                  </span>
                  {r.rubricAgreement < 0.8 && <AlertTriangle size={11} className="text-amber-400 ml-1" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-neutral-600 mt-3 leading-relaxed">
        Calibration data feeds back into two places: (1) the difficulty rubric definitions shown on the Generate page get updated as more data lands, and (2) the gold set picks up newly-calibrated problems as few-shot examples for future generation.
      </p>
    </div>
  );
}
