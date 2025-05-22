import "../styles/home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePanel from "../panels/ProfilePanel";
import ReportSpotPanel from "../panels/ReportSpotPanel";

export default function HomePage() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showDropIcon, setShowDropIcon] = useState(false);
  const [showReportSpot, setShowReportSpot] = useState(false);

  const fakeCoordinates = "45.123, 21.456";

  const handleAddClick = () => {
    setShowDropIcon(true);
    setShowReportSpot(true);
  };

  return (
    <div className="page-container">
      <div className="map-container"></div>
      <div className="search-bar floating-ui">
        <input type="text" placeholder="Search a location..." />
      </div>
      <button className="profile-btn floating-ui" type="button" onClick={() => setShowProfile(true)}>
        <img src="src/assets/profile_icon.svg" alt="Porfile Icon" width="100%" height="100%" />
      </button>
      <button className="add-btn floating-ui" type="button" onClick={handleAddClick}>
        <img src="src/assets/plus_icon.svg" alt="Plus Icon" width="100%" height="100%" />
      </button>

      {showProfile && <ProfilePanel onClose={() => setShowProfile(false)} />}
      {showDropIcon && (
        <img
          src="src/assets/location_pin.svg"
          alt="Dropping Icon"
          className="drop-icon"
        />
      )}
      {showReportSpot && (
        <ReportSpotPanel
          coordinates={fakeCoordinates}
          onClose={() => {
            setShowReportSpot(false);
            setShowDropIcon(false);
          }}
          onConfirm={() => {
            navigate(`/submitreport/${encodeURIComponent(fakeCoordinates)}`);
            setShowReportSpot(false);
            setShowDropIcon(false);
          }}
        />
      )}
    </div>
  );
}
