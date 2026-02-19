"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Copy, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface SavedPolicyItem {
  id: number;
  role: string[];
  data_field: string[];
  action: string;
  data_transformation?: string;
  restrictions?: string[];
  restricted_fields?: string[];
  time_restriction?: { duration: number; unit: string };
  conditional_access?: string;
  created_at: string;
  nlp_text: string;
}

interface SavedPoliciesListProps {
  policies: SavedPolicyItem[];
  onDelete: (id: number) => void;
  onCopyJson: (policy: SavedPolicyItem) => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -20 },
};

export function SavedPoliciesList({ policies, onDelete, onCopyJson }: SavedPoliciesListProps) {
  if (policies.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-[#036E6E]" />
          <h3 className="text-lg font-semibold text-slate-800">Saved Policies</h3>
          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-[#024443] border border-emerald-200">
            {policies.length}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-3 max-h-[520px] overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {policies.map((policy) => (
            <motion.div
              key={policy.id}
              variants={itemVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              layout
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm border-l-4 border-l-[#036E6E] hover:shadow-md transition-shadow"
            >
              <p className="text-sm font-semibold text-slate-700 mb-3">
                {policy.role[0]?.replace(/_/g, " ") ?? "Policy"} · {policy.action}
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {policy.role.map((r) => (
                  <span
                    key={r}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 text-[#024443] border border-emerald-200"
                  >
                    {r}
                  </span>
                ))}
                {policy.data_field.map((f) => (
                  <span
                    key={f}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 border border-slate-200"
                  >
                    {f}
                  </span>
                ))}
                <span
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-lg",
                    "bg-[#036E6E]/10 text-[#036E6E] border border-[#036E6E]/20"
                  )}
                >
                  {policy.action}
                </span>
              </div>
              <p className="text-sm text-slate-500 italic mb-2 line-clamp-2">"{policy.nlp_text}"</p>
              <p className="text-xs text-slate-400 mb-3">
                {new Date(policy.created_at).toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Copy className="w-3.5 h-3.5" />}
                  onClick={() => onCopyJson(policy)}
                >
                  Copy JSON
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => onDelete(policy.id)}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
