import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showMax?: boolean;
}

export function ScoreBadge({ score, max = 5, size = "sm", showMax = false }: ScoreBadgeProps) {
  const ratio = score / max;
  const colorClass =
    ratio >= 0.8 ? "bg-emerald-900/40 text-emerald-300 border-emerald-700/40" :
    ratio >= 0.6 ? "bg-yellow-900/40 text-yellow-300 border-yellow-700/40" :
    "bg-rose-900/40 text-rose-300 border-rose-700/40";

  return (
    <span
      className={cn(
        "inline-flex items-center border rounded-md font-mono font-semibold",
        colorClass,
        size === "sm" && "text-xs px-1.5 py-0.5",
        size === "md" && "text-sm px-2 py-1",
        size === "lg" && "text-base px-2.5 py-1.5"
      )}
    >
      {score.toFixed(1)}{showMax && `/${max}`}
    </span>
  );
}
