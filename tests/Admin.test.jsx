import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Admin from "../src/components/Admin";

// Mock AppContext
vi.mock("../src/AppContext", () => ({
  useApp: vi.fn(() => ({ user: { uid: "admin123" }, isAdmin: true }))
}));

describe("Admin Component", () => {
  test("renders admin panel forms", () => {
    render(<Admin />);
    expect(screen.getByTestId("admin-game-name")).toBeInTheDocument();
    expect(screen.getByText(/Picture upload method/i)).toBeInTheDocument();
    expect(screen.getByTestId("admin-game-description")).toBeInTheDocument();
    expect(screen.getByTestId("admin-add-game-btn")).toBeInTheDocument();
  });

  test("can type in genre field", async () => {
    render(<Admin />);
    const user = userEvent.setup();
    const genreInput = screen.getByTestId("admin-genre-input");
    await user.type(genreInput, "RPG");
    expect(genreInput).toHaveValue("RPG");
  });
});
