import React from 'react';
import '../components/component-styles/ChessboardBackground.css';

function ChessboardBackground() {
  // Checkmate scenario - Scholar's Mate
  const pieces = [
    // White pieces
    { piece: '♙', color: 'white', position: 'a2' },
    { piece: '♙', color: 'white', position: 'b2' },
    { piece: '♙', color: 'white', position: 'c2' },
    { piece: '♙', color: 'white', position: 'e2' },
    { piece: '♙', color: 'white', position: 'f2' },
    { piece: '♙', color: 'white', position: 'g2' },
    { piece: '♙', color: 'white', position: 'h2' },
    { piece: '♖', color: 'white', position: 'a1' },
    { piece: '♘', color: 'white', position: 'b1' },
    { piece: '♗', color: 'white', position: 'c1' },
    { piece: '♕', color: 'white', position: 'd1' },
    { piece: '♔', color: 'white', position: 'e1' },
    { piece: '♗', color: 'white', position: 'f1' },
    { piece: '♘', color: 'white', position: 'g1' },
    { piece: '♖', color: 'white', position: 'h1' },
    // Moved white pieces for checkmate
    { piece: '♗', color: 'white', position: 'c4' },
    { piece: '♕', color: 'white', position: 'h5' },

    // Black pieces
    { piece: '♟', color: 'black', position: 'a7' },
    { piece: '♟', color: 'black', position: 'b7' },
    { piece: '♟', color: 'black', position: 'c7' },
    { piece: '♟', color: 'black', position: 'd7' },
    { piece: '♟', color: 'black', position: 'e7' },
    { piece: '♟', color: 'black', position: 'f7' },
    { piece: '♟', color: 'black', position: 'g7' },
    { piece: '♞', color: 'black', position: 'b8' },
    { piece: '♞', color: 'black', position: 'g8' },
    { piece: '♝', color: 'black', position: 'c8' },
    { piece: '♝', color: 'black', position: 'f8' },
    { piece: '♛', color: 'black', position: 'd8' },
    { piece: '♚', color: 'black', position: 'e8' },
    { piece: '♜', color: 'black', position: 'a8' },
    { piece: '♜', color: 'black', position: 'h8' },
  ];

  // Convert position to grid coordinates (a1 = bottom-left)
  const getGridPosition = (position) => {
    const file = position.charCodeAt(0) - 97; // a=0, h=7
    const rank = parseInt(position[1]) - 1; // 1=0, 8=7
    return { col: file + 1, row: 8 - rank }; // CSS grid is 1-indexed, top-down
  };

  return (
    <div className="chessboard-background">
      <div className="chessboard">
        {/* Create 64 squares */}
        {Array.from({ length: 64 }).map((_, index) => {
          const row = Math.floor(index / 8) + 1;
          const col = (index % 8) + 1;
          const isLight = (row + col) % 2 === 0;
          
          return (
            <div
              key={index}
              className={`square ${isLight ? 'light' : 'dark'}`}
              style={{
                gridRow: row,
                gridColumn: col,
              }}
            >
              {/* Render pieces on this square */}
              {pieces.map((p, pidx) => {
                const pos = getGridPosition(p.position);
                if (pos.row === row && pos.col === col) {
                  return (
                    <span
                      key={pidx}
                      className={`piece ${p.color}-piece`}
                    >
                      {p.piece}
                    </span>
                  );
                }
                return null;
              })}
            </div>
          );
        })}
      </div>
      <div className="checkmate-label">
        <h1>CHECKMATE</h1>
        <p>Scholar's Mate</p>
      </div>
    </div>
  );
}

export default ChessboardBackground;
