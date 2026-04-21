import React, { useState } from "react";
import "../../utils/css/community.css";
import Navbar from "../navbar/Navbar";

const Community = () => {
  const [selectedTopic, setSelectedTopic] = useState("All");

  const topics = [
    "All Discussions",
    "Pregnancy Tips",
    "Mental Wellness",
    "Nutrition",
    "Postpartum Care",
    "Support Groups"
  ];

  return (
    <div className="community-wrapper">
        <Navbar/>
    
    <div className="community-container">

      {/* LEFT SIDEBAR */}
      <div className="community-sidebar">
        <h3>Topics</h3>

        {topics.map((topic) => (
          <div
            key={topic}
            className={`topic-item ${
              selectedTopic === topic ? "active" : ""
            }`}
            onClick={() => setSelectedTopic(topic)}
          >
            {topic}
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="community-main">

        {/* Header */}
        <div className="community-header">
          <h2>Community</h2>
          <button className="new-post-btn">+ New Discussion</button>
        </div>

        {/* POST CARD */}
        <div className="post-card">
          <div className="post-header">
            <div className="avatar">N</div>
            <div>
              <h4>Nelly Mom</h4>
              <span>2 hours ago</span>
            </div>
          </div>

          <h3>Managing stress during pregnancy</h3>
          <p>
            I've been feeling anxious lately. Any tips that helped you stay calm?
          </p>

          <div className="post-actions">
            <span>💬 3 replies</span>
            <span>❤️ 12</span>
          </div>
        </div>

        {/* REPLY SECTION */}
        <div className="reply-box">
          <input placeholder="Write a reply..." />
          <button>Send</button>
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="community-right">
        <h3>Online Now</h3>

        <div className="user">
          <span className="dot"></span> Mary
        </div>
        <div className="user">
          <span className="dot"></span> Sarah
        </div>
        <div className="user">
          <span className="dot"></span> Joy
        </div>
      </div>

    </div>

    </div>
  );
};

export default Community;