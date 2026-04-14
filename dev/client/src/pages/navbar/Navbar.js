import React, { useState, useRef, useEffect } from "react";
import "../../utils/css/navbar.css";
import { useNavigate,  useLocation } from "react-router-dom";
import { apiUrl } from "../../utils/api";
import {  } from "react-router-dom";
import projectLogo from "../../utils/assets/project-logo.png";

const Navbar = ({ sessionId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

   // ==========================
        // Logout + End Session
        // ==========================
        const handleLogout = async () => {
          const token = localStorage.getItem("token");
      
          if (sessionId) {
            await fetch(
              apiUrl(`/api/chat/session/${sessionId}/sessionend`),
              {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          }
      
          await fetch(apiUrl("/api/auth/logout"), {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
      
          localStorage.removeItem("token");
          navigate("/");
        };
  return (

    <div className="navbar">

      {/* LEFT */}
      <div className="nav-left">
        
                <div className="logo"><img src={projectLogo} alt="Project Logo" /></div>
      </div>

      {/* CENTER */}
      <div className={`nav-center ${menuOpen ? "open" : ""}`}>
       <span
  className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}
  onClick={() => navigate("/dashboard")}
>
  Home
</span>

<span
  className={`nav-item ${location.pathname === "/resources" ? "active" : ""}`}
  onClick={() => navigate("/resources")}
>
  Resources
</span>

<span
  className={`nav-item ${location.pathname === "/community" ? "active" : ""}`}
  onClick={() => navigate("/community")}
>
  Community
</span>

      </div>

      {/* RIGHT */}
      <div className="nav-right" ref={dropdownRef}>
        <span className="user-name">Nelly Nia</span>

        <img
          src="https://i.pravatar.cc/40"
          alt="user"
          className="avatar"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />

        {/* DROPDOWN */}
        {dropdownOpen && (
          <div className="dropdown">
            <div className="dropdown-item" onClick={() => navigate("/profile")}>
              Profile
            </div>
            <div className="dropdown-item logout" onClick={handleLogout}>
              Logout
            </div>
            </div>
          
        )}
      </div>

      {/* HAMBURGER */}
      <div
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

    </div>
  );
};

export default Navbar;