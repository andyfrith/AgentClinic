import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { Providers } from "../Providers";

function TestConsumer() {
  const queryClient = new QueryClient();
  const isDefault = queryClient.getQueryDefaults("test") !== undefined;
  return <div data-testid="result">{String(isDefault)}</div>;
}

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
        queryKey: ["test-key"],
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
