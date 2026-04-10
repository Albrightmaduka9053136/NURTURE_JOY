import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../utils/css/chatwidget.css";
import SidebarCards from "../dash-utils/MetricsCards";
import projectLogo from "../../utils/assets/project-logo.png";

const ChatWidget = ({
  open,
  setChatOpen,
  chat,
  message,
  setMessage,
  handleSend,
  handleIntent,
  startNewSession,
  handleEndSession,
  sessionId
}) => {

  
  const navigate = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();
  
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
              placeholder={
                sessionId
                  ? "Type your message..."
                  : "Session ended. Start a new session."
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