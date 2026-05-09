"use client";

import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  active: "bg-green-500",
  idle: "bg-yellow-400",
  busy: "bg-red-500",
  offline: "bg-gray-400",
};

export function StatusIndicator({ status }: { status: string }) {
  const color = statusColors[status] ?? "bg-gray-400";

  return (
    <motion.span
      className={`inline-block h-3 w-3 rounded-full ${color}`}
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      title={status}
    />
  );
}
