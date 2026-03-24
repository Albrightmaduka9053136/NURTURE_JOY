import React, { useEffect, useState } from "react";
import { apiUrl } from "../utils/api";
import "../utils/css/index.css";
import { useNavigate } from "react-router-dom";

const SessionHistory = () => {
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

  return (
    <div className="history-page">
      {/* NAVBAR */}
      <nav className="dashboard-navbar">
        <div className="logo">NURTURE JOY</div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="history-container">
        {/* LEFT COLUMN */}
        <div className="history-left">
            <div className="history-header">
             <p className="session-count">
           You have {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
          </p>   
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
              Go Back to Dashboard
            </button>
            </div>
        
          <h2>Your Sessions</h2>

          {sessions.map((session) => (
            <div
              key={session.id}
              className={`session-card ${
                selectedSession?.id === session.id ? "active-card" : ""
              }`}
              onClick={() => loadSession(session)}
            >
              <div className="card-title">
                {new Date(session.created_at).toLocaleString()}
              </div>

              <div className="card-subtitle">
                Turns: {session.turns}
              </div>

              <div className="card-text">
                Status: {session.ended ? "Completed" : "Active"}
              </div>

              <div className="card-actions">
                <button
                  className="view-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    loadSession(session);
                  }}
                >
                  View
                </button>

                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(session.id);
                  }}
                >
                  Delete
                </button>

                {!session.ended && (
                  <button
                    className="continue-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      continueSession(session.id);
                    }}
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN */}
        <div className="history-right">
          {!selectedSession && (
            <div className="empty-state">
              <h3>Select a session to view details</h3>
            </div>
          )}

          {selectedSession && (
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionHistory;