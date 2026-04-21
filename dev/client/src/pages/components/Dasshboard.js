import React, {useState, useEffect} from "react";
import "../../utils/css/dashboard.css";
import { apiUrl } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import MoodTracker from "../dash-utils/MoodSelector";
import MoodTrend from "../dash-utils/MoodTrend";
import MetricsCards from "../dash-utils/MetricsCards";
import ChatWidget from "../chatbot/ChatWidget";
import WellBeingTip from "../dash-utils/TodayTip";

import chatCardImg from "../../utils/assets/chatbot-card.jpg";
import CarePlanCard from "../dash-utils/CarePlan";

const Dashboard = () => {
  
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  // const [profileProgress, setProfileProgress] = useState(0);
  // const [moodProgress, setMoodProgress] = useState(0);
  // const [journalProgress, setJournalProgress] = useState(0);
  const [refreshMood, setRefreshMood] = useState(false);
   

    // ==========================
    // 🔐 Load User + Start Session
    // ==========================
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
  
      try {
        // 1️⃣ Validate user
        const userRes = await fetch(apiUrl("/api/auth/me"), {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const userData = await userRes.json();
  
        if (!userRes.ok) {
          navigate("/login");
          return;
        }
  
        setUser(userData.user);
  
  
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };
  
    init();
  }, [navigate]);

// profile cmpletion progress
// useEffect(() => {
//   if (!user) return;

//   const fields = [
//     user.username,
//     user.email,
//     user.phone,
//     user.city,
//     user.due_date,
//   ];

//   const filled = fields.filter((f) => f && f !== "").length;
//   const percentage = Math.round((filled / fields.length) * 100);

//   setProfileProgress(percentage);
// }, [user]);


// // mood tracking progress
// useEffect(() => {
//   const fetchMood = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(apiUrl("/api/mood/today"), {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error("Failed mood fetch");

//       const data = await res.json();

//       setMoodProgress(data.mood ? 100 : 0);

//     } catch (err) {
//       console.error("Mood fetch error:", err);
//       setMoodProgress(0); // fallback
//     }
//   };

//   fetchMood();
// }, []);

// // journal progress
// useEffect(() => {
//   const fetchJournal = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(apiUrl("/api/journal/today"), {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error("Failed journal fetch");

//       const data = await res.json();

//       setJournalProgress(data.entry ? 100 : 0);

//     } catch (err) {
//       console.error("Journal fetch error:", err);
//       setJournalProgress(0); // fallback
//     }
//   };

//   fetchJournal();
// }, []);
  
  
  return (
    <div className="dashboard">

      {/* Navbar */}
     

      <Navbar />

      {/* Welcome */}
     
     <div>

       

     </div>

      <div className="grid" style={{padding:"20px"}}>

        {/* LEFT COLUMN */}
        <div className="left">

          {/* Progress */}
          <div className="progress-card" style={{ marginBottom: "10px" }}>

  <div className="progress-header">
    <h2 style={{ marginBottom: "10px" }}> Welcome Back, {user?.username}</h2>
    <button className="cta">Call-to-actions →</button>
  </div>

  {/* MASTER PROGRESS */}
  {/* <div className="master-progress">
    <div className="progress-track">
      <div className="progress-fill master"></div>
    </div>
  </div> */}

  {/* ITEMS */}
  <div className="progress-item">
    <span>Profile Setup</span>
    <span>90%</span>
  </div>
  <div className="progress-track">
    <div className="progress-fill p90"></div>
  </div>

  <div className="progress-item">
    <span>Mood Check-ins</span>
    <span>65%</span>
  </div>
  <div className="progress-track">
    <div className="progress-fill p65"></div>
  </div>

  <div className="progress-item">
    <span>Journal Entries</span>
    <span>30%</span>
  </div>
  <div className="progress-track">
    <div className="progress-fill p30"></div>
  </div>


          </div>

          <div className="grid-inside">
            <div className="left-inside">
                {/* Mood Logger */}
          <MoodTracker onMoodSaved={() => setRefreshMood(prev => !prev)}/> 
            </div>
<div className="right-inside">
  {/* Metrics */}
          <MetricsCards refresh={refreshMood}/>

    {/* Mood Trend */}
              <MoodTrend refresh={refreshMood}/>
    </div>

          </div>

         
          
          
        </div>

       

        {/* RIGHT COLUMN */}
        <div className="right">

              {/* Chat */}
         
         
    <div className="chatbot-card">

      {/* IMAGE */}
      <div className="chatbot-image">
        <img
          src={chatCardImg}
          alt="support"
        />
      </div>

      {/* CONTENT */}
      <div className="chatbot-content">
        <h3>Emotional Well-Being Chat</h3>

        <button className="chat-btn" onClick={() => setChatOpen(true)}>
          Chat Now
        </button>
      </div>

    </div>


{/* Tip */}
          <WellBeingTip/>

          {/* Care Plan */}
         <CarePlanCard/>

        </div>
<ChatWidget open={chatOpen} setChatOpen={setChatOpen} />
      </div>
    </div>
  );
};

export default Dashboard;