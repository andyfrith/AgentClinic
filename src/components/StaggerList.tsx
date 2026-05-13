"use client";

import { motion, type Variants } from "framer-motion";
import { Children, cloneElement, isValidElement, type ReactNode } from "react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export function StaggerList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {Children.map(children, (child) =>
        isValidElement(child) ? (
          <motion.div variants={itemVariants}>{cloneElement(child)}</motion.div>
        ) : (
          child
        )
      )}
    </motion.div>
  );
}
