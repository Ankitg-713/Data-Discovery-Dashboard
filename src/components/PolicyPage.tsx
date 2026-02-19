"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle, Save, FileCheck, Clock, Shield, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { PolicyRiskBadge } from "@/components/PolicyRiskBadge";
import { SavedPoliciesList, type SavedPolicyItem } from "@/components/SavedPoliciesList";
import {
  generatePolicy,
  assessRisk,
  type GeneratedPolicy,
  type RiskLevel,
} from "@/utils/mockNLP";

const STORAGE_KEY = "securelytix.savedPolicies.v1";
const GENERATE_DELAY_MS = 1500;

function formatLabel(value: string): string {
  return value
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function loadSavedPolicies(): SavedPolicyItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePoliciesToStorage(policies: SavedPolicyItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(policies));
  } catch {
    // ignore
  }
}

export function PolicyPage() {
  const [input, setInput] = useState("");
  const [generatedPolicy, setGeneratedPolicy] = useState<GeneratedPolicy | null>(null);
  const [riskLevel, setRiskLevel] = useState<RiskLevel | null>(null);
  const [savedPolicies, setSavedPolicies] = useState<SavedPolicyItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validateMessage, setValidateMessage] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setSavedPolicies(loadSavedPolicies());
  }, []);

  const handleGenerate = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setIsGenerating(true);
    setGeneratedPolicy(null);
    setRiskLevel(null);
    setValidateMessage(null);
    setSaveMessage(null);
    await new Promise((r) => setTimeout(r, GENERATE_DELAY_MS));
    const policy = generatePolicy(trimmed);
    setGeneratedPolicy(policy);
    setRiskLevel(assessRisk(policy));
    setIsGenerating(false);
  }, [input]);

  const handleValidate = useCallback(async () => {
    if (!generatedPolicy) return;
    setIsValidating(true);
    setValidateMessage(null);
    await new Promise((r) => setTimeout(r, 400));
    setValidateMessage("Policy structure is valid.");
    setIsValidating(false);
  }, [generatedPolicy]);

  const handleSave = useCallback(async () => {
    if (!generatedPolicy || !input.trim()) return;
    setIsSaving(true);
    setSaveMessage(null);
    await new Promise((r) => setTimeout(r, 300));
    const item: SavedPolicyItem = {
      id: Date.now(),
      ...generatedPolicy,
      created_at: new Date().toISOString(),
      nlp_text: input.trim(),
    };
    const next = [item, ...savedPolicies];
    setSavedPolicies(next);
    savePoliciesToStorage(next);
    setIsSaving(false);
    // Close generated section and clear form so the saved policies list is the focus
    setGeneratedPolicy(null);
    setRiskLevel(null);
    setInput("");
    setValidateMessage(null);
    setSaveMessage(null);
  }, [generatedPolicy, input, savedPolicies]);

  const handleDelete = useCallback((id: number) => {
    setSavedPolicies((prev) => {
      const next = prev.filter((p) => p.id !== id);
      savePoliciesToStorage(next);
      return next;
    });
  }, []);

  const handleCopyJson = useCallback((policy: SavedPolicyItem) => {
    const payload = {
      role: policy.role,
      data_field: policy.data_field,
      action: policy.action,
      data_transformation: policy.data_transformation ?? "none",
      restrictions: policy.restrictions,
      restricted_fields: policy.restricted_fields,
      time_restriction: policy.time_restriction,
      conditional_access: policy.conditional_access,
      created_at: policy.created_at,
      nlp_text: policy.nlp_text,
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
  }, []);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card variant="default" padding="md" hover={false}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#036E6E]" />
            <CardTitle>Type Your Request</CardTitle>
          </div>
          <CardDescription>Describe your security policy in plain English</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='e.g. "Grant doctors access to patient records for active consultation sessions"'
            className="input h-32 resize-y min-h-32 rounded-xl border-slate-200 focus:border-[#036E6E] focus:ring-2 focus:ring-[#036E6E]/20"
            disabled={isGenerating}
          />
          <div className="mt-4">
            <Button
              variant="primary"
              size="lg"
              icon={<Sparkles className="w-4 h-4" />}
              isLoading={isGenerating}
              disabled={!input.trim()}
              onClick={handleGenerate}
            >
              Generate Policy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Policy Section - Single Container */}
      <AnimatePresence>
        {generatedPolicy && riskLevel !== null && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
          >
            {/* Policy Assignment */}
            <div className="p-5 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 border-b border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#024443] to-[#036E6E] flex items-center justify-center shadow-sm">
                  <FileCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800">Policy Assignment</h3>
                  <p className="text-xs text-slate-500">Role-based access control policy</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-white/80 border border-emerald-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Role</p>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedPolicy.role.map((r) => (
                      <span key={r} className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#024443] to-[#036E6E] text-white">
                        {formatLabel(r)}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">User role(s) assigned to this policy</p>
                </div>
                <div className="p-3 rounded-lg bg-white/80 border border-emerald-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Data Field</p>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedPolicy.data_field.map((f) => (
                      <span key={f} className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-100 text-[#024443] border border-emerald-200">
                        {formatLabel(f)}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Type(s) of data this policy applies to</p>
                </div>
                <div className="p-3 rounded-lg bg-white/80 border border-emerald-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Action</p>
                  <p className="text-sm font-bold text-slate-800">{formatLabel(generatedPolicy.action)}</p>
                  <p className="text-xs text-slate-500 mt-1">Permission level granted</p>
                </div>
              </div>
            </div>

            {/* Time Restriction */}
            {generatedPolicy.time_restriction && (
              <div className="px-5 py-3 flex items-center gap-3 border-b border-slate-100 bg-sky-100/80">
                <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Time Restriction</p>
                  <p className="text-sm text-slate-600">Access is limited to this duration</p>
                </div>
                <p className="text-sm font-bold text-slate-800 shrink-0">
                  {generatedPolicy.time_restriction.duration} {generatedPolicy.time_restriction.unit}
                </p>
              </div>
            )}

            {/* Restrictions */}
            {generatedPolicy.restrictions && generatedPolicy.restrictions.length > 0 && (
              <div className="px-5 py-3 flex items-center gap-3 border-b border-slate-100 bg-red-100/70">
                <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Restrictions</p>
                  <p className="text-sm text-slate-600">Additional limits on this policy</p>
                </div>
                <p className="text-sm font-medium text-red-700 shrink-0">
                  {generatedPolicy.restrictions.map(formatLabel).join(", ")}
                </p>
              </div>
            )}

            {/* Restricted Fields */}
            {generatedPolicy.restricted_fields && generatedPolicy.restricted_fields.length > 0 && (
              <div className="px-5 py-3 flex items-center gap-3 border-b border-slate-100 bg-amber-100/70">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Restricted Fields</p>
                  <p className="text-sm text-slate-600">Data fields excluded from access</p>
                </div>
                <p className="text-sm font-medium text-amber-800 shrink-0">
                  {generatedPolicy.restricted_fields.map(formatLabel).join(", ")}
                </p>
              </div>
            )}

            {/* Conditional Access */}
            {generatedPolicy.conditional_access && (
              <div className="px-5 py-3 flex items-center gap-3 border-b border-slate-100 bg-purple-100/70">
                <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Conditional Access</p>
                  <p className="text-sm text-slate-600">When this policy applies</p>
                </div>
                <p className="text-sm font-medium text-purple-700 shrink-0">
                  {formatLabel(generatedPolicy.conditional_access)}
                </p>
              </div>
            )}

            {/* JSON + Actions - compact */}
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <p className="text-sm font-medium text-slate-600">Structured JSON policy</p>
                <PolicyRiskBadge level={riskLevel} />
              </div>
              <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto overflow-y-auto max-h-44 scrollbar-thin mb-4">
                {JSON.stringify(generatedPolicy, null, 2)}
              </pre>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  icon={<FileCheck className="w-4 h-4" />}
                  isLoading={isValidating}
                  onClick={handleValidate}
                >
                  Validate
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  icon={<Save className="w-4 h-4" />}
                  isLoading={isSaving}
                  onClick={handleSave}
                >
                  Save Policy
                </Button>
                {validateMessage && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
                    <CheckCircle className="w-4 h-4" />
                    {validateMessage}
                  </span>
                )}
                {saveMessage && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
                    <CheckCircle className="w-4 h-4" />
                    {saveMessage}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Policies Section */}
      {savedPolicies.length > 0 && (
        <SavedPoliciesList
          policies={savedPolicies}
          onDelete={handleDelete}
          onCopyJson={handleCopyJson}
        />
      )}
    </div>
  );
}
