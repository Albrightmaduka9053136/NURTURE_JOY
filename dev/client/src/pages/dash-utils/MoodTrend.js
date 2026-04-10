import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import "../../utils/css/mood.css";

const data = [
  { day: "Mon 7", mood: 3 },
  { day: "Mon 9", mood: 7 },
  { day: "Tue 19", mood: 4 },
  { day: "Wed 13", mood: 9 },
  { day: "Thu 1", mood: 5 },
  { day: "Fri 4", mood: 8 },
  { day: "Sat 18", mood: 6 }
];

const MoodTrend = () => {
  return (
    <div className="trend-card">
 <h3>Your Mood Trend</h3>
      {/* Legend */}
      <div className="legend">
        <span className="legend-box"></span>
        <span>Overall Wellbeing</span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          
          <defs>
            <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8DD5F5" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#8DD5F5" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis dataKey="day" />
          <YAxis domain={[0, 10]} />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="mood"
            stroke="#1a535c"
            strokeWidth={3}
            fill="url(#colorMood)"
          />
        </AreaChart>
      </ResponsiveContainer>

  

    </div>
  );
};

export default MoodTrend;