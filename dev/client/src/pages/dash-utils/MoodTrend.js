import React, { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import "../../utils/css/mood.css";
import { apiUrl } from "../../utils/api";


const moodEmojiMap = {
  happy: "😊",
  calm: "😌",
  anxious: "😰",
  sad: "😢",
  neutral: "😐",
  stressed: "😫"
};

const MoodTrend = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoodData();
  }, []);

  const fetchMoodData = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(apiUrl("/api/mood/history"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      console.log("Mood data:", result);

      if (!res.ok) throw new Error();

      // Transform backend data → chart format
      const formatted = result.moods.map((item) => {
  const date = new Date(item.created_at);

  return {
    day: date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric"
    }),
    month: date.toLocaleDateString("en-US", { 
       weekday: "short",
      month: "short",
      day: "numeric"
     }),
    mood: item.intensity,
    moodType: item.mood 
  };
}).sort((a, b) => new Date(b.day) - new Date(a.day));
console.log("Formatted mood data:", formatted);

      setData(formatted.slice(0,7).reverse()); 

    } catch (err) {
      console.error("Failed to fetch mood data", err);
    } finally {
      setLoading(false);
    }
  };


  const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    const emoji = moodEmojiMap[data.moodType] || "🙂";

    return (
      <div className="custom-tooltip">
        <p><strong>{data.month}</strong></p>

        <p style={{ fontSize: "18px" }}>
          {emoji} {data.moodType}
        </p>

        <p>Intensity: {data.mood}/10</p>
      </div>
    );
  }}

  return (
    <div className="trend-card">
      <h3>Your Mood Trend</h3>

      {/* Legend */}
      <div className="legend">
        <span className="legend-box"></span>
        <span>Overall Wellbeing</span>
      </div>

      {/* Loading */}
      {loading ? (
        <p>Loading mood data...</p>
      ) : data.length === 0 ? (
        <p>No mood data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8DD5F5" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#8DD5F5" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="day"
            label={{
    value: "Date",
    position: "insideBottom",
    offset: -5
  }}
            />
            <YAxis domain={[0, 10]}
            label={{
    value: "Mood Intensity",
    angle: -90,
    position: "inside"
  }}
            />

            <Tooltip  content={<CustomTooltip />}/>

            <Area
              type="monotone"
              dataKey="mood"
              stroke="#1a535c"
              strokeWidth={3}
              fill="url(#colorMood)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MoodTrend;