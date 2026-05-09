"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusIndicator } from "./StatusIndicator";
import type { Agent } from "@/db/schema";

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link href={`/agents/${agent.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-lg font-semibold">
                {agent.avatar || agent.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <Badge variant="secondary">{agent.specialty}</Badge>
            </div>
            <StatusIndicator status={agent.status} />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {agent.bio}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
