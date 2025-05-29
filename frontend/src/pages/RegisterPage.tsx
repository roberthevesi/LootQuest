import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
import useWindowWidth from "../hooks/useWindowWidth";
import logo from "../assets/logo.png"

export default function RegisterPage() {
  const screenWidth = useWindowWidth();
  const isMobile = screenWidth < 768;
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8081/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, 
          phoneNumber: phoneNumber,
          password: password 
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          alert("Registration failed. Email might already be in use or invalid data provided.");
        } else {
          alert("Registration failed. Please try again.");
        }
        return;
      }

      const userData = await response.json();
      
      alert("Registration successful! Please login with your credentials.");
      navigate("/login");
      
    } catch (error) {
      console.error("Error during registration:", error);
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
          <form className="auth-form" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={isLoading}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Register"}
            </button>
          </form>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
        {!isMobile && <div className="welcome-image-component"></div>}
      </div>
    </div>
  );
}
