import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SeverityBadge } from "../SeverityBadge";

describe("SeverityBadge", () => {
  it("renders the severity text", () => {
    render(<SeverityBadge severity="mild" />);
    expect(screen.getByText("mild")).toBeInTheDocument();
  });

  it("applies green styles for mild", () => {
    const { container } = render(<SeverityBadge severity="mild" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("green");
  });

  it("applies yellow styles for moderate", () => {
    const { container } = render(<SeverityBadge severity="moderate" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("yellow");
  });

  it("applies red styles for severe", () => {
    const { container } = render(<SeverityBadge severity="severe" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("red");
  });

  it("capitalizes the severity text", () => {
    render(<SeverityBadge severity="severe" />);
    expect(screen.getByText("severe")).toBeInTheDocument();
  });

  it("handles unknown severity gracefully", () => {
    const { container } = render(<SeverityBadge severity="unknown" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("gray");
  });
});
