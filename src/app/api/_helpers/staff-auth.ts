import { db } from "@/db";
import { staff } from "@/db/schema";
import { eq } from "drizzle-orm";

export type StaffMember = {
  id: number;
  name: string;
  role: "admin" | "editor" | "viewer";
  avatar: string;
  specialties: string[];
};

export async function getStaffMember(request: Request): Promise<StaffMember | null> {
  const staffId = request.headers.get("x-staff-id");
  if (!staffId) return null;

  const id = parseInt(staffId, 10);
  if (isNaN(id)) return null;

  const [member] = await db.select().from(staff).where(eq(staff.id, id)).limit(1);
  if (!member) return null;

  return member;
}

export async function requireRole(
  request: Request,
  allowedRoles: string[]
): Promise<Response | null> {
  const member = await getStaffMember(request);
  if (!member) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }
  if (!allowedRoles.includes(member.role)) {
    return Response.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  return null;
}
