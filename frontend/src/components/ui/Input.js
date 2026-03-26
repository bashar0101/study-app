"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, className, type = "text", ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors",
          "placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500",
          "disabled:bg-gray-50 disabled:text-gray-500",
          error && "border-red-400 focus:ring-red-300 focus:border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
