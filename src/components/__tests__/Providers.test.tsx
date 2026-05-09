import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import { Providers } from "../Providers";

describe("Providers", () => {
  it("renders children", () => {
    render(
      <Providers>
        <div data-testid="child">Hello</div>
      </Providers>
    );
    expect(screen.getByTestId("child")).toHaveTextContent("Hello");
  });

  it("provides a QueryClient to children", () => {
    function QueryConsumer() {
      const { data } = useQuery({
        queryKey: ["test-key"] as const,
        queryFn: async () => "test-data",
        enabled: false,
      });
      return <div data-testid="query-result">{data ?? "no-data"}</div>;
    }

    render(
      <Providers>
        <QueryConsumer />
      </Providers>
    );
    expect(screen.getByTestId("query-result")).toHaveTextContent("no-data");
  });
});
