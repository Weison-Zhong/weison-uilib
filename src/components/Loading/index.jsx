import React from "react";
import "./index.less";
function Loading({ className = "", isCenter = false }) {
  return (
    <div
      className={`loading-wrapper${
        (className ? " " + className : "") + (isCenter ? " center" : "")
      }`}
    >
      <svg width="100" height="100">
        <g>
          <text x="50" y="55">
            loading···
          </text>
          <circle cx="50" cy="50" r="40" />
        </g>
      </svg>
    </div>
  );
}

export default React.memo(Loading);
