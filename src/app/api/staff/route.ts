import { db } from "@/db";
import { staff } from "@/db/schema";
import { z } from "zod";
import { requireRole } from "@/app/api/_helpers/staff-auth";

const createSchema = z.object({
  name: z.string().min(1).max(255),
  role: z.enum(["admin", "editor", "viewer"]),
  avatar: z.string().max(255).optional(),
  specialties: z.array(z.string()).optional(),
});

export async function GET() {
  try {
    const result = await db.select().from(staff);
    return Response.json(result);
  } catch {
    return Response.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireRole(request, ["admin"]);
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

    const [created] = await db.insert(staff).values(parsed.data).returning();
    return Response.json(created, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create staff" }, { status: 500 });
  }
}
