import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/form.css";
import logo from "../images/WOD_logo.png";

// RegistrationForm component definition
const RegistrationForm = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    birthDate: "",
    contactDetails: "",
    role: "user",
    groupName: "",
  });

  // State to store the list of coaches
  const [coaches, setCoaches] = useState([]);

  // useEffect to fetch all coaches for the user to choose from
  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/coaches") // Correct backend URL
      .then((response) => setCoaches(response.data))
      .catch((error) => console.error("Error fetching coaches:", error));
  }, []);

  // Handler for form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send registration request to the server
      const response = await axios.post(
        "http://localhost:5000/auth/register",
        formData
      ); // Correct backend URL
      console.log("Registration successful:", response.data);
      // Redirect to login after successful registration
      window.location.href = "/login";
    } catch (error) {
      console.error("Registration error:", error.response.data);
    }
  };

  // Render the RegistrationForm component
  return (
    <div className="container">
      <form className="register-form" onSubmit={handleSubmit}>
        <img src={logo} alt="WOD Logo" className="logo" />
        <h1>Register</h1>
        {/* Email input field */}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        {/* Password input field */}
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        {/* Name input field */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        {/* Birth date input field */}
        <h4>Birth Date</h4>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          placeholder="Birth Date"
          required
        />
        {/* Contact details input field */}
        <input
          type="text"
          name="contactDetails"
          value={formData.contactDetails}
          onChange={handleChange}
          placeholder="Cell Number"
          required
        />
        {/* Role selection dropdown */}
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="coach">Coach</option>
        </select>
        {/* Team name input field for coach */}
        {formData.role === "coach" && (
          <input
            type="text"
            name="groupName"
            value={formData.groupName}
            onChange={handleChange}
            placeholder="Team Name"
          />
        )}
        {/* Coach selection dropdown for user */}
        {formData.role === "user" && (
          <select
            name="groupName"
            value={formData.groupName}
            onChange={handleChange}
          >
            <option value="">Select Coach</option>
            {coaches.map((coach) => (
              <option key={coach._id} value={coach.groupName}>
                {coach.name} ({coach.groupName})
              </option>
            ))}
          </select>
        )}
        {/* Register button */}
        <button className="log-button" type="submit">
          Register
        </button>
        {/* Redirect to login page */}
        <button
          type="button"
          className="link-button"
          onClick={() => (window.location.href = "/login")}
        >
          Already have an account? Log In
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
