import { db } from "@/db";
import { agents, ailments, therapies, appointments, staff } from "@/db/schema";
import { eq, sql, and, gte, lt } from "drizzle-orm";

export async function GET() {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(startOfDay);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const [agentCount] = await db.select({ count: sql<number>`count(*)` }).from(agents);
    const [ailmentCount] = await db.select({ count: sql<number>`count(*)` }).from(ailments);
    const [therapyCount] = await db.select({ count: sql<number>`count(*)` }).from(therapies);
    const [appointmentCount] = await db.select({ count: sql<number>`count(*)` }).from(appointments);
    const [staffCount] = await db.select({ count: sql<number>`count(*)` }).from(staff);

    const todayAppointments = await db
      .select({
        id: appointments.id,
        date: appointments.date,
        status: appointments.status,
        notes: appointments.notes,
        agentName: agents.name,
        therapyName: therapies.name,
      })
      .from(appointments)
      .innerJoin(agents, eq(appointments.agentId, agents.id))
      .innerJoin(therapies, eq(appointments.therapyId, therapies.id))
      .where(and(gte(appointments.date, startOfDay), lt(appointments.date, startOfTomorrow)))
      .orderBy(appointments.date);

    const statusBreakdown = await db
      .select({
        status: appointments.status,
        count: sql<number>`count(*)`,
      })
      .from(appointments)
      .groupBy(appointments.status);

    return Response.json({
      agents: Number(agentCount.count),
      ailments: Number(ailmentCount.count),
      therapies: Number(therapyCount.count),
      appointments: Number(appointmentCount.count),
      staff: Number(staffCount.count),
      todayAppointments,
      statusBreakdown,
    });
  } catch {
    return Response.json({ error: "Failed to fetch overview stats" }, { status: 500 });
  }
}
