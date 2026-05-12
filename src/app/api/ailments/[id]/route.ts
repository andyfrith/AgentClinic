import { db } from "@/db";
import { ailments, agents, agentAilments, therapies, ailmentTherapies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireRole } from "@/app/api/_helpers/staff-auth";

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  severity: z.enum(["mild", "moderate", "severe"]).optional(),
  category: z.string().max(100).optional(),
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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, ["editor", "admin"]);
  if (auth) return auth;

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

    const [existing] = await db.select().from(ailments).where(eq(ailments.id, id)).limit(1);
    if (!existing) {
      return Response.json({ error: "Ailment not found" }, { status: 404 });
    }

    const body = await request.json();
    const bodyParsed = updateSchema.safeParse(body);

    if (!bodyParsed.success) {
      return Response.json(
        { error: "Invalid input", details: bodyParsed.error.flatten() },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(ailments)
      .set({ ...bodyParsed.data, updatedAt: new Date() })
      .where(eq(ailments.id, id))
      .returning();

    return Response.json(updated);
  } catch {
    return Response.json({ error: "Failed to update ailment" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, ["editor", "admin"]);
  if (auth) return auth;

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

    const [existing] = await db.select().from(ailments).where(eq(ailments.id, id)).limit(1);
    if (!existing) {
      return Response.json({ error: "Ailment not found" }, { status: 404 });
    }

    await db.delete(ailments).where(eq(ailments.id, id));
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete ailment" }, { status: 500 });
  }
}
