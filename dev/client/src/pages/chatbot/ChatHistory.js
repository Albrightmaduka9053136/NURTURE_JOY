import React, { useState, useEffect } from "react";
import "../../utils/css/chatwidget.css";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../utils/api";
import Navbar from "../navbar/Navbar";

const ChatHistory = () => {
  const navigate = useNavigate();
  
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [messages, setMessages] = useState([]);
  
    // ==========================
    // 🔄 Fetch All Sessions
    // ==========================
    useEffect(() => {
      const fetchSessions = async () => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
  
        try {
          const res = await fetch(
            apiUrl("/api/chat/sessions"),
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
  
          const data = await res.json();
  
          if (res.ok) {
            setSessions(data.sessions);
          } else {
            console.error("Failed to load sessions");
          }
        } catch (err) {
          console.error("Session fetch error:", err);
        }
      };
  
      fetchSessions();
    }, [navigate]);
  
    // ==========================
    // 📂 Load One Session
    // ==========================
    const loadSession = async (session) => {
      const token = localStorage.getItem("token");
  
      try {
        const res = await fetch(
          apiUrl(`/api/chat/session/${session.id}/history`),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        const data = await res.json();
  
        if (res.ok) {
          setSelectedSession(session);
          setMessages(data.messages);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Load session error:", err);
      }
    };
  
    // ==========================
    // 🗑 Delete Session
    // ==========================
    const handleDelete = async (sessionId) => {
      const token = localStorage.getItem("token");
  
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this session?"
      );
  
      if (!confirmDelete) return;
  
      try {
        const res = await fetch(
          apiUrl(`/api/chat/session/${sessionId}`),
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!res.ok) {
          console.log("Delete failed:", res.status);
          return;
        }
  
        // Remove from UI
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  
        if (selectedSession?.id === sessionId) {
          setSelectedSession(null);
          setMessages([]);
        }
      } catch (err) {
        console.error("Delete error:", err);
      }
    };
  
    // ==========================
    // 🔁 Continue Session
    // ==========================
    const continueSession = (sessionId) => {
      localStorage.setItem("activeSession", sessionId);
      navigate("/dashboard");
    };


    // =========== END SESSION ==========
     const handleEndSession = async () => {
  if (!selectedSession) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      apiUrl(`/api/chat/session/${selectedSession.id}/sessionend`),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error();

    // update UI
    setSessions((prev) =>
      prev.map((s) =>
        s.id === selectedSession.id ? { ...s, ended: true } : s
      )
    );

    alert("Session ended successfully 🌿");

  } catch (err) {
    console.error("Failed to end session", err);
  }
};
  

  return (
    <div>
<Navbar/>
       <div className="chat-history">
      {/* <button className="back-btn" onClick={() => navigate("/dashboard")}>
        Go Back to Dashboard
      </button> */}
      

      {/* STATS */}
      <div className="stats">
        <div className="stat-card green">
          <h4>Total Sessions</h4>
          <h1>{sessions.length}</h1>
          <p>Complete history</p>
        </div>

        <div className="stat-card yellow">
          <h4>Unfinished</h4>
          <h1>{sessions.filter((s) => !s.ended).length}</h1>
          <p>Awaiting completion</p>
        </div>

        <div className="stat-card orange">
          <h4>Closed</h4>
          <h1>{sessions.filter((s) => s.ended).length}</h1>
          <p>Archived & reviewed</p>
        </div>
      </div>

      <div className="chat-grid">

        {/* LEFT PANEL */}
        <div className="sessions">
          <h3>All Sessions</h3>

          {sessions.map((session) => (
            <div
              key={session.id}
              className="session-card"
              onClick={() => loadSession(session)}
            >
              <span>
                {new Date(session.created_at).toLocaleString()}
              </span>

              <h4>{session.turns}</h4>

              <span className={`status ${session.ended ? "true" : "false"}`}>
                {session.ended ? "Ended" : "Unfinished"}
              </span>

              {!session.ended && (
                <button
                  className="continue-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    continueSession(session.id);
                  }}
                >
                  Continue Chat
                </button>
              )}

           
            </div>
          ))}
        </div>

        {/* MIDDLE (VIEW ONLY) */}
        <div className="session-view">
          {selectedSession ? (
             <div className="session-detail">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${
                    msg.role === "user" ? "user-msg" : "bot-msg"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
{
  selectedSession.ended ? (
    <p className="session-ended">This session has been ended.</p>
  ) : (
    <button className="end-btn" onClick={handleEndSession}>
      End Session
    </button>
  )}
            </div>
          ) : (
            <p>Select a session to view</p>
          )}
        </div>

       
   
      </div>
    </div>
    </div>
   
  );
};

export default ChatHistory;