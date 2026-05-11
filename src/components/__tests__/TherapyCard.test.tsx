import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TherapyCard } from "../TherapyCard";
import type { Therapy } from "@/db/schema";

const mockTherapy: Therapy = {
  id: 1,
  name: "Cache Flush",
  description: "A complete reset of the working memory cache.",
  duration: "15 minutes",
  sideEffects: ["Temporary amnesia", "Mild disorientation"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("TherapyCard", () => {
  it("renders the therapy name", () => {
    render(<TherapyCard therapy={mockTherapy} />);
    expect(screen.getByText("Cache Flush")).toBeInTheDocument();
  });

  it("renders the duration", () => {
    render(<TherapyCard therapy={mockTherapy} />);
    expect(screen.getByText("15 minutes")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<TherapyCard therapy={mockTherapy} />);
    expect(screen.getByText("A complete reset of the working memory cache.")).toBeInTheDocument();
  });

  it("renders side effects", () => {
    render(<TherapyCard therapy={mockTherapy} />);
    expect(screen.getByText(/Temporary amnesia/)).toBeInTheDocument();
    expect(screen.getByText(/Mild disorientation/)).toBeInTheDocument();
  });

  it("links to the therapy detail page", () => {
    render(<TherapyCard therapy={mockTherapy} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/therapies/1");
  });
});
