export function getStaffId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("staff");
    if (stored) {
      const parsed = JSON.parse(stored);
      return String(parsed.id);
    }
  } catch {}
  return null;
}

export function authHeaders(): Record<string, string> {
  const id = getStaffId();
  return id ? { "x-staff-id": id } : {};
}
