import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppointmentStatusBadge } from "../AppointmentStatusBadge";

describe("AppointmentStatusBadge", () => {
  it("renders the status text", () => {
    render(<AppointmentStatusBadge status="scheduled" />);
    expect(screen.getByText("scheduled")).toBeInTheDocument();
  });

  it("renders all status variants", () => {
    const statuses = ["scheduled", "in-progress", "completed", "cancelled"];
    for (const s of statuses) {
      const { container } = render(<AppointmentStatusBadge status={s} />);
      expect(container.textContent).toBe(s);
    }
  });

  it("capitalizes the status text", () => {
    render(<AppointmentStatusBadge status="in-progress" />);
    expect(screen.getByText("in-progress")).toHaveClass("capitalize");
  });
});
