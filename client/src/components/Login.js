import React, { useState } from "react";
import axios from "axios";
import "../styles/form.css"; // Import the CSS file for styling
import logo from "../images/WOD_logo.png"; // Import the logo image

function Login({ setToken }) {
  // State to store the email input
  const [email, setEmail] = useState("");

  // State to store the password input
  const [password, setPassword] = useState("");

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the server
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      // Destructure response data
      const { token, userId, role, name, groupName } = response.data;
      // Set token and user details in parent component
      setToken(token, role, name);
      // Save token and user details in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userRole", role);
      localStorage.setItem("username", name);
      localStorage.setItem("groupName", groupName);
      // Redirect based on user role
      window.location.href =
        role === "coach" ? "/coach-dashboard" : "/user-dashboard";
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      alert("Login failed.");
    }
  };

  // Render the Login component
  return (
    <div className="container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img src={logo} alt="WOD Logo" className="logo" />
        <h1>Login</h1>
        {/* Email input field */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        {/* Password input field */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {/* Login button */}
        <button className="log-button" type="submit">
          LOGIN
        </button>
        {/* Redirect to register page */}
        <button
          type="button"
          className="link-button"
          onClick={() => (window.location.href = "/register")}
        >
          Don't have an account? Sign Up
        </button>
        {/* Social login buttons */}
        <div className="social-login">
          <button
            type="button"
            className="google-button"
            onClick={() =>
              (window.location.href = "http://localhost:5000/auth/google")
            }
          >
            Login with Google
          </button>
          <button
            type="button"
            className="facebook-button"
            onClick={() =>
              (window.location.href = "http://localhost:5000/auth/facebook")
            }
          >
            Login with Facebook
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
