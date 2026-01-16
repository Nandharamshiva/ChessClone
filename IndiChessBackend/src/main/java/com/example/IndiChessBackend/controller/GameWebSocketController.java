package com.example.IndiChessBackend.controller;

import com.example.IndiChessBackend.model.DTO.GameMessageDto;
import com.example.IndiChessBackend.model.DTO.MoveDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.concurrent.ConcurrentHashMap;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
@RequiredArgsConstructor
public class GameWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    
    // Store active game sessions
    private static final ConcurrentHashMap<String, GameSession> gameSessions = new ConcurrentHashMap<>();

    /**
     * Handle player joining a game
     */
    @MessageMapping("/game/{gameId}/join")
    public void joinGame(@DestinationVariable String gameId, GameMessageDto message) {
        log.info("Player {} joining game {}", message.getPlayerUsername(), gameId);
        
        GameSession session = gameSessions.computeIfAbsent(gameId, k -> new GameSession(gameId));
        session.addPlayer(message.getPlayerUsername());
        
        message.setType("join");
        message.setTimestamp(System.currentTimeMillis());
        
        // Broadcast to all players in this game
        messagingTemplate.convertAndSend("/topic/game/" + gameId, message);
    }

    /**
     * Handle player move in game
     */
    @MessageMapping("/game/{gameId}/move")
    public void handleMove(@DestinationVariable String gameId, MoveDto move) {
        log.info("Move from {} in game {}: {} to {}", 
                move.getPlayerUsername(), gameId, move.getFrom(), move.getTo());
        
        move.setGameId(gameId);
        move.setTimestamp(System.currentTimeMillis());
        
        // Validate and broadcast move to all players in the game
        GameMessageDto messageDto = new GameMessageDto();
        messageDto.setType("move");
        messageDto.setGameId(gameId);
        messageDto.setPlayerUsername(move.getPlayerUsername());
        messageDto.setMove(move);
        messageDto.setTimestamp(System.currentTimeMillis());
        
        messagingTemplate.convertAndSend("/topic/game/" + gameId, messageDto);
    }

    /**
     * Handle player leaving game
     */
    @MessageMapping("/game/{gameId}/leave")
    public void leaveGame(@DestinationVariable String gameId, GameMessageDto message) {
        log.info("Player {} leaving game {}", message.getPlayerUsername(), gameId);
        
        GameSession session = gameSessions.get(gameId);
        if (session != null) {
            session.removePlayer(message.getPlayerUsername());
            
            if (session.getPlayers().isEmpty()) {
                gameSessions.remove(gameId);
                log.info("Game {} session ended", gameId);
            }
        }
        
        message.setType("leave");
        message.setTimestamp(System.currentTimeMillis());
        messagingTemplate.convertAndSend("/topic/game/" + gameId, message);
    }

    /**
     * Handle draw offer
     */
    @MessageMapping("/game/{gameId}/offer-draw")
    public void offerDraw(@DestinationVariable String gameId, GameMessageDto message) {
        log.info("Player {} offers draw in game {}", message.getPlayerUsername(), gameId);
        
        message.setType("offer_draw");
        message.setTimestamp(System.currentTimeMillis());
        messagingTemplate.convertAndSend("/topic/game/" + gameId, message);
    }

    /**
     * Handle resignation
     */
    @MessageMapping("/game/{gameId}/resign")
    public void resign(@DestinationVariable String gameId, GameMessageDto message) {
        log.info("Player {} resigns from game {}", message.getPlayerUsername(), gameId);
        
        message.setType("resign");
        message.setTimestamp(System.currentTimeMillis());
        messagingTemplate.convertAndSend("/topic/game/" + gameId, message);
    }

    /**
     * Get game session info
     */
    public static GameSession getGameSession(String gameId) {
        return gameSessions.get(gameId);
    }

    /**
     * Inner class to manage game sessions
     */
    public static class GameSession {
        private final String gameId;
        private final ConcurrentHashMap<String, Boolean> players = new ConcurrentHashMap<>();
        private long createdAt;

        public GameSession(String gameId) {
            this.gameId = gameId;
            this.createdAt = System.currentTimeMillis();
        }

        public void addPlayer(String username) {
            players.put(username, true);
        }

        public void removePlayer(String username) {
            players.remove(username);
        }

        public ConcurrentHashMap<String, Boolean> getPlayers() {
            return players;
        }

        public String getGameId() {
            return gameId;
        }

        public long getCreatedAt() {
            return createdAt;
        }
    }
}
