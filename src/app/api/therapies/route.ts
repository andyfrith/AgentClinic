import { db } from "@/db";
import { therapies } from "@/db/schema";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  duration: z.string().max(100),
  sideEffects: z.array(z.string()).optional(),
});

export async function GET() {
  try {
    const result = await db.select().from(therapies);
    return Response.json(result);
  } catch {
    return Response.json({ error: "Failed to fetch therapies" }, { status: 500 });
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

    const [created] = await db.insert(therapies).values(parsed.data).returning();
    return Response.json(created, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create therapy" }, { status: 500 });
  }
}
