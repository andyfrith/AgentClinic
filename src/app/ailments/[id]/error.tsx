"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AilmentDetailError({
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl px-4 py-8"
    >
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-destructive font-medium mb-2">Failed to load ailment</p>
        <p className="text-sm text-muted-foreground mb-4">Please try again or go back.</p>
        <div className="flex justify-center gap-3">
          <Button onClick={reset} variant="outline">
            Try Again
          </Button>
          <Link href="/ailments">
            <Button variant="outline">Back to Ailments</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
