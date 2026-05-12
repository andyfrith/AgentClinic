"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUpdateAppointment, useAssignStaff } from "@/hooks/use-appointments";

type StaffMember = {
  id: number;
  name: string;
  avatar: string;
  role: string;
  specialties: string[];
};

type AppointmentCardProps = {
  id: number;
  agentName: string;
  therapyName: string;
  date: string;
  status: string;
  assignedStaffId: number | null;
  staffList: StaffMember[];
};

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function StaffAppointmentCard({
  id,
  agentName,
  therapyName,
  date,
  status,
  assignedStaffId,
  staffList,
}: AppointmentCardProps) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const updateAppointment = useUpdateAppointment();
  const assignStaff = useAssignStaff();
  const isPending = updateAppointment.isPending || assignStaff.isPending;

  const handleAssign = (staffId: string | null) => {
    if (!staffId) return;
    assignStaff.mutate(
      { appointmentId: id, staffId: parseInt(staffId, 10) },
      {
        onSuccess: (data) => {
          toast.success(data.assigned ? "Staff assigned" : "Staff unassigned");
        },
        onError: () => {
          toast.error("Failed to update staff assignment");
        },
      }
    );
  };

  const handleStatusChange = (newStatus: string) => {
    updateAppointment.mutate(
      { id, status: newStatus as "scheduled" | "in-progress" | "completed" | "cancelled" },
      {
        onSuccess: () => {
          const labels: Record<string, string> = {
            "in-progress": "Appointment started",
            completed: "Appointment completed",
            cancelled: "Appointment cancelled",
          };
          toast.success(labels[newStatus] || "Status updated");
        },
        onError: () => {
          toast.error("Failed to update status");
        },
      }
    );
    setCancelOpen(false);
  };

  const handleReschedule = () => {
    if (!rescheduleDate) return;
    updateAppointment.mutate(
      { id, date: new Date(rescheduleDate).toISOString() },
      {
        onSuccess: () => {
          toast.success("Appointment rescheduled");
          setRescheduleDate("");
        },
        onError: () => {
          toast.error("Failed to reschedule");
        },
      }
    );
  };

  return (
    <motion.div
      layout
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border"
    >
      <div className="min-w-0">
        <div className="font-medium truncate">{agentName}</div>
        <div className="text-sm text-muted-foreground">{therapyName}</div>
        <div className="text-xs text-muted-foreground">
          {new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge className={statusColors[status] || ""}>{status}</Badge>

        <Select
          value={assignedStaffId ? String(assignedStaffId) : ""}
          onValueChange={handleAssign}
          disabled={isPending}
        >
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Assign staff" />
          </SelectTrigger>
          <SelectContent>
            {staffList.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {status === "scheduled" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusChange("in-progress")}
            disabled={isPending}
          >
            Start
          </Button>
        )}

        {status === "in-progress" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusChange("completed")}
            disabled={isPending}
          >
            Complete
          </Button>
        )}

        {(status === "scheduled" || status === "in-progress") && (
          <input
            type="date"
            value={rescheduleDate}
            onChange={(e) => setRescheduleDate(e.target.value)}
            className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
            disabled={isPending}
          />
        )}

        {(status === "scheduled" || status === "in-progress") && rescheduleDate && (
          <Button size="sm" variant="outline" onClick={handleReschedule} disabled={isPending}>
            Set
          </Button>
        )}

        {(status === "scheduled" || status === "in-progress") && (
          <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
            <DialogTrigger
              render={
                <Button size="sm" variant="destructive" disabled={isPending}>
                  Cancel
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Appointment</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel this appointment for {agentName}?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCancelOpen(false)}>
                  Keep
                </Button>
                <Button variant="destructive" onClick={() => handleStatusChange("cancelled")}>
                  Yes, cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </motion.div>
  );
}
