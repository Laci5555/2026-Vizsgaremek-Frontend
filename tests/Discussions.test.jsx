import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Discussions from "../src/components/Discussions";
import { getDocs } from "firebase/firestore";

vi.mock("../src/AppContext", () => ({
  useApp: vi.fn(() => ({ user: { email: "test@test.com" } }))
}));

// Mock Navbar
vi.mock("../src/components/Navbar", () => ({
  default: () => <div data-testid="navbar-mock">Navbar</div>
}));

describe("Discussions Component", () => {
  test("renders New topic button", async () => {
    // Mock getDocs to return a user so it doesn't return early
    vi.mocked(getDocs).mockResolvedValue({
      docs: [{ data: () => ({ email: "test@test.com", picture: "test.png" }), id: "u1" }]
    });

    render(<Discussions />);
    const newTopicBtn = await screen.findByTitle(/New discussion/i);
    expect(newTopicBtn).toBeInTheDocument();
  });

  test("clicking New topic opens the new topic modal", async () => {
    vi.mocked(getDocs).mockResolvedValue({
      docs: [{ data: () => ({ email: "test@test.com", picture: "test.png" }), id: "u1" }]
    });

    render(<Discussions />);
    const user = userEvent.setup();
    const newTopicBtn = await screen.findByTitle(/New discussion/i);
    await user.click(newTopicBtn);
    expect(screen.getByPlaceholderText(/What's on your mind\?/i)).toBeInTheDocument();
  });
});
