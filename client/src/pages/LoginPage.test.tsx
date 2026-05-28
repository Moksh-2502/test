import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "./LoginPage";

vi.mock("../components/AuthProvider", () => ({
  useAuth: () => ({ login: vi.fn() })
}));

describe("LoginPage", () => {
  it("renders email and password fields", () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    expect(screen.getByText("Student login")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });
});
