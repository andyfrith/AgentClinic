import { db } from "@/db";
import { ailments } from "@/db/schema";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  severity: z.enum(["mild", "moderate", "severe"]),
  category: z.string().max(100),
});

export async function GET() {
  try {
    const result = await db.select().from(ailments);
    return Response.json(result);
  } catch {
    return Response.json({ error: "Failed to fetch ailments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [created] = await db.insert(ailments).values(parsed.data).returning();
    return Response.json(created, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create ailment" }, { status: 500 });
  }
}
