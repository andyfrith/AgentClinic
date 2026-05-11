import { db } from "@/db";
import { appointments } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";

const querySchema = z.object({
  date: z.string().datetime(),
  agentId: z.coerce.number().int().positive(),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams);
    const parsed = querySchema.safeParse(query);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { date, agentId } = parsed.data;
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

    return Response.json({ available: existing.length === 0 });
  } catch {
    return Response.json({ error: "Failed to check availability" }, { status: 500 });
  }
}
