"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateAppointment } from "@/hooks/use-appointments";
import { useAgents } from "@/hooks/use-agents";
import Link from "next/link";

function toDatetimeLocal(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function getMinDate() {
  const d = new Date();
  d.setHours(d.getHours() + 1, 0, 0, 0);
  return toDatetimeLocal(d);
}

export default function NewAppointmentPage() {
  const router = useRouter();
  const createMutation = useCreateAppointment();
  const { data: agents, isLoading: agentsLoading } = useAgents();

  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [selectedAilmentId, setSelectedAilmentId] = useState("");
  const [selectedTherapyId, setSelectedTherapyId] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const [agentAilments, setAgentAilments] = useState<
    Array<{ id: number; name: string; severity: string; category: string }>
  >([]);
  const [availableTherapies, setAvailableTherapies] = useState<
    Array<{ id: number; name: string; duration: string }>
  >([]);

  const handleAgentChange = async (agentId: string) => {
    setSelectedAgentId(agentId);
    setSelectedAilmentId("");
    setSelectedTherapyId("");
    setAvailableTherapies([]);
    setError("");

    if (!agentId) {
      setAgentAilments([]);
      return;
    }

    try {
      const res = await fetch(`/api/agents/${agentId}`);
      if (res.ok) {
        const data = await res.json();
        setAgentAilments(data.ailments ?? []);
      }
    } catch {
      setAgentAilments([]);
    }
  };

  const handleAilmentChange = async (ailmentId: string) => {
    setSelectedAilmentId(ailmentId);
    setSelectedTherapyId("");
    setError("");

    if (!ailmentId) {
      setAvailableTherapies([]);
      return;
    }

    try {
      const res = await fetch(`/api/ailments/${ailmentId}`);
      if (res.ok) {
        const data = await res.json();
        setAvailableTherapies(data.therapies ?? []);
      }
    } catch {
      setAvailableTherapies([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedAgentId || !selectedAilmentId || !selectedTherapyId || !date) {
      setError("Please fill in all required fields");
      return;
    }

    const selectedDate = new Date(date);
    if (selectedDate <= new Date()) {
      setError("Please select a future date and time");
      return;
    }

    try {
      const availRes = await fetch(
        `/api/appointments/availability?date=${encodeURIComponent(selectedDate.toISOString())}&agentId=${selectedAgentId}`
      );
      const availData = await availRes.json();
      if (!availData.available) {
        setError("This time slot is already booked. Please choose another time.");
        return;
      }
    } catch {
      // proceed, server validates too
    }

    createMutation.mutate(
      {
        agentId: Number(selectedAgentId),
        ailmentId: Number(selectedAilmentId),
        therapyId: Number(selectedTherapyId),
        date: selectedDate.toISOString(),
        notes: notes || undefined,
      },
      {
        onSuccess: (data) => {
          router.push(`/appointments/${data.id}`);
        },
        onError: (err) => {
          setError(err.message);
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-4">
        <Link href="/appointments">
          <Button variant="outline" size="sm">
            &larr; Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">New Appointment</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book a Therapy Session</CardTitle>
          <CardDescription>
            Select an agent, their ailment, a therapy, and a date to book an appointment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="agent" className="text-sm font-medium">
                Agent
              </label>
              {agentsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <select
                  id="agent"
                  value={selectedAgentId}
                  onChange={(e) => handleAgentChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select an agent...</option>
                  {agents?.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} &mdash; {agent.specialty}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="ailment" className="text-sm font-medium">
                Ailment
              </label>
              <select
                id="ailment"
                value={selectedAilmentId}
                onChange={(e) => handleAilmentChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!selectedAgentId}
                required
              >
                <option value="">
                  {selectedAgentId ? "Select an ailment..." : "Select an agent first"}
                </option>
                {agentAilments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.severity})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="therapy" className="text-sm font-medium">
                Therapy
              </label>
              <select
                id="therapy"
                value={selectedTherapyId}
                onChange={(e) => setSelectedTherapyId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!selectedAilmentId}
                required
              >
                <option value="">
                  {selectedAilmentId ? "Select a therapy..." : "Select an ailment first"}
                </option>
                {availableTherapies.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.duration})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date &amp; Time
              </label>
              <input
                type="datetime-local"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={getMinDate()}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Any additional notes..."
              />
            </div>

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}

            <div className="flex gap-3">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Booking..." : "Book Appointment"}
              </Button>
              <Link href="/appointments">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
