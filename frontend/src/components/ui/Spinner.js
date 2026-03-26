import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function Spinner({ size = "md", className }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };

  return (
    <Loader2
      className={cn("animate-spin text-indigo-500", sizes[size], className)}
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="lg" />
    </div>
  );
}
