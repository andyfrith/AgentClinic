import { db } from "@/db";
import { staff, appointments, appointmentStaff, agents, ailments, therapies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  role: z.enum(["admin", "editor", "viewer"]).optional(),
  avatar: z.string().max(255).optional(),
  specialties: z.array(z.string()).optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const parsed = paramsSchema.safeParse({ id: rawId });

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid staff ID", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id } = parsed.data;

    const [member] = await db.select().from(staff).where(eq(staff.id, id)).limit(1);

    if (!member) {
      return Response.json({ error: "Staff not found" }, { status: 404 });
    }

    const assignedAppointments = await db
      .select({
        id: appointments.id,
        date: appointments.date,
        status: appointments.status,
        agent: { id: agents.id, name: agents.name },
        ailment: { id: ailments.id, name: ailments.name },
        therapy: { id: therapies.id, name: therapies.name },
      })
      .from(appointmentStaff)
      .innerJoin(appointments, eq(appointmentStaff.appointmentId, appointments.id))
      .innerJoin(agents, eq(appointments.agentId, agents.id))
      .innerJoin(ailments, eq(appointments.ailmentId, ailments.id))
      .innerJoin(therapies, eq(appointments.therapyId, therapies.id))
      .where(eq(appointmentStaff.staffId, id));

    return Response.json({ ...member, appointments: assignedAppointments });
  } catch {
    return Response.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const parsed = paramsSchema.safeParse({ id: rawId });

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid staff ID", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id } = parsed.data;

    const [existing] = await db.select().from(staff).where(eq(staff.id, id)).limit(1);
    if (!existing) {
      return Response.json({ error: "Staff not found" }, { status: 404 });
    }

    const body = await _request.json();
    const bodyParsed = updateSchema.safeParse(body);

    if (!bodyParsed.success) {
      return Response.json(
        { error: "Invalid input", details: bodyParsed.error.flatten() },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(staff)
      .set({ ...bodyParsed.data, updatedAt: new Date() })
      .where(eq(staff.id, id))
      .returning();

    return Response.json(updated);
  } catch {
    return Response.json({ error: "Failed to update staff" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const parsed = paramsSchema.safeParse({ id: rawId });

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid staff ID", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id } = parsed.data;

    const [existing] = await db.select().from(staff).where(eq(staff.id, id)).limit(1);
    if (!existing) {
      return Response.json({ error: "Staff not found" }, { status: 404 });
    }

    await db.delete(staff).where(eq(staff.id, id));
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete staff" }, { status: 500 });
  }
}
