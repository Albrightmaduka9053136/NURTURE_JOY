import React from "react";
import "../../utils/css/user-profile.css";

const UserProfile = () => {
  return (
    <div className="profile-container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h3>Profile Overview</h3>

        <ul>
          <li className="active">Profile Overview</li>
          <li>Maternal Health Records</li>
          <li>My Nurture Plan</li>
          <li>Journal & Mood</li>
          <li>Community Connections</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="profile-content">

        {/* PROFILE CARD */}
        <div className="card profile-card">
          <img src="https://i.pravatar.cc/100" alt="avatar" />
          <h2>Nelly Nia</h2>
          <p>Expecting Mom | 28 Weeks</p>

          <div className="info">
            <p>Email: nelly@gmail.com</p>
            <p>Phone: (325) 655-5770</p>
            <p>City: San Francisco, CA</p>
          </div>

          <div className="actions">
            <button className="primary">Edit Profile</button>
            <button className="secondary">Change Password</button>
          </div>
        </div>

        {/* MATERNAL HEALTH */}
        <div className="card">
          <h3>My Maternal Health</h3>
          <p><b>Due Date:</b> September 15, 2024</p>
          <p><b>Primary OB/GYN:</b> Dr. Evelyn Reed</p>
          <p><b>Recent Check-in:</b> 27 weeks</p>
        </div>

        {/* PROGRESS */}
        <div className="card progress-card">
          <h3>Nurture Journey Progress</h3>

          <div className="progress-item">
            <span>Profile Setup</span>
            <span>90%</span>
          </div>
          <div className="progress-bar"><div className="bar p90"></div></div>

          <div className="progress-item">
            <span>Mood Check-ins</span>
            <span>65%</span>
          </div>
          <div className="progress-bar"><div className="bar p65"></div></div>

          <div className="progress-item">
            <span>Nurture Plan</span>
            <span>30%</span>
          </div>
          <div className="progress-bar"><div className="bar p30"></div></div>
        </div>

        {/* CARE TEAM */}
        <div className="card">
          <h3>Care Team & Connections</h3>

          <div className="list-item">👨‍👩‍👧 David Nia (Husband)</div>
          <div className="list-item">👩‍⚕️ Dr. Evelyn Reed</div>
          <div className="list-item">👩‍⚕️ Marcy Nia</div>
          <div className="list-item">👥 Support Group</div>
        </div>

        {/* QUICK LINKS */}
        <div className="card">
          <h3>Quick Links</h3>

          <div className="quick-link">😊 Log Mood</div>
          <div className="quick-link">📋 View Care Plan</div>
          <div className="quick-link">💬 Community Forum</div>
        </div>

        {/* PERSONAL DETAILS */}
        <div className="card">
          <h3>Personal Details</h3>
          <p><b>Birth Date:</b> September 15, 2024</p>
          <p><b>Account Created:</b> May 15, 2024</p>
        </div>

      </div>
    </div>
  );
};


export default UserProfile;