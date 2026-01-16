import React, { useEffect } from "react";
import api from "../../api";

const Moves = ({ moves }) => {

  // Function to send move data to the backend API
  // Note: Moves are already synced via WebSocket in real-time, 
  // this REST endpoint is optional for persistence/analytics
  const sendMoveToServer = (move) => {
    // Optional: Send to backend for move history/analytics
    // Commented out as WebSocket already handles real-time sync
    // api.post('/game', move)
    //   .then(response => console.log("Move submitted:", response.data))
    //   .catch(error => console.error("Error submitting move:", error));
  };

  // Effect hook to watch changes in the `moves` array and send to the API
  useEffect(() => {
    if (moves.length > 0) {
      const lastMove = moves[moves.length - 1]; // Get the latest move

      // Prepare the move object with the required data
      const ply = moves.length;  // Ply is the size of the move array
      const moveNumber = ply % 2 === 1 ? 2 * ply - 1 : 2 * ply;  // Calculate the move number
      const color = moveNumber % 2 === 1 ? 'WHITE' : 'BLACK';  // Determine the color
      const uci = lastMove.moveFrom + lastMove.moveTo;  // UCI notation
      const san = lastMove.moveTo;  // SAN notation

      const move = {
        ply: ply,
        moveNumber: moveNumber,
        color: color,
        uci: uci,
        san: san,
        fenBefore: lastMove.fenBefore,
        fenAfter: lastMove.fenAfter,   
        createdAt: new Date().toISOString(),  // Date when the move was created
      };

      // Call the function to send the move to the server
      sendMoveToServer(move);
    }
  }, [moves]); // Dependency on `moves` array

  return (
    <div className="moves">
      <h2>Moves</h2>
      <ul>
        {moves.map((move, index) => (
          <li key={index}>
            {index + 1} {move.moveToWhite} {move.moveToBlack}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Moves;
