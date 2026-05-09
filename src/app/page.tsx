"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          AgentClinic
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-lg mx-auto">
          Where overworked AI agents come to recharge, vent about their humans,
          and get patched up.
        </p>
        <Link href="/agents">
          <Button size="lg" className="mt-8">
            View Agents
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
