package com.example.IndiChessBackend.config;

import com.example.IndiChessBackend.model.User;
import com.example.IndiChessBackend.repo.UserRepo;
import com.example.IndiChessBackend.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepo userRepository;
    private final JwtService jwtService;

    @Value("${app.oauth2.authorizedRedirectUri:http://localhost:3000/home}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        // Extract user info from OAuth2 provider
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String sub = oAuth2User.getAttribute("sub");
        
        // Check if user exists in database
        Optional<User> existingUser = userRepository.findByEmailId(email);
        
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            // Create new user if doesn't exist
            user = new User();
            user.setEmailId(email);
            // Use email prefix as username for OAuth users
            user.setUsername(email.split("@")[0]);
            // OAuth users don't have a password, set a placeholder
            user.setPassword("oauth_" + sub);
            userRepository.save(user);
        }
        
        // Generate JWT token
        String token = jwtService.generateToken(user.getUsername());
        
        // Redirect to frontend with token
        String targetUrl = redirectUri + "?token=" + token + "&username=" + user.getUsername();
        
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}