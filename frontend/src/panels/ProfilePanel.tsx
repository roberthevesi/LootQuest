import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";
import logo from "../assets/logo.png"

interface ProfilePanelProps {
  onClose: () => void;
}

export default function ProfilePanel({ onClose }: ProfilePanelProps) {
  const navigate = useNavigate();
  const [animateIn, setAnimateIn] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleLogOut = () => {
    navigate(`/login`);
  };
  
  const handleClose = () => {
    setClosing(true);
    setAnimateIn(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div className={`profile-page ${animateIn ? "slide-in" : ""} ${closing ? "slide-out" : ""}`}>

      <img src={logo} alt="Logo" className="logo" />

      <div className="profile-content">

        <div className="info-section">
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Phone Number:</strong> 911</p>
          <p><strong>Email:</strong> john.doe@example.com</p>
        </div>

        <div className="action-btns-container">
          <button className="mylostitems-btn" onClick={() => navigate('/my-lost-items', { state: { fromListingPage: true } })}>
            My Lost Items
          </button>

          <button className="myfindings-btn" onClick={() => navigate('/my-findings', { state: { fromListingPage: true } })}>
            My Findings
          </button>
        </div>

      </div>

      <div className="escape-btns-container">

        <button className="logout-btn" onClick={handleLogOut}>Log Out</button>
        
        <button className="return-home-btn" onClick={handleClose}>Return →</button>

      </div>

    </div>
  );
}