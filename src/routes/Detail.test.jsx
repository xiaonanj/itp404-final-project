import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLoaderData, useNavigate } from "react-router-dom";
import Detail from "./Detail";

const mockLegalRule = {
  id: 1,
  title: "Sample Legal Rule",
  type: "Statute",
  jurisdiction: "Federal",
  description: "This is a description of the legal rule.",
  notes: [
    { id: 1, content: "First note." },
    { id: 2, content: "Second note." },
  ],
};

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLoaderData: jest.fn(),
  useNavigate: jest.fn(),
}));

describe("Detail component", () => {
  beforeEach(() => {
    useLoaderData.mockReturnValue(mockLegalRule);
  });

  test("updates document title based on legal rule title", () => {
    render(
      <MemoryRouter>
        <Detail />
      </MemoryRouter>
    );

    expect(document.title).toBe("Sample Legal Rule | Legal Tracker");
  });

  test("navigates back to home when Back to Home button is clicked", () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <Detail />
      </MemoryRouter>
    );

    const backButton = screen.getByText("Back to Home");
    backButton.click();

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});