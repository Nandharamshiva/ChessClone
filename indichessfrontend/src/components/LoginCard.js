import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";

function LoginCard({ handleToggleSignup }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle OAuth2 redirect with token
  useEffect(() => {
    const token = searchParams.get("token");
    const username = searchParams.get("username");
    
    if (token && username) {
      // Store the JWT token and username from OAuth provider
      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("username", username);
      console.log("OAuth login successful");
      navigate("/home");
    }
  }, [searchParams, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login request to backend
      const response = await api.post("/login", {
        username,
        password
      });

      // If login is successful, store token and redirect to home
      if (response && response.data) {
        // Store the JWT token
        sessionStorage.setItem("authToken", response.data);
        // Store username for later use in game
        sessionStorage.setItem("username", username);
        console.log("Login successful");
        navigate("/home");
      }
      else{
        console.log("Not Auth");
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-card">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="simple-auth-btn">Login</button>
      </form>

      <div className="oauth-buttons">
        <a href="http://localhost:8080/oauth2/authorization/google">
          <button className="btn-google" type="button">Login with Google</button>
        </a>
        <a href="http://localhost:8080/oauth2/authorization/github">
          <button className="btn-github" type="button">Login with GitHub</button>
        </a>
      </div>

      <div className="signup-link">
        Not an existing user? 
        <button className="simple-auth-btn" onClick={handleToggleSignup}>Sign up here</button>
      </div>
    </div>
  );
}

export default LoginCard;
