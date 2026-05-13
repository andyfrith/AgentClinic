import { db } from "@/db";
import { agents } from "@/db/schema";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  const checks: Record<string, string> = {};
  
  try {
    const sql = neon(process.env.DATABASE_URL || "");
    const result = await sql`SELECT 1 as ping`;
    checks.dbConn = "ok: " + JSON.stringify(result);
  } catch (e: any) {
    checks.dbConn = "fail: " + e.message;
  }

  try {
    const agentList = await db.select().from(agents);
    checks.agents = `count=${agentList.length}`;
  } catch (e: any) {
    checks.agents = "fail: " + e.message;
  }

  return Response.json({
    hasDbUrl: !!process.env.DATABASE_URL,
    dbUrlPrefix: (process.env.DATABASE_URL || "").substring(0, 25),
    ...checks,
  });
}
