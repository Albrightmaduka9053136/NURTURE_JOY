import React, { useState, useEffect } from "react";
import { apiUrl } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import "../../utils/css/mood.css";

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "🙂", label: "Content" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "😖", label: "Stressed" }
];

const MoodTracker = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [moodData, setMoodData] = useState([]);
  const [notes, setNotes] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [moodNote, setMoodNote] = useState("");
  const [savingMood, setSavingMood] = useState(false);

  const [responseMessage, setResponseMessage] = useState("");


  // mood logging
const handleSaveMood = async () => {
  if (!selectedMood) return;

  const token = localStorage.getItem("token");
  setSavingMood(true);

  try {
    const res = await fetch(
      apiUrl("/api/mood/track"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mood: selectedMood,
          intensity: intensity,
          note: moodNote,
        }),
      }
      
    );
    setResponseMessage("Mood logged successfully!");


    const data = await res.json();

    if (res.ok) {
      // Add new mood to chart instantly
      setMoodData((prev) => [
        ...prev,
        {
          date: new Date(data.mood.created_at).toLocaleDateString(),
          intensity: data.mood.intensity,
        },
      ]);

      // Reset form
      setSelectedMood(null);
      setIntensity(3);
      setMoodNote("");
    }
  } catch (err) {
    console.error("Failed to save mood");
    setResponseMessage("Failed to save mood. Please try again.");
  }

  setSavingMood(false);
};

  return (
    <div className="mood-card">
      <div className="mood-card-header">
        <h3>Log Your Mood</h3>
      
        </div>
        <div className="mood-card-body">
<p className="question">How are you feeling?</p>

{/* Mood Options */}
      <div className="mood-options">
        {moods.map((mood) => (
          <div
            key={mood.label}
            className={`mood-item ${
              selectedMood === mood.label ? "selected" : ""
            }`}
            onClick={() => setSelectedMood(mood.label)}
          >
            <span className="emoji">{mood.emoji}</span>
            <span className="label">{mood.label}</span>
          </div>
        ))}
      </div>

      {/* Intensity */}
      <label className="intensity-label">Intensity</label>

      <input
        type="range"
        min="1"
        max="10"
        value={intensity}
        onChange={(e) => setIntensity(Number(e.target.value))}
        className="slider"
      />

      <div className="scale">
        {[...Array(10)].map((_, i) => (
          <span key={i}>{i + 1}</span>
        ))}
      </div>

      {/* Notes */}
      <label>Notes (optional)</label>
      <textarea
        placeholder="Add your notes"
        value={moodNote}
        onChange={(e) => setMoodNote(e.target.value)}
      />

      {/* Buttons */}
      <div className="buttons">
        <button className="primary" onClick={handleSaveMood} disabled={!selectedMood || savingMood}>
          {savingMood ? "Saving..." : "Log Mood"}
        </button>
        
        <button className="secondary" onClick={() => navigate("/resources/journal")}>Add Notes</button>
      </div>
< p className={`response-message ${responseMessage.includes("successfully") ? "success" : "error"}`}>
          {responseMessage}
        </p>
        </div>

      

      
    </div>
  );
};

export default MoodTracker;