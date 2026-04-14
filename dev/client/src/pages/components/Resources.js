// import React, { useEffect, useState } from "react";
// import { apiUrl } from "../utils/api";
// import { Link, useNavigate } from "react-router-dom";
// import "../utils/css/dashboard.css";
// import {ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";


// const Resources = () => {
//     const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [sessionId, setSessionId] = useState(null);
//   const [chat, setChat] = useState([]);
//   const [message, setMessage] = useState("");
//   const [activeTab, setActiveTab] = useState("mood");
//   const [moodData, setMoodData] = useState([]);

//   const [selectedMood, setSelectedMood] = useState(null);
//   const [intensity, setIntensity] = useState(3);
//   const [moodNote, setMoodNote] = useState("");
//   const [savingMood, setSavingMood] = useState(false);

//   // ==========================
//   // 🔐 Load User + Start Session
//   // ==========================
// useEffect(() => {
//   const init = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       // 1️⃣ Validate user
//       const userRes = await fetch(apiUrl("/api/auth/me"), {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const userData = await userRes.json();

//       if (!userRes.ok) {
//         navigate("/login");
//         return;
//       }

//       setUser(userData.user);

//       // mood data for insights tab
//       // Fetch mood history
// const moodRes = await fetch(
//   apiUrl("/api/mood/history"),
//   {
//     headers: { Authorization: `Bearer ${token}` },
//   }
// );

// const moodHistory = await moodRes.json();

// if (moodRes.ok) {
//   const formatted = moodHistory.moods
//     .map((m) => ({
//       date: new Date(m.created_at).toLocaleDateString(),
//       intensity: m.intensity,
//     }))
//     .reverse();

//   setMoodData(formatted);
// }

//       // 2️⃣ CHECK IF CONTINUING SESSION
//       const existingSession = localStorage.getItem("activeSession");

//       if (existingSession) {
//         // Continue old session
//         setSessionId(existingSession);

//         const historyRes = await fetch(
//           apiUrl(`/api/chat/session/${existingSession}/history`),
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const historyData = await historyRes.json();

//         if (historyRes.ok) {
//           setChat(historyData.messages);
//         } else {
//           console.error("Failed to load session history");
//         }

//         localStorage.removeItem("activeSession");

//       } else {
//         // Start new session
//         const sessionRes = await fetch(
//           apiUrl("/api/chat/session/start"),
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const sessionData = await sessionRes.json();

//         if (sessionRes.ok) {
//           setSessionId(sessionData.session_id);
//           setChat([sessionData.message]);
//         }
//       }

//     } catch (err) {
//       console.error(err);
//       navigate("/login");
//     }
//   };

//   init();
// }, [navigate]);



//   // ==========================
//   // 💬 Send Message
//   // ==========================
//   const handleSend = async () => {
//     if (!message.trim() || !sessionId) return;

//     const token = localStorage.getItem("token");
//     const userText = message.trim();

//     // Add user message instantly
//     setChat((prev) => [
//       ...prev,
//       { role: "user", text: userText }
//     ]);

//     setMessage("");

//     try {
//       const res = await fetch(
//         apiUrl(`/api/chat/session/${sessionId}/message`),
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ text: userText }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         setChat((prev) => [
//           ...prev,
//           { role: "assistant", text: data.error || "Error occurred" }
//         ]);
//         return;
//       }

//       setChat((prev) => [...prev, data.message]);

//     } catch (err) {
//       setChat((prev) => [
//         ...prev,
//         { role: "assistant", text: "Backend not reachable" }
//       ]);
//     }
//   };

//   // ==========================
//   // 🔘 Handle Quick Reply
//   // ==========================
//   const handleIntent = async (intentId) => {
//   if (!sessionId) return;

//   const token = localStorage.getItem("token");

//   const res = await fetch(
//     apiUrl(`/api/chat/session/${sessionId}/intent`),
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ intent: intentId }),
//     }
//   );

