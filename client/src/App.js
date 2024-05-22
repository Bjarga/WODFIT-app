import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import Login from "./components/Login";
import Workout from "./components/Workout";
import Leaderboard from "./components/Leaderboard";
import UserDashboard from "./components/UserDashboard";
import CoachDashboard from "./components/CoachDashboard";
import Profile from "./components/Profile";
import GalleryPage from "./components/GalleryPage";
import Header from "./components/Header";
import "./styles/global.css";
import "./styles/header.css";
import "./styles/gallery.css";
import "./styles/form.css";
import "./styles/dashboard.css";
import "./styles/modal.css";

function App() {
  const [token, setTokenState] = useState(localStorage.getItem("token") || "");
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || ""
  );
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  const setToken = (token, role, name) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("username", name);
    setTokenState(token);
    setUserRole(role);
    setUsername(name);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    setTokenState("");
    setUserRole("");
    setUsername("");
    window.location.href = "/login"; // Force redirect to login page
  };

  return (
    <Router>
      <div className="app-container">
        {token && (
          <Header
            userRole={userRole}
            username={username}
            handleLogout={handleLogout}
          />
        )}
        <div className="content-container">
          <Routes>
            {!token ? (
              <>
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/" element={<Login setToken={setToken} />} />
              </>
            ) : (
              <>
                <Route path="/logout" element={<Navigate to="/login" />} />
                {userRole === "coach" ? (
                  <>
                    <Route
                      path="/coach-dashboard"
                      element={<CoachDashboard token={token} />}
                    />
                    <Route
                      path="/gallery"
                      element={<GalleryPage token={token} isAdmin={true} />}
                    />
                    <Route
                      path="*"
                      element={<Navigate to="/coach-dashboard" />}
                    />
                  </>
                ) : (
                  <>
                    <Route
                      path="/user-dashboard"
                      element={<UserDashboard token={token} />}
                    />
                    <Route
                      path="/gallery"
                      element={<GalleryPage token={token} isAdmin={false} />}
                    />
                    <Route
                      path="*"
                      element={<Navigate to="/user-dashboard" />}
                    />
                  </>
                )}
                <Route path="/workout" element={<Workout token={token} />} />
                <Route
                  path="/leaderboard"
                  element={<Leaderboard token={token} />}
                />
                <Route path="/profile" element={<Profile token={token} />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
