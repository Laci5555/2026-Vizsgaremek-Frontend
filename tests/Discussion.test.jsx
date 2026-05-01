import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Discussion from "../src/components/Discussion";
import { getDocs } from "firebase/firestore";

vi.mock("../src/AppContext", () => ({
  useApp: vi.fn(() => ({ user: { email: "test@test.com" } }))
}));

describe("Individual Discussion Page", () => {
  test("renders loading state or Navbar initially", () => {
    render(<Discussion />);
    // The component renders a Navbar while loading
    expect(screen.getByTestId("navbar-mock")).toBeInTheDocument();
  });

  test("renders discussion title when loaded", async () => {
    // Mock getDocs to return data
    vi.mocked(getDocs).mockResolvedValue({
      docs: [
        { data: () => ({ title: "Test Title", creatoremail: "test@test.com" }), id: "123" },
        { data: () => ({ email: "test@test.com", username: "Tester", picture: "test.png" }), id: "u1" }
      ]
    });

    render(<Discussion />);
    const title = await screen.findByTestId("discussion-title");
    expect(title).toHaveTextContent("Test Title");
  });
});