//   const data = await res.json();

//   if (res.ok) {
//     setChat((prev) => [...prev, data.message]);

//     // 🔴 If session ended, disable input
//     if (intentId === "end_session") {
//       setSessionId(null);
//     }
//   }
// };


// // endsession
// const handleEndSession = async () => {
//   if (!sessionId) return;

//   const token = localStorage.getItem("token");

//   try {
//     const res = await fetch(
//       apiUrl(`/api/chat/session/${sessionId}/sessionend`),
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const data = await res.json();

//     if (res.ok) {
//       setChat((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           text: "Your session has been safely closed 🌿",
//         },
//       ]);

//       setSessionId(null); // disable session
//     }
//   } catch (err) {
//     console.error("Failed to end session", err);
//   }
// };


// // restart the chat session
// const startNewSession = async () => {
//   const token = localStorage.getItem("token");

//   const res = await fetch(
//     apiUrl("/api/chat/session/start"),
//     {
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   );

//   const data = await res.json();

//   if (res.ok) {
//     setSessionId(data.session_id);
//     setChat([data.message]);
//   }
// };


// // mood logging
// const handleSaveMood = async () => {
//   if (!selectedMood) return;

//   const token = localStorage.getItem("token");
//   setSavingMood(true);

//   try {
//     const res = await fetch(
//       apiUrl("/api/mood/track"),
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           mood: selectedMood,
//           intensity: intensity,
//           note: moodNote,
//         }),
//       }
//     );

//     const data = await res.json();

//     if (res.ok) {
//       // Add new mood to chart instantly
//       setMoodData((prev) => [
//         ...prev,
//         {
//           date: new Date(data.mood.created_at).toLocaleDateString(),
//           intensity: data.mood.intensity,
//         },
//       ]);

//       // Reset form
//       setSelectedMood(null);
//       setIntensity(3);
//       setMoodNote("");
//     }
//   } catch (err) {
//     console.error("Failed to save mood");
//   }

//   setSavingMood(false);
// };
//   // ==========================
//   // 🚪 Logout + End Session
//   // ==========================
//   const handleLogout = async () => {
//     const token = localStorage.getItem("token");

//     if (sessionId) {
//       await fetch(
//         apiUrl(`/api/chat/session/${sessionId}/sessionend`),
//         {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//     }

//     await fetch(apiUrl("/api/auth/logout"), {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   if (!user) return null;


//   return (
//     <div className="dashboard-container">
//       {/* Navbar */}
//       <nav className="dashboard-navbar">
//         <div className="logo">NURTURE JOY</div>
//         <ul>
//           <li><Link to="/dashboard">Home</Link></li>
//           <li><Link to="/resources">Resources</Link></li>
//           <li><Link to="/community">Community</Link></li>
//           <li onClick={handleLogout} style={{ cursor: "pointer" }}> Logout  </li>
//         </ul>
//       </nav>

//       <div className="resources-content">
//         {/* LEFT SIDE */}
//         <div className="resources-tab">


//           {/* NAV PILLS */}
// <div className="custom-tabs">
//   <button
//     className={`tab-btn ${activeTab === "mood" ? "active" : ""}`}
//     onClick={() => setActiveTab("mood")}
//   >
//     Mood
//   </button>

//   <button
//     className={`tab-btn ${activeTab === "community" ? "active" : ""}`}
//     onClick={() => setActiveTab("community")}
//   >
//     Community
//   </button>

//   <button
//     className={`tab-btn ${activeTab === "insights" ? "active" : ""}`}
//     onClick={() => setActiveTab("insights")}
//   >
//     Insights
//   </button>

//   <button
//     className={`tab-btn ${activeTab === "resources" ? "active" : ""}`}
//     onClick={() => setActiveTab("resources")}
//   >
//     Resources
//   </button>
// </div>

// <div className="tab-content-section">

