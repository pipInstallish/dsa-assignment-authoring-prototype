import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export default function CategoriesPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-neutral-100 mb-2">Categories</h1>
      <p className="text-sm text-neutral-400 mb-8">Assignment categories available in the authoring pipeline.</p>

      <div className="grid grid-cols-1 gap-3">
        <Link href="/categories/dsa" className="flex items-center justify-between p-4 rounded-lg border border-indigo-500/30 bg-indigo-950/20 hover:border-indigo-500/50 transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-indigo-600/20 flex items-center justify-center">
              <BookOpen size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="font-medium text-neutral-100">Data Structures & Algorithms</p>
              <p className="text-xs text-neutral-500 mt-0.5">code_execution verification · 31 concepts · 15 corpus questions</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-neutral-500 group-hover:text-neutral-300 transition-colors" />
        </Link>

        {["High-Level Design", "Low-Level Design"].map(cat => (
          <div key={cat} className="flex items-center justify-between p-4 rounded-lg border border-white/5 bg-white/2 opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-neutral-800 flex items-center justify-center">
                <BookOpen size={18} className="text-neutral-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-400">{cat}</p>
                <p className="text-xs text-neutral-600 mt-0.5">Coming soon</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
