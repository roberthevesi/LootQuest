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
  const [showReports, setShowReports] = useState(false);

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
      <div className="profile-content">
        <img src={logo} alt="Logo" className="logo" />

        <div className="info-section">
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Phone Number:</strong> 911</p>
          <p><strong>Email:</strong> john.doe@example.com</p>
        </div>

        <div className="action-btns-container">
          <button className="mylostitems-btn" onClick={handleLogOut}>
            My Lost Items
          </button>

          <button className="myfindings-btn" onClick={handleLogOut}>
            My Findings
          </button>
        </div>

        {showReports && (
          <div className="reports-table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Headline</th>
                  <th>Resolved</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2025-05-01</td>
                  <td>Water leak near station</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>2025-05-01</td>
                  <td>Water leak near station</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>2025-05-01</td>
                  <td>Water leak near station</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>2025-05-01</td>
                  <td>Water leak near station</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>2025-05-01</td>
                  <td>Water leak near station</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>2025-05-01</td>
                  <td>Water leak near station</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>2025-05-01</td>
                  <td>Water leak near station</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>2025-05-01</td>
                  <td>Water leak near station</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>2025-05-01</td>
                  <td>Water leak near station</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>2025-05-01</td>
                  <td>Water leak near station</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>2025-04-22</td>
                  <td>Broken streetlight</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td>2025-04-15</td>
                  <td>Pothole on Main Street</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>2025-04-08</td>
                  <td>Fallen tree branch</td>
                  <td>Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="escape-btns-container">
        <button className="logout-btn" onClick={handleLogOut}>
          Log Out
        </button>
        
        <button className="return-home-btn" onClick={handleClose}>
          Return →
        </button>
      </div>

    </div>
  );
}