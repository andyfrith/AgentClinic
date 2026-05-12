import { db } from "@/db";
import { appointments, agents, ailments, therapies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireRole } from "@/app/api/_helpers/staff-auth";

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const updateSchema = z.object({
  status: z.enum(["scheduled", "in-progress", "completed", "cancelled"]).optional(),
  notes: z.string().optional(),
  date: z.string().datetime().optional(),
});

const validTransitions: Record<string, string[]> = {
  scheduled: ["in-progress", "cancelled"],
  "in-progress": ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const [appointment] = await db
      .select({
        id: appointments.id,
        date: appointments.date,
        status: appointments.status,
        notes: appointments.notes,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        agent: {
          id: agents.id,
          name: agents.name,
          avatar: agents.avatar,
          specialty: agents.specialty,
          status: agents.status,
        },
        ailment: {
          id: ailments.id,
          name: ailments.name,
          severity: ailments.severity,
          category: ailments.category,
          description: ailments.description,
        },
        therapy: {
          id: therapies.id,
          name: therapies.name,
          description: therapies.description,
          duration: therapies.duration,
          sideEffects: therapies.sideEffects,
        },
      })
      .from(appointments)
      .innerJoin(agents, eq(appointments.agentId, agents.id))
      .innerJoin(ailments, eq(appointments.ailmentId, ailments.id))
      .innerJoin(therapies, eq(appointments.therapyId, therapies.id))
      .where(eq(appointments.id, id))
      .limit(1);

    if (!appointment) {
      return Response.json({ error: "Appointment not found" }, { status: 404 });
    }

    return Response.json(appointment);
  } catch {
    return Response.json({ error: "Failed to fetch appointment" }, { status: 500 });
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
        { error: "Invalid appointment ID", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id } = parsed.data;

    const [existing] = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);

    if (!existing) {
      return Response.json({ error: "Appointment not found" }, { status: 404 });
    }

    const body = await request.json();
    const updateParsed = updateSchema.safeParse(body);

    if (!updateParsed.success) {
      return Response.json(
        { error: "Invalid input", details: updateParsed.error.flatten() },
        { status: 400 }
      );
    }

    const updateData = updateParsed.data;

    if (updateData.status) {
      const allowed = validTransitions[existing.status];
      if (!allowed.includes(updateData.status)) {
        return Response.json(
          {
            error: `Cannot transition from '${existing.status}' to '${updateData.status}'`,
            allowedTransitions: allowed,
          },
          { status: 400 }
        );
      }
    }

    const updateValues: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    if (updateData.status) updateValues.status = updateData.status;
    if (updateData.notes !== undefined) updateValues.notes = updateData.notes;
    if (updateData.date) updateValues.date = new Date(updateData.date);

    const [updated] = await db
      .update(appointments)
      .set(updateValues)
      .where(eq(appointments.id, id))
      .returning();

    return Response.json(updated);
  } catch {
    return Response.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}
