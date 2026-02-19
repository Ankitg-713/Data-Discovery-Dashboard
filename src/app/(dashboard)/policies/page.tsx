"use client";

import React from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { PolicyPage } from "@/components/PolicyPage";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Policies"
        subtitle="Role-based access policy from natural language"
      />
      <div className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <PolicyPage />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
