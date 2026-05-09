import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusIndicator } from "../StatusIndicator";

describe("StatusIndicator", () => {
  it("renders with active status (green)", () => {
    const { container } = render(<StatusIndicator status="active" />);
    const span = container.querySelector("span");
    expect(span).toHaveClass("bg-green-500");
    expect(span).toHaveAttribute("title", "active");
  });

  it("renders with idle status (yellow)", () => {
    const { container } = render(<StatusIndicator status="idle" />);
    const span = container.querySelector("span");
    expect(span).toHaveClass("bg-yellow-400");
  });

  it("renders with busy status (red)", () => {
    const { container } = render(<StatusIndicator status="busy" />);
    const span = container.querySelector("span");
    expect(span).toHaveClass("bg-red-500");
  });

  it("renders with offline status (gray)", () => {
    const { container } = render(<StatusIndicator status="offline" />);
    const span = container.querySelector("span");
    expect(span).toHaveClass("bg-gray-400");
  });

  it("falls back to gray for unknown status", () => {
    const { container } = render(<StatusIndicator status="unknown" />);
    const span = container.querySelector("span");
    expect(span).toHaveClass("bg-gray-400");
    expect(span).toHaveAttribute("title", "unknown");
  });
});
