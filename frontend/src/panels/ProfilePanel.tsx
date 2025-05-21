import { useEffect, useState } from "react";
import "../styles/profile.css";

interface ProfilePanelProps {
  onClose: () => void;
}

export default function ProfilePanel({ onClose }: ProfilePanelProps) {
  const [animateIn, setAnimateIn] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showReports, setShowReports] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setAnimateIn(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div className={`profile-page ${animateIn ? "slide-in" : ""} ${closing ? "slide-out" : ""}`}>
      <div className="profile-content">
        <div className="info-section">
          <h2>Profile Section</h2>
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> john.doe@example.com</p>
        </div>

        <div className="reports-toggle">
          <button onClick={() => setShowReports(!showReports)}>
            {showReports ? "Hide Reports History" : "Show Reports History"}
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

      <button className="return-home-btn" onClick={handleClose}>
        Return to homepage →
      </button>
    </div>
  );
}