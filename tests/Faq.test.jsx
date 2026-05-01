import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Faq from "../src/components/Faq";

// Mocking Navbar to isolate Faq testing
vi.mock("../src/components/Navbar", () => ({
  default: () => <div data-testid="navbar-mock">Navbar</div>
}));

describe("Faq Component", () => {
  test("renders the FAQ container and specific title", () => {
    render(<Faq />);
    
    // Check if the title is present
    const title = screen.getByText(/Frequently Asked Questions/i);
    expect(title).toBeInTheDocument();

    // Check if Navbar mock is rendered
    const navbar = screen.getByTestId("navbar-mock");
    expect(navbar).toBeInTheDocument();
  });

  test("toggles an accordion question to show answer", async () => {
    render(<Faq />);
    const user = userEvent.setup();
    
    // The answer should not have the 'active' class on its parent item initially
    const questionButton = screen.getByText(/What is Gamminity\?/i);
    const faqItem = questionButton.closest(".faq-item");
    expect(faqItem).not.toHaveClass("active");

    // Click the question
    await user.click(questionButton);

    // After click, the faq-item should have the 'active' class
    expect(faqItem).toHaveClass("active");
    
    // Click again to close
    await user.click(questionButton);
    expect(faqItem).not.toHaveClass("active");
  });
});
