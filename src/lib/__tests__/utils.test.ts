import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("handles undefined and null", () => {
    expect(cn("a", undefined, null, "b")).toBe("a b");
  });

  it("resolves tailwind conflicts (last wins)", () => {
    expect(cn("px-4", "px-2")).toBe("px-2");
  });

  it("handles clsx array input", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });
});
