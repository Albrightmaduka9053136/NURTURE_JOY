import React from "react";
import { useNavigate } from "react-router-dom";

export default function CareProviders() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <div className="grounding-header">
        <h1>Care Provider Directory</h1>
        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
  
      <p>
        This is a placeholder directory page. Connect this to your real providers list or messaging feature.
      </p>

      <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10, marginBottom: 10 }}>
        <strong>Dr. A. Khan (OB/GYN)</strong>
        <div>Availability: Mon–Thu</div>
        <button style={{ marginTop: 8 }}>Message Provider</button>
      </div>

      <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10 }}>
        <strong>Nurse Support Team</strong>
        <div>Availability: Daily</div>
        <button style={{ marginTop: 8 }}>Message Support</button>
      </div>

      <p style={{ opacity: 0.8, marginTop: 12 }}>
        Note: NurtureJoy does not provide diagnosis or medical instructions. This page helps you connect to qualified professionals.
      </p>
    </div>
  );
}