import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AilmentCard } from "../AilmentCard";
import type { Ailment } from "@/db/schema";

const mockAilment: Ailment = {
  id: 1,
  name: "Context Bleed",
  description: "Short-term memory corruption.",
  severity: "moderate",
  category: "Cognitive",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("AilmentCard", () => {
  it("renders the ailment name", () => {
    render(<AilmentCard ailment={mockAilment} />);
    expect(screen.getByText("Context Bleed")).toBeInTheDocument();
  });

  it("renders the severity badge", () => {
    render(<AilmentCard ailment={mockAilment} />);
    expect(screen.getByText("moderate")).toBeInTheDocument();
  });

  it("renders the category badge", () => {
    render(<AilmentCard ailment={mockAilment} />);
    expect(screen.getByText("Cognitive")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<AilmentCard ailment={mockAilment} />);
    expect(screen.getByText("Short-term memory corruption.")).toBeInTheDocument();
  });

  it("links to the ailment detail page", () => {
    render(<AilmentCard ailment={mockAilment} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/ailments/1");
  });
});
