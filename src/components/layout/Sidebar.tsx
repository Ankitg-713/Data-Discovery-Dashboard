"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Activity,
  LayoutDashboard,
  Search,
  Key,
  RefreshCcw,
  Shield,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Database,
  Bell,
  Plug,
  FileCheck,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    name: "Observability",
    href: "/observability",
    icon: Activity,
    badge: null,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Data Discovery",
    href: "/data-discovery",
    icon: Search,
    badge: null,
  },
  {
    name: "Data Access",
    href: "/data-access",
    icon: Key,
    badge: null,
  },
  {
    name: "Backfill Tokenization",
    href: "/backfill-tokenization",
    icon: RefreshCcw,
    badge: null,
  },
  {
    name: "Integrations",
    href: "/integrations",
    icon: Plug,
    badge: null,
  },
  {
    name: "Policies",
    href: "/policies",
    icon: FileCheck,
    badge: null,
  },
];

const secondaryNavItems = [
  {
    name: "Data Sources",
    href: "#",
    icon: Database,
    badge: "3",
  },
  {
    name: "Alerts",
    href: "#",
    icon: Bell,
    badge: "12",
  },
  {
    name: "Security",
    href: "#",
    icon: Shield,
    badge: null,
  },
];

const bottomNavItems = [
  {
    name: "Settings",
    href: "#",
    icon: Settings,
  },
  {
    name: "Help & Support",
    href: "#",
    icon: HelpCircle,
  },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-slate-200 flex flex-col z-50 shadow-sm"
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
        <Link href="/observability" className="flex items-center gap-3">
          {!isCollapsed ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <Image
                src="/Securelytix.svg"
                alt="Securelytix"
                width={140}
                height={28}
                className="h-7 w-auto"
                priority
              />
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
            >
              <Image
                src="/securelytixFavicon.svg"
                alt="Securelytix"
                width={31}
                height={31}
                className="w-8 h-8"
                priority
              />
            </motion.div>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-all"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {/* Primary Nav */}
        <div className="mb-6">
          {!isCollapsed && (
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Main Menu
            </p>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer",
                      isActive
                        ? "bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200"
                        : "hover:bg-slate-50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                        isActive
                          ? "bg-gradient-to-br from-[#024443] to-[#036E6E] shadow-lg shadow-[#036E6E]/20"
                          : "bg-slate-100 group-hover:bg-slate-200"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5",
                          isActive ? "text-white" : "text-slate-500"
                        )}
                      />
                    </div>
                    {!isCollapsed && (
                      <>
                        <span
                          className={cn(
                            "flex-1 font-medium",
                            isActive ? "text-[#024443]" : "text-slate-600"
                          )}
                        >
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-[#024443] border border-emerald-200">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Management section - commented out
        <div className="mb-6">
          {!isCollapsed && (
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Management
            </p>
          )}
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  // Add navigation logic here when routes are ready
                }}
                className="w-full text-left"
              >
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200 group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-all">
                    <item.icon className="w-5 h-5 text-slate-500" />
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-500">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </motion.div>
              </button>
            ))}
          </nav>
        </div>
        */}

        {/* Stats Card - Only show when expanded */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-1 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#024443] to-[#036E6E] flex items-center justify-center shadow-md">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Data Scanned</p>
                <p className="text-xs text-slate-500">This month</p>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">2.4</span>
              <span className="text-sm text-slate-500">TB</span>
              <span className="ml-auto text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                +12%
              </span>
            </div>
            <div className="mt-3 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "68%" }}
                transition={{ delay: 0.5, duration: 1 }}
                className="h-full bg-gradient-to-r from-[#036E6E] to-[#41C28D] rounded-full"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">68% of monthly quota</p>
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-slate-200 p-3">
        <nav className="space-y-1">
          {bottomNavItems.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                // Add navigation logic here when routes are ready
              }}
              className="w-full text-left"
            >
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-all">
                  <item.icon className="w-5 h-5 text-slate-500" />
                </div>
                {!isCollapsed && (
                  <span className="font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                    {item.name}
                  </span>
                )}
              </motion.div>
            </button>
          ))}
        </nav>
      </div>
    </motion.aside>
  );
}
