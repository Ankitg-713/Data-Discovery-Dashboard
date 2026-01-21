"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, iconPosition = "left", className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === "left" && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-3 rounded-xl",
              "bg-white border border-slate-200",
              "text-slate-800 placeholder-slate-400",
              "focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20",
              "transition-all duration-300 outline-none",
              icon && iconPosition === "left" && "pl-11",
              icon && iconPosition === "right" && "pr-11",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
