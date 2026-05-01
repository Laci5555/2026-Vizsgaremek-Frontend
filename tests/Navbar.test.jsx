import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "../src/components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../src/AppContext";

vi.unmock("../src/components/Navbar");

vi.mock("../src/AppContext", () => ({
  useApp: vi.fn(() => ({
    user: { email: "test@test.com", username: "Test User", picture: "test.png" },
    isAdmin: true
  }))
}));

const mockedNavigate = vi.fn();
vi.mocked(useNavigate).mockReturnValue(mockedNavigate);
vi.mocked(useLocation).mockReturnValue({ pathname: "/" });

describe("Navbar Component", () => {
  test("renders Navbar with all links and admin link", async () => {
    render(<Navbar />);
    expect(screen.getByTestId("nav-home")).toBeInTheDocument();
    expect(screen.getByTestId("nav-games")).toBeInTheDocument();
    expect(screen.getByTestId("nav-discussions")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  test("navigates to games page on click", async () => {
    render(<Navbar />);
    const user = userEvent.setup();
    const gamesLink = screen.getByTestId("nav-games");
    await user.click(gamesLink);
    expect(mockedNavigate).toHaveBeenCalledWith("/games");
  });
});
