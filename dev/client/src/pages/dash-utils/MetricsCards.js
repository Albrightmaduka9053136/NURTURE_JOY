import React, { useEffect, useState } from "react";
import "../../utils/css/care-metrics.css";
import { apiUrl } from "../../utils/api";

const MetricsCards = ({ refresh }) => {
  const [moodStreak, setMoodStreak] = useState(0);
  const [journalStreak, setJournalStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreaks();
  }, [refresh]);

  const fetchStreaks = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(apiUrl("/api/metrics/streaks"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error();

      setMoodStreak(data.moodStreak);
      setJournalStreak(data.journalStreak);

    } catch (err) {
      console.error("Failed to fetch streaks", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="metrics-container">

      <div className="metrics-grid">

        {/* Mood Streak */}
        <div className="card mood">
          <div className="card-content">
            <div>
              <p>Mood Streak:</p>
              <h2>
                {loading ? "..." : `🔥 ${moodStreak} Days`}
              </h2>
            </div>
          </div>
        </div>

        {/* Journal Streak */}
        <div className="card journal">
          <div className="card-content">
            <div>
              <p>Journal Streak:</p>
              <h2>
                {loading ? "..." : `🔥 ${journalStreak} Days`}
              </h2>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default MetricsCards;