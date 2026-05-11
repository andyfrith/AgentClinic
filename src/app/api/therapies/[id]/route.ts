import { db } from "@/db";
import { therapies, ailments, ailmentTherapies } from "@/db/schema";
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
