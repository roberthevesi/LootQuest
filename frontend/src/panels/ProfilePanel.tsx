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

  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setPhoneNumber(localStorage.getItem("phoneNumber") || "N/A");
    setEmail(localStorage.getItem("email") || "N/A");
  }, []);

  const handleLogOut = () => {
    localStorage.clear();
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
          <p><strong>Phone Number:</strong> {phoneNumber}</p>
          <p><strong>Email:</strong> {email}</p>
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