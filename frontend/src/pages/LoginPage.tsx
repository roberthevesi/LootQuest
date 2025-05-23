import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
import useWindowWidth from "../hooks/useWindowWidth";
import logo from "../assets/logo.png"

export default function LoginPage() {
  const screenWidth = useWindowWidth();
  const isMobile = screenWidth < 768;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: email, 
          password: password 
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Invalid email or password.");
        } else if (response.status === 400) {
          alert("Please check your email and password format.");
        } else {
          alert("Login failed. Please try again.");
        }
        return;
      }

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("phoneNumber", data.phoneNumber);
        localStorage.setItem("email", data.email);
        
        if (data.expiresIn) {
          const expirationTime = Date.now() + data.expiresIn;
          localStorage.setItem("tokenExpiration", expirationTime.toString());
        }
        
        alert("Login successful!");
        navigate("/home");
      } else {
        alert("Login failed - no token received.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="auth-component">
          <img src={logo} alt="Logo" className="logo" />
          <form className="auth-form" onSubmit={handleLogin}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </button>
          </form>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
        {!isMobile && <div className="welcome-image-component"></div>}
      </div>
    </div>
  );
}