//   {activeTab === "mood" && (
//     <div className="card mood-chart-card">
//       <div className="card mood-input-card">
//   <h3>Log Today's Mood</h3>

//   {/* Mood Options */}
//   <div className="mood-options">
//     {[
//       { label: "Happy", emoji: "😊" },
//       { label: "Calm", emoji: "😌" },
//       { label: "Neutral", emoji: "😐" },
//       { label: "Anxious", emoji: "😟" },
//       { label: "Sad", emoji: "😢" },
//     ].map((m) => (
//       <button
//         key={m.label}
//         className={`mood-btn ${
//           selectedMood === m.label ? "selected-mood" : ""
//         }`}
//         onClick={() => setSelectedMood(m.label)}
//       >
//         <span>{m.emoji}</span>
//         {m.label}
//       </button>
//     ))}
//   </div>

//   {/* Intensity Slider */}
//   <div className="intensity-section">
//     <label>Intensity: {intensity}</label>
//     <input
//       type="range"
//       min="1"
//       max="5"
//       value={intensity}
//       onChange={(e) => setIntensity(Number(e.target.value))}
//     />
//   </div>

//   {/* Optional Note */}
//   <textarea
//     placeholder="Add a note (optional)..."
//     value={moodNote}
//     onChange={(e) => setMoodNote(e.target.value)}
//     className="mood-note"
//   />

//   <button
//     className="save-mood-btn"
//     onClick={handleSaveMood}
//     disabled={!selectedMood || savingMood}
//   >
//     {savingMood ? "Saving..." : "Save Mood"}
//   </button>
// </div>
//       <h3>Your Mood Trend</h3>

//       {moodData.length === 0 ? (
//         <p style={{ color: "#888" }}>
//   Start tracking your mood to see patterns and insights 🌿
// </p>
//       ) : (
//         <ResponsiveContainer width="100%" height={250}>
//           <LineChart data={moodData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis domain={[1, 5]} />
//             <Tooltip />
//             <Line
//               type="monotone"
//               dataKey="intensity"
//               stroke="#6c63ff"
//               strokeWidth={3}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       )}
//     </div>
//   )}

//   {activeTab === "community" && (
//     <div className="card">
//       <h3>Community</h3>
//       <p>Join discussions with other expecting mothers.</p>
//       <button className="join-btn">Explore Community</button>

//           <div className="card community-card">
//             <div>
//               <strong>Pregnancy Support</strong>
//               <p>18.5K members</p>
//               <button className="join-btn">Join</button>
//             </div>
            
//           </div>
//     </div>
//   )}

//   {activeTab === "insights" && (
//     <div className="card">
//       <h3>Weekly Insights</h3>
//       <p>Your mood improved by 15% this week 🌿</p>
//       <p>Most frequent mood: Happy 😊</p>
//     </div>
//   )}

//   {activeTab === "resources" && (
//     <div className="card">
//       <h3>Helpful Resources</h3>
//       <div className="resources-intro">
//         <button onClick={() => navigate("/resources/breathing-box")}>Breathing Exercises</button>
//         <button onClick={() => navigate("/resources/journal")}>Journal</button>
//         <button onClick={() => navigate("/resources/care-providers")}>Emotional Support Contacts</button>
//         <button onClick={() => navigate("/resources/grounding-54321")}>5-4-3-2-1 Grounding</button>
//       </div>
//     </div>
//   )}

// </div>

          
//         </div>

       
//     </div>
//       </div>
    
//   );
// };

// export default Resources;



import React, { useState } from "react";
import "../../utils/css/resources.css";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";

