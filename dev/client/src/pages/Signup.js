import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../utils/css/index.css";
 
const Register = () => {
  const navigate = useNavigate();
 
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    trimester: ""
  });
 
  const [error, setError] = useState("");
 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }
 
  setError("");
    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
 
      const data = await response.json();
 
      if (response.ok) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };
 
  return (
  <div className="signup-wrapper">
 
    <div className="signup-card">
 
      {/* LEFT SIDE */}
      <div className="signup-left">
        <div className="signup-nav">
          <div className="logo">Nurture Joy</div>
          <ul>
            <li><Link to="/">Home</Link></li>
          </ul>
        </div>
 
        <div className="signup-form-section">
          <h2>Sign up</h2>
 
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
 
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />
 
            <div className="password-row">
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
 
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                required
              />
            </div>
            {error && <p className="form-error">{error}</p>}
 
            <div className="extra-row">
              <input
                type="number"
                name="age"
                placeholder="Age"
                onChange={handleChange}
              />
 
              <input
                type="number"
                name="trimester"
                placeholder="Trimester (1-3)"
                onChange={handleChange}
              />
            </div>
 
            <button type="submit">Create Account</button>
          </form>
 
          <p className="signin-link">
            or <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
 
      {/* RIGHT SIDE */}
      <div className="signup-right"></div>
 
    </div>
  </div>
);
 
};
 
export default Register;