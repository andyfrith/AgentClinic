import { db } from "@/db";
import { agents } from "@/db/schema";
import { z } from "zod";
import { requireRole } from "@/app/api/_helpers/staff-auth";

const querySchema = z.object({
  status: z.string().optional(),
});

const createSchema = z.object({
  name: z.string().min(1).max(255),
  avatar: z.string().max(255).optional(),
  specialty: z.string().max(255),
  status: z.string().max(50).optional(),
  bio: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    querySchema.parse(Object.fromEntries(searchParams));

    const result = await db.select().from(agents);
    return Response.json(result);
  } catch {
    return Response.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireRole(request, ["editor", "admin"]);
  if (auth) return auth;

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [created] = await db.insert(agents).values(parsed.data).returning();
    return Response.json(created, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create agent" }, { status: 500 });
  }
}
