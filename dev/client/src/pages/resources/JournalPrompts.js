// 

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../utils/css/index.css";

const Journal = () => {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================
  // 🔐 Fetch Prompt + Journals
  // ==========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchPrompt();
    fetchEntries();
  }, [navigate]);

  const fetchPrompt = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/journal/prompt");
    const data = await res.json();
    if (res.ok) setPrompt(data.prompt);
  };

  const fetchEntries = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:5000/api/journal", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (res.ok) setEntries(data.entries);
  };

  // ==========================
  // 💾 Save Journal
  // ==========================
  const handleSave = async () => {
    if (!content.trim()) return;

    const token = localStorage.getItem("token");
    setLoading(true);

    const res = await fetch("http://127.0.0.1:5000/api/journal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        content: content,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setContent("");
      fetchEntries();
      fetchPrompt(); // refresh prompt
    }

    setLoading(false);
  };

 return (
  <div className="journal-page">

    <div className="journal-header">
      <h1>Journal</h1>
      <button onClick={() => navigate("/dashboard")} className="back-btn">
        Go to Dashboard
      </button>
    </div>

    <div className="journal-layout">

      {/* LEFT SIDE — Today's Prompt */}
      <div className="journal-left">
        <div className="journal-card">
          <h3>Today's Prompt</h3>
          <p className="journal-prompt">{prompt}</p>

          <textarea
            placeholder="Write your thoughts here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="journal-textarea"
          />

          <button
            onClick={handleSave}
            className="save-journal-btn"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Journal"}
          </button>
        </div>
      </div>

      {/* RIGHT SIDE — Previous Entries */}
      <div className="journal-right" style={{  }}>
        <h3>Previous Journals</h3>

        <div className="journal-scroll">

          {entries.length === 0 && <p>No journal entries yet.</p>}

          {entries.map((entry) => (
            <div key={entry.id} className="journal-entry-card">
              <div className="journal-entry-date">
                {new Date(entry.created_at).toLocaleString()}
              </div>

              {entry.prompt && (
                <div className="journal-entry-prompt">
                  <strong>Prompt:</strong> {entry.prompt}
                </div>
              )}

              <div className="journal-entry-content">
                {entry.content}
              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  </div>
);
}

export default Journal;