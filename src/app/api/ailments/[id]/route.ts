import { db } from "@/db";
import { ailments, agents, agentAilments, therapies, ailmentTherapies } from "@/db/schema";
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
        { error: "Invalid ailment ID", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id } = parsed.data;

    const [ailment] = await db.select().from(ailments).where(eq(ailments.id, id)).limit(1);

    if (!ailment) {
      return Response.json({ error: "Ailment not found" }, { status: 404 });
    }

    const linkedAgents = await db
      .select({
        id: agents.id,
        name: agents.name,
        avatar: agents.avatar,
        specialty: agents.specialty,
        status: agents.status,
        bio: agents.bio,
        diagnosedAt: agentAilments.diagnosedAt,
        notes: agentAilments.notes,
      })
      .from(agentAilments)
      .innerJoin(agents, eq(agentAilments.agentId, agents.id))
      .where(eq(agentAilments.ailmentId, id));

    const linkedTherapies = await db
      .select({
        id: therapies.id,
        name: therapies.name,
        description: therapies.description,
        duration: therapies.duration,
        sideEffects: therapies.sideEffects,
      })
      .from(ailmentTherapies)
      .innerJoin(therapies, eq(ailmentTherapies.therapyId, therapies.id))
      .where(eq(ailmentTherapies.ailmentId, id));

    return Response.json({ ...ailment, agents: linkedAgents, therapies: linkedTherapies });
  } catch {
    return Response.json({ error: "Failed to fetch ailment" }, { status: 500 });
  }
}
