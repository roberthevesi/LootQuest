import "../styles/home.css";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfilePanel from "../panels/ProfilePanel";
import ReportSpotPanel from "../panels/ReportSpotPanel";
import { MapView } from "../components/MapView";
import { Coordinate, getLocationAsync } from "../services/locationService";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  // const [disableProfileAnimation, setDisableProfileAnimation] = useState(false);
  const [showDropIcon, setShowDropIcon] = useState(false);
  const [showReportSpot, setShowReportSpot] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinate>();

  useEffect(() => {
    getLocationAsync().then((response) => setCoordinates(response));
  }, []);

  const handleAddClick = () => {
    setShowDropIcon(true);
    setShowReportSpot(true);
  };

  useEffect(() => {
    if (location.state?.fromListingPage) {
      setShowProfile(true);
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  return (
    <div className="page-container">
      <div className="map-container">
        <MapView center={coordinates} />
      </div>
      <div className="search-bar floating-ui">
        <input type="text" placeholder="Search a location..." />
      </div>
      <button
        className="profile-btn floating-ui"
        type="button"
        onClick={() => setShowProfile(true)}
      >
        <img
          src="src/assets/profile_icon.svg"
          alt="Porfile Icon"
          width="100%"
          height="100%"
        />
      </button>
      <button
        className="add-btn floating-ui"
        type="button"
        onClick={handleAddClick}
      >
        <img
          src="src/assets/plus_icon.svg"
          alt="Plus Icon"
          width="100%"
          height="100%"
        />
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
          coordinates={
            !coordinates ? "" : `${coordinates[1]}, ${coordinates[0]}`
          }
          onClose={() => {
            setShowReportSpot(false);
            setShowDropIcon(false);
          }}
          onConfirm={() => {
            navigate(
              `/submitreport/${encodeURIComponent(
                !coordinates ? "" : `${coordinates[1]}, ${coordinates[0]}`
              )}`
            );
            setShowReportSpot(false);
            setShowDropIcon(false);
          }}
        />
      )}
    </div>
  );
}
