"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeverityBadge } from "./SeverityBadge";
import type { Ailment } from "@/db/schema";

export function AilmentCard({ ailment }: { ailment: Ailment }) {
  return (
    <Link href={`/ailments/${ailment.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg">{ailment.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <SeverityBadge severity={ailment.severity} />
                <Badge variant="secondary">{ailment.category}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">{ailment.description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
