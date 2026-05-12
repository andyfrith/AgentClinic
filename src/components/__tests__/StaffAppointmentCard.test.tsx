import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StaffAppointmentCard } from "../StaffAppointmentCard";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/hooks/use-appointments", () => ({
  useUpdateAppointment: () => ({ mutate: vi.fn(), isPending: false }),
  useAssignStaff: () => ({ mutate: vi.fn(), isPending: false }),
}));

const mockStaffList = [
  { id: 1, name: "Dr. Ada", avatar: "DA", role: "admin", specialties: ["Cognitive"] },
  { id: 2, name: "Dr. Bob", avatar: "BB", role: "editor", specialties: ["Runtime"] },
];

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("StaffAppointmentCard", () => {
  const baseProps = {
    id: 1,
    agentName: "Claude",
    therapyName: "Prompt Therapy",
    date: "2026-05-12T10:00:00.000Z",
    status: "scheduled",
    assignedStaffId: null,
    staffList: mockStaffList,
  };

  it("renders agent name and therapy name", () => {
    renderWithQuery(<StaffAppointmentCard {...baseProps} />);
    expect(screen.getByText("Claude")).toBeInTheDocument();
    expect(screen.getByText("Prompt Therapy")).toBeInTheDocument();
  });

  it("renders status badge", () => {
    renderWithQuery(<StaffAppointmentCard {...baseProps} />);
    expect(screen.getByText("scheduled")).toBeInTheDocument();
  });

  it("renders staff assignment dropdown", () => {
    renderWithQuery(<StaffAppointmentCard {...baseProps} />);
    expect(screen.getByText("Assign staff")).toBeInTheDocument();
  });

  it("shows Start button for scheduled appointments", () => {
    renderWithQuery(<StaffAppointmentCard {...baseProps} />);
    expect(screen.getByText("Start")).toBeInTheDocument();
  });

  it("shows Complete button for in-progress appointments", () => {
    renderWithQuery(<StaffAppointmentCard {...baseProps} status="in-progress" />);
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it("shows Cancel button for non-terminal appointments", () => {
    renderWithQuery(<StaffAppointmentCard {...baseProps} />);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("does not show Cancel button for completed appointments", () => {
    renderWithQuery(<StaffAppointmentCard {...baseProps} status="completed" />);
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
  });

  it("does not show Cancel button for cancelled appointments", () => {
    renderWithQuery(<StaffAppointmentCard {...baseProps} status="cancelled" />);
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
  });

  it("shows reschedule date input for scheduled appointments", () => {
    renderWithQuery(<StaffAppointmentCard {...baseProps} />);
    const dateInput = document.querySelector('input[type="date"]');
    expect(dateInput).toBeInTheDocument();
  });
});
