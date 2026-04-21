// import React from "react";

// export default function BreathingBox() {
//   return (
//     <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
//       <h2>Box Breathing (Non-clinical)</h2>
//       <p>
//         This is a simple calming exercise. If you feel dizzy or uncomfortable, pause and return to normal breathing.
//       </p>
//       <ol>
//         <li>Breathe in slowly for 4 seconds</li>
//         <li>Hold for 4 seconds</li>
//         <li>Breathe out slowly for 4 seconds</li>
//         <li>Hold for 4 seconds</li>
//         <li>Repeat 4 times</li>
//       </ol>
//       <p style={{ opacity: 0.8 }}>
//         Note: This is for general calming support and not medical advice.
//       </p>
//     </div>
//   );
// }

import React from "react";
import "../../utils/css/index.css";
import { useNavigate } from "react-router-dom";

const BreathingBox = () => {
  const navigate = useNavigate();
  const videos = [
    {
      title: "5 Minute Deep Breathing Exercise",
      url: "https://www.youtube.com/embed/odADwWzHR24"
    },
    {
      title: "Box Breathing Technique (4x4 Method)",
      url: "https://www.youtube.com/embed/tEmt1Znux58"
    },
    {
      title: "Wim Hof Guided Breathing",
      url: "https://www.youtube.com/embed/tybOi4hjZFQ"
    },
    {
      title: "Calming Breathing for Anxiety",
      url: "https://www.youtube.com/embed/8VwufJrUhic"
    },
    {
      title: "Pregnancy Relaxation Breathing",
      url: "https://www.youtube.com/embed/SEfs5TJZ6Nk"
    }
  ];

  return (
    <div className="breathing-page">
      <h1>Breathing Exercises</h1>
      <button className="back-btn" onClick={() => navigate("/dashboard")} style={{marginBottom: "10px"}}>
              Go Back to Dashboard
            </button>
      <p className="breathing-subtitle">
        Relax, reset, and reconnect with your breath 🌿
      </p>
      

      <div className="breathing-grid">
        {videos.map((video, index) => (
          <div key={index} className="breathing-card">
            <h3>{video.title}</h3>

            <div className="video-wrapper">
              <iframe
                src={video.url}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreathingBox;