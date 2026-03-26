import { cn } from "@/lib/utils";

export default function ProgressBar({
  value = 0,
  max = 100,
  size = "md",
  color = "indigo",
  showLabel = false,
  className,
}) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const heights = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const colors = {
    indigo: "bg-indigo-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    cyan: "bg-cyan-500",
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-gray-500">
            {value} / {max}
          </span>
          <span className="text-xs font-medium text-gray-700">
            {percentage}%
          </span>
        </div>
      )}
      <div className={cn("w-full bg-gray-200 rounded-full", heights[size])}>
        <div
          className={cn(
            "rounded-full transition-all duration-500 ease-out",
            heights[size],
            colors[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
