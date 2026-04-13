import React from "react";
import "../../utils/css/care-metrics.css";

const MetricsCards = () => {
  return (
    <div className="metrics-container">

      {/* <h3>Summarized Metrics Flashcards</h3> */}

      <div className="metrics-grid">

        {/* Mood Streak */}
        <div className="card mood">
          <div className="card-content">
            <div>
              <p>Mood Streak:</p>
              <h2>5 Days</h2>
            </div>
            
          </div>
        </div>

        {/* Journal Posts */}
        <div className="card journal">
          <div className="card-content">
            <div>
              <p>Journal Posts:</p>
              <h2>10 entries</h2>
            </div>
          </div>
        </div>

        {/* Total Logs */}
        <div className="card logs">
          <div className="card-content">
            <div>
              <p>Total Logs:</p>
              <h2>32</h2>
            </div>
            
          </div>
        </div>

        {/* Community Likes */}
        <div className="card likes">
          <div className="card-content">
            <div>
              <p>Community Likes:</p>
              <h2>18</h2>
            </div>
           
          </div>
        </div>

      </div>

    </div>
  );
};

export default MetricsCards;