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
  const [sessionId, setSessionId] = useState(null);

  
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("mood");
    const [moodData, setMoodData] = useState([]);
    const [chatOpen, setChatOpen] = useState(false);
   

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


  // ==========================
    // 💬 Send Message
    // ==========================
  const handleSend = async () => {
  if (!message.trim()) return;

  const token = localStorage.getItem("token");
  const userText = message.trim();

  // Add user message instantly
  setChat((prev) => [
    ...prev,
    { role: "user", text: userText }
  ]);

  setMessage("");

  try {
    let currentSessionId = sessionId;

    // 🟢 START SESSION ONLY IF NONE EXISTS
    if (!currentSessionId) {
      const startRes = await fetch(
        apiUrl("/api/chat/session/start"),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const startData = await startRes.json();

      if (!startRes.ok) throw new Error("Failed to start session");

      currentSessionId = startData.session_id;
      setSessionId(currentSessionId);

      // Optional: show welcome message
      setChat((prev) => [...prev, startData.message]);
    }

    // 🟢 SEND MESSAGE AFTER SESSION EXISTS
    const res = await fetch(
      apiUrl(`/api/chat/session/${currentSessionId}/message`),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: userText }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setChat((prev) => [
        ...prev,
        { role: "assistant", text: data.error || "Error occurred" }
      ]);
      return;
    }

    setChat((prev) => [...prev, data.message]);

  } catch (err) {
    setChat((prev) => [
      ...prev,
      { role: "assistant", text: "Backend not reachable" }
    ]);
  }
};
  
    // ==========================
    // 🔘 Handle Quick Reply
    // ==========================
    const handleIntent = async (intentId) => {
    if (!sessionId) return;
  
    const token = localStorage.getItem("token");
  
    const res = await fetch(
      apiUrl(`/api/chat/session/${sessionId}/intent`),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ intent: intentId }),
      }
    );
  
    const data = await res.json();
  
    if (res.ok) {
      setChat((prev) => [...prev, data.message]);
  
      // 🔴 If session ended, disable input
      if (intentId === "end_session") {
        setSessionId(null);
      }
    }
  };
  
  
  // endsession
  const handleEndSession = async () => {
    if (!sessionId) return;
  
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch(
        apiUrl(`/api/chat/session/${sessionId}/sessionend`),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = await res.json();
  
      if (res.ok) {
        setChat((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Your session has been safely closed 🌿",
          },
        ]);
  
        setSessionId(null); // disable session
      }
    } catch (err) {
      console.error("Failed to end session", err);
    }
  };
  
  
  // restart the chat session
  const startNewSession = async () => {
    const token = localStorage.getItem("token");
  
    const res = await fetch(
      apiUrl("/api/chat/session/start"),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  
    const data = await res.json();
  
    if (res.ok) {
      setSessionId(data.session_id);
      setChat([data.message]);
    }
  };
  
  
  
  return (
    <div className="dashboard">

      {/* Navbar */}
     

      <Navbar sessionId={sessionId} />

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
          <MoodTracker/> 
            </div>
<div className="right-inside">
  {/* Metrics */}
          <MetricsCards/>

    {/* Mood Trend */}
              <MoodTrend/>
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
<ChatWidget
  chat={chat}
  message={message}
  setMessage={setMessage}
  handleSend={handleSend}
  handleIntent={handleIntent}
  startNewSession={startNewSession}
  handleEndSession={handleEndSession}
  sessionId={sessionId}
  setChatOpen={setChatOpen}
  open={chatOpen}
/>
      </div>
    </div>
  );
};

export default Dashboard;