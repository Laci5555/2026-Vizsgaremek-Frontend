import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../src/components/Login";

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
