import React from "react";
import { useLocation, Link } from "react-router-dom";
import "../styles/header.css";

// Header component definition
function Header({ userRole, username, handleLogout }) {
  // Get the current location path
  const location = useLocation();
  const path = location.pathname;

  // Function to determine the header title based on the path and user role
  const getTitle = () => {
    if (path === "/gallery") {
      return "Gallery";
    } else if (userRole === "admin") {
      return "Coach Dashboard";
    } else {
      return `Welcome ${username}`;
    }
  };

  // Render the Header component
  return (
    <header className="header">
      <div className="header-content">
        {/* Left section of the header */}
        <div className="header-left">
          {path === "/gallery" && (
            <Link
              to={userRole === "admin" ? "/coach-dashboard" : "/user-dashboard"}
              className="back-link"
            >
              &larr; Back to Dashboard
            </Link>
          )}
        </div>

        {/* Center section of the header */}
        <div className="header-center">
          <h1>{getTitle()}</h1>
        </div>

        {/* Right section of the header */}
        <div className="header-right">
          <button className="logout-button" onClick={handleLogout}>
            <span className="logout-circle">×</span> Log out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
