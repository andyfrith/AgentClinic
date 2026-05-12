"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useOverviewStats } from "@/hooks/use-stats";
import { useStaffList } from "@/hooks/use-staff";
import { useStaff } from "@/contexts/StaffContext";
import { StaffAppointmentCard } from "@/components/StaffAppointmentCard";

const quickLinks = [
  { href: "/staff/agents", label: "Manage Agents", desc: "Add, edit, or remove agents" },
  { href: "/staff/ailments", label: "Manage Ailments", desc: "Add, edit, or remove ailments" },
  { href: "/staff/therapies", label: "Manage Therapies", desc: "Add, edit, or remove therapies" },
];

export default function StaffDashboardPage() {
  const { data: stats, isLoading, error } = useOverviewStats();
  const { data: staffList } = useStaffList();
  const { staff, canEdit } = useStaff();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          Failed to load dashboard
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Agents", value: stats?.agents ?? 0, href: "/agents" },
    { label: "Ailments", value: stats?.ailments ?? 0, href: "/ailments" },
    { label: "Therapies", value: stats?.therapies ?? 0, href: "/therapies" },
    { label: "Appointments", value: stats?.appointments ?? 0, href: "/appointments" },
    { label: "Staff", value: stats?.staff ?? 0, href: "/staff" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {staff ? `${staff.name}'s Dashboard` : "Staff Dashboard"}
          </h1>
          {staff && (
            <span className="text-xs capitalize px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
              {staff.role}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          {statCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="p-4 rounded-lg border hover:border-primary transition-colors"
            >
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-sm text-muted-foreground">{card.label}</div>
            </Link>
          ))}
        </div>

        {stats?.todayAppointments && stats.todayAppointments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Today&apos;s Appointments</h2>
            <div className="space-y-3">
              {stats.todayAppointments.map((apt) => (
                <StaffAppointmentCard
                  key={apt.id}
                  id={apt.id}
                  agentName={apt.agentName}
                  therapyName={apt.therapyName}
                  date={apt.date}
                  status={apt.status}
                  assignedStaffId={apt.assignedStaffId ?? null}
                  staffList={staffList ?? []}
                />
              ))}
            </div>
          </div>
        )}

        {canEdit && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="p-4 rounded-lg border hover:border-primary transition-colors"
                >
                  <div className="font-medium">{link.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">{link.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
