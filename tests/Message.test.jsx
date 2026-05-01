import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Message from "../src/components/Message";

vi.mock("../src/AppContext", () => ({
  useApp: vi.fn(() => ({ user: { email: "test@test.com" } }))
}));

describe("Message (Chat) Component", () => {
  test("renders chat toggle icon", () => {
    const { container } = render(<Message />);
    const toggleBtn = container.querySelector(".showChat");
    expect(toggleBtn).toBeInTheDocument();
  });

  test("clicking toggle icon opens chat window", async () => {
    const { container } = render(<Message />);
    const user = userEvent.setup();
    const toggleBtn = container.querySelector(".showChat");
    await user.click(toggleBtn);
    expect(await screen.findByText((content) => content.toLowerCase().includes('conversations'))).toBeInTheDocument();
  });
});
