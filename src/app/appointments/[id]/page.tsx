"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentStatusBadge } from "@/components/AppointmentStatusBadge";
import { useAppointment, useUpdateAppointment } from "@/hooks/use-appointments";
import Link from "next/link";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: appointment, isLoading, error } = useAppointment(id);
  const updateMutation = useUpdateAppointment();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-8">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <p className="text-destructive font-medium">Failed to load appointment</p>
            <p className="text-sm text-muted-foreground mt-1">{(error as Error).message}</p>
            <Link href="/appointments">
              <Button className="mt-4" variant="outline">
                Back to Appointments
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-lg font-medium text-muted-foreground">Appointment not found</p>
            <Link href="/appointments">
              <Button className="mt-4" variant="outline">
                Back to Appointments
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleStatusChange = (status: string) => {
    updateMutation.mutate(
      {
        id: appointment.id,
        status: status as "scheduled" | "in-progress" | "completed" | "cancelled",
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  };

  const showStart = appointment.status === "scheduled";
  const showComplete = appointment.status === "in-progress";
  const showCancel = appointment.status === "scheduled" || appointment.status === "in-progress";

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-4">
        <Link href="/appointments">
          <Button variant="outline" size="sm">
            &larr; Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Appointment</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-xl">{appointment.therapy.name}</CardTitle>
                <CardDescription>{formatDate(appointment.date)}</CardDescription>
              </div>
              <AppointmentStatusBadge status={appointment.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agent</p>
                <Link
                  href={`/agents/${appointment.agent.id}`}
                  className="text-sm font-medium hover:underline"
                >
                  {appointment.agent.name}
                </Link>
                <p className="text-xs text-muted-foreground">{appointment.agent.specialty}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ailment</p>
                <Link
                  href={`/ailments/${appointment.ailment.id}`}
                  className="text-sm font-medium hover:underline"
                >
                  {appointment.ailment.name}
                </Link>
                <p className="text-xs text-muted-foreground capitalize">
                  {appointment.ailment.severity} &middot; {appointment.ailment.category}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Therapy</p>
              <p className="text-sm">{appointment.therapy.description}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Duration: {appointment.therapy.duration}
              </p>
            </div>

            {appointment.therapy.sideEffects && appointment.therapy.sideEffects.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Side Effects</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  {appointment.therapy.sideEffects.map((effect, i) => (
                    <li key={i}>{effect}</li>
                  ))}
                </ul>
              </div>
            )}

            {appointment.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-sm">{appointment.notes}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              {showStart && (
                <Button
                  onClick={() => handleStatusChange("in-progress")}
                  disabled={updateMutation.isPending}
                >
                  Start Appointment
                </Button>
              )}
              {showComplete && (
                <Button
                  onClick={() => handleStatusChange("completed")}
                  disabled={updateMutation.isPending}
                >
                  Complete
                </Button>
              )}
              {showCancel && (
                <Button
                  onClick={() => {
                    if (confirm("Cancel this appointment?")) {
                      handleStatusChange("cancelled");
                    }
                  }}
                  variant="outline"
                  disabled={updateMutation.isPending}
                >
                  Cancel Appointment
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
