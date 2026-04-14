import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";

export default function CareProviders() {
  const navigate = useNavigate();
  return (
    <div>
<Navbar />
      <div className="providers-page">

  {/* LEFT SIDE - PROVIDERS */}
  <div className="providers-left">

    <h2>Care Provider Directory</h2>
    <p className="subtitle">
      Connect with trusted professionals for support and guidance.
    </p>

    <div className="providers-list">

      <div className="provider-card">
        <div className="provider-info">
          <div className="avatar">👩‍⚕️</div>
          <div>
            <h3>Dr. A. Khan</h3>
            <p className="role">OB/GYN</p>
            <span> +1 435 778 3456</span>
            <p className="availability">🟢 Mon–Thu</p>
          </div>
        </div>
        <button className="message-btn">Message</button>
      </div>

      <div className="provider-card">
        <div className="provider-info">
          <div className="avatar">🧑‍⚕️</div>
          <div>
            <h3>Nurse Support Team</h3>
            <p className="role">General Support</p>
            <span> +1 435 778 3456</span>
            <p className="availability">🟢 Daily</p>
          </div>
        </div>
        <button className="message-btn">Message</button>
      </div>

    </div>
  </div>

  {/* RIGHT SIDE - FORM */}
  <div className="providers-right">

    <h3>Add Care Provider</h3>

    <form className="provider-form">

      <input type="text" placeholder="Full Name" required />
      <input type="text" placeholder="Specialization (e.g. OB/GYN)" required />
      <input type="text" placeholder="Availability (e.g. Mon–Fri)" required />
      <input type="email" placeholder="Email (optional)" />

      <button type="submit" className="add-provider-btn">
        Add Provider
      </button>

    </form>

  </div>

</div>
    </div>
  
    
  );
}