"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-300",
  secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300",
  danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300",
  success: "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-300",
  outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-indigo-300",
  ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-300",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
