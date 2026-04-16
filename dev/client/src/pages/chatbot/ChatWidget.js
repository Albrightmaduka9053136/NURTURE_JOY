import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../utils/css/chatwidget.css";
import SidebarCards from "../dash-utils/MetricsCards";
import projectLogo from "../../utils/assets/project-logo.png";
import { apiUrl } from "../../utils/api";

const ChatWidget = ({ open, setChatOpen }) => {
  const [chat, setChat] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [message, setMessage] = useState("");

  const [loadingSession, setLoadingSession] = useState(false);
  
  const navigate = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();
  

   // restart the chat session
 const startNewSession = async () => {
  const token = localStorage.getItem("token");

  setLoadingSession(true);

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

  setLoadingSession(false);
};

    // Close dropdown when clicking outside
  useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);  
    }, []);


// auto-satart session when widget opens
    useEffect(() => {
  if (open && !sessionId && chat.length === 0) {
    startNewSession();
  }
}, [open, sessionId, chat.length]);

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
  
  // ==========================
// 🔁 Resume session from history
// ==========================
useEffect(() => {
  const loadActiveSession = async () => {
    const storedSession = localStorage.getItem("activeSession");
    if (!storedSession) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        apiUrl(`/api/chat/session/${storedSession}/history`),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSessionId(storedSession);
        setChat(data.messages);

        // ✅ Open chat automatically
        setChatOpen(true);
      }

      // 🧹 clear after loading
      localStorage.removeItem("activeSession");

    } catch (err) {
      console.error("Failed to load session", err);
    }
  };

  loadActiveSession();
}, []);
 
setTimeout(() => {
  const chatBox = document.querySelector(".chat-box");
  if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
}, 100);

  return (
<div className="chat-container">
    <div className="chat-widget">

      {/* Floating Chat Icon */}
      {/* <button
        className="chat-toggle"
        onClick={() => setOpen(!open)}
      >
        💬
      </button> */}

      

      {/* Chat Window */}
      {open && (
        <div className="chat-window">

          {/* Header */}
          <div className="chat-header">
            <div className="assistant-info">
    <div className="avatar"><img src={projectLogo} alt="Assistant"/></div>
    <div>
      <div className="assistant-name">NurtureJoy</div>
      <div className="assistant-status">Online • here for you</div>
    </div>
  </div>

            <div>
                <div className="chat-controls" ref={dropdownRef}>
                  <div>
            <span className="more-history" onClick={() => setDropdownOpen(!dropdownOpen)}> ... </span>

        

        {/* DROPDOWN */}
        {dropdownOpen && (
          <div className="dropdown">
            <div className="dropdown-item" onClick={() => navigate("/sessions")}> View History </div>
            </div>
          
        )}
      </div>      

      <div>
        <button
                className="close-btn"
                onClick={() => setChatOpen(false)}
              >
                ✖
              </button>
        </div>   
                  </div>

              
            </div>

          </div>

          {/* Chat Messages */}
          <div className="chat-box">

            {chat.map((msg, index) => (
              <div key={index}>

                <div
                  className={`chat-message ${
                    msg.role === "user" ? "user" : "bot"
                  }`}
                >
                  {msg.text}
                </div>

                {/* Quick Replies */}
                {msg.quick_replies &&
                  msg.quick_replies.map((qr) => (
                    <button
                      className="quick-replies-btn"
                      key={qr.id}
                      onClick={() => handleIntent(qr.id)}
                    >
                      {qr.label}
                    </button>
                  ))}

              </div>
            ))}

          </div>

          {/* Session Controls */}
          <div style={{ marginBottom: "10px", textAlign: "right" }}>

            {
              loadingSession && <span style={{ fontSize: "12px", color: "#666" }}>Starting session...</span>
            }

            {sessionId && (
              <button
                className="end-session-btn"
                onClick={handleEndSession}
              >
                End
              </button>
            )}

            {!sessionId && (
              <button
                className="start-new-session-btn"
                onClick={startNewSession}
              >
                Start
              </button>
            )}

          </div>

          {/* Chat Input */}
          <div className="chat-input">

            <input
              value={message}
              disabled={!sessionId}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === "Enter" && sessionId){
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                sessionId
                  ? "Type your message..."
                  : "Start a session"
              }
            />

            <button
              onClick={handleSend}
              disabled={!sessionId}
            >
              ➤
            </button>

          </div>

        </div>
      )}

    </div>
  </div>
  );
};

export default ChatWidget;