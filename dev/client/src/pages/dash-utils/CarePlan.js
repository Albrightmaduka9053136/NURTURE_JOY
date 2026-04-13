import React, { useState } from "react";
import "../../utils/css/care-metrics.css";

const initialTasks = [
  { id: 1, text: "15 min gentle stretch", completed: true },
  { id: 2, text: "Drink 8 glasses of water", completed: true },
  { id: 3, text: "Read a positive article", completed: false },
  { id: 4, text: "Connect with a friend", completed: false },
  { id: 5, text: "Complete a quick journal entry", completed: false }
];

const CarePlanCard = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="care-card">

      <h3>Your Care Plan: <span>[Date] todays date</span></h3>

      <div className="task-list">
        {tasks.map((task) => (
          <div className="task-item" key={task.id}>
            
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span className="checkmark"></span>
            </label>

            <span className={`task-text ${task.completed ? "done" : ""}`}>
              {task.text}
            </span>

            {/* RIGHT ICON */}
            {task.completed && (
              <span className="task-icon">
                {task.id === 2 ? "💧" : "✔️"}
              </span>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default CarePlanCard;