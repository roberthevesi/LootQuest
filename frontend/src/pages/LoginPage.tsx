import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
import useWindowWidth from "../hooks/useWindowWidth";
import logo from "../assets/logo.png";
import mapImage from "../assets/map.png";

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
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          fcmToken: localStorage.getItem("fcmToken"),
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

        if (data.user.phoneNumber) {
          localStorage.setItem("phoneNumber", data.user.phoneNumber);
        }

        if (data.user.email) {
          localStorage.setItem("email", data.user.email);
        }

        if (data.expiresIn) {
          const expirationTime = Date.now() + data.expiresIn;
          localStorage.setItem("tokenExpiration", expirationTime.toString());
        }

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
        {!isMobile && (
          <div
            className="welcome-image-component"
            style={{ backgroundImage: `url(${mapImage})` }}
          ></div>
        )}
      </div>
    </div>
  );
}
