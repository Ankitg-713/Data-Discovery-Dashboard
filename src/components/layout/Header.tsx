"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "New sensitive data detected",
      message: "15 PII records found in AWS S3 bucket",
      time: "2 min ago",
      type: "warning",
    },
    {
      id: 2,
      title: "Scan completed",
      message: "Database scan finished successfully",
      time: "15 min ago",
      type: "success",
    },
    {
      id: 3,
      title: "Access anomaly detected",
      message: "Unusual access pattern from user john@company.com",
      time: "1 hour ago",
      type: "danger",
    },
  ];

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Title Section */}
      <div>
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all outline-none text-sm"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs text-slate-400 bg-white border border-slate-200 rounded">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
              3
            </span>
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-14 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">Notifications</h3>
                    <button className="text-xs text-cyan-600 hover:text-cyan-700 transition-colors">
                      Mark all read
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === "warning"
                              ? "bg-amber-500"
                              : notification.type === "success"
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-slate-50">
                  <button className="w-full py-2 text-sm text-cyan-600 hover:text-cyan-700 transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-slate-700">{user?.name || "User"}</p>
              <p className="text-xs text-slate-500">{user?.role || "Admin"}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </motion.button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-14 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100">
                  <p className="font-medium text-slate-800">{user?.name}</p>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all">
                    <HelpCircle className="w-4 h-4" />
                    <span className="text-sm">Help & Support</span>
                  </button>
                </div>
                <div className="p-2 border-t border-slate-100">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Log out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
}
