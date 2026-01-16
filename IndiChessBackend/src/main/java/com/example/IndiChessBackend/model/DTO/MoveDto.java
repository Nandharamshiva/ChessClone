package com.example.IndiChessBackend.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MoveDto {
    private String gameId;
    private String from;        // e.g., "e2"
    private String to;          // e.g., "e4"
    private String piece;       // e.g., "pawn", "knight", "bishop"
    private String promotionPiece; // For pawn promotion (e.g., "queen")
    private String playerUsername;
    private long timestamp;
}
