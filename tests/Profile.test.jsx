import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Profile from "../src/components/Profile";

// Mock AppContext
vi.mock("../src/AppContext", () => ({
  useApp: () => ({
    user: { email: "test@test.com" },
    isAdmin: false
  })
}));

// Mock Navbar
vi.mock("../src/components/Navbar", () => ({
  default: () => <div data-testid="navbar-mock">Navbar</div>
}));

describe("Profile Component", () => {
  test("renders profile section", () => {
    const { container } = render(<Profile auth={{}} />);
    expect(container.querySelector(".profile")).toBeInTheDocument();
  });

  test("renders Favourite Games section header", async () => {
    render(<Profile auth={{}} />);
    // Find the H2 heading in the main content area
    const header = await screen.findByRole("heading", { name: /Favourite Games/i });
    expect(header).toBeInTheDocument();
  });

  test("renders Log out button", async () => {
    render(<Profile auth={{}} />);
    const logoutBtn = await screen.findByRole("button", { name: /Log out/i });
    expect(logoutBtn).toBeInTheDocument();
  });
});
