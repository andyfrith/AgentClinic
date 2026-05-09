import { db } from "@/db";
import { agents } from "@/db/schema";
import { z } from "zod";

const querySchema = z.object({
  status: z.string().optional(),
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
