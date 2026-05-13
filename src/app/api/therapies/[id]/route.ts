import { db } from "@/db";
import { therapies, ailments, ailmentTherapies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireRole } from "@/app/api/_helpers/staff-auth";

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional(),
  duration: z.string().max(100).optional(),
  sideEffects: z.array(z.string()).optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const parsed = paramsSchema.safeParse({ id: rawId });

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid therapy ID", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id } = parsed.data;

    const [therapy] = await db.select().from(therapies).where(eq(therapies.id, id)).limit(1);

    if (!therapy) {
      return Response.json({ error: "Therapy not found" }, { status: 404 });
    }

    const linkedAilments = await db
      .select({
        id: ailments.id,
        name: ailments.name,
        description: ailments.description,
        severity: ailments.severity,
        category: ailments.category,
      })
      .from(ailmentTherapies)
      .innerJoin(ailments, eq(ailmentTherapies.ailmentId, ailments.id))
      .where(eq(ailmentTherapies.therapyId, id));

    return Response.json({ ...therapy, ailments: linkedAilments });
  } catch {
    return Response.json({ error: "Failed to fetch therapy" }, { status: 500 });
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
        { error: "Invalid therapy ID", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id } = parsed.data;

    const [existing] = await db.select().from(therapies).where(eq(therapies.id, id)).limit(1);
    if (!existing) {
      return Response.json({ error: "Therapy not found" }, { status: 404 });
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
      .update(therapies)
      .set({ ...bodyParsed.data, updatedAt: new Date() })
      .where(eq(therapies.id, id))
      .returning();

    return Response.json(updated);
  } catch {
    return Response.json({ error: "Failed to update therapy" }, { status: 500 });
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
        { error: "Invalid therapy ID", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id } = parsed.data;

    const [existing] = await db.select().from(therapies).where(eq(therapies.id, id)).limit(1);
    if (!existing) {
      return Response.json({ error: "Therapy not found" }, { status: 404 });
    }

    await db.delete(therapies).where(eq(therapies.id, id));
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete therapy" }, { status: 500 });
  }
}
