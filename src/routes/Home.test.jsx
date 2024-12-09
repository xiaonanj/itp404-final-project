import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

const mockLegalRules = [
  { id: 1, title: "Rule Title 1", type: "Statute", jurisdiction: "Federal", description: "This is a description of Rule Title 1." },
  { id: 2, title: "Rule Title 2", type: "Precedent", jurisdiction: "State", description: "This is a description of Rule Title 2." },
];

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLoaderData: () => mockLegalRules,
  useNavigate: jest.fn(),
}));

test("renders Home component and displays legal rules", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(screen.getByText(/Welcome to Legal Rules Tracker/)).toBeInTheDocument();
  const legalRulesList = screen.getAllByRole("listitem");
  expect(legalRulesList).toHaveLength(2);
  expect(legalRulesList[0]).toHaveTextContent("Rule Title 1");
  expect(legalRulesList[1]).toHaveTextContent("Rule Title 2");
});

test("updates document title on Home render", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(document.title).toBe("Home | Legal Tracker");
});
