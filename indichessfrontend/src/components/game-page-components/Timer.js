import React, { useState, useEffect } from "react";
import "../component-styles/Timer.css";

const Timer = ({ playerName, initialTime, increment, isActive, onTimeExpired }) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) {
      if (timeRemaining <= 0 && onTimeExpired) {
        onTimeExpired();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          if (onTimeExpired) {
            onTimeExpired();
          }
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeRemaining, onTimeExpired]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeRemaining < 60 && timeRemaining > 0;
  const isOutOfTime = timeRemaining <= 0;

  return (
    <div className={`timer-container ${isActive ? "active" : "inactive"} ${isLowTime ? "low-time" : ""} ${isOutOfTime ? "out-of-time" : ""}`}>
      <div className="player-name">{playerName}</div>
      <div className="timer-display">{formatTime(timeRemaining)}</div>
      {increment > 0 && <div className="increment-info">+{increment}s</div>}
    </div>
  );
};

export default Timer;
