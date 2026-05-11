import { db } from "@/db";
import { therapies } from "@/db/schema";

export async function GET() {
  try {
    const result = await db.select().from(therapies);
    return Response.json(result);
  } catch {
    return Response.json({ error: "Failed to fetch therapies" }, { status: 500 });
  }
}
