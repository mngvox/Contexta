import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Contexta", () => {
  it("shows the current project continuity summary", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Afterglow" })).toBeInTheDocument();
    expect(screen.getByText(/bridge found its voice/i)).toBeInTheDocument();
  });

  it("starts and ends a session", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /start a session/i }));
    expect(screen.getByText("Listening")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /end session/i }));
    expect(screen.queryByText("Listening")).not.toBeInTheDocument();
  });

  it("opens the contextual assistant", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /ask contexta/i }));
    expect(screen.getByText(/caught up on Afterglow/i)).toBeInTheDocument();
  });
});
