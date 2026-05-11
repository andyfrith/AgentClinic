"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type StaffMember = {
  id: number;
  name: string;
  role: "admin" | "editor" | "viewer";
  avatar: string;
  specialties: string[];
};

type StaffContextType = {
  staff: StaffMember | null;
  setStaff: (staff: StaffMember | null) => void;
  isEditor: boolean;
  isAdmin: boolean;
  canEdit: boolean;
  hydrated: boolean;
};

const StaffContext = createContext<StaffContextType>({
  staff: null,
  setStaff: () => {},
  isEditor: false,
  isAdmin: false,
  canEdit: false,
  hydrated: false,
});

export function StaffProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const stored = localStorage.getItem("staff");
      if (stored) {
        setStaff(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem("staff");
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const handleSetStaff = (s: StaffMember | null) => {
    setStaff(s);
    if (s) {
      localStorage.setItem("staff", JSON.stringify(s));
    } else {
      localStorage.removeItem("staff");
    }
  };

  const role = staff?.role ?? "viewer";
  const isEditor = role === "editor" || role === "admin";
  const isAdmin = role === "admin";
  const canEdit = isEditor || isAdmin;

  return (
    <StaffContext.Provider
      value={{ staff, setStaff: handleSetStaff, isEditor, isAdmin, canEdit, hydrated }}
    >
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  return useContext(StaffContext);
}
