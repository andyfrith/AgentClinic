import { db } from "@/db";
import { appointmentStaff } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const assignSchema = z.object({
  staffId: z.number().int().positive(),
});

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const parsed = paramsSchema.safeParse({ id: rawId });

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid appointment ID", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id } = parsed.data;
    const body = await _request.json();
    const bodyParsed = assignSchema.safeParse(body);

    if (!bodyParsed.success) {
      return Response.json(
        { error: "Invalid input", details: bodyParsed.error.flatten() },
        { status: 400 }
      );
    }

    const { staffId } = bodyParsed.data;

    const [existing] = await db
      .select()
      .from(appointmentStaff)
      .where(and(eq(appointmentStaff.appointmentId, id), eq(appointmentStaff.staffId, staffId)))
      .limit(1);

    if (existing) {
      await db
        .delete(appointmentStaff)
        .where(and(eq(appointmentStaff.appointmentId, id), eq(appointmentStaff.staffId, staffId)));
      return Response.json({ assigned: false });
    }

    await db.insert(appointmentStaff).values({
      appointmentId: id,
      staffId,
    });

    return Response.json({ assigned: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to assign staff" }, { status: 500 });
  }
}
