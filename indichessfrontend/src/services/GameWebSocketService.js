import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

class GameWebSocketService {
  constructor() {
    this.stompClient = null;
    this.gameId = null;
    this.isConnected = false;
    this.moveCallbacks = [];
    this.gameCallbacks = [];
  }

  /**
   * Connect to WebSocket server
   */
  connect(gameId, playerUsername, onConnect) {
    this.gameId = gameId;
    const socket = new SockJS("http://localhost:8080/ws-chess");
    const token = sessionStorage.getItem("authToken");
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log("WebSocket Connected");
        this.isConnected = true;

        // Subscribe to game topic after connection is established
        this.stompClient.subscribe(`/topic/game/${gameId}`, (message) => {
          const data = JSON.parse(message.body);
          console.log("Message received:", data);

          // Call all registered callbacks
          if (data.type === "move") {
            this.moveCallbacks.forEach((callback) => callback(data));
          } else {
            this.gameCallbacks.forEach((callback) => callback(data));
          }
        });

        // Join the game
        this.sendMessage("/app/game/" + gameId + "/join", {
          gameId,
          playerUsername,
          type: "join",
          timestamp: Date.now(),
        });

        // Call the connection callback
        if (onConnect) onConnect();
      },
      onDisconnect: () => {
        console.log("WebSocket Disconnected");
        this.isConnected = false;
      },
      onStompError: (frame) => {
        console.error("STOMP Error:", frame.headers["message"], frame.body);
      },
      onWebSocketError: (error) => {
        console.error("WebSocket Error:", error);
      },
    });

    this.stompClient.activate();
  }

  /**
   * Send a move to the WebSocket server
   */
  sendMove(from, to, piece, promotionPiece = null, playerUsername) {
    if (!this.stompClient || !this.isConnected) {
      console.error("WebSocket not connected");
      return;
    }

    const move = {
      gameId: this.gameId,
      from,
      to,
      piece,
      promotionPiece,
      playerUsername,
      timestamp: Date.now(),
    };

    this.sendMessage("/app/game/" + this.gameId + "/move", move);
  }

  /**
   * Offer draw
   */
  offerDraw(playerUsername) {
    if (!this.stompClient || !this.isConnected) {
      console.error("WebSocket not connected");
      return;
    }

    this.sendMessage("/app/game/" + this.gameId + "/offer-draw", {
      gameId: this.gameId,
      playerUsername,
      type: "offer_draw",
      timestamp: Date.now(),
    });
  }

  /**
   * Resign from game
   */
  resign(playerUsername) {
    if (!this.stompClient || !this.isConnected) {
      console.error("WebSocket not connected");
      return;
    }

    this.sendMessage("/app/game/" + this.gameId + "/resign", {
      gameId: this.gameId,
      playerUsername,
      type: "resign",
      timestamp: Date.now(),
    });
  }

  /**
   * Register callback for move messages
   */
  onMoveReceived(callback) {
    this.moveCallbacks.push(callback);
  }

  /**
   * Register callback for game messages (join, leave, draw, resign)
   */
  onGameMessageReceived(callback) {
    this.gameCallbacks.push(callback);
  }

  /**
   * Send a message to the server
   */
  sendMessage(destination, message) {
    if (this.stompClient && this.isConnected) {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(message)
      });
      console.log("Message sent:", message);
    } else {
      console.error("WebSocket not connected, cannot send message");
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(playerUsername) {
    if (this.stompClient && this.isConnected) {
      this.sendMessage("/app/game/" + this.gameId + "/leave", {
        gameId: this.gameId,
        playerUsername,
        type: "leave",
        timestamp: Date.now(),
      });

      this.stompClient.deactivate();
      console.log("WebSocket Disconnected");
      this.isConnected = false;
    }
  }

  /**
   * Check if connected
   */
  isWebSocketConnected() {
    return this.isConnected;
  }
}

export default new GameWebSocketService();
