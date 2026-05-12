"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-md px-4 py-20 text-center"
    >
      <h1 className="text-2xl font-bold text-destructive mb-3">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">An unexpected error occurred. Please try again.</p>
      <Button onClick={reset}>Try Again</Button>
    </motion.div>
  );
}
