import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BoardLayout from "./BoardLayout";
import GamePlayControlContainer from "./GamePlayControlContainer";
import Timer from "./Timer";
import "../component-styles/GameContainer.css";



const GameContainer = () => {
  const location = useLocation();
  const gameConfig = location.state || {};
  
  const [moves, setMoves] = useState([]);
  const [whiteTime, setWhiteTime] = useState(gameConfig.initialTime || 600);
  const [blackTime, setBlackTime] = useState(gameConfig.initialTime || 600);
  const [currentPlayer, setCurrentPlayer] = useState("white");
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState(null);

  // Function to add a move to the history
  const addMove = (move) => {
    if(move.piece !== move.piece.toLowerCase())
    {
      const newMove = {move, moveToWhite : move.moveTo };
      setMoves((moves) => [...moves, newMove]);
      
      // Switch to black's turn and add increment
      setCurrentPlayer("black");
      if (gameConfig.increment) {
        setWhiteTime(prev => prev + gameConfig.increment);
      }
    }
    else{
      setMoves((prevMoves) => {
      const newMoves = [...prevMoves];
      const lastMove = { 
        ...newMoves[newMoves.length - 1], 
        moveToBlack: move.moveTo,
        tc: `Black's Turn: ${move.tc}`,
        tr: move.tr
      };
      newMoves[newMoves.length - 1] = lastMove;
      return newMoves;
    });
    
      // Switch to white's turn and add increment
      setCurrentPlayer("white");
      if (gameConfig.increment) {
        setBlackTime(prev => prev + gameConfig.increment);
      }
    }
  };

  const handleTimeExpired = (player) => {
    setGameEnded(true);
    const opponent = player === "white" ? "black" : "white";
    setWinner(opponent);
    console.log(`${player} time expired! ${opponent} wins!`);
  };

  return (
    <div className="game-container">
      <div className="game-main-layout">
        {/* Left Section: Timers */}
        <div className="board-with-timers">
          {/* Black Timer (Top) */}
          <div className="timer-column timer-top">
            <Timer 
              playerName="Black"
              initialTime={blackTime}
              increment={gameConfig.increment || 0}
              isActive={currentPlayer === "black" && !gameEnded}
              onTimeExpired={() => handleTimeExpired("black")}
            />
          </div>

          {/* White Timer (Bottom) */}
          <div className="timer-column timer-bottom">
            <Timer 
              playerName="White"
              initialTime={whiteTime}
              increment={gameConfig.increment || 0}
              isActive={currentPlayer === "white" && !gameEnded}
              onTimeExpired={() => handleTimeExpired("white")}
            />
          </div>
        </div>

        {/* Center: Board */}
        <div className="board-center">
          <BoardLayout addMove={addMove}/>
        </div>

        {/* Right Section: GamePlayControl (Analysis) */}
        <GamePlayControlContainer moves={moves}/>
      </div>
      
      {/* Game End Alert */}
      {gameEnded && (
        <div className="game-end-alert">
          <h2>⏱️ Time's Up!</h2>
          <p>{winner.toUpperCase()} wins by timeout!</p>
        </div>
      )}
    </div>
  );
};

export default GameContainer;
