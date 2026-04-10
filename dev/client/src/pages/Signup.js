import React, { useState } from "react";
import { apiUrl } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import "../utils/css/signup.css";
 
const Register = () => {
  const navigate = useNavigate();
 
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
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
      const response = await fetch(apiUrl("/api/auth/register"), {
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
          {/* <div className="logo"><Link to="/">💕Nurture Joy</Link></div> */}
        </div>
 
        <div className="signup-form-section">
          <h2>Join  <Link to="/">Nurture Joy 💕</Link></h2>
 
          <form onSubmit={handleSubmit}>
            
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              onChange={handleChange}
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
 
            <button type="submit">Create Your Safe Space</button>
          </form>
 
          <p className="signin-link">
            or <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
 
      {/* RIGHT SIDE */}
      <div className="signup-right">

        <div className="overlay"></div>
         
        </div>
      </div>
 
    </div>
 
);
 
};
 
export default Register;