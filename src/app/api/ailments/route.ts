import { db } from "@/db";
import { ailments } from "@/db/schema";

export async function GET() {
  try {
    const result = await db.select().from(ailments);
    return Response.json(result);
  } catch {
    return Response.json({ error: "Failed to fetch ailments" }, { status: 500 });
  }
}
