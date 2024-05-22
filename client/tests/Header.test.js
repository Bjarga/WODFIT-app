// tests/Header.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../components/Header"; // Adjust the path as needed

const renderWithRouter = (ui, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(ui, { wrapper: MemoryRouter });
};

test("renders the header with the correct text for user role", () => {
  renderWithRouter(
    <Header userRole="user" username="John Doe" handleLogout={() => {}} />,
    { route: "/dashboard" }
  );
  expect(screen.getByText(/Welcome John Doe/i)).toBeInTheDocument();
});

test("renders the header with the correct text for admin role", () => {
  renderWithRouter(
    <Header userRole="admin" username="Jane Doe" handleLogout={() => {}} />,
    { route: "/dashboard" }
  );
  expect(screen.getByText(/Coach Dashboard/i)).toBeInTheDocument();
});

test("renders the header with the correct text for gallery path", () => {
  renderWithRouter(
    <Header userRole="user" username="John Doe" handleLogout={() => {}} />,
    { route: "/gallery" }
  );
  expect(screen.getByText(/Gallery/i)).toBeInTheDocument();
});

test("matches snapshot", () => {
  const { asFragment } = renderWithRouter(
    <Header userRole="user" username="John Doe" handleLogout={() => {}} />,
    { route: "/dashboard" }
  );
  expect(asFragment()).toMatchSnapshot();
});
