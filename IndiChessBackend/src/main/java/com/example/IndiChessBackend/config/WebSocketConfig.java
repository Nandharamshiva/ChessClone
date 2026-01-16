package com.example.IndiChessBackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple message broker with a /topic destination prefix for broadcasting
        config.enableSimpleBroker("/topic", "/queue");
        // Set the prefix for messages received from clients
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the WebSocket endpoint with CORS allowed
        registry.addEndpoint("/ws-chess")
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS(); // Fallback for browsers that don't support WebSocket
    }
}
