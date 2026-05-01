import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Finder from "../src/components/Finder";

vi.mock("../src/AppContext", () => ({
  useApp: vi.fn(() => ({ user: { email: "test@test.com" } }))
}));

describe("Finder Component", () => {
  test("renders group creation FAB", async () => {
    render(<Finder />);
    const fab = await screen.findByTitle(/New post/i);
    expect(fab).toBeInTheDocument();
  });

  test("clicking FAB opens the modal", async () => {
    render(<Finder />);
    const user = userEvent.setup();
    const fab = await screen.findByTitle(/New post/i);
    await user.click(fab);
    expect(await screen.findByRole("heading", { name: /Find a teammate/i })).toBeInTheDocument();
  });
});
