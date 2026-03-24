import React, { useState } from "react";
import { apiUrl } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import "../utils/css/index.css";
 
const Login = () => {
  const navigate = useNavigate();
 
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      const response = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // important for sessions
        body: JSON.stringify(formData)
      });
 
      const data = await response.json();
 
      if (response.ok) {
        localStorage.setItem("token", data.token);
 
    // Optional: save user
        localStorage.setItem("user", JSON.stringify(data.user));
 
        navigate("/dashboard");
       }else {
        alert(data.error);
  }
    } catch (error) {
      console.error(error);
    }
  };
 
 return (
  <div className="login-wrapper">
 
    <div className="login-card">
 
      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="login-nav">
          <div className="logo">Nurture Joy</div>
          <ul>
            <li><Link to="/">Home</Link></li>
          </ul>
        </div>
 
        <div className="login-form-section">
          <h2>Log in</h2>
 
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Username"
              onChange={handleChange}
              required
            />
 
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
 
            <div className="login-options">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <span className="forgot">Forgot Password?</span>
            </div>
 
            <button type="submit">Log in</button>
          </form>
 
          <p className="signup-link">
            or <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
 
      {/* RIGHT SIDE */}
      <div className="login-right"></div>
 
    </div>
  </div>
);
 
};
 
export default Login;