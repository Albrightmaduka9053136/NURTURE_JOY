// import React from "react";

// export default function Grounding54321() {
//   return (
//     <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
//       <h2>5-4-3-2-1 Grounding</h2>
//       <p>This exercise helps bring attention back to the present moment.</p>
//       <ol>
//         <li>Name 5 things you can see</li>
//         <li>Name 4 things you can feel</li>
//         <li>Name 3 things you can hear</li>
//         <li>Name 2 things you can smell</li>
//         <li>Name 1 thing you can taste</li>
//       </ol>
//       <p style={{ opacity: 0.8 }}>
//         Note: This is non-clinical emotional support and not medical advice.
//       </p>
//     </div>
//   );
// }

import React from "react";
import { useNavigate } from "react-router-dom";
import "../../utils/css/index.css";

const Grounding54321 = () => {
  const navigate = useNavigate();

  const videos = [
    {
      title: "5-4-3-2-1 Grounding Technique",
      url: "https://www.youtube.com/embed/30VMIEmA114"
    },
    {
      title: "10 Minute Grounding Meditation for Anxiety",
      url: "https://www.youtube.com/embed/1vx8iUvfyCY"
    },
    {
      title: "Grounding Exercise for Stress Relief",
      url: "https://www.youtube.com/embed/ihO02wUzgkc"
    }
  ];

  return (
    <div className="grounding-page">
      <div className="grounding-header">
        <h1>Grounding Exercises</h1>
        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      <p className="grounding-subtitle">
        Regain balance, calm your nervous system, and reconnect to the present moment 🌿
      </p>

      <div className="grounding-grid">
        {videos.map((video, index) => (
          <div key={index} className="grounding-card">
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

export default  Grounding54321;