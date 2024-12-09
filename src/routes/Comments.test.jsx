import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Comments from "./Comments";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

global.fetch = jest.fn();

describe("Comments component", () => {
  beforeEach(() => {
    global.fetch.mockClear();
    global.fetch.mockImplementation((url) => {
      if (url.includes("/comments")) {
        return Promise.resolve({
          ok: true,
          json: async () => [{ id: 1, content: "Test comment", userId: "1", legalRuleId: "1" }],
        });
      } else if (url.includes("/legalRules")) {
        return Promise.resolve({
          ok: true,
          json: async () => [{ id: "1", title: "Test Legal Rule" }],
        });
      } else if (url.includes("/users")) {
        return Promise.resolve({
          ok: true,
          json: async () => [{ id: "1", name: "Test User" }],
        });
      }
      return Promise.reject(new Error("Unknown API endpoint"));
    });
  });

  test("renders Comments component and displays comments, legal rules, and users", async () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Comments />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Test comment")).toBeInTheDocument());
    expect(screen.getByText("Test Legal Rule")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  test("displays validation errors when adding a comment with empty fields", async () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Comments />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Add Comment"));

    await waitFor(() => expect(screen.getByText("Please select an existing user.")).toBeInTheDocument());
    expect(screen.getByText("Please select a legal rule.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a comment.")).toBeInTheDocument();
  });
});
