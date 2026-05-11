import { db } from "@/db";
import { agents, ailments, agentAilments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const parsed = paramsSchema.safeParse({ id: rawId });

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid agent ID", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id } = parsed.data;

    const [agent] = await db.select().from(agents).where(eq(agents.id, id)).limit(1);

    if (!agent) {
      return Response.json({ error: "Agent not found" }, { status: 404 });
    }

    const agentAilmentsList = await db
      .select({
        id: ailments.id,
        name: ailments.name,
        severity: ailments.severity,
        category: ailments.category,
        diagnosedAt: agentAilments.diagnosedAt,
        notes: agentAilments.notes,
      })
      .from(agentAilments)
      .innerJoin(ailments, eq(agentAilments.ailmentId, ailments.id))
      .where(eq(agentAilments.agentId, id));

    return Response.json({ ...agent, ailments: agentAilmentsList });
  } catch {
    return Response.json({ error: "Failed to fetch agent" }, { status: 500 });
  }
}
