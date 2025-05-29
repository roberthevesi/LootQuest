import "../styles/home.css";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfilePanel from "../panels/ProfilePanel";
import ReportSpotPanel from "../panels/ReportSpotPanel";
import { MapView } from "../components/MapView";
import { Coordinate, getLocationAsync } from "../services/locationService";
import { NearbyLostItem } from "../types";
import MapPinMarker from "../props/MapReportPin";
import MapReportPanel from "../panels/MapReportPanel";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [nearbyLostItems, setNearbyLostItems] = useState<NearbyLostItem[]>([]);
  const [selectedNearbyItem, setSelectedNearbyItem] =
    useState<NearbyLostItem | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showDropIcon, setShowDropIcon] = useState(false);
  const [showReportSpot, setShowReportSpot] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinate>([
    24.9668, 45.9432,
  ]);

  useEffect(() => {
    getLocationAsync().then((response) => setCoordinates(response));
  }, []);

  const handleAddClick = () => {
    setShowDropIcon(true);
    setShowReportSpot(true);
  };

  useEffect(() => {
    const fetchNearbyLostItems = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("User not authenticated.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/items/get-nearby-lost-items?latitude=${coordinates[1]}&longitude=${coordinates[0]}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch lost items");
        }

        const data = await response.json();
        setNearbyLostItems(data);
      } catch (error) {
        console.error("Error fetching nearby lost items:", error);
      }
    };

    fetchNearbyLostItems();
  }, []);

  useEffect(() => {
    console.log("Nearby lost items:", nearbyLostItems);
    if (nearbyLostItems.length > 0) {
      console.log("✅ List is not empty");
    } else {
      console.log("❌ List is empty");
    }
  }, [nearbyLostItems]);

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
          latitude={coordinates[1]}
          longitude={coordinates[0]}
          onClose={() => {
            setShowReportSpot(false);
            setShowDropIcon(false);
          }}
          onConfirm={() => {
            navigate(
              `/submit-report/${encodeURIComponent(
                `${coordinates[1]}, ${coordinates[0]}`
              )}`
            );
            setShowReportSpot(false);
            setShowDropIcon(false);
          }}
        />
      )}

      {nearbyLostItems.length > 0 && (
        <MapPinMarker
          item={nearbyLostItems[0]}
          position={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }}
          onClick={(item) => setSelectedNearbyItem(item)}
        />
      )}

      {selectedNearbyItem && (
        <MapReportPanel
          item={selectedNearbyItem}
          onClose={() => setSelectedNearbyItem(null)}
        />
      )}
    </div>
  );
}