const Resources = () => {

  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("breathing");

  const breathing_videos = [
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
  
    const grounding_videos = [
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

  const journaling_videos = [
    {
      title: "How to Start Journaling for Mental Health", 
      url: "https://www.youtube.com/embed/8tqQYV9sKjA"
    },
    {
      title: "Journaling for Anxiety Relief",
      url: "https://www.youtube.com/embed/9v3V5XQzZzY"
    }
  ];


  return (
    <div className="resources-page">
      <Navbar/>

      <div className="resources-content">

      {/* HERO */}
      <div className="hero">

        <div className="hero-left">
          <h1>Resources</h1>
          <p>
            Nurture guided support to improve your emotional well-being and care journey.
          </p>

          {/* <button className="hero-btn">Dashboard</button> */}
        </div>




        {/* FLOATING CARD */}
        <div className="hero-card">
          <div className="hero-card-content">
            <img
              src="https://i.pravatar.cc/50"
              alt="profile"
            />

            <div>
              <h3>Nurture Joy</h3>
              <p>
                Access curated content to support your mood and emotional health.
              </p>
            </div>
          </div>

          <div className="hero-actions">
            <button className="secondary">New</button>
            <button className="primary">Continue</button>
          </div>
        </div>

      </div>

      {/* RESOURCES */}
      <div className="resources-section">


        <div className="resource-row">

          {/* Pink CARD */}
          <div className={`resource-card beige   ${activeTab === "breathing" ? "active" : ""}`}
    onClick={() => setActiveTab("breathing")}>
             <h3>Breathing</h3>
            <p>Relaxation & breathing techniques</p>
            <span>Show More</span>
          </div>

          {/* PLANT CARD */}
          <div className= {`resource-card orange ${activeTab === "grounding" ? "active" : ""}`}
    onClick={() => setActiveTab("grounding")}>
             <h3>Grounding</h3>
            <p>Relaxation & breathing techniques</p>
            <span>Show More</span>
          </div>

          {/* GREEN CARD */}
          <div className= {`resource-card green ${activeTab === "care" ? "active" : ""}`}
    onClick={() => setActiveTab("care")}>
            <h3>Care Support</h3>
            <p>See your helpful contacts</p>
            <span>Show More</span>
          </div>

          {/* ORANGE CARD */}
          <div className= {`resource-card orange  ${activeTab === "journaling" ? "active" : ""}`}
    onClick={() => setActiveTab("journaling")}>
            <h3>Journaling</h3>
            <p>Write your thoughts</p>
            <span>Show More</span>
          </div>

          {/* BEIGE CARD */}
          <div className= {`resource-card beige  ${activeTab === "nutrition" ? "active" : ""}`}
    onClick={() => setActiveTab("nutrition")}>
            <h3>Nutrition</h3>
            <p>Healthy eating tips</p>
            <span>Show More</span>
          </div>

        </div>


      {/* content */}
      <div className="resource-content">
{/* breathing */}
      {activeTab === "breathing" && (
   <div className="resource-grid breathing-grid">
        {breathing_videos.map((video, index) => (
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
  )}

{/* grounding */}

{activeTab === "grounding" && (
<div className="resource-grid grounding-grid">
        {grounding_videos.map((video, index) => (
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
)}

{/* journaling */}
{activeTab === "journaling" && (
<div className=" journaling-grid">
  < div className="journaling-intro">
    <h2>Journaling Resources</h2>
    <p>
      Explore guided journaling techniques to support your emotional well-being during pregnancy.
    </p>
    <button className="primary" onClick={() => navigate("/resources/journal")} >Start Journaling</button>
  </div>
  <div className="resource-grid">
 { journaling_videos.map((video, index) => (
          <div key={index} className="journaling-card">
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
)}

{/* care support */}
{activeTab === "care" && (
<div className=" journaling-grid">
  < div className="journaling-intro">
    <h2>Care Support</h2>
    <p>
      See all saved contact information.
    </p>
    <button className="primary" onClick={() => navigate("/resources/care-providers")} >Save Contacts</button>
  </div>
  <div className="resource-grid">

  </div>

       
      </div> 
)}
      </div>
      </div>

    
    </div></div>
  );
};

export default Resources;