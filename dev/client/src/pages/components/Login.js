import React, {useState} from "react";
import "../../utils/css/login.css";
import bgImage from "../../utils/assets/pregnancy.jpg";
import projectLogo from "../../utils/assets/project-logo.png";

import { apiUrl } from "../../utils/api";
import { useNavigate, Link } from "react-router-dom";

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
        console.error("Login request failed:", error);
        alert("Login request failed. Check browser console or backend logs.");
      }
    };
  return (
    <div className="login-container">
      {/* LEFT SIDE */}
      <div
  className="left-section"
  style={{ backgroundImage: `url(${bgImage})` }}
>
  {/* TOP TEXT BLOCK */}
  <div className="top-overlay">
    <h1>Welcome Back</h1>
    <p>
      Continue your personalized, safe, and emotional support throughout
      your pregnancy journey.
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
        <div className="form-card">
          <h2 className="logo"><img src={projectLogo} alt="Project Logo" /></h2>
          {/* <h3>Log In to Your Safe Space</h3> */}

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                onChange={handleChange}
              />
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
              />
              <span className="eye">👁️</span>
            </div>

            {/* EXTRA FIELD (as shown) */}
            {/* <div className="input-group">
              <input type="text" placeholder="" />
            </div> */}

            <p className="forgot">Forgot Password?</p>

            <button className="login-btn">
              Log In
            </button>

            {/* <div className="divider">Or log in with:</div>

            <div className="social-buttons">
              <button className="google">G</button>
              <button className="apple"></button>
            </div> */}

            <p className="signup-text">
              Don't have an account? <span><Link to="/register">Sign Up</Link></span>
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

export default Login;