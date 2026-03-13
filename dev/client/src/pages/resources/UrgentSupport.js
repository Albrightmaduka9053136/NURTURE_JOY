import React from "react";

export default function UrgentSupport() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h2>Urgent Support</h2>
      <p>
        If you feel like you might harm yourself or you are in immediate danger, please contact emergency services now.
      </p>
      <ul>
        <li>Call local emergency number</li>
        <li>Reach out to a trusted person nearby</li>
        <li>Contact a local crisis support line in your region</li>
      </ul>
      <p style={{ opacity: 0.9 }}>
        This page is informational and is not medical advice.
      </p>
    </div>
  );
}