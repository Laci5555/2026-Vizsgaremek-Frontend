import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Games from "../src/components/Games";

// Mock Context
vi.mock("../src/AppContext", () => ({
  useApp: vi.fn(() => ({ user: { uid: "user123" }, isAdmin: false }))
}));

// Mock Navbar and Message
vi.mock("../src/components/Navbar", () => ({
  default: () => <div data-testid="navbar-mock">Navbar</div>
}));
vi.mock("../src/components/Message", () => ({
  default: () => <div data-testid="message-mock">Message</div>
}));

describe("Games Component", () => {
  test("renders Games search bar", async () => {
    render(<Games />);
    const searchInput = await screen.findByPlaceholderText(/Search games.../i);
    expect(searchInput).toBeInTheDocument();
  });

  test("typing in search input updates value", async () => {
    render(<Games />);
    const user = userEvent.setup();
    const searchInput = await screen.findByPlaceholderText(/Search games.../i);
    
    await user.type(searchInput, "Elden Ring");
    expect(searchInput).toHaveValue("Elden Ring");
  });
});
