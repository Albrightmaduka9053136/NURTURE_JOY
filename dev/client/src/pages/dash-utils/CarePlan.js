import React from "react";

const tasks = [
  "Drink 8 glasses of water 💧",
  "Take a gentle 15-min walk 🚶",
  "Practice deep breathing 🧘",
  "Take prenatal vitamins 💊",
  "Write 3 things you're grateful for ✍️",
  "Rest or nap 😴",
];

const CarePlan = () => {
  return (
    <div className="card">
      <h3>🌼 Care Plan for Today</h3>

      {tasks.map((task, index) => (
        <div key={index} className="task">
          <input type="checkbox" />
          <span>{task}</span>
        </div>
      ))}
    </div>
  );
};

export default CarePlan;