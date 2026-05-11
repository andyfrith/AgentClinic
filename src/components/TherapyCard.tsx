"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Therapy } from "@/db/schema";

export function TherapyCard({ therapy }: { therapy: Therapy }) {
  return (
    <Link href={`/therapies/${therapy.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg">{therapy.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{therapy.duration}</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">{therapy.description}</p>
            {therapy.sideEffects.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-muted-foreground mb-1">Side effects:</p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {therapy.sideEffects.slice(0, 2).map((effect, i) => (
                    <li key={i} className="line-clamp-1">
                      &bull; {effect}
                    </li>
                  ))}
                  {therapy.sideEffects.length > 2 && (
                    <li className="text-muted-foreground/60">
                      +{therapy.sideEffects.length - 2} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
