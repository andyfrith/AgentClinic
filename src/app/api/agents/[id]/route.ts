import { db } from "@/db";
import { agents, ailments, agentAilments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireRole } from "@/app/api/_helpers/staff-auth";

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  avatar: z.string().max(255).optional(),
  specialty: z.string().max(255).optional(),
  status: z.string().max(50).optional(),
  bio: z.string().max(5000).optional(),
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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(request, ["editor", "admin"]);
  if (auth) return auth;

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

    const [existing] = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
    if (!existing) {
      return Response.json({ error: "Agent not found" }, { status: 404 });
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
      .update(agents)
      .set(bodyParsed.data)
      .where(eq(agents.id, id))
      .returning();

    return Response.json(updated);
  } catch {
    return Response.json({ error: "Failed to update agent" }, { status: 500 });
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
        { error: "Invalid agent ID", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id } = parsed.data;

    const [existing] = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
    if (!existing) {
      return Response.json({ error: "Agent not found" }, { status: 404 });
    }

    await db.delete(agents).where(eq(agents.id, id));
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete agent" }, { status: 500 });
  }
}
