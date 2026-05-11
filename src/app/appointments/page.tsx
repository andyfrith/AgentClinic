"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentStatusBadge } from "@/components/AppointmentStatusBadge";
import { useAppointments } from "@/hooks/use-appointments";
import type { Appointment } from "@/hooks/use-appointments";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <Link href={`/appointments/${appointment.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">
                {appointment.agent.name} &mdash; {appointment.therapy.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{formatDate(appointment.date)}</p>
            </div>
            <AppointmentStatusBadge status={appointment.status} />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {appointment.ailment.name}
              {appointment.notes ? ` — ${appointment.notes}` : ""}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

export default function AppointmentsPage() {
  const { data: appointments, isLoading, error } = useAppointments();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <p className="text-destructive font-medium">Failed to load appointments</p>
            <p className="text-sm text-muted-foreground mt-1">{(error as Error).message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <Link href="/appointments/new">
          <Button>New Appointment</Button>
        </Link>
      </div>

      {!appointments || appointments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-lg font-medium text-muted-foreground">No appointments yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Book your first appointment to get started.
            </p>
            <Link href="/appointments/new">
              <Button className="mt-4">Book an Appointment</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
}
