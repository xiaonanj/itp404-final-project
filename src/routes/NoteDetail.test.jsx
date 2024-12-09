import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import NoteDetail from "./NoteDetail";

// Mock data for the note
const mockNote = {
  id: 1,
  content: "Sample note content",
  isReviewed: false,
};

// Mock useParams and useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

// Mock toast notifications
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

// Mock global fetch
global.fetch = jest.fn();

describe("NoteDetail component", () => {
  beforeEach(() => {
    useParams.mockReturnValue({ noteId: "1" });
    global.fetch.mockClear();
  });

  test("renders note details correctly", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockNote,
    });

    render(
      <MemoryRouter>
        <NoteDetail />
      </MemoryRouter>
    );

    // Verify loading state
    expect(screen.getByText("Loading note details...")).toBeInTheDocument();

    // Verify rendered content after fetching
    await waitFor(() => expect(screen.getByText("Note Details")).toBeInTheDocument());
    expect(screen.getByDisplayValue("Sample note content")).toBeInTheDocument();
    expect(screen.getByLabelText("Reviewed").checked).toBe(false);
  });

  test("navigates back to notes list", async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockNote });

    render(
      <MemoryRouter>
        <NoteDetail />
      </MemoryRouter>
    );

    // Wait for note details to render
    await waitFor(() => expect(screen.getByText("Note Details")).toBeInTheDocument());

    // Click Back to Notes button
    fireEvent.click(screen.getByText("Back to Notes"));

    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith("/notes");
  });
});
