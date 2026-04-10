import React from "react";
import "../../utils/css/today-tip.css";

const WellBeingTip = () => {
  return (
    <div className="tip-card card" >

      <h3>Today's Tip</h3>

      <div className="tip-content">

        {/* LEFT IMAGE */}
        <div className="tip-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2913/2913465.png"
            alt="vitamins"
          />
        </div>

        {/* RIGHT TEXT */}
        <div className="tip-text">
          <h4>THE IMPORTANCE OF FOLIC ACID.</h4>
          <p>
            Getting enough folic acid helps prevent birth defects.
          </p>
          <p className="sources">
            Sources: Leafy greens, fortified cereals.
          </p>
        </div>

      </div>

    </div>
  );
};

export default WellBeingTip;