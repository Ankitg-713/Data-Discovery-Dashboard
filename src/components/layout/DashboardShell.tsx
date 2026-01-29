"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { motion } from "framer-motion";
import { Shield, FlaskConical } from "lucide-react";
import { DEMO_MODE } from "@/core/config";

export default function DashboardShell({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Mark client mount - necessary for Next.js SSR/client hydration
  // This is a valid pattern to prevent hydration mismatches
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [mounted, isAuthenticated, isLoading, router]);

  // Prevent SSR/client mismatch entirely
  if (!mounted) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#024443] to-[#036E6E] flex items-center justify-center"
          >
            <Shield className="w-6 h-6 text-white" />
          </motion.div>
          <p className="text-slate-500 text-sm">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {DEMO_MODE && (
        <div className="flex items-center justify-center gap-2 py-1.5 px-4 bg-amber-100 border-b border-amber-200 text-amber-800 text-sm font-medium">
          <FlaskConical className="w-4 h-4 shrink-0" />
          <span>Demo mode — mock data. All metrics are simulated and connected across pages.</span>
        </div>
      )}
      <div className="flex flex-1 min-h-0">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main
          className="flex-1 min-h-screen bg-slate-50 transition-[margin-left] duration-300 ease-in-out overflow-auto"
          style={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
