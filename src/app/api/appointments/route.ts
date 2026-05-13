import { db } from "@/db";
import { appointments, agents, ailments, therapies } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { z } from "zod";
import { requireRole } from "@/app/api/_helpers/staff-auth";
import { rateLimitMiddleware } from "@/lib/rate-limit";

const createSchema = z.object({
  agentId: z.number().int().positive(),
  ailmentId: z.number().int().positive(),
  therapyId: z.number().int().positive(),
  date: z.string().datetime(),
  notes: z.string().max(5000).optional(),
});

export async function GET() {
  try {
    const result = await db
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
        },
        therapy: {
          id: therapies.id,
          name: therapies.name,
          duration: therapies.duration,
        },
      })
      .from(appointments)
      .innerJoin(agents, eq(appointments.agentId, agents.id))
      .innerJoin(ailments, eq(appointments.ailmentId, ailments.id))
      .innerJoin(therapies, eq(appointments.therapyId, therapies.id))
      .orderBy(desc(appointments.date));

    return Response.json(result);
  } catch {
    return Response.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireRole(request, ["editor", "admin"]);
  if (auth) return auth;

  const rate = rateLimitMiddleware(request);
  if (rate) return rate;

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { agentId, ailmentId, therapyId, date, notes } = parsed.data;

    const appointmentDate = new Date(date);

    const existing = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.agentId, agentId),
          eq(appointments.date, appointmentDate),
          sql`${appointments.status} != 'cancelled'`
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return Response.json({ error: "Time slot already booked for this agent" }, { status: 409 });
    }

    const [created] = await db
      .insert(appointments)
      .values({
        agentId,
        ailmentId,
        therapyId,
        date: appointmentDate,
        notes: notes ?? "",
      })
      .returning();

    return Response.json(created, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
