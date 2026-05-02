import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../src/components/Login";
import { useNavigate } from "react-router-dom";

// Mock AppContext
vi.mock("../src/AppContext", () => ({
  useApp: vi.fn(() => ({
    API_BASE_URL: "http://localhost:88"
  }))
}));

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate
  };
});

describe("Login Component", () => {
  test("renders login form correctly", () => {
    render(<Login auth={{}} />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Login")).toBeInTheDocument();
  });

  test("typing in email and password updates value", async () => {
    render(<Login auth={{}} />);
    const user = userEvent.setup();
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });
});
