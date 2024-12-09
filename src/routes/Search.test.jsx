import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Search from "./Search";

global.fetch = jest.fn();

describe("Search component", () => {
  beforeEach(() => {
    global.fetch.mockClear();
  });

  test("renders Search component and displays fetched legal rules", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, title: "Rule 1", description: "Description 1" }] });

    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Rule 1")).toBeInTheDocument());
    expect(screen.getByText("Description 1")).toBeInTheDocument();
  });

  test("displays a message when no legal rules are found", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("No legal rules found.")).toBeInTheDocument());
  });
});
