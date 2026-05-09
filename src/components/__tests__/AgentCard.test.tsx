import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AgentCard } from "../AgentCard";

const mockAgent = {
  id: 1,
  name: "Dr. Smith",
  avatar: "",
  specialty: "Cardiology",
  status: "active" as const,
  bio: "Experienced cardiologist with 15 years.",
};

describe("AgentCard", () => {
  it("renders agent name", () => {
    render(<AgentCard agent={mockAgent} />);
    expect(screen.getByText("Dr. Smith")).toBeInTheDocument();
  });

  it("renders agent specialty in a badge", () => {
    render(<AgentCard agent={mockAgent} />);
    expect(screen.getByText("Cardiology")).toBeInTheDocument();
  });

  it("renders agent bio", () => {
    render(<AgentCard agent={mockAgent} />);
    expect(
      screen.getByText("Experienced cardiologist with 15 years.")
    ).toBeInTheDocument();
  });

  it("renders avatar fallback with initials", () => {
    render(<AgentCard agent={mockAgent} />);
    expect(screen.getByText("DR")).toBeInTheDocument();
  });

  it("links to the agent detail page", () => {
    render(<AgentCard agent={mockAgent} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/agents/1");
  });

  it("uses avatar text when provided", () => {
    const agentWithAvatar = { ...mockAgent, avatar: "🧑‍⚕️" };
    render(<AgentCard agent={agentWithAvatar} />);
    expect(screen.getByText("🧑‍⚕️")).toBeInTheDocument();
  });
});
