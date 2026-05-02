import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../src/components/Home";
import { useNavigate } from "react-router-dom";

// Mock AppContext
vi.mock("../src/AppContext", () => ({
  useApp: vi.fn(() => ({
    API_BASE_URL: "http://localhost:88",
    user: null,
    isAdmin: false
  }))
}));

// Mock Navbar and Message
vi.mock("../src/components/Navbar", () => ({
  default: () => <div data-testid="navbar-mock">Navbar</div>
}));
vi.mock("../src/components/Message", () => ({
  default: () => <div data-testid="message-mock">Message</div>
}));

describe("Home Component", () => {
  test("renders Home page and checks hero title", async () => {
    render(<Home />);
    // Adjusted to match the actual text content which might have spaces/line breaks
    expect(await screen.findByText(/Discover, Rate &.*Discuss Your Favorite Games/i)).toBeInTheDocument();
  });

  test("FAQ CTA button navigates to /faq", async () => {
    const mockedNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockedNavigate);

    render(<Home />);
    const user = userEvent.setup();
    const faqButton = await screen.findByText(/Visit FAQ/i);
    await user.click(faqButton);
    expect(mockedNavigate).toHaveBeenCalledWith("/faq");
  });
});
