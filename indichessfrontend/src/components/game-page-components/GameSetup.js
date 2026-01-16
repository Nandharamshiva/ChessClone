import React, { useState } from "react";
import { FaClock } from "react-icons/fa";
import "../component-styles/GameSetup.css";

const GameSetup = ({ gameType, onStartGame, onCancel }) => {
  const [selectedTimeControl, setSelectedTimeControl] = useState(null);

  // Time control presets
  const timeControls = [
    {
      id: "blitz",
      name: "Blitz",
      description: "3 min + 2 sec",
      initialTime: 180, // 3 minutes in seconds
      increment: 2, // 2 seconds per move
      difficulty: "Fast-paced",
    },
    {
      id: "rapid",
      name: "Rapid",
      description: "10 min + 5 sec",
      initialTime: 600, // 10 minutes in seconds
      increment: 5, // 5 seconds per move
      difficulty: "Balanced",
    },
    {
      id: "classical",
      name: "Classical",
      description: "30 min + 0 sec",
      initialTime: 1800, // 30 minutes in seconds
      increment: 0, // No increment
      difficulty: "Thoughtful",
    },
    {
      id: "bullet",
      name: "Bullet",
      description: "1 min + 0 sec",
      initialTime: 60, // 1 minute in seconds
      increment: 0,
      difficulty: "Lightning",
    },
  ];

  const handleSelectTimeControl = (timeControl) => {
    setSelectedTimeControl(timeControl);
    // Auto-start after 500ms for better UX
    setTimeout(() => {
      onStartGame({
        gameType,
        timeControl: timeControl.id,
        initialTime: timeControl.initialTime,
        increment: timeControl.increment,
      });
    }, 500);
  };

  return (
    <div className="game-setup-modal">
      <div className="game-setup-content">
        <h2>Select Time Control</h2>
        <p className="game-type-info">Game Type: <strong>{gameType.replace("_", " ").toUpperCase()}</strong></p>
        
        <div className="time-controls-grid">
          {timeControls.map((tc) => (
            <div
              key={tc.id}
              className={`time-control-card ${selectedTimeControl?.id === tc.id ? "selected" : ""}`}
              onClick={() => handleSelectTimeControl(tc)}
            >
              <FaClock size={24} />
              <h3>{tc.name}</h3>
              <p className="time-desc">{tc.description}</p>
              <p className="difficulty">{tc.difficulty}</p>
            </div>
          ))}
        </div>

        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default GameSetup;
