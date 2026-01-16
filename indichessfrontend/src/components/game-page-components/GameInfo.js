import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFire, FaRegHandshake, FaRobot, FaChessPawn } from "react-icons/fa"; // Importing icons from react-icons
import GameSetup from "./GameSetup";
import "../component-styles/GameInfo.css";

const GameInfo = ({ streak }) => {
  const navigate = useNavigate();
  const [selectedGameType, setSelectedGameType] = useState(null);

  const handlePlayGame = (gameType) => {
    // Show time control selection modal
    setSelectedGameType(gameType);
  };

  const handleStartGame = (gameConfig) => {
    // Navigate to game page with game type and time control as state
    navigate("/game", { state: gameConfig });
    setSelectedGameType(null);
  };

  const handleCancelSetup = () => {
    setSelectedGameType(null);
  };

  return (
    <>
      <div className="game-info">
        {/* Streak Section */}
        <div className="streak">
          <FaFire size={30} />
          <div>
            <p>Streak</p>
            <h3>{streak} Days</h3>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="buttons">
          <button className="button" onClick={() => handlePlayGame("1v1")}>
            <FaChessPawn size={20} />
            Play 1 | 1
          </button>
          <button className="button" onClick={() => handlePlayGame("new_game")}>
            <FaChessPawn size={20} />
            New Game
          </button>
          <button className="button" onClick={() => handlePlayGame("bot")}>
            <FaRobot size={20} />
            Play Bots
          </button>
          <button className="button" onClick={() => handlePlayGame("friend")}>
            <FaRegHandshake size={20} />
            Play a Friend
          </button>
        </div>
      </div>

      {/* Game Setup Modal */}
      {selectedGameType && (
        <GameSetup
          gameType={selectedGameType}
          onStartGame={handleStartGame}
          onCancel={handleCancelSetup}
        />
      )}
    </>
  );
};

export default GameInfo;
