import React, {useState} from "react";
import "../../utils/css/signup.css";
import bgImage from "../../utils/assets/pregnancy.jpg";
import projectLogo from "../../utils/assets/project-logo.png";
import { Link, useNavigate } from "react-router-dom";

import { apiUrl } from "../../utils/api";

const Signup = () => {
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
    <div className="signup-container">
      {/* LEFT SIDE */}
      <div
  className="left-section"
  style={{ backgroundImage: `url(${bgImage})` }}
>
  {/* TOP TEXT BLOCK */}
  <div className="top-overlay">
    <h1>Join the Nurture Joy Community.</h1>
    <p>
      Find personalized, safe, and emotional support throughout your
      pregnancy journey.
    </p>
  </div>

  {/* BOTTOM TEXT (OPTIONAL – keep if you want both) */}
  {/* <div className="bottom-overlay">
    <h1>Join the Nurture Joy Community.</h1>
    <p>
      Find personalized, safe, and emotional support throughout your
      pregnancy journey.
    </p>
  </div> */}
</div>

      {/* RIGHT SIDE */}
      <div className="right-section">
        <div className="signup-form-card">
          <h2 className="logo"><img src={projectLogo} alt="Project Logo" /></h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Full Name"
                name="username"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                onChange={handleChange}
              />
            </div>
{error && <p className="form-error">{error}</p>}
            <button className="signup-btn">
              Create Your Safe Space
            </button>

            {/* <div className="divider">Or sign up with:</div>

            <div className="social-buttons">
              <button className="google">G</button>
              <button className="apple"></button>
            </div> */}

            <p className="login-text">
              Already have an account? <span><Link to="/login">Log In</Link></span>
            </p>

            <p className="terms">
              We use privacy and security data to ensure safe usage. Read our
              Terms of Data Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;