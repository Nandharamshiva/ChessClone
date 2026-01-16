package com.example.IndiChessBackend.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameMessageDto {
    private String type;          // "move", "join", "leave", "gameEnd", "offer_draw", "resign"
    private String gameId;
    private String playerUsername;
    private MoveDto move;         // Null for non-move messages
    private String message;       // General message content
    private String opponent;      // Opponent username
    private long timestamp;
}
