import React, { useEffect, useState } from "react";
import "../../utils/css/journal.css";
import { apiUrl } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";

const labels = ["Work", "Motivation", "Mindfulness", "Creativity", "Gratitude", "Health", "Personal", "Reflection"];

const Journal = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [entries, setEntries] = useState([]);
  const [prompt, setPrompt] = useState("")
  const [title, setTitle] = useState("");
  const [expandedEntryId, setExpandedEntryId] = useState(null);


  const toggleLabel = (label) => {
    setSelectedLabels((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  };

const saveEntry = () => {
  if (!content) return;

  const newEntry = {
    id: Date.now(),
    date: new Date().getDate(),
    label: selectedLabels[0] || "Personal",
  title: title,
    content: content
  };

  setEntries([newEntry, ...entries]);
  setContent("");
  setTitle("");
  setSelectedLabels([]);
};

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
  try {
    const res = await fetch(apiUrl("/api/journal/prompt"));

    if (!res.ok) throw new Error("Failed to fetch prompt");

    const data = await res.json();
    setPrompt(data.prompt);

  } catch (error) {
    console.error("Prompt error:", error);
    setPrompt("How are you feeling today?");
  }
};

const fetchEntries = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(apiUrl("/api/journal"), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch entries");

    const data = await res.json();
    setEntries(data.entries || []);

  } catch (error) {
    console.error("Entries error:", error);
    setEntries([]);
  }
};

  // ==========================
  // 💾 Save Journal
  // ==========================
  const handleSave = async () => {
    if (!content.trim()) return;

    const token = localStorage.getItem("token");
    setLoading(true);

    const res = await fetch(apiUrl("/api/journal"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
      prompt: prompt,
      title: title,
      label: selectedLabels[0] || "Personal",
      content: content,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setContent("");
      setTitle("");
      fetchEntries();
      fetchPrompt(); // refresh prompt
    }

    setLoading(false);
  };



  // ========== show journal details (for now just alert) ==========
  const toggleEntry = (id) => {
  setExpandedEntryId((prev) => (prev === id ? null : id));
};


    // ========================== most used lables (for stats) ==========================
    const getMostUsedLabel = () => {
  if (!entries.length) return "None";

  const count = {};

  entries.forEach((entry) => {
    const label = entry.label || "Personal";
    count[label] = (count[label] || 0) + 1;
  });

  // find max
  let maxLabel = "None";
  let maxCount = 0;

  for (const label in count) {
    if (count[label] > maxCount) {
      maxCount = count[label];
      maxLabel = label;
    }
  }

  return maxLabel;
};

  return (
    <div>
      {/* navbar */}
      <Navbar />
     <div className="journal-page">
       {/* STATS */}
   <div className="journal-header-card">

  {/* LEFT SIDE */}
  <div className="journal-header-left">
    <h2>Your Nurture Journal</h2>

    <div className="prompt-box">
      <h4>Today's Prompt</h4>
      <p className="prompt">{prompt}</p>
    </div>
  </div>

  {/* RIGHT SIDE (FLASHCARDS) */}
  <div className="journal-header-right">

    <div className="flashcard">
      
      <h3>{entries.length}</h3><p>Total Entries</p>
    </div>

    <div className="flashcard">
    
      <h3>
        {getMostUsedLabel()}
      </h3>  <p>Most Used Label</p>
    </div>

  </div>

</div>



      <div className="journal-grid">

        {/* LEFT: CREATE ENTRY */}
        <div className="card">
        <p className="journal-new-entry">New Entry</p>

          {/* LABELS */}
          <div className="labels">
            {labels.map((label) => (
              <span
                key={label}
                className={`label ${
                  selectedLabels.includes(label) ? "active" : ""
                }`}
                onClick={() => toggleLabel(label)}
                value={label}
              >
                {label}
              </span>
            ))}
          </div>

{/* title */}
          <input
            type="text"
            placeholder="Subject"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="journal-title-input"
          />
          {/* TEXTAREA */}
          <textarea
            placeholder="Write your thoughts here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button className="primary" onClick={handleSave}>
             Save Journal Entry
          </button>

        </div>

        {/* RIGHT: SAVED ENTRIES */}
        <div className="entries-section">

          <div className="entries-header">
            <h3>Your Saved Entries</h3>
            <input placeholder="Search..." />
          </div>
             <div className="journal-scroll">

           {entries.length === 0 && <p>No journal entries yet.</p>}

           {entries.map((entry) => (
            <div key={entry.id} className="journal-entry-card">
              <div className="date-box">
                <span>Date</span><h3>
  {entry.created_at &&
  new Date(entry.created_at).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short"
  })}
</h3>
                
              </div>

              <div className="entry-content">
                  <span className={`tag ${entry.label.toLowerCase()}`}>
                    {entry.label}
                  </span> 
                  
                  {entry.prompt && (
                <div className="journal-entry-prompt">
                  <strong>Prompt:</strong> {entry.prompt}
                </div>
              )}
              <p className="journal-entry-title">{entry.title}</p>

              <p className="journal-entry-link" onClick={() => toggleEntry(entry.id)}>
                Show Journal details
              </p>

               {/* CONDITIONAL CONTENT */}
               <div className="journal-entry-details">
                {expandedEntryId === entry.id && (
    <p className="journal-entry-content">
      {entry.content}
    </p>
  )}
               </div>
  
                </div>

            </div>
          ))}
         </div>

          

        </div>

      </div>

     

    </div> 
    </div>
    
  );
};

export default Journal;